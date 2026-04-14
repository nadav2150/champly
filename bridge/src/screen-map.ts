import type { ScreenInfo } from './types.js';

// ---------------------------------------------------------------------------
// Tag model → screen info lookup
// Full Minew ESL catalog — all series
// ---------------------------------------------------------------------------

const TAG_SCREEN_MAP: Record<string, ScreenInfo> = {
  // DS Series (ultra-thin)
  DS021Q:  { size: '2.13"',  width: 250,  height: 122,  colors: 4 },
  DS026F:  { size: '2.66"',  width: 296,  height: 152,  colors: 2 },
  DS027Q:  { size: '2.67"',  width: 384,  height: 200,  colors: 4 },
  DS029Q:  { size: '2.9"',   width: 296,  height: 128,  colors: 4 },
  DS035Q:  { size: '3.5"',   width: 384,  height: 184,  colors: 4 },
  DS035B:  { size: '3.5"',   width: 384,  height: 184,  colors: 2 },
  DS042Q:  { size: '4.2"',   width: 400,  height: 300,  colors: 4 },
  DS042F:  { size: '4.2"',   width: 400,  height: 300,  colors: 2 },
  DS042B:  { size: '4.2"',   width: 400,  height: 300,  colors: 2 },
  DS043Q:  { size: '4.3"',   width: 522,  height: 152,  colors: 4 },
  DS073:   { size: '7.3"',   width: 800,  height: 480,  colors: 3 },
  DS075:   { size: '7.5"',   width: 800,  height: 480,  colors: 3 },
  DS116:   { size: '11.6"',  width: 960,  height: 640,  colors: 3 },

  // STag Series
  STAG21F: { size: '2.13"',  width: 250,  height: 122,  colors: 2 },
  STAG21:  { size: '2.13"',  width: 250,  height: 122,  colors: 3 },
  STAG21Q: { size: '2.13"',  width: 250,  height: 122,  colors: 4 },
  STAG26:  { size: '2.66"',  width: 296,  height: 152,  colors: 3 },
  STAG26Q: { size: '2.66"',  width: 296,  height: 152,  colors: 4 },
  STAG29:  { size: '2.9"',   width: 296,  height: 128,  colors: 3 },
  STAG29Q: { size: '2.9"',   width: 296,  height: 128,  colors: 4 },
  STAG29B: { size: '2.9"',   width: 296,  height: 128,  colors: 2 },
  STAG29A: { size: '2.9"',   width: 296,  height: 128,  colors: 3 },
  STAG29AQ:{ size: '2.9"',   width: 296,  height: 128,  colors: 4 },
  STAG29AB:{ size: '2.9"',   width: 296,  height: 128,  colors: 2 },
  STAG42:  { size: '4.2"',   width: 400,  height: 300,  colors: 3 },
  STAG42Q: { size: '4.2"',   width: 400,  height: 300,  colors: 4 },
  STAG58:  { size: '5.83"',  width: 648,  height: 480,  colors: 3 },
  STAG58Q: { size: '5.83"',  width: 648,  height: 480,  colors: 4 },
  STAG75:  { size: '7.5"',   width: 800,  height: 480,  colors: 3 },
  STAG116: { size: '11.6"',  width: 960,  height: 640,  colors: 3 },

  // MTag Series
  MTAG15:  { size: '1.54"',  width: 152,  height: 152,  colors: 3 },
  MTAG15Q: { size: '1.54"',  width: 200,  height: 200,  colors: 4 },
  MTAG21:  { size: '2.13"',  width: 250,  height: 122,  colors: 3 },
  MTAG21Q: { size: '2.13"',  width: 250,  height: 122,  colors: 4 },
  MTAG29:  { size: '2.9"',   width: 296,  height: 128,  colors: 3 },
  MTAG29Q: { size: '2.9"',   width: 296,  height: 128,  colors: 4 },
  MTAG29B: { size: '2.9"',   width: 296,  height: 128,  colors: 2 },
  MTAG42:  { size: '4.2"',   width: 400,  height: 300,  colors: 3 },
  MTAG42Q: { size: '4.2"',   width: 400,  height: 300,  colors: 4 },
  MTAG58:  { size: '5.83"',  width: 648,  height: 480,  colors: 3 },
  MTAG58Q: { size: '5.83"',  width: 648,  height: 480,  colors: 4 },
  MTAG75:  { size: '7.5"',   width: 800,  height: 480,  colors: 3 },
  MTAG75Q: { size: '7.5"',   width: 800,  height: 480,  colors: 4 },

  // RS Series (6-color e-paper)
  RS075:   { size: '7.3"',   width: 800,  height: 480,  colors: 6 },
  RS133:   { size: '13.3"',  width: 1600, height: 1200, colors: 6 },
  RS253:   { size: '25.3"',  width: 3200, height: 1800, colors: 6 },
  RS315:   { size: '31.5"',  width: 2560, height: 1440, colors: 6 },

  // Conference table
  RS075V:  { size: '7.3"',   width: 800,  height: 480,  colors: 6 },
  WS075:   { size: '7.5"',   width: 800,  height: 480,  colors: 3 },

  // MZ / WT Series
  MZ5021:  { size: '2.13"',  width: 250,  height: 122,  colors: 4 },
  WT029A:  { size: '2.9"',   width: 296,  height: 128,  colors: 2 },
};

// ---------------------------------------------------------------------------
// Gateway `type` field → model name
//
// The Minew gateway sends a numeric/short `type` string in advertisements
// (e.g. "027", "029"). This maps those to the most common DS-series model.
// If the gateway sends a full model name, normalizeModel will match it
// directly from TAG_SCREEN_MAP.
// ---------------------------------------------------------------------------

const TYPE_TO_MODEL: Record<string, string> = {
  '015':  'MTAG15',
  '021':  'DS021Q',
  '026':  'DS026F',
  '027':  'DS027Q',
  '029':  'DS029Q',
  '035':  'DS035Q',
  '042':  'DS042Q',
  '043':  'DS043Q',
  '058':  'STAG58',
  '073':  'DS073',
  '075':  'RS075',
  '116':  'DS116',
  '133':  'RS133',
};

/**
 * Normalize a raw type/model string from the gateway into a canonical model name.
 */
export function normalizeModel(raw: string): string {
  const upper = raw.toUpperCase().trim();
  if (TAG_SCREEN_MAP[upper]) return upper;
  const fromType = TYPE_TO_MODEL[raw.toLowerCase().trim()];
  if (fromType) return fromType;
  return raw;
}

export function resolveScreenInfo(tagModel: string | null | undefined): ScreenInfo | undefined {
  if (!tagModel) return undefined;
  const normalized = normalizeModel(tagModel);
  if (TAG_SCREEN_MAP[normalized]) return TAG_SCREEN_MAP[normalized];
  const upper = tagModel.toUpperCase();
  for (const [code, info] of Object.entries(TAG_SCREEN_MAP)) {
    if (upper.includes(code)) return info;
  }
  return undefined;
}
