import type { BridgeConfig } from './config.js';
import { sendCommand } from './command-sender.js';
import type { BuzzerParams, CommandResult, LedParams, SlotParams } from './types.js';

export function sendVersion(cfg: BridgeConfig, mac: string): Promise<CommandResult> {
  return sendCommand(cfg, { mac, actionName: 'version' });
}

export function sendWakeQuery(cfg: BridgeConfig, mac: string): Promise<CommandResult> {
  return sendCommand(cfg, { mac, actionName: 'query' });
}

export function sendLedViaRadio(cfg: BridgeConfig, mac: string, params?: Partial<LedParams>): Promise<CommandResult> {
  return sendCommand(cfg, { mac, actionName: 'ledRadio', params: params as Record<string, unknown> });
}

export function sendLedViaBle(cfg: BridgeConfig, mac: string, params?: Partial<LedParams>): Promise<CommandResult> {
  return sendCommand(cfg, { mac, actionName: 'ledBle', params: params as Record<string, unknown> });
}

export function sendBuzzer(cfg: BridgeConfig, mac: string, params?: Partial<BuzzerParams>): Promise<CommandResult> {
  return sendCommand(cfg, { mac, actionName: 'buzzer', params: params as Record<string, unknown> });
}

export function sendRefreshRegion(
  cfg: BridgeConfig,
  mac: string,
  regionA: number,
  regionB?: number,
): Promise<CommandResult> {
  const params: Record<string, unknown> = { region_a: regionA };
  if (regionB !== undefined) params.region_b = regionB;
  return sendCommand(cfg, { mac, actionName: 'refresh', params });
}

export function sendShutdown(cfg: BridgeConfig, mac: string): Promise<CommandResult> {
  return sendCommand(cfg, { mac, actionName: 'shutdown' });
}

export function sendReboot(cfg: BridgeConfig, mac: string): Promise<CommandResult> {
  return sendCommand(cfg, { mac, actionName: 'reboot' });
}

export function sendGetOperatingStatus(cfg: BridgeConfig, mac: string): Promise<CommandResult> {
  return sendCommand(cfg, { mac, actionName: 'operatingStatus' });
}

export function sendGetSlot(cfg: BridgeConfig, mac: string): Promise<CommandResult> {
  return sendCommand(cfg, { mac, actionName: 'slot', method: 'get_req' });
}

export function sendSetSlot(cfg: BridgeConfig, mac: string, params: Partial<SlotParams>): Promise<CommandResult> {
  return sendCommand(cfg, { mac, actionName: 'slot', method: 'set_req', params: params as Record<string, unknown> });
}
