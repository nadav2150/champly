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
  | 'detail1'
  | 'detail2'
  | 'detail3'
  | 'imageUrl';

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
  background: 'white' | 'black';
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
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function isEslColor(v: unknown): v is EslColor {
  return v === 'white' || v === 'black' || v === 'red' || v === 'yellow';
}

const VALID_FIELDS = new Set<string>([
  'name', 'price', 'unit', 'category', 'currency',
  'description', 'discount', 'detail1', 'detail2', 'detail3', 'imageUrl',
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
    if (bg !== 'white' && bg !== 'black') return null;
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
