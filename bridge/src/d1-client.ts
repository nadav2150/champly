import { config } from './config.js';

const D1_API_BASE = `https://api.cloudflare.com/client/v4/accounts/${config.cloudflare.accountId}/d1/database/${config.cloudflare.databaseId}`;

interface D1QueryResult {
  results: Record<string, unknown>[];
  success: boolean;
  meta: Record<string, unknown>;
}

interface D1ApiResponse {
  result: D1QueryResult[];
  success: boolean;
  errors: Array<{ code: number; message: string }>;
}

async function queryD1(sql: string, params: unknown[] = []): Promise<D1QueryResult> {
  const res = await fetch(`${D1_API_BASE}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.cloudflare.apiToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`D1 API error ${res.status}: ${text}`);
  }

  const body = (await res.json()) as D1ApiResponse;
  if (!body.success) {
    throw new Error(`D1 query failed: ${JSON.stringify(body.errors)}`);
  }
  return body.result[0];
}

// ---------------------------------------------------------------------------
// Tag status
// ---------------------------------------------------------------------------

// Generic type strings the gateway sends that should NOT overwrite
// a user-chosen specific model (e.g. "DS027Q") in D1.
const GENERIC_TAG_TYPES = new Set(['ds', 'esl', 'info_v3', 'tag', 'unknown']);

export async function upsertTagStatus(
  mac: string,
  rssi: number,
  lastAdvertised: string,
  gatewayId: string,
  battery?: number,
  firmwareVersion?: string,
  tagModel?: string,
): Promise<void> {
  const setClauses = [
    'rssi = ?',
    'last_advertised = ?',
    "status = 'online'",
    'gateway_id = ?',
  ];
  const values: unknown[] = [rssi, lastAdvertised, gatewayId];

  if (battery !== undefined) {
    setClauses.push('battery = ?');
    values.push(battery);
  }
  if (firmwareVersion) {
    setClauses.push('firmware_version = ?');
    values.push(firmwareVersion);
  }
  if (tagModel && !GENERIC_TAG_TYPES.has(tagModel.toLowerCase())) {
    // Only overwrite tag_model when the gateway provides a specific model,
    // never when it sends a generic type like "ds" or "info_v3".
    setClauses.push('tag_model = ?');
    values.push(tagModel);
  }

  values.push(mac);

  await queryD1(
    `UPDATE tags SET ${setClauses.join(', ')} WHERE mac = ?`,
    values,
  );
}

// ---------------------------------------------------------------------------
// Gateway
// ---------------------------------------------------------------------------

export async function updateGatewayLastSeen(
  apId: string,
  lastSeen: string,
): Promise<void> {
  await queryD1(
    `UPDATE gateways SET last_seen = ?, status = 'online' WHERE ap_id = ?`,
    [lastSeen, apId],
  );
}

// ---------------------------------------------------------------------------
// Tag keys
// ---------------------------------------------------------------------------

export async function getTagKeyByMac(mac: string): Promise<string | null> {
  const result = await queryD1(
    'SELECT ble_key FROM tags WHERE mac = ?',
    [mac],
  );
  if (result.results.length === 0) return null;
  return (result.results[0].ble_key as string) ?? null;
}

export async function getAllTagKeys(): Promise<Record<string, string>> {
  const result = await queryD1(
    'SELECT mac, ble_key FROM tags WHERE mac IS NOT NULL AND ble_key IS NOT NULL',
  );
  const map: Record<string, string> = {};
  for (const row of result.results) {
    map[row.mac as string] = row.ble_key as string;
  }
  return map;
}

// ---------------------------------------------------------------------------
// Tag firmware (after action 74 version response)
// ---------------------------------------------------------------------------

export async function updateTagFirmware(
  mac: string,
  firmwareVersion: string,
  tagModel?: string,
): Promise<void> {
  if (tagModel) {
    await queryD1(
      'UPDATE tags SET firmware_version = ?, tag_model = ? WHERE mac = ?',
      [firmwareVersion, tagModel, mac],
    );
  } else {
    await queryD1(
      'UPDATE tags SET firmware_version = ? WHERE mac = ?',
      [firmwareVersion, mac],
    );
  }
}

// ---------------------------------------------------------------------------
// Command history
// ---------------------------------------------------------------------------

export async function insertTagCommand(
  id: string,
  mac: string,
  reqId: number,
  action: number,
  method: string,
  payloadJson: string,
): Promise<void> {
  await queryD1(
    `INSERT INTO tag_commands (id, mac, req_id, action, method, payload_json, status, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'sent', ?)`,
    [id, mac, reqId, action, method, payloadJson, new Date().toISOString()],
  );
}

export async function updateTagCommandResult(
  reqId: number,
  status: 'success' | 'failed',
  responseJson: string | null,
  errorMessage: string | null,
): Promise<void> {
  await queryD1(
    `UPDATE tag_commands SET status = ?, response_json = ?, error_message = ?, completed_at = ?
     WHERE req_id = ? AND status = 'sent'`,
    [status, responseJson, errorMessage, new Date().toISOString(), reqId],
  );
}

export async function getCommandByReqId(
  reqId: number,
): Promise<Record<string, unknown> | null> {
  const result = await queryD1(
    'SELECT * FROM tag_commands WHERE req_id = ? LIMIT 1',
    [reqId],
  );
  if (result.results.length === 0) return null;
  return result.results[0];
}
