import type { EslColor, LayoutElement, TemplateLayout, TextAlign } from './template-layout';

const ESL_HEX: Record<EslColor, string> = {
  white: '#ffffff',
  black: '#000000',
  red: '#b91c1c',
  yellow: '#ca8a04',
};

function resolveColor(color: EslColor): string {
  return ESL_HEX[color];
}

function getFieldText(data: Record<string, string>, field: string): string {
  const v = data[field];
  return v !== undefined && v !== null ? String(v) : '';
}

function truncateToWidth(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
): string {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let s = text;
  while (s.length > 0 && ctx.measureText(`${s}…`).width > maxWidth) {
    s = s.slice(0, -1);
  }
  return s.length > 0 ? `${s}…` : '…';
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  if (maxLines <= 1) {
    return [truncateToWidth(ctx, text, maxWidth)];
  }
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines: string[] = [];
  let current = words[0]!;
  for (let i = 1; i < words.length; i++) {
    const word = words[i]!;
    const test = `${current} ${word}`;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      lines.push(current);
      current = word;
      if (lines.length >= maxLines - 1) {
        const rest = words.slice(i).join(' ');
        lines.push(truncateToWidth(ctx, rest, maxWidth));
        return lines;
      }
    }
  }
  lines.push(current);
  return lines.slice(0, maxLines);
}

