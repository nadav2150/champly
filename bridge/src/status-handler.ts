import { config } from './config.js';
import { updateGatewayLastSeen, upsertTagStatus } from './d1-client.js';
import type { GatewayStatusMessage, TagState } from './types.js';

const recentTags = new Map<string, TagState>();

export function getRecentTags(): TagState[] {
  return Array.from(recentTags.values());
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

  for (const adv of msg.adv) {
    if (!adv.mac) continue;

    const tagState: TagState = {
      mac: adv.mac,
      rssi: adv.rssi,
      lastAdvertised: adv.tm || msg.tm,
      type: adv.type,
      error: adv.error ?? 0,
      battery: adv.battery,
      firmwareVersion: adv.firmware_version,
      tagModel: adv.tag_model ?? adv.type,
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
        adv.tag_model ?? adv.type,
      );
    } catch (err) {
      console.error(`[status] Failed to upsert tag ${adv.mac}:`, err);
    }
  }

  console.log(
    `[status] Processed ${msg.adv.length} advertisement(s) from gateway ${msg.gw} (seq: ${msg.seq})`,
  );
}
