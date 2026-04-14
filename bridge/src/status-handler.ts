import { config } from './config.js';
import { updateGatewayLastSeen, upsertTagStatus } from './d1-client.js';
import { normalizeModel, resolveScreenInfo } from './screen-map.js';
import type { GatewayStatusMessage, TagState } from './types.js';

const recentTags = new Map<string, TagState>();
let firstAdvLogged = false;

export function getRecentTags(): TagState[] {
  return Array.from(recentTags.values());
}

/**
 * Extract the best tag model / type string from an advertisement entry.
 *
 * Minew gateways may send model info under different field names depending
 * on firmware version: `tag_model`, `model`, `name`, `type`, or nested
 * inside `ds` / `info` objects. We try them all in priority order.
 */
function extractTagModel(adv: Record<string, unknown>): string | undefined {
  // Explicit model fields (highest priority)
  if (typeof adv.tag_model === 'string' && adv.tag_model) return adv.tag_model;
  if (typeof adv.model === 'string' && adv.model) return adv.model;
  if (typeof adv.name === 'string' && adv.name) return adv.name;

  // Nested inside `ds` object (some firmware versions)
  if (adv.ds && typeof adv.ds === 'object') {
    const ds = adv.ds as Record<string, unknown>;
    if (typeof ds.model === 'string' && ds.model) return ds.model;
    if (typeof ds.tag_model === 'string' && ds.tag_model) return ds.tag_model;
    if (typeof ds.name === 'string' && ds.name) return ds.name;
  }

  // Nested inside `info` object
  if (adv.info && typeof adv.info === 'object') {
    const info = adv.info as Record<string, unknown>;
    if (typeof info.model === 'string' && info.model) return info.model;
    if (typeof info.tag_model === 'string' && info.tag_model) return info.tag_model;
  }

  // Fall back to `type` (always present but may be generic like "esl")
  if (typeof adv.type === 'string' && adv.type) return adv.type;

  return undefined;
}

export async function handleStatusMessage(payload: Buffer): Promise<void> {
  let msg: GatewayStatusMessage;
  try {
    msg = JSON.parse(payload.toString()) as GatewayStatusMessage;
  } catch {
    console.warn('[status] Failed to parse status message');
    return;
  }

  if (msg.gw !== config.gateway.mac) {
    return;
  }

  try {
    await updateGatewayLastSeen(msg.gw, msg.tm);
  } catch (err) {
    console.error('[status] Failed to update gateway last_seen:', err);
  }

  if (!Array.isArray(msg.adv) || msg.adv.length === 0) return;

  // Log the first raw advertisement so we can see the exact fields the gateway sends
  if (!firstAdvLogged) {
    firstAdvLogged = true;
    console.log('[status] First raw advertisement sample:', JSON.stringify(msg.adv[0], null, 2));
  }

  for (const adv of msg.adv) {
    if (!adv.mac) continue;

    const rawAdv = adv as unknown as Record<string, unknown>;
    const rawModel = extractTagModel(rawAdv);
    const tagModel = rawModel ? normalizeModel(rawModel) : undefined;
    const screen = resolveScreenInfo(tagModel);

    const tagState: TagState = {
      mac: adv.mac,
      rssi: adv.rssi,
      lastAdvertised: adv.tm || msg.tm,
      type: adv.type,
      error: adv.error ?? 0,
      battery: adv.battery,
      firmwareVersion: adv.firmware_version,
      tagModel,
      screen,
      imgId: adv.img_id,
      opcode: adv.opcode,
      single: adv.single,
    };

    recentTags.set(adv.mac, tagState);

    try {
      await upsertTagStatus(
        adv.mac,
        adv.rssi,
        tagState.lastAdvertised,
        'gw-minew-01',
        adv.battery,
        adv.firmware_version,
        tagModel,
      );
    } catch (err) {
      console.error(`[status] Failed to upsert tag ${adv.mac}:`, err);
    }
  }

  console.log(
    `[status] Processed ${msg.adv.length} advertisement(s) from gateway ${msg.gw} (seq: ${msg.seq})`,
  );
}
