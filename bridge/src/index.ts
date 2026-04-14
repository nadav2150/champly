import 'dotenv/config';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { getConfig } from './config.js';
import { connectMqtt, isMqttConnected, disconnectMqtt, publishAction } from './mqtt-client.js';
import { handleStatusMessage, getRecentTags } from './status-handler.js';
import { initResponseListener, sendCommand, allocReqId, allocOpcode, registerPending } from './command-sender.js';
import { getCommandByReqId, getTagKeyByMac } from './d1-client.js';
import { actionRegistry } from './command-registry.js';
import type { SendCommandRequest } from './types.js';

const cfg = getConfig();
const pendingImageTags = new Set<string>();

function parseBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString()));
    req.on('error', reject);
  });
}

function json(res: ServerResponse, status: number, data: unknown): void {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

function checkAuth(req: IncomingMessage): boolean {
  const authHeader = req.headers.authorization;
  return authHeader === `Bearer ${cfg.bridge.apiKey}`;
}

function parsePathname(url: URL): { path: string; param?: string } {
  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length === 2) {
    return { path: `/${segments[0]}`, param: segments[1] };
  }
  return { path: url.pathname };
}

async function handleRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const url = new URL(req.url ?? '/', `http://localhost:${cfg.bridge.port}`);
  const method = req.method ?? 'GET';
  const { path, param } = parsePathname(url);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ---- Public endpoints ----

  if (path === '/health' && method === 'GET') {
    json(res, 200, {
      status: 'ok',
      mqtt: isMqttConnected() ? 'connected' : 'disconnected',
      gateway: cfg.gateway.mac,
      uptime: process.uptime(),
      actions: Object.keys(actionRegistry),
    });
    return;
  }

  // ---- Auth-required endpoints ----

  if (!checkAuth(req)) {
    json(res, 401, { error: 'Unauthorized' });
    return;
  }

  if (path === '/tags' && method === 'GET') {
    json(res, 200, { tags: getRecentTags() });
    return;
  }

  // GET /command/:reqId
  if (path === '/command' && method === 'GET' && param) {
    const reqId = parseInt(param, 10);
    if (isNaN(reqId)) {
      json(res, 400, { error: 'Invalid reqId' });
      return;
    }
    try {
      const row = await getCommandByReqId(cfg, reqId);
      if (!row) {
        json(res, 404, { error: `Command with req_id ${reqId} not found` });
        return;
      }
      json(res, 200, row);
    } catch (err) {
      json(res, 500, { error: err instanceof Error ? err.message : 'Internal error' });
    }
    return;
  }

  // POST /image — send image to tag with Action 2
  if (path === '/image' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const { mac, data, region_a = 0 } = JSON.parse(body) as {
        mac: string;
        data: string;
        region_a?: number;
      };

      if (!mac || !data) {
        json(res, 400, { error: 'Missing mac or data' });
        return;
      }

      const tagMac = mac.toLowerCase();

      if (pendingImageTags.has(tagMac)) {
        console.log(`[image] Rejecting duplicate image push for ${tagMac} — already pending`);
        json(res, 429, { error: `Image push already pending for tag ${tagMac}`, reqId: 0, status: 'failed' });
        return;
      }

      const key = await getTagKeyByMac(cfg, tagMac);
      if (!key) {
        json(res, 400, { error: `No BLE key found for tag ${tagMac}` });
        return;
      }

      const reqId = allocReqId();
      const opcode = allocOpcode();
      const imgId = reqId;

      console.log(`[image] Pushing image to ${tagMac} (reqId=${reqId}, region=${region_a}, data=${data.length} chars)...`);

      const imageCommand = {
        action: 2,
        version: 1,
        method: 'set_req',
        req_id: reqId,
        payload: {
          key,
          opcode,
          single: true,
          img_id: imgId,
          images: [
            {
              data,
              screen: ['A'],
              compress: 'NONE',
              region: region_a,
              refresh: true,
            },
          ],
          details: {
            [tagMac]: {},
          },
        },
      };

      pendingImageTags.add(tagMac);

      const resultPromise = registerPending(reqId, tagMac, 'ble', 90_000);

      await publishAction(cfg, imageCommand);
      console.log(`[image] Action 2 published for ${tagMac}, waiting for response...`);

      const result = await resultPromise;
      pendingImageTags.delete(tagMac);

      console.log(`[image] Result for ${tagMac}: ${result.status}${result.error ? ` (${result.error})` : ''}`);
      json(res, result.status === 'success' ? 200 : 502, result);
    } catch (err) {
      json(res, 500, {
        error: err instanceof Error ? err.message : 'Internal error',
      });
    }
    return;
  }

  // POST /command
  if (path === '/command' && method === 'POST') {
    try {
      const body = await parseBody(req);
      const payload = JSON.parse(body) as SendCommandRequest;

      if (!payload.mac) {
        json(res, 400, { error: 'Missing required field: mac' });
        return;
      }
      if (!payload.actionName && payload.action === undefined) {
        json(res, 400, { error: 'Missing actionName or action number' });
        return;
      }

      const result = await sendCommand(cfg, payload);
      json(res, result.status === 'success' ? 200 : 502, result);
    } catch (err) {
      json(res, 500, {
        error: err instanceof Error ? err.message : 'Internal error',
      });
    }
    return;
  }

  json(res, 404, { error: 'Not found' });
}

async function main(): Promise<void> {
  console.log('[bridge] Starting Champty MQTT Bridge...');

  const mqttClient = await connectMqtt(cfg);

  initResponseListener(cfg);

  mqttClient.on('message', (topic: string, payload: Buffer) => {
    if (topic === cfg.gateway.statusTopic) {
      handleStatusMessage(cfg, payload).catch((err) =>
        console.error('[bridge] Status handler error:', err),
      );
    }
  });

  const server = createServer((req, res) => {
    handleRequest(req, res).catch((err) => {
      console.error('[bridge] Request error:', err);
      json(res, 500, { error: 'Internal server error' });
    });
  });

  server.listen(cfg.bridge.port, () => {
    console.log(`[bridge] HTTP server listening on port ${cfg.bridge.port}`);
    console.log(`[bridge] Gateway: ${cfg.gateway.mac}`);
    console.log(`[bridge] Status topic: ${cfg.gateway.statusTopic}`);
    console.log(`[bridge] Action topic: ${cfg.gateway.actionTopic}`);
    console.log(`[bridge] Response topic: ${cfg.gateway.responseTopic}`);
    console.log(`[bridge] Supported actions: ${Object.keys(actionRegistry).join(', ')}`);
  });

  const shutdown = async () => {
    console.log('[bridge] Shutting down...');
    server.close();
    await disconnectMqtt();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

main().catch((err) => {
  console.error('[bridge] Fatal error:', err);
  process.exit(1);
});
