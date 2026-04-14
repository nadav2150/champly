/**
 * Minew ESL image encoder.
 *
 * Scan order is determined per-tag model (stored in TagScreenInfo.scan):
 *   - 'col-rtl': column-major right-to-left (x outer RTL, y inner). Works for
 *     small landscape panels (DS027Q, STAG29, etc.).
 *   - 'row': row-major left-to-right (y outer, x inner). Works for larger /
 *     near-square panels (STAG42, DS073, etc.).
 *
 * Pixel packing:
 *   - 4/3 colors: 2 bits per pixel, 4 pixels per byte.
 *   - 2 colors: 1 bit per pixel, 8 pixels per byte.
 */

import type { ScanOrder } from './tag-screen-map';

const enum MinewColor {
  Black  = 0x00,
  White  = 0x01,
  Yellow = 0x02,
  Red    = 0x03,
}

function classifyPixel(r: number, g: number, b: number): MinewColor {
  if (r < 64 && g < 64 && b < 64) return MinewColor.Black;
  if (r > 192 && g > 192 && b > 192) return MinewColor.White;
  if (r > 128 && g < 100 && b < 100) return MinewColor.Red;
  if (r > 128 && g > 100 && b < 100) return MinewColor.Yellow;

  const luma = 0.299 * r + 0.587 * g + 0.114 * b;
  if (luma < 128) return MinewColor.Black;
  return MinewColor.White;
}

function getPixelData(canvas: HTMLCanvasElement): {
  data: Uint8ClampedArray;
  width: number;
  height: number;
} {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get 2d context from canvas');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { data: imageData.data, width: canvas.width, height: canvas.height };
}

function pixelAt(
  data: Uint8ClampedArray,
  width: number,
  x: number,
  y: number,
): [number, number, number] {
  const idx = (y * width + x) * 4;
  return [data[idx], data[idx + 1], data[idx + 2]];
}

// ---- 2 bpp encoder (4-color & 3-color) ------------------------------------

function encode2bpp(canvas: HTMLCanvasElement, scan: ScanOrder): Uint8Array {
  const { data, width, height } = getPixelData(canvas);
  const bytes: number[] = [];

  if (scan === 'col-rtl') {
    for (let x = width - 1; x >= 0; x--) {
      for (let y = 0; y < height; y += 4) {
        let byte = 0;
        for (let i = 0; i < 4; i++) {
          const color = (y + i < height)
            ? classifyPixel(...pixelAt(data, width, x, y + i))
            : MinewColor.Black;
          byte = (byte << 2) | (color & 0x03);
        }
        bytes.push(byte);
      }
    }
  } else {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x += 4) {
        let byte = 0;
        for (let i = 0; i < 4; i++) {
          const color = (x + i < width)
            ? classifyPixel(...pixelAt(data, width, x + i, y))
            : MinewColor.Black;
          byte = (byte << 2) | (color & 0x03);
        }
        bytes.push(byte);
      }
    }
  }

  return new Uint8Array(bytes);
}

// ---- 1 bpp encoder (2-color BW) -------------------------------------------

function encode1bpp(canvas: HTMLCanvasElement, scan: ScanOrder): Uint8Array {
  const { data, width, height } = getPixelData(canvas);
  const bits: number[] = [];

  if (scan === 'col-rtl') {
    for (let x = width - 1; x >= 0; x--) {
      for (let y = 0; y < height; y++) {
        const [r, g, b] = pixelAt(data, width, x, y);
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        bits.push(luma >= 128 ? 1 : 0);
      }
    }
  } else {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const [r, g, b] = pixelAt(data, width, x, y);
        const luma = 0.299 * r + 0.587 * g + 0.114 * b;
        bits.push(luma >= 128 ? 1 : 0);
      }
    }
  }

  const out: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let bit = 0; bit < 8; bit++) {
      byte = (byte << 1) | (bits[i + bit] ?? 0);
    }
    out.push(byte);
  }

  return new Uint8Array(out);
}

// ---- Dispatcher -----------------------------------------------------------

export function encodeForTag(
  canvas: HTMLCanvasElement,
  colors: number,
  scan: ScanOrder = 'col-rtl',
): string {
  let bytes: Uint8Array;
  if (colors >= 3) {
    bytes = encode2bpp(canvas, scan);
  } else {
    bytes = encode1bpp(canvas, scan);
  }
  return uint8ArrayToBase64(bytes);
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
