export type ScanOrder = 'col-rtl' | 'row';
export type TagScreenInfo = { size: string; w: number; h: number; colors: number; scan: ScanOrder };

/** Gateway / user typos → canonical map key */
const MODEL_ALIASES: Record<string, string> = {
  SQTAG29: 'STAG29',
  STAG_29: 'STAG29',
};

/** Short numeric `type` strings from the gateway (same idea as bridge screen-map). */
const TYPE_TO_MODEL: Record<string, string> = {
  '015': 'MTAG15',
  '021': 'DS021Q',
  '026': 'DS026F',
  '027': 'DS027Q',
  '029': 'DS029Q',
  '035': 'DS035Q',
  '042': 'DS042Q',
  '043': 'DS043Q',
  '058': 'STAG58',
  '073': 'DS073',
  '075': 'RS075',
  '116': 'DS116',
  '133': 'RS133',
};

export const TAG_SCREEN_MAP: Record<string, TagScreenInfo> = {
  // DS Series — small landscape panels use col-rtl; 4.2"+ use row
  DS021Q:   { size: '2.13"',  w: 250,  h: 122,  colors: 4, scan: 'col-rtl' },
  DS026F:   { size: '2.66"',  w: 296,  h: 152,  colors: 2, scan: 'col-rtl' },
  DS027Q:   { size: '2.67"',  w: 384,  h: 200,  colors: 4, scan: 'col-rtl' },
  DS029Q:   { size: '2.9"',   w: 296,  h: 128,  colors: 4, scan: 'col-rtl' },
  DS035Q:   { size: '3.5"',   w: 384,  h: 184,  colors: 4, scan: 'col-rtl' },
  DS035B:   { size: '3.5"',   w: 384,  h: 184,  colors: 2, scan: 'col-rtl' },
  DS042Q:   { size: '4.2"',   w: 400,  h: 300,  colors: 4, scan: 'row' },
  DS042F:   { size: '4.2"',   w: 400,  h: 300,  colors: 2, scan: 'row' },
  DS042B:   { size: '4.2"',   w: 400,  h: 300,  colors: 2, scan: 'row' },
  DS043Q:   { size: '4.3"',   w: 522,  h: 152,  colors: 4, scan: 'col-rtl' },
  DS073:    { size: '7.3"',   w: 800,  h: 480,  colors: 3, scan: 'row' },
  DS075:    { size: '7.5"',   w: 800,  h: 480,  colors: 3, scan: 'row' },
  DS116:    { size: '11.6"',  w: 960,  h: 640,  colors: 3, scan: 'row' },
  // STag Series
  STAG21F:  { size: '2.13"',  w: 250,  h: 122,  colors: 2, scan: 'col-rtl' },
  STAG21:   { size: '2.13"',  w: 250,  h: 122,  colors: 3, scan: 'col-rtl' },
  STAG21Q:  { size: '2.13"',  w: 250,  h: 122,  colors: 4, scan: 'col-rtl' },
  STAG26:   { size: '2.66"',  w: 296,  h: 152,  colors: 3, scan: 'col-rtl' },
  STAG26Q:  { size: '2.66"',  w: 296,  h: 152,  colors: 4, scan: 'col-rtl' },
  STAG29:   { size: '2.9"',   w: 296,  h: 128,  colors: 3, scan: 'col-rtl' },
  STAG29Q:  { size: '2.9"',   w: 296,  h: 128,  colors: 4, scan: 'col-rtl' },
  STAG29B:  { size: '2.9"',   w: 296,  h: 128,  colors: 2, scan: 'col-rtl' },
  STAG29A:  { size: '2.9"',   w: 296,  h: 128,  colors: 3, scan: 'col-rtl' },
  STAG29AQ: { size: '2.9"',   w: 296,  h: 128,  colors: 4, scan: 'col-rtl' },
  STAG29AB: { size: '2.9"',   w: 296,  h: 128,  colors: 2, scan: 'col-rtl' },
  STAG42:   { size: '4.2"',   w: 400,  h: 300,  colors: 3, scan: 'row' },
  STAG42Q:  { size: '4.2"',   w: 400,  h: 300,  colors: 4, scan: 'row' },
  STAG58:   { size: '5.83"',  w: 648,  h: 480,  colors: 3, scan: 'row' },
  STAG58Q:  { size: '5.83"',  w: 648,  h: 480,  colors: 4, scan: 'row' },
  STAG75:   { size: '7.5"',   w: 800,  h: 480,  colors: 3, scan: 'row' },
  STAG116:  { size: '11.6"',  w: 960,  h: 640,  colors: 3, scan: 'row' },
  // MTag Series
  MTAG15:   { size: '1.54"',  w: 152,  h: 152,  colors: 3, scan: 'row' },
  MTAG15Q:  { size: '1.54"',  w: 200,  h: 200,  colors: 4, scan: 'row' },
  MTAG21:   { size: '2.13"',  w: 250,  h: 122,  colors: 3, scan: 'col-rtl' },
  MTAG21Q:  { size: '2.13"',  w: 250,  h: 122,  colors: 4, scan: 'col-rtl' },
  MTAG29:   { size: '2.9"',   w: 296,  h: 128,  colors: 3, scan: 'col-rtl' },
  MTAG29Q:  { size: '2.9"',   w: 296,  h: 128,  colors: 4, scan: 'col-rtl' },
  MTAG29B:  { size: '2.9"',   w: 296,  h: 128,  colors: 2, scan: 'col-rtl' },
  MTAG42:   { size: '4.2"',   w: 400,  h: 300,  colors: 3, scan: 'row' },
  MTAG42Q:  { size: '4.2"',   w: 400,  h: 300,  colors: 4, scan: 'row' },
  MTAG58:   { size: '5.83"',  w: 648,  h: 480,  colors: 3, scan: 'row' },
  MTAG58Q:  { size: '5.83"',  w: 648,  h: 480,  colors: 4, scan: 'row' },
  MTAG75:   { size: '7.5"',   w: 800,  h: 480,  colors: 3, scan: 'row' },
  MTAG75Q:  { size: '7.5"',   w: 800,  h: 480,  colors: 4, scan: 'row' },
  // RS Series (6-color)
  RS075:    { size: '7.3"',   w: 800,  h: 480,  colors: 6, scan: 'row' },
  RS133:    { size: '13.3"',  w: 1600, h: 1200, colors: 6, scan: 'row' },
  RS253:    { size: '25.3"',  w: 3200, h: 1800, colors: 6, scan: 'row' },
  RS315:    { size: '31.5"',  w: 2560, h: 1440, colors: 6, scan: 'row' },
  // Conference
  RS075V:   { size: '7.3"',   w: 800,  h: 480,  colors: 6, scan: 'row' },
  WS075:    { size: '7.5"',   w: 800,  h: 480,  colors: 3, scan: 'row' },
  // MZ / WT
  MZ5021:   { size: '2.13"',  w: 250,  h: 122,  colors: 4, scan: 'col-rtl' },
  WT029A:   { size: '2.9"',   w: 296,  h: 128,  colors: 2, scan: 'col-rtl' },
};

export function resolveScreen(model: string | null): TagScreenInfo | undefined {
  if (!model) return undefined;
  const compact = model.toUpperCase().trim().replace(/[\s_-]+/g, '');
  const canonical = MODEL_ALIASES[compact] ?? compact;
  if (TAG_SCREEN_MAP[canonical]) return TAG_SCREEN_MAP[canonical];

  const typeKey = model.toLowerCase().trim();
  const fromGatewayType = TYPE_TO_MODEL[typeKey];
  if (fromGatewayType && TAG_SCREEN_MAP[fromGatewayType]) {
    return TAG_SCREEN_MAP[fromGatewayType];
  }

  for (const [code, info] of Object.entries(TAG_SCREEN_MAP)) {
    if (canonical.includes(code)) return info;
  }
  return undefined;
}
