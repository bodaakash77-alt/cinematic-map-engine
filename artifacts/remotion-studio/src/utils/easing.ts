/**
 * Easing functions for smooth animations.
 * All functions accept t ∈ [0, 1] and return a value ∈ [0, 1].
 */
export type EasingFunction = (t: number) => number;

// ─── Linear ───────────────────────────────────────────────────────────────────
export const linear: EasingFunction = (t) => t;

// ─── Quadratic ────────────────────────────────────────────────────────────────
export const easeInQuad: EasingFunction = (t) => t * t;
export const easeOutQuad: EasingFunction = (t) => 1 - (1 - t) ** 2;
export const easeInOutQuad: EasingFunction = (t) =>
  t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;

// ─── Cubic ────────────────────────────────────────────────────────────────────
export const easeInCubic: EasingFunction = (t) => t ** 3;
export const easeOutCubic: EasingFunction = (t) => 1 - (1 - t) ** 3;
export const easeInOutCubic: EasingFunction = (t) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

// ─── Quartic ──────────────────────────────────────────────────────────────────
export const easeInQuart: EasingFunction = (t) => t ** 4;
export const easeOutQuart: EasingFunction = (t) => 1 - (1 - t) ** 4;
export const easeInOutQuart: EasingFunction = (t) =>
  t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2;

// ─── Exponential ──────────────────────────────────────────────────────────────
export const easeInExpo: EasingFunction = (t) =>
  t === 0 ? 0 : 2 ** (10 * t - 10);
export const easeOutExpo: EasingFunction = (t) =>
  t === 1 ? 1 : 1 - 2 ** (-10 * t);
export const easeInOutExpo: EasingFunction = (t) => {
  if (t === 0) return 0;
  if (t === 1) return 1;
  return t < 0.5 ? 2 ** (20 * t - 10) / 2 : (2 - 2 ** (-20 * t + 10)) / 2;
};

// ─── Elastic ──────────────────────────────────────────────────────────────────
export const easeOutElastic: EasingFunction = (t) => {
  const c4 = (2 * Math.PI) / 3;
  if (t === 0) return 0;
  if (t === 1) return 1;
  return 2 ** (-10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
};
export const easeInElastic: EasingFunction = (t) => {
  const c4 = (2 * Math.PI) / 3;
  if (t === 0) return 0;
  if (t === 1) return 1;
  return -(2 ** (10 * t - 10)) * Math.sin((t * 10 - 10.75) * c4);
};

// ─── Back ─────────────────────────────────────────────────────────────────────
export const easeOutBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};
export const easeInBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return c3 * t ** 3 - c1 * t ** 2;
};
export const easeInOutBack: EasingFunction = (t) => {
  const c1 = 1.70158;
  const c2 = c1 * 1.525;
  return t < 0.5
    ? ((2 * t) ** 2 * ((c2 + 1) * 2 * t - c2)) / 2
    : ((2 * t - 2) ** 2 * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
};

// ─── Bounce ───────────────────────────────────────────────────────────────────
export const easeOutBounce: EasingFunction = (t) => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (t < 1 / d1) return n1 * t * t;
  if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
  if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
  return n1 * (t -= 2.625 / d1) * t + 0.984375;
};
export const easeInBounce: EasingFunction = (t) => 1 - easeOutBounce(1 - t);

// ─── Smooth step ──────────────────────────────────────────────────────────────
export const smoothstep: EasingFunction = (t) => t * t * (3 - 2 * t);
export const smootherstep: EasingFunction = (t) =>
  t * t * t * (t * (t * 6 - 15) + 10);

// ─── Cubic Bezier (CSS-compatible) ────────────────────────────────────────────
export function cubicBezier(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): EasingFunction {
  return (t: number) => {
    let lo = 0;
    let hi = 1;
    for (let i = 0; i < 10; i++) {
      const mid = (lo + hi) / 2;
      const x =
        3 * (1 - mid) ** 2 * mid * x1 +
        3 * (1 - mid) * mid ** 2 * x2 +
        mid ** 3;
      if (x < t) lo = mid;
      else hi = mid;
    }
    const u = (lo + hi) / 2;
    return (
      3 * (1 - u) ** 2 * u * y1 + 3 * (1 - u) * u ** 2 * y2 + u ** 3
    );
  };
}

// ─── Named presets (mirror CSS / After Effects defaults) ─────────────────────
export const EASE = cubicBezier(0.25, 0.1, 0.25, 1.0);
export const EASE_IN = cubicBezier(0.42, 0, 1.0, 1.0);
export const EASE_OUT = cubicBezier(0, 0, 0.58, 1.0);
export const EASE_IN_OUT = cubicBezier(0.42, 0, 0.58, 1.0);
/** After Effects default "Easy Ease" */
export const AE_EASE = cubicBezier(0.33, 0.0, 0.67, 1.0);
/** Cinematic feel */
export const CINEMATIC = cubicBezier(0.76, 0, 0.24, 1);
