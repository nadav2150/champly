// ---------------------------------------------------------------------------
// Jengine Action Numbers
// ---------------------------------------------------------------------------

export const JengineAction = {
  Generic: 0,
  Image: 2,
  Ota: 3,
  Query: 20,
  Shutdown: 26,
  Refresh: 33,
  Slot: 36,
  LedRadio: 37,
  LedBle: 42,
  FactoryReset: 44,
  Trigger: 52,
  HtData: 54,
  Buzzer: 56,
  Scan: 57,
  Reboot: 58,
  Timestamp: 62,
  HistoricalData: 63,
  Switches: 67,
  Version: 74,
  OperatingStatus: 75,
  MultiScreenRadio: 101,
  MultiScreenBle: 102,
  MultiPanel: 103,
} as const;

export type JengineActionValue = (typeof JengineAction)[keyof typeof JengineAction];

// ---------------------------------------------------------------------------
// Jengine Method
// ---------------------------------------------------------------------------

export type JengineMethod = 'get_req' | 'set_req';

// ---------------------------------------------------------------------------
// Stage 1 codes (gateway-level validation)
// ---------------------------------------------------------------------------

export const Stage1Code = {
  Accepted: 1,
  FormatError: 100,
  InternalError: 200,
  ParamError: 300,
  NetworkError: 400,
} as const;

export type Stage1CodeValue = (typeof Stage1Code)[keyof typeof Stage1Code];

// ---------------------------------------------------------------------------
// Stage 2 codes (device-level execution)
// ---------------------------------------------------------------------------

export const Stage2Code = {
  BleTransmitted: 2,
  RadioSuccess: 3,
  FormatError: 100,
  InternalError: 200,
  ParamError: 300,
  NetworkError: 400,
  AuthError: 677,
  RadioWakeFail: 701,
  NoAdvPacket: 708,
  OpcodeConflict: 710,
} as const;

export type Stage2CodeValue = (typeof Stage2Code)[keyof typeof Stage2Code];

// ---------------------------------------------------------------------------
// Device-side error codes (inside stage 2 detail)
// ---------------------------------------------------------------------------

export const DeviceError = {
  None: 0,
  AuthError: 4,
  UnsupportedCommand: 13,
  ParamError: 20,
  ImageSizeMismatch: 26,
  InvalidCompressedData: 41,
  ScreenRefreshFail1: 44,
  ScreenRefreshFail2: 45,
  ScreenRefreshFail3: 46,
} as const;

export type DeviceErrorValue = (typeof DeviceError)[keyof typeof DeviceError];

// ---------------------------------------------------------------------------
// Transport type (BLE vs private 2.4GHz radio)
// ---------------------------------------------------------------------------

export type TransportType = 'ble' | 'radio';

// ---------------------------------------------------------------------------
// Action-specific parameter types
// ---------------------------------------------------------------------------

export interface LedParams {
  color: number;
  cycles: number;
  light_on: number;
  light_off: number;
  brightness: number;
}

export interface BuzzerParams {
  cycles: number;
  on_time: number;
  off_time: number;
}

export interface RefreshParams {
  region_a: number;
  region_b?: number;
}

export interface SlotParams {
  slot_number: number;
  frame_type?: number;
  adv_interval?: number;
  adv_by_trigger?: boolean;
}

// ---------------------------------------------------------------------------
// Jengine Request (v1)
// ---------------------------------------------------------------------------

export interface JengineRequest {
  action: JengineActionValue;
  version: 1 | 2;
  method: JengineMethod;
  req_id: number;
  payload: {
    key?: string;
    opcode?: number;
    single?: boolean;
    suppress_stage2?: boolean;
    [key: string]: unknown;
    details: Record<string, Record<string, unknown>>;
  };
}

// ---------------------------------------------------------------------------
// Jengine Response
// ---------------------------------------------------------------------------

export interface Stage2Detail {
  code: number;
  error: number;
  message: string;
  [key: string]: unknown;
}

export interface JengineResponse {
  action: number;
  req_id: number;
  version: number;
  method: string;
  payload: {
    code?: number;
    message?: string;
    details?: Record<string, Stage2Detail>;
  };
}

// ---------------------------------------------------------------------------
// Gateway Status / Advertisement Messages
// ---------------------------------------------------------------------------

export interface GatewayStatusMessage {
  tm: string;
  gw: string;
  seq: number;
  adv: AdvertisementEntry[];
}

export interface AdvertisementEntry {
  type: string;
  mac: string;
  rssi: number;
  tm: string;
  error?: number;
  img_id?: number;
  opcode?: number;
  single?: boolean;
  battery?: number;
  firmware_version?: string;
  tag_model?: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Screen info (resolved from tag model)
// ---------------------------------------------------------------------------

export interface ScreenInfo {
  size: string;
  width: number;
  height: number;
  colors: number;
}

// ---------------------------------------------------------------------------
// In-memory tag state (held by status handler)
// ---------------------------------------------------------------------------

export interface TagState {
  mac: string;
  rssi: number;
  lastAdvertised: string;
  type: string;
  error: number;
  battery?: number;
  firmwareVersion?: string;
  tagModel?: string;
  screen?: ScreenInfo;
  imgId?: number;
  opcode?: number;
  single?: boolean;
}

// ---------------------------------------------------------------------------
// HTTP API types
// ---------------------------------------------------------------------------

export type ActionName =
  | 'version'
  | 'query'
  | 'ledRadio'
  | 'ledBle'
  | 'buzzer'
  | 'shutdown'
  | 'refresh'
  | 'slot'
  | 'reboot'
  | 'operatingStatus';

export interface SendCommandRequest {
  mac: string;
  /** Named action from the registry */
  actionName?: ActionName;
  /** Raw action number (backward compat) */
  action?: number;
  /** Raw method (backward compat) */
  method?: JengineMethod;
  /** Action-specific parameters (LED, buzzer, slot, refresh, etc.) */
  params?: Record<string, unknown>;
}

export interface CommandResult {
  reqId: number;
  status: 'pending' | 'sent' | 'success' | 'failed';
  stage1Code?: number;
  stage2Code?: number;
  deviceError?: number;
  response?: JengineResponse;
  error?: string;
}
