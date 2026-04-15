export type EslColor = 'white' | 'black' | 'red' | 'yellow';

export type TextAlign = 'left' | 'center' | 'right';

export type FontWeight = 'normal' | 'bold';

export type LayoutField =
  | 'name'
  | 'price'
  | 'unit'
  | 'category'
  | 'currency'
  | 'description'
  | 'discount'
  | 'badge_text'
  | 'detail1'
  | 'detail2'
  | 'detail3'
  | 'imageUrl'
  | 'old_price';

export type TextElement = {
  type: 'text';
  field: LayoutField;
  x: number;
  y: number;
  w?: number;
  fontSize: number;
  fontWeight?: FontWeight;
  align?: TextAlign;
  color: EslColor;
  maxLines?: number;
  strikethrough?: boolean;
};

export type LabelElement = {
  type: 'label';
  text: string;
  x: number;
  y: number;
  w?: number;
  fontSize: number;
  fontWeight?: FontWeight;
  align?: TextAlign;
  color: EslColor;
  maxLines?: number;
};

export type RectElement = {
  type: 'rect';
  x: number;
  y: number;
  w: number;
  h: number;
  color: EslColor;
  radius?: number;
};

export type LineElement = {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: EslColor;
  strokeWidth?: number;
};

export type BadgeElement = {
  type: 'badge';
  text?: string;
  field?: LayoutField;
  x: number;
  y: number;
  w?: number;
  h?: number;
  fontSize: number;
  fontWeight?: FontWeight;
  color: EslColor;
  bgColor: EslColor;
  radius?: number;
  paddingX?: number;
  paddingY?: number;
};

export type ImageElement = {
  type: 'image';
  field?: LayoutField;
  src?: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

export type LayoutElement =
  | TextElement
  | LabelElement
  | RectElement
  | LineElement
  | BadgeElement
  | ImageElement;

export interface TemplateLayout {
  width: number;
  height: number;
  background: EslColor;
  elements: LayoutElement[];
}

export const SAMPLE_PRODUCT_DATA: Record<string, string> = {
  name: 'Fresh Milk 1L',
  price: '₪11.90',
  unit: 'per unit',
  category: 'Dairy',
  currency: '₪',
  description: 'Pasteurized whole milk',
  discount: '20%',
  detail1: 'Volume: 1L',
  detail2: 'Fat: 3%',
  detail3: 'Organic: Yes',
  imageUrl: '',
  old_price: '₪14.90',
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isEslColor(v: unknown): v is EslColor {
  return v === 'white' || v === 'black' || v === 'red' || v === 'yellow';
}

const VALID_FIELDS = new Set<string>([
  'name', 'price', 'unit', 'category', 'currency',
  'description', 'discount', 'badge_text', 'detail1', 'detail2', 'detail3',
  'imageUrl', 'old_price',
]);

function isLayoutField(v: unknown): v is LayoutField {
  return typeof v === 'string' && VALID_FIELDS.has(v);
}

function optNum(raw: unknown): number | undefined {
  if (raw === undefined || raw === null) return undefined;
  const n = Number(raw);
  return Number.isFinite(n) ? n : undefined;
}

function parseTextElement(raw: Record<string, unknown>): TextElement | null {
  if (!isLayoutField(raw.field)) return null;
  const x = Number(raw.x);
  const y = Number(raw.y);
  const fontSize = Number(raw.fontSize);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(fontSize)) {
    return null;
  }
  if (!isEslColor(raw.color)) return null;
  const fontWeight =
    raw.fontWeight === 'bold' || raw.fontWeight === 'normal'
      ? raw.fontWeight
      : 'normal';
  const align =
    raw.align === 'left' || raw.align === 'center' || raw.align === 'right'
      ? raw.align
      : 'left';
  const maxLines = optNum(raw.maxLines);
  const w = optNum(raw.w);
  return {
    type: 'text',
    field: raw.field,
    x,
    y,
    w: w !== undefined && w > 0 ? w : undefined,
    fontSize,
    fontWeight,
    align,
    color: raw.color,
    maxLines:
      maxLines !== undefined && maxLines > 0 ? Math.floor(maxLines) : undefined,
    strikethrough: raw.strikethrough === true ? true : undefined,
  };
}

function parseLabelElement(raw: Record<string, unknown>): LabelElement | null {
  if (typeof raw.text !== 'string' || raw.text.length === 0) return null;
  const x = Number(raw.x);
  const y = Number(raw.y);
  const fontSize = Number(raw.fontSize);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(fontSize)) {
    return null;
  }
  if (!isEslColor(raw.color)) return null;
  const fontWeight =
    raw.fontWeight === 'bold' || raw.fontWeight === 'normal'
      ? raw.fontWeight
      : 'normal';
  const align =
    raw.align === 'left' || raw.align === 'center' || raw.align === 'right'
      ? raw.align
      : 'left';
  const w = optNum(raw.w);
  const maxLines = optNum(raw.maxLines);
  return {
    type: 'label',
    text: raw.text,
    x,
    y,
    w: w !== undefined && w > 0 ? w : undefined,
    fontSize,
    fontWeight,
    align,
    color: raw.color,
    maxLines:
      maxLines !== undefined && maxLines > 0 ? Math.floor(maxLines) : undefined,
  };
}