function setFont(
  ctx: CanvasRenderingContext2D,
  fontSize: number,
  fontWeight: string,
): void {
  ctx.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, "Segoe UI", sans-serif`;
}

function resolveMaxWidth(
  x: number,
  explicitW: number | undefined,
  layoutWidth: number,
  padding: number,
): number {
  if (explicitW !== undefined && explicitW > 0) return explicitW;
  return Math.max(8, layoutWidth - x - padding);
}

function drawTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  fontWeight: string,
  color: EslColor,
  align: TextAlign,
  maxWidth: number,
  maxLines: number,
): void {
  setFont(ctx, fontSize, fontWeight);
  ctx.fillStyle = resolveColor(color);
  ctx.textBaseline = 'alphabetic';

  const lines =
    maxLines > 1
      ? wrapText(ctx, text, maxWidth, maxLines)
      : [truncateToWidth(ctx, text, maxWidth)];

  const lineHeight = fontSize * 1.25;
  let drawY = y;

  for (const line of lines) {
    let drawX = x;
    const metrics = ctx.measureText(line);
    if (align === 'center') {
      drawX = x - metrics.width / 2;
    } else if (align === 'right') {
      drawX = x - metrics.width;
    }
    ctx.fillText(line, drawX, drawY);
    drawY += lineHeight;
  }
}

function drawTextElement(
  ctx: CanvasRenderingContext2D,
  el: Extract<LayoutElement, { type: 'text' }>,
  data: Record<string, string>,
  layoutWidth: number,
): void {
  const text = getFieldText(data, el.field);
  const maxWidth = resolveMaxWidth(el.x, el.w, layoutWidth, 8);
  drawTextLines(
    ctx, text, el.x, el.y,
    el.fontSize,
    el.fontWeight === 'bold' ? 'bold' : 'normal',
    el.color,
    el.align ?? 'left',
    maxWidth,
    el.maxLines ?? 1,
  );
}

function drawLabelElement(
  ctx: CanvasRenderingContext2D,
  el: Extract<LayoutElement, { type: 'label' }>,
  layoutWidth: number,
): void {
  const maxWidth = resolveMaxWidth(el.x, el.w, layoutWidth, 8);
  drawTextLines(
    ctx, el.text, el.x, el.y,
    el.fontSize,
    el.fontWeight === 'bold' ? 'bold' : 'normal',
    el.color,
    el.align ?? 'left',
    maxWidth,
    el.maxLines ?? 1,
  );
}

function drawRectElement(
  ctx: CanvasRenderingContext2D,
  el: Extract<LayoutElement, { type: 'rect' }>,
): void {
  ctx.fillStyle = resolveColor(el.color);
  const r = el.radius ?? 0;
  if (r > 0 && typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(el.x, el.y, el.w, el.h, r);
    ctx.fill();
  } else {
    ctx.fillRect(el.x, el.y, el.w, el.h);
  }
}

function drawLineElement(
  ctx: CanvasRenderingContext2D,
  el: Extract<LayoutElement, { type: 'line' }>,
): void {
  ctx.strokeStyle = resolveColor(el.color);
  ctx.lineWidth = el.strokeWidth ?? 1;
  ctx.beginPath();
  ctx.moveTo(el.x1, el.y1);
  ctx.lineTo(el.x2, el.y2);
  ctx.stroke();
}

function drawBadgeElement(
  ctx: CanvasRenderingContext2D,
  el: Extract<LayoutElement, { type: 'badge' }>,
  data: Record<string, string>,
): void {
  const text = el.text ?? (el.field ? getFieldText(data, el.field) : '');
  if (!text) return;

  const fontWeight = el.fontWeight === 'bold' ? 'bold' : 'normal';
  setFont(ctx, el.fontSize, fontWeight);

  const px = el.paddingX ?? 6;
  const py = el.paddingY ?? 3;
  const metrics = ctx.measureText(text);
  const badgeW = el.w ?? Math.ceil(metrics.width + px * 2);
  const badgeH = el.h ?? Math.ceil(el.fontSize + py * 2);
  const r = el.radius ?? 4;

  ctx.fillStyle = resolveColor(el.bgColor);
  if (r > 0 && typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(el.x, el.y, badgeW, badgeH, r);
    ctx.fill();
  } else {
    ctx.fillRect(el.x, el.y, badgeW, badgeH);
  }

  ctx.fillStyle = resolveColor(el.color);
  ctx.textBaseline = 'middle';
  const textX = el.x + badgeW / 2 - metrics.width / 2;
  const textY = el.y + badgeH / 2;
  ctx.fillText(text, textX, textY);
}

function drawImagePlaceholder(
  ctx: CanvasRenderingContext2D,
  el: Extract<LayoutElement, { type: 'image' }>,
): void {
  ctx.strokeStyle = '#d1d5db';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(el.x, el.y, el.w, el.h);
  ctx.setLineDash([]);

  const iconSize = Math.min(el.w, el.h, 32) * 0.5;
  const cx = el.x + el.w / 2;
  const cy = el.y + el.h / 2;

  ctx.fillStyle = '#9ca3af';
  ctx.beginPath();
  ctx.moveTo(cx - iconSize * 0.5, cy + iconSize * 0.4);
  ctx.lineTo(cx - iconSize * 0.2, cy - iconSize * 0.1);
  ctx.lineTo(cx + iconSize * 0.1, cy + iconSize * 0.2);
  ctx.lineTo(cx + iconSize * 0.3, cy - iconSize * 0.3);
  ctx.lineTo(cx + iconSize * 0.5, cy + iconSize * 0.4);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx - iconSize * 0.25, cy - iconSize * 0.25, iconSize * 0.12, 0, Math.PI * 2);
  ctx.fill();
}

const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): HTMLImageElement | null {
  const cached = imageCache.get(src);
  if (cached?.complete && cached.naturalWidth > 0) return cached;
  if (!cached) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    imageCache.set(src, img);
  }
  return null;
}

function drawImageElement(
  ctx: CanvasRenderingContext2D,
  el: Extract<LayoutElement, { type: 'image' }>,
  data: Record<string, string>,
): void {
  const src = el.src ?? (el.field ? getFieldText(data, el.field) : '');
  if (!src) {
    drawImagePlaceholder(ctx, el);
    return;
  }

  const img = loadImage(src);
  if (!img) {
    drawImagePlaceholder(ctx, el);
    return;
  }

  const imgAspect = img.naturalWidth / img.naturalHeight;
  const boxAspect = el.w / el.h;
  let dw: number, dh: number, dx: number, dy: number;
  if (imgAspect > boxAspect) {
    dw = el.w;
    dh = el.w / imgAspect;
    dx = el.x;
    dy = el.y + (el.h - dh) / 2;
  } else {
    dh = el.h;
    dw = el.h * imgAspect;
    dx = el.x + (el.w - dw) / 2;
    dy = el.y;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

export function renderLabel(
  canvas: HTMLCanvasElement,
  layout: TemplateLayout,
  data: Record<string, string>,
  options?: { scale?: number },
): void {
  const scale = options?.scale ?? 1;
  const w = Math.max(1, Math.round(layout.width * scale));
  const h = Math.max(1, Math.round(layout.height * scale));
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.fillStyle = resolveColor(
    layout.background === 'white' ? 'white' : 'black',
  );
  ctx.fillRect(0, 0, layout.width, layout.height);

  for (const el of layout.elements) {
    switch (el.type) {
      case 'rect':
        drawRectElement(ctx, el);
        break;
      case 'line':
        drawLineElement(ctx, el);
        break;
      case 'text':
        drawTextElement(ctx, el, data, layout.width);
        break;
      case 'label':
        drawLabelElement(ctx, el, layout.width);
        break;
      case 'badge':
        drawBadgeElement(ctx, el, data);
        break;
      case 'image':
        drawImageElement(ctx, el, data);
        break;
    }
  }
}
