import type { Env } from '../../workers/app';

// ---------------------------------------------------------------------------
// Response types
// ---------------------------------------------------------------------------

interface BridgeHealthResponse {
  status: string;
  mqtt: 'connected' | 'disconnected';
  gateway: string;
  uptime: number;
  actions: string[];
}

interface BridgeCommandResult {
  reqId: number;
  status: 'pending' | 'sent' | 'success' | 'failed';
  stage1Code?: number;
  stage2Code?: number;
  deviceError?: number;
  response?: unknown;
  error?: string;
}

interface BridgeTagState {
  mac: string;
  rssi: number;
  lastAdvertised: string;
  type: string;
  error: number;
  battery?: number;
  firmwareVersion?: string;
  tagModel?: string;
}

// ---------------------------------------------------------------------------
// LED / Buzzer param types (matches bridge)
// ---------------------------------------------------------------------------

export interface LedParams {
  color?: number;
  cycles?: number;
  light_on?: number;
  light_off?: number;
  brightness?: number;
}

export interface BuzzerParams {
  cycles?: number;
  on_time?: number;
  off_time?: number;
}

// ---------------------------------------------------------------------------
// Internal fetch helper
// ---------------------------------------------------------------------------

async function bridgeFetch(
  env: Env,
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${env.MQTT_BRIDGE_URL}${path}`;
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.MQTT_BRIDGE_API_KEY}`,
      ...options.headers,
    },
  });
}

async function postCommand(
  env: Env,
  body: Record<string, unknown>,
): Promise<BridgeCommandResult> {
  const res = await bridgeFetch(env, '/command', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  return (await res.json()) as BridgeCommandResult;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function getBridgeHealth(
  env: Env,
): Promise<BridgeHealthResponse | null> {
  try {
    const res = await fetch(`${env.MQTT_BRIDGE_URL}/health`);
    if (!res.ok) return null;
    return (await res.json()) as BridgeHealthResponse;
  } catch {
    return null;
  }
}

export async function getRecentTags(
  env: Env,
): Promise<BridgeTagState[]> {
  try {
    const res = await bridgeFetch(env, '/tags');
    if (!res.ok) return [];
    const body = (await res.json()) as { tags: BridgeTagState[] };
    return body.tags;
  } catch {
    return [];
  }
}

export async function getCommandStatus(
  env: Env,
  reqId: number,
): Promise<Record<string, unknown> | null> {
  try {
    const res = await bridgeFetch(env, `/command/${reqId}`);
    if (!res.ok) return null;
    return (await res.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Named command functions
// ---------------------------------------------------------------------------

export function sendVersion(env: Env, mac: string): Promise<BridgeCommandResult> {
  return postCommand(env, { mac, actionName: 'version' });
}

export function sendWakeQuery(env: Env, mac: string): Promise<BridgeCommandResult> {
  return postCommand(env, { mac, actionName: 'query' });
}

export function sendLedViaRadio(
  env: Env,
  mac: string,
  params?: LedParams,
): Promise<BridgeCommandResult> {
  return postCommand(env, { mac, actionName: 'ledRadio', params });
}

export function sendLedViaBle(
  env: Env,
  mac: string,
  params?: LedParams,
): Promise<BridgeCommandResult> {
  return postCommand(env, { mac, actionName: 'ledBle', params });
}

export function sendBuzzer(
  env: Env,
  mac: string,
  params?: BuzzerParams,
): Promise<BridgeCommandResult> {
  return postCommand(env, { mac, actionName: 'buzzer', params });
}

export function sendShutdown(env: Env, mac: string): Promise<BridgeCommandResult> {
  return postCommand(env, { mac, actionName: 'shutdown' });
}

export function sendReboot(env: Env, mac: string): Promise<BridgeCommandResult> {
  return postCommand(env, { mac, actionName: 'reboot' });
}

export function sendGetOperatingStatus(env: Env, mac: string): Promise<BridgeCommandResult> {
  return postCommand(env, { mac, actionName: 'operatingStatus' });
}

export function sendRefreshRegion(
  env: Env,
  mac: string,
  regionA: number,
  regionB?: number,
): Promise<BridgeCommandResult> {
  const params: Record<string, unknown> = { region_a: regionA };
  if (regionB !== undefined) params.region_b = regionB;
  return postCommand(env, { mac, actionName: 'refresh', params });
}

export async function sendImage(
  env: Env,
  mac: string,
  imageBase64: string,
): Promise<BridgeCommandResult> {
  const res = await bridgeFetch(env, '/image', {
    method: 'POST',
    body: JSON.stringify({ mac, data: imageBase64, region_a: 0 }),
  });
  return (await res.json()) as BridgeCommandResult;
}

/** Generic command for backward compat or raw action numbers */
export function sendTagCommand(
  env: Env,
  mac: string,
  action: number,
  method: string,
  details?: Record<string, unknown>,
  params?: Record<string, unknown>,
): Promise<BridgeCommandResult> {
  return postCommand(env, { mac, action, method, params: { ...params, ...details } });
}