function parseRectElement(raw: Record<string, unknown>): RectElement | null {
  const x = Number(raw.x);
  const y = Number(raw.y);
  const w = Number(raw.w);
  const h = Number(raw.h);
  if (
    !Number.isFinite(x) || !Number.isFinite(y) ||
    !Number.isFinite(w) || !Number.isFinite(h)
  ) {
    return null;
  }
  if (!isEslColor(raw.color)) return null;
  const radius = optNum(raw.radius);
  return {
    type: 'rect',
    x, y, w, h,
    color: raw.color,
    radius: radius !== undefined && radius >= 0 ? radius : undefined,
  };
}

function parseLineElement(raw: Record<string, unknown>): LineElement | null {
  const x1 = Number(raw.x1);
  const y1 = Number(raw.y1);
  const x2 = Number(raw.x2);
  const y2 = Number(raw.y2);
  if (
    !Number.isFinite(x1) || !Number.isFinite(y1) ||
    !Number.isFinite(x2) || !Number.isFinite(y2)
  ) {
    return null;
  }
  if (!isEslColor(raw.color)) return null;
  const strokeWidth = optNum(raw.strokeWidth) ?? 1;
  return {
    type: 'line',
    x1, y1, x2, y2,
    color: raw.color,
    strokeWidth: strokeWidth > 0 ? strokeWidth : 1,
  };
}

function parseBadgeElement(raw: Record<string, unknown>): BadgeElement | null {
  const x = Number(raw.x);
  const y = Number(raw.y);
  const fontSize = Number(raw.fontSize);
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(fontSize)) {
    return null;
  }
  if (!isEslColor(raw.color) || !isEslColor(raw.bgColor)) return null;
  const hasText = typeof raw.text === 'string' && raw.text.length > 0;
  const hasField = isLayoutField(raw.field);
  if (!hasText && !hasField) return null;
  return {
    type: 'badge',
    text: hasText ? (raw.text as string) : undefined,
    field: hasField ? (raw.field as LayoutField) : undefined,
    x, y,
    w: optNum(raw.w),
    h: optNum(raw.h),
    fontSize,
    fontWeight:
      raw.fontWeight === 'bold' || raw.fontWeight === 'normal'
        ? raw.fontWeight
        : 'bold',
    color: raw.color,
    bgColor: raw.bgColor,
    radius: optNum(raw.radius) ?? 4,
    paddingX: optNum(raw.paddingX) ?? 6,
    paddingY: optNum(raw.paddingY) ?? 3,
  };
}

function parseImageElement(raw: Record<string, unknown>): ImageElement | null {
  const x = Number(raw.x);
  const y = Number(raw.y);
  const w = Number(raw.w);
  const h = Number(raw.h);
  if (
    !Number.isFinite(x) || !Number.isFinite(y) ||
    !Number.isFinite(w) || !Number.isFinite(h)
  ) {
    return null;
  }
  const hasSrc = typeof raw.src === 'string' && raw.src.length > 0;
  const hasField = isLayoutField(raw.field);
  if (!hasSrc && !hasField) return null;
  return {
    type: 'image',
    src: hasSrc ? (raw.src as string) : undefined,
    field: hasField ? (raw.field as LayoutField) : undefined,
    x, y, w, h,
  };
}

function parseElement(raw: unknown): LayoutElement | null {
  if (!isRecord(raw) || typeof raw.type !== 'string') return null;
  if (raw.type === 'text') return parseTextElement(raw);
  if (raw.type === 'label') return parseLabelElement(raw);
  if (raw.type === 'rect') return parseRectElement(raw);
  if (raw.type === 'line') return parseLineElement(raw);
  if (raw.type === 'badge') return parseBadgeElement(raw);
  if (raw.type === 'image') return parseImageElement(raw);
  return null;
}

