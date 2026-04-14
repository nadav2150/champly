import { getMqttClient, publishAction } from './mqtt-client.js';
import { config } from './config.js';
import { getTagKeyByMac, insertTagCommand, updateTagCommandResult } from './d1-client.js';
import { type ActionDef, getActionDef, findActionDefByNumber } from './command-registry.js';
import type {
  ActionName,
  CommandResult,
  JengineMethod,
  JengineRequest,
  JengineResponse,
  SendCommandRequest,
  TransportType,
} from './types.js';

// ---------------------------------------------------------------------------
// Monotonic counters
// ---------------------------------------------------------------------------

let nextReqId = 1000;
let nextOpcode = 1;

function allocReqId(): number {
  return nextReqId++;
}

function allocOpcode(): number {
  const op = nextOpcode++;
  if (nextOpcode > 4_294_967_294) nextOpcode = 1;
  return op;
}

// ---------------------------------------------------------------------------
// Pending command tracking
// ---------------------------------------------------------------------------

interface PendingCommand {
  resolve: (result: CommandResult) => void;
  timeout: ReturnType<typeof setTimeout>;
  transport: TransportType;
  mac: string;
  reqId: number;
}

const pendingCommands = new Map<number, PendingCommand>();

// ---------------------------------------------------------------------------
// Response listener — handles the two-stage Jengine response model
// ---------------------------------------------------------------------------

export function initResponseListener(): void {
  const client = getMqttClient();

  client.on('message', (topic: string, payload: Buffer) => {
    if (topic !== config.gateway.responseTopic) return;

    let response: JengineResponse;
    try {
      response = JSON.parse(payload.toString()) as JengineResponse;
    } catch {
      console.warn('[command] Failed to parse response JSON');
      return;
    }

    const pending = pendingCommands.get(response.req_id);
    if (!pending) {
      console.log(`[command] Response for unknown req_id: ${response.req_id}`);
      return;
    }

    // ----- STAGE 1: gateway-level validation -----
    const stage1Code = response.payload?.code;
    const hasDetails = response.payload?.details && Object.keys(response.payload.details).length > 0;

    if (stage1Code !== undefined && !hasDetails) {
      if (stage1Code === 1) {
        // Gateway accepted, waiting for stage 2 — do NOT delete pending entry
        console.log(`[command] Stage 1 accepted for req_id ${response.req_id}`);
        return;
      }

      // Stage 1 error (code >= 100)
      clearTimeout(pending.timeout);
      pendingCommands.delete(response.req_id);

      const errorMsg = response.payload?.message ?? `Stage 1 error code ${stage1Code}`;
      const result: CommandResult = {
        reqId: response.req_id,
        status: 'failed',
        stage1Code,
        response,
        error: errorMsg,
      };

      updateTagCommandResult(response.req_id, 'failed', JSON.stringify(response), errorMsg).catch(() => {});
      pending.resolve(result);
      return;
    }

    // ----- STAGE 2: per-device execution result -----
    clearTimeout(pending.timeout);
    pendingCommands.delete(response.req_id);

    const details = response.payload?.details ?? {};
    const targetMac = pending.mac.toLowerCase();
    const detail = details[targetMac] ?? Object.values(details)[0];

    let isSuccess = false;
    let stage2Code: number | undefined;
    let deviceError: number | undefined;

    if (detail) {
      stage2Code = detail.code;
      deviceError = detail.error;

      if (pending.transport === 'radio') {
        // Radio commands: success = code 3
        isSuccess = detail.code === 3;
      } else {
        // BLE commands: success = code 2 AND error 0
        isSuccess = detail.code === 2 && detail.error === 0;
      }
    }

    const dbStatus = isSuccess ? 'success' as const : 'failed' as const;
    const errorMsg = isSuccess ? undefined : (detail?.message ?? `stage2 code=${stage2Code} error=${deviceError}`);

    const result: CommandResult = {
      reqId: response.req_id,
      status: dbStatus,
      stage1Code: stage1Code ?? undefined,
      stage2Code,
      deviceError,
      response,
      error: errorMsg,
    };

    updateTagCommandResult(
      response.req_id,
      dbStatus,
      JSON.stringify(response),
      errorMsg ?? null,
    ).catch((err) =>
      console.error('[command] Failed to update command result in D1:', err),
    );

    console.log(
      `[command] Stage 2 for req_id ${response.req_id}: ${result.status} (code=${stage2Code}, error=${deviceError})`,
    );
    pending.resolve(result);
  });
}

