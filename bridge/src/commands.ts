import { sendCommand } from './command-sender.js';
import type { BuzzerParams, CommandResult, LedParams, SlotParams } from './types.js';

export function sendVersion(mac: string): Promise<CommandResult> {
  return sendCommand({ mac, actionName: 'version' });
}

export function sendWakeQuery(mac: string): Promise<CommandResult> {
  return sendCommand({ mac, actionName: 'query' });
}

export function sendLedViaRadio(mac: string, params?: Partial<LedParams>): Promise<CommandResult> {
  return sendCommand({ mac, actionName: 'ledRadio', params: params as Record<string, unknown> });
}

export function sendLedViaBle(mac: string, params?: Partial<LedParams>): Promise<CommandResult> {
  return sendCommand({ mac, actionName: 'ledBle', params: params as Record<string, unknown> });
}

export function sendBuzzer(mac: string, params?: Partial<BuzzerParams>): Promise<CommandResult> {
  return sendCommand({ mac, actionName: 'buzzer', params: params as Record<string, unknown> });
}

export function sendRefreshRegion(
  mac: string,
  regionA: number,
  regionB?: number,
): Promise<CommandResult> {
  const params: Record<string, unknown> = { region_a: regionA };
  if (regionB !== undefined) params.region_b = regionB;
  return sendCommand({ mac, actionName: 'refresh', params });
}

export function sendShutdown(mac: string): Promise<CommandResult> {
  return sendCommand({ mac, actionName: 'shutdown' });
}

export function sendReboot(mac: string): Promise<CommandResult> {
  return sendCommand({ mac, actionName: 'reboot' });
}

export function sendGetOperatingStatus(mac: string): Promise<CommandResult> {
  return sendCommand({ mac, actionName: 'operatingStatus' });
}

export function sendGetSlot(mac: string): Promise<CommandResult> {
  return sendCommand({ mac, actionName: 'slot', method: 'get_req' });
}

export function sendSetSlot(mac: string, params: Partial<SlotParams>): Promise<CommandResult> {
  return sendCommand({ mac, actionName: 'slot', method: 'set_req', params: params as Record<string, unknown> });
}