export function parseLayoutJson(json: string): TemplateLayout | null {
  try {
    const v = JSON.parse(json) as unknown;
    if (!isRecord(v)) return null;
    const width = Number(v.width);
    const height = Number(v.height);
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return null;
    }
    const bg = v.background;
    if (!isEslColor(bg)) return null;
    const elementsRaw = v.elements;
    if (!Array.isArray(elementsRaw)) return null;
    const elements: LayoutElement[] = [];
    for (const el of elementsRaw) {
      const parsed = parseElement(el);
      if (parsed) elements.push(parsed);
    }
    return { width, height, background: bg, elements };
  } catch {
    return null;
  }
}

const AUTO_FIELDS = new Set<string>([
  'name', 'price', 'unit', 'category', 'currency',
]);

export function getEditableFields(layout: TemplateLayout): string[] {
  const fields = new Set<string>();
  for (const el of layout.elements) {
    if ('field' in el && el.field && !AUTO_FIELDS.has(el.field)) {
      fields.add(el.field);
    }
  }
  return [...fields];
}

export function parseTemplateData(
  raw: string | null | undefined,
): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    const result: Record<string, string> = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === 'string') result[k] = v;
    }
    return result;
  } catch {
    return {};
  }
}

export function sanitizeTemplateData(
  data: Record<string, string>,
  layout: TemplateLayout,
): Record<string, string> {
  const allowed = new Set(getEditableFields(layout));
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(data)) {
    if (allowed.has(k) && typeof v === 'string' && v.trim().length > 0) {
      clean[k] = v;
    }
  }
  return clean;
}

// ---------------------------------------------------------------------------
// Style customization types and rules
// ---------------------------------------------------------------------------

export type StyleRole =
  | 'name' | 'price' | 'unit' | 'category'
  | 'discount' | 'badge_text' | 'old_price' | 'description';

export type SizePreset = 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl' | '3xl';

export type HorizontalAlign = 'left' | 'center' | 'right';

export type RoleStyleOverride = {
  size?: SizePreset;
  color?: EslColor;
  bold?: boolean;
  align?: HorizontalAlign;
};

export type TemplateStyle = Partial<Record<StyleRole, RoleStyleOverride>> & {
  background?: EslColor;
};

export type RoleRule = {
  labelKey: string;
  sizePresets: SizePreset[];
  sizeRatios: Partial<Record<SizePreset, number>>;
  allowedColors: EslColor[];
  allowBoldToggle: boolean;
  allowedAligns?: HorizontalAlign[];
};

export const ROLE_RULES: Partial<Record<StyleRole, RoleRule>> = {
  name: {
    labelKey: 'common:style.roles.name',
    sizePresets: ['s', 'm', 'l', 'xl', '2xl', '3xl'],
    sizeRatios: { xs: 0.7, s: 0.85, m: 1.0, l: 1.2, xl: 1.4, '2xl': 1.7, '3xl': 2.0 },
    allowedColors: ['black', 'red', 'yellow'],
    allowBoldToggle: true,
    allowedAligns: ['left', 'center', 'right'],
  },
  price: {
    labelKey: 'common:style.roles.price',
    sizePresets: ['s', 'm', 'l', 'xl', '2xl'],
    sizeRatios: { xs: 0.6, s: 0.8, m: 1.0, l: 1.25, xl: 1.5, '2xl': 1.8 },
    allowedColors: ['black', 'red', 'yellow'],
    allowBoldToggle: false,
    allowedAligns: ['left', 'center', 'right'],
  },
  unit: {
    labelKey: 'common:style.roles.unit',
    sizePresets: ['s', 'm', 'l'],
    sizeRatios: { xs: 0.7, s: 0.85, m: 1.0, l: 1.2, xl: 1.4 },
    allowedColors: ['black', 'red'],
    allowBoldToggle: false,
  },
  category: {
    labelKey: 'common:style.roles.category',
    sizePresets: ['s', 'm', 'l'],
    sizeRatios: { xs: 0.7, s: 0.85, m: 1.0, l: 1.2, xl: 1.4 },
    allowedColors: ['black', 'red'],
    allowBoldToggle: false,
    allowedAligns: ['left', 'center', 'right'],
  },
  discount: {
    labelKey: 'common:style.roles.discount',
    sizePresets: ['s', 'm', 'l', 'xl', '2xl'],
    sizeRatios: { xs: 0.6, s: 0.8, m: 1.0, l: 1.3, xl: 1.6, '2xl': 2.0 },
    allowedColors: ['red', 'black'],
    allowBoldToggle: false,
  },
  badge_text: {
    labelKey: 'common:style.roles.badge_text',
    sizePresets: ['s', 'm', 'l'],
    sizeRatios: { xs: 0.7, s: 0.85, m: 1.0, l: 1.2, xl: 1.4 },
    allowedColors: ['white', 'black'],
    allowBoldToggle: false,
  },
  old_price: {
    labelKey: 'common:style.roles.old_price',
    sizePresets: ['s', 'm', 'l'],
    sizeRatios: { xs: 0.7, s: 0.85, m: 1.0, l: 1.2, xl: 1.4 },
    allowedColors: ['black'],
    allowBoldToggle: false,
  },
  description: {
    labelKey: 'common:style.roles.description',
    sizePresets: ['s', 'm', 'l'],
    sizeRatios: { xs: 0.7, s: 0.85, m: 1.0, l: 1.2, xl: 1.4 },
    allowedColors: ['black'],
    allowBoldToggle: false,
    allowedAligns: ['left', 'center'],
  },
};

