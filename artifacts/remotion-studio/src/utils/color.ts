export interface RGB { r: number; g: number; b: number }
export interface RGBA extends RGB { a: number }
export interface HSL { h: number; s: number; l: number }

export function hexToRgb(hex: string): RGB {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.slice(0, 2), 16),
    g: parseInt(c.slice(2, 4), 16),
    b: parseInt(c.slice(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
}

export function rgbToCss({r, g, b}: RGB): string {
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

export function rgbaToCss({r, g, b, a}: RGBA): string {
  return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
}

export function lerpColor(hex1: string, hex2: string, t: number): string {
  const a = hexToRgb(hex1);
  const b = hexToRgb(hex2);
  return rgbToHex(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t,
  );
}

export function hexWithAlpha(hex: string, alpha: number): string {
  const {r, g, b} = hexToRgb(hex);
  return rgbaToCss({r, g, b, a: alpha});
}

export function luminance({r, g, b}: RGB): number {
  const lin = (c: number) => {
    const n = c / 255;
    return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Documentary colour palette */
export const PALETTE = {
  black:     '#080808',
  charcoal:  '#1a1a1a',
  gold:      '#c9a84c',
  amber:     '#e8a030',
  white:     '#f5f5f0',
  warmWhite: '#f0ebe0',
  red:       '#cc2222',
  blue:      '#1a3a6b',
  teal:      '#1a6b5a',
  cream:     '#ede8d8',
} as const;
