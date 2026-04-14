import {
  JengineAction,
  type ActionName,
  type JengineActionValue,
  type JengineMethod,
  type TransportType,
} from './types.js';

export interface ActionDef {
  action: JengineActionValue;
  method: JengineMethod;
  transport: TransportType;
  requiresKey: boolean;
  defaultSingle?: boolean;
  defaultSuppressStage2?: boolean;
  buildDetails: (mac: string, params?: Record<string, unknown>) => Record<string, unknown>;
}

const passthrough = (_mac: string, params?: Record<string, unknown>) => params ?? {};

const LED_DEFAULTS = { color: 3, cycles: 20, light_on: 300, light_off: 300, brightness: 50 };
const BUZZER_DEFAULTS = { cycles: 3, on_time: 500, off_time: 500 };

function buildLedDetails(_mac: string, params?: Record<string, unknown>): Record<string, unknown> {
  return { ...LED_DEFAULTS, ...params };
}

function buildBuzzerDetails(_mac: string, params?: Record<string, unknown>): Record<string, unknown> {
  return { ...BUZZER_DEFAULTS, ...params };
}

function buildRefreshDetails(_mac: string, params?: Record<string, unknown>): Record<string, unknown> {
  const p = params ?? {};
  const out: Record<string, unknown> = { region_a: p.region_a ?? 0 };
  if (p.region_b !== undefined) out.region_b = p.region_b;
  return out;
}

function buildSlotDetails(_mac: string, params?: Record<string, unknown>): Record<string, unknown> {
  return params ?? {};
}

export const actionRegistry: Record<ActionName, ActionDef> = {
  version: {
    action: JengineAction.Version,
    method: 'get_req',
    transport: 'ble',
    requiresKey: true,
    defaultSingle: true,
    buildDetails: passthrough,
  },
  query: {
    action: JengineAction.Query,
    method: 'set_req',
    transport: 'radio',
    requiresKey: false,
    defaultSuppressStage2: true,
    buildDetails: passthrough,
  },
  ledRadio: {
    action: JengineAction.LedRadio,
    method: 'set_req',
    transport: 'radio',
    requiresKey: false,
    buildDetails: buildLedDetails,
  },
  ledBle: {
    action: JengineAction.LedBle,
    method: 'set_req',
    transport: 'ble',
    requiresKey: true,
    defaultSingle: true,
    buildDetails: buildLedDetails,
  },
  buzzer: {
    action: JengineAction.Buzzer,
    method: 'set_req',
    transport: 'ble',
    requiresKey: true,
    defaultSingle: true,
    buildDetails: buildBuzzerDetails,
  },
  shutdown: {
    action: JengineAction.Shutdown,
    method: 'set_req',
    transport: 'ble',
    requiresKey: true,
    defaultSingle: true,
    buildDetails: passthrough,
  },
  refresh: {
    action: JengineAction.Refresh,
    method: 'set_req',
    transport: 'radio',
    requiresKey: false,
    buildDetails: buildRefreshDetails,
  },
  slot: {
    action: JengineAction.Slot,
    method: 'get_req',
    transport: 'ble',
    requiresKey: true,
    defaultSingle: true,
    buildDetails: buildSlotDetails,
  },
  reboot: {
    action: JengineAction.Reboot,
    method: 'set_req',
    transport: 'ble',
    requiresKey: true,
    defaultSingle: true,
    buildDetails: passthrough,
  },
  operatingStatus: {
    action: JengineAction.OperatingStatus,
    method: 'get_req',
    transport: 'ble',
    requiresKey: true,
    defaultSingle: true,
    buildDetails: passthrough,
  },
};

export function getActionDef(name: ActionName): ActionDef {
  const def = actionRegistry[name];
  if (!def) throw new Error(`Unknown action: ${name}`);
  return def;
}

export function findActionDefByNumber(action: number, method: JengineMethod): ActionDef | undefined {
  return Object.values(actionRegistry).find(
    (def) => def.action === action && def.method === method,
  );
}