const VALID_STYLE_ROLES = new Set<string>(Object.keys(ROLE_RULES));
const VALID_SIZE_PRESETS = new Set<string>(['xs', 's', 'm', 'l', 'xl', '2xl', '3xl']);
const VALID_ALIGNS = new Set<string>(['left', 'center', 'right']);

export function getStyleableRoles(layout: TemplateLayout): StyleRole[] {
  const roles = new Set<StyleRole>();
  for (const el of layout.elements) {
    if (el.type === 'text' && VALID_STYLE_ROLES.has(el.field)) {
      roles.add(el.field as StyleRole);
    }
  }
  return [...roles];
}

export function parseTemplateStyle(
  raw: string | null | undefined,
): TemplateStyle {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    const obj = parsed as Record<string, unknown>;
    const result: TemplateStyle = {};
    if (isEslColor(obj.background)) {
      result.background = obj.background;
    }
    for (const [k, v] of Object.entries(obj)) {
      if (!VALID_STYLE_ROLES.has(k)) continue;
      if (typeof v !== 'object' || v === null || Array.isArray(v)) continue;
      const roleObj = v as Record<string, unknown>;
      const entry: RoleStyleOverride = {};
      if (typeof roleObj.size === 'string' && VALID_SIZE_PRESETS.has(roleObj.size)) {
        entry.size = roleObj.size as SizePreset;
      }
      if (typeof roleObj.color === 'string' && isEslColor(roleObj.color)) {
        entry.color = roleObj.color;
      }
      if (typeof roleObj.bold === 'boolean') {
        entry.bold = roleObj.bold;
      }
      if (typeof roleObj.align === 'string' && VALID_ALIGNS.has(roleObj.align)) {
        entry.align = roleObj.align as HorizontalAlign;
      }
      if (Object.keys(entry).length > 0) {
        result[k as StyleRole] = entry;
      }
    }
    return result;
  } catch {
    return {};
  }
}

export function sanitizeStyle(
  raw: TemplateStyle,
  layout: TemplateLayout,
): TemplateStyle {
  const validRoles = new Set(getStyleableRoles(layout));
  const clean: TemplateStyle = {};

  if (raw.background && isEslColor(raw.background)) {
    clean.background = raw.background;
  }

  for (const [k, ovr] of Object.entries(raw) as Array<[StyleRole, RoleStyleOverride]>) {
    if (k === 'background' as string) continue;
    if (!validRoles.has(k)) continue;
    const rule = ROLE_RULES[k];
    if (!rule || !ovr) continue;

    const entry: RoleStyleOverride = {};

    if (ovr.size && rule.sizePresets.includes(ovr.size) && ovr.size !== 'm') {
      entry.size = ovr.size;
    }
    if (ovr.color && rule.allowedColors.includes(ovr.color)) {
      entry.color = ovr.color;
    }
    if (rule.allowBoldToggle && typeof ovr.bold === 'boolean') {
      entry.bold = ovr.bold;
    }
    if (ovr.align && rule.allowedAligns?.includes(ovr.align)) {
      entry.align = ovr.align;
    }

    if (Object.keys(entry).length > 0) {
      clean[k] = entry;
    }
  }

  return clean;
}

// ---------------------------------------------------------------------------
// Field labels
// ---------------------------------------------------------------------------

const FIELD_LABELS: Record<string, string> = {
  badge_text: 'Badge text',
  discount: 'Discount',
  detail1: 'Detail 1',
  detail2: 'Detail 2',
  detail3: 'Detail 3',
  description: 'Description',
  imageUrl: 'Image URL',
  old_price: 'Old price',
};

export function humanizeField(field: string): string {
  return (
    FIELD_LABELS[field] ??
    field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}