// ---------------------------------------------------------------------------
// Send a command using the registry
// ---------------------------------------------------------------------------

export async function sendCommand(req: SendCommandRequest): Promise<CommandResult> {
  // Resolve the action definition
  let def: ActionDef | undefined;
  let actionName: string;

  if (req.actionName) {
    def = getActionDef(req.actionName);
    actionName = req.actionName;
  } else if (req.action !== undefined && req.method) {
    def = findActionDefByNumber(req.action, req.method);
    actionName = def ? `raw(${req.action})` : `unknown(${req.action})`;
  } else {
    return { reqId: 0, status: 'failed', error: 'Missing actionName or action+method' };
  }

  if (!def) {
    return {
      reqId: 0,
      status: 'failed',
      error: `No registry entry for action=${req.action} method=${req.method}`,
    };
  }

  // Fetch BLE key from D1 when required
  let key: string | undefined;
  if (def.requiresKey) {
    const fetchedKey = await getTagKeyByMac(req.mac);
    if (!fetchedKey) {
      return { reqId: 0, status: 'failed', error: `No BLE key found for tag ${req.mac}` };
    }
    key = fetchedKey;
  }

  const reqId = allocReqId();
  const opcode = allocOpcode();
  const mac = req.mac.toLowerCase();

  // Use the registry's method, but allow override for slot (get_req vs set_req)
  const method: JengineMethod = req.method ?? def.method;

  const perDeviceDetails = def.buildDetails(mac, req.params);

  const command: JengineRequest = {
    action: def.action,
    version: 1,
    method,
    req_id: reqId,
    payload: {
      ...(key ? { key } : {}),
      opcode,
      ...(def.defaultSingle !== undefined ? { single: def.defaultSingle } : {}),
      ...(def.defaultSuppressStage2 ? { suppress_stage2: true } : {}),
      details: {
        [mac]: perDeviceDetails,
      },
    },
  };

  // Persist command to D1
  const commandId = `cmd-${reqId}-${Date.now()}`;
  try {
    await insertTagCommand(
      commandId,
      mac,
      reqId,
      def.action,
      method,
      JSON.stringify(command),
    );
  } catch (err) {
    console.error('[command] Failed to insert command record:', err);
  }

  // If suppress_stage2 is on, we get only stage 1 — resolve immediately after stage 1 accept
  const timeoutMs = def.defaultSuppressStage2 ? 10_000 : 30_000;

  return new Promise<CommandResult>((resolve) => {
    const timeout = setTimeout(() => {
      pendingCommands.delete(reqId);
      const result: CommandResult = {
        reqId,
        status: def!.defaultSuppressStage2 ? 'success' : 'failed',
        error: def!.defaultSuppressStage2 ? undefined : `Command timeout (${timeoutMs / 1000}s)`,
      };
      if (!def!.defaultSuppressStage2) {
        updateTagCommandResult(reqId, 'failed', null, result.error!).catch(() => {});
      }
      resolve(result);
    }, timeoutMs);

    pendingCommands.set(reqId, {
      resolve,
      timeout,
      transport: def!.transport,
      mac,
      reqId,
    });

    publishAction(command).catch((err) => {
      clearTimeout(timeout);
      pendingCommands.delete(reqId);
      resolve({
        reqId,
        status: 'failed',
        error: `Publish failed: ${err instanceof Error ? err.message : String(err)}`,
      });
    });

    console.log(
      `[command] Sent ${actionName} (action=${def!.action}) to ${mac} (req_id: ${reqId}, opcode: ${opcode})`,
    );
  });
}
