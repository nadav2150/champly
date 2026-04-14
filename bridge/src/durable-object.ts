import { DurableObject } from 'cloudflare:workers';
import { type BridgeConfig, buildConfig } from './config.js';
import { connectMqtt, isMqttConnected, publishAction } from './mqtt-client.js';
import { handleStatusMessage, getRecentTags } from './status-handler.js';
import { initResponseListener, sendCommand, allocReqId, allocOpcode, registerPending } from './command-sender.js';
import { getCommandByReqId, getTagKeyByMac } from './d1-client.js';
import { actionRegistry } from './command-registry.js';
import type { SendCommandRequest } from './types.js';
import type { Env } from './worker.js';

const pendingImageTags = new Set<string>();

export class MqttBridgeDO extends DurableObject<Env> {
  private cfg: BridgeConfig;
  private mqttReady = false;
  private mqttConnecting: Promise<void> | null = null;
  private startedAt = Date.now();

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.cfg = buildConfig(env as unknown as Record<string, string | undefined>);
  }

  private async ensureMqtt(): Promise<void> {
    if (this.mqttReady) return;
    if (this.mqttConnecting) {
      await this.mqttConnecting;
      return;
    }

    this.mqttConnecting = (async () => {
      const mqttClient = await connectMqtt(this.cfg);
      initResponseListener(this.cfg);

      mqttClient.on('message', (topic: string, payload: Buffer) => {
        if (topic === this.cfg.gateway.statusTopic) {
          handleStatusMessage(this.cfg, payload).catch((err) =>
            console.error('[bridge] Status handler error:', err),
          );
        }
      });

      this.mqttReady = true;
      console.log('[bridge] MQTT bridge initialized in Durable Object');
    })();

    await this.mqttConnecting;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;
    const { path, param } = this.parsePathname(url);

    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
      await this.ensureMqtt();
    } catch (err) {
      return this.json(503, { error: 'MQTT not ready', detail: err instanceof Error ? err.message : String(err) }, corsHeaders);
    }

    // ---- Public endpoints ----

    if (path === '/health' && method === 'GET') {
      return this.json(200, {
        status: 'ok',
        mqtt: isMqttConnected() ? 'connected' : 'disconnected',
        gateway: this.cfg.gateway.mac,
        uptime: (Date.now() - this.startedAt) / 1000,
        actions: Object.keys(actionRegistry),
      }, corsHeaders);
    }

    // ---- Auth-required endpoints ----

    if (!this.checkAuth(request)) {
      return this.json(401, { error: 'Unauthorized' }, corsHeaders);
    }

    if (path === '/tags' && method === 'GET') {
      return this.json(200, { tags: getRecentTags() }, corsHeaders);
    }

    // GET /command/:reqId
    if (path === '/command' && method === 'GET' && param) {
      const reqId = parseInt(param, 10);
      if (isNaN(reqId)) {
        return this.json(400, { error: 'Invalid reqId' }, corsHeaders);
      }
      try {
        const row = await getCommandByReqId(this.cfg, reqId);
        if (!row) {
          return this.json(404, { error: `Command with req_id ${reqId} not found` }, corsHeaders);
        }
        return this.json(200, row, corsHeaders);
      } catch (err) {
        return this.json(500, { error: err instanceof Error ? err.message : 'Internal error' }, corsHeaders);
      }
    }

    // POST /image
    if (path === '/image' && method === 'POST') {
      try {
        const body = await request.text();
        const { mac, data, region_a = 0 } = JSON.parse(body) as {
          mac: string;
          data: string;
          region_a?: number;
        };

        if (!mac || !data) {
          return this.json(400, { error: 'Missing mac or data' }, corsHeaders);
        }

        const tagMac = mac.toLowerCase();

        if (pendingImageTags.has(tagMac)) {
          console.log(`[image] Rejecting duplicate image push for ${tagMac} — already pending`);
          return this.json(429, { error: `Image push already pending for tag ${tagMac}`, reqId: 0, status: 'failed' }, corsHeaders);
        }

        const key = await getTagKeyByMac(this.cfg, tagMac);
        if (!key) {
          return this.json(400, { error: `No BLE key found for tag ${tagMac}` }, corsHeaders);
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

        await publishAction(this.cfg, imageCommand);
        console.log(`[image] Action 2 published for ${tagMac}, waiting for response...`);

        const result = await resultPromise;
        pendingImageTags.delete(tagMac);

        console.log(`[image] Result for ${tagMac}: ${result.status}${result.error ? ` (${result.error})` : ''}`);
        return this.json(result.status === 'success' ? 200 : 502, result, corsHeaders);
      } catch (err) {
        return this.json(500, { error: err instanceof Error ? err.message : 'Internal error' }, corsHeaders);
      }
    }

    // POST /command
    if (path === '/command' && method === 'POST') {
      try {
        const body = await request.text();
        const payload = JSON.parse(body) as SendCommandRequest;

        if (!payload.mac) {
          return this.json(400, { error: 'Missing required field: mac' }, corsHeaders);
        }
        if (!payload.actionName && payload.action === undefined) {
          return this.json(400, { error: 'Missing actionName or action number' }, corsHeaders);
        }

        const result = await sendCommand(this.cfg, payload);
        return this.json(result.status === 'success' ? 200 : 502, result, corsHeaders);
      } catch (err) {
        return this.json(500, { error: err instanceof Error ? err.message : 'Internal error' }, corsHeaders);
      }
    }

    return this.json(404, { error: 'Not found' }, corsHeaders);
  }

  private parsePathname(url: URL): { path: string; param?: string } {
    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length === 2) {
      return { path: `/${segments[0]}`, param: segments[1] };
    }
    return { path: url.pathname };
  }

  private checkAuth(request: Request): boolean {
    const authHeader = request.headers.get('authorization');
    return authHeader === `Bearer ${this.cfg.bridge.apiKey}`;
  }

  private json(status: number, data: unknown, extraHeaders: Record<string, string> = {}): Response {
    return new Response(JSON.stringify(data), {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...extraHeaders,
      },
    });
  }
}
