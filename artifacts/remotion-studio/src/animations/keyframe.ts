import {interpolate} from 'remotion';
import type {EasingFunction} from '../utils/easing';
import {linear} from '../utils/easing';

// ─── Core keyframe type ───────────────────────────────────────────────────────
export interface Keyframe {
  frame: number;
  value: number;
  easing?: EasingFunction; // easing INTO this keyframe from the previous one
}

/**
 * animateKeyframes — the heart of the animation system.
 * Supply an array of {frame, value, easing} pairs; get back the
 * interpolated value at the current frame.
 */
export function animateKeyframes(frame: number, kfs: Keyframe[]): number {
  if (kfs.length === 0) return 0;
  const sorted = [...kfs].sort((a, b) => a.frame - b.frame);
  if (frame <= sorted[0].frame) return sorted[0].value;
  if (frame >= sorted[sorted.length - 1].frame)
    return sorted[sorted.length - 1].value;

  for (let i = 0; i < sorted.length - 1; i++) {
    const curr = sorted[i];
    const next = sorted[i + 1];
    if (frame >= curr.frame && frame <= next.frame) {
      const t = (frame - curr.frame) / (next.frame - curr.frame);
      const eased = (next.easing ?? linear)(t);
      return curr.value + (next.value - curr.value) * eased;
    }
  }
  return sorted[sorted.length - 1].value;
}

/**
 * anim — shorthand for a single from→to tween with optional easing.
 */
export function anim(
  frame: number,
  from: number,
  to: number,
  startFrame: number,
  endFrame: number,
  easing?: EasingFunction,
): number {
  return interpolate(frame, [startFrame, endFrame], [from, to], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
}

// ─── Convenience helpers ──────────────────────────────────────────────────────
export const fadeIn = (
  frame: number,
  start: number,
  duration: number,
  ease?: EasingFunction,
) => anim(frame, 0, 1, start, start + duration, ease);

export const fadeOut = (
  frame: number,
  start: number,
  duration: number,
  ease?: EasingFunction,
) => anim(frame, 1, 0, start, start + duration, ease);

export const slideIn = (
  frame: number,
  start: number,
  duration: number,
  distance: number,
  ease?: EasingFunction,
) => anim(frame, distance, 0, start, start + duration, ease);

export const slideOut = (
  frame: number,
  start: number,
  duration: number,
  distance: number,
  ease?: EasingFunction,
) => anim(frame, 0, distance, start, start + duration, ease);

export const scaleAnim = (
  frame: number,
  start: number,
  duration: number,
  from: number,
  to: number,
  ease?: EasingFunction,
) => anim(frame, from, to, start, start + duration, ease);
