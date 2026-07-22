import {useCurrentFrame} from 'remotion';
import {animateKeyframes, anim, fadeIn, fadeOut} from '../animations/keyframe';
import type {Keyframe} from '../animations/keyframe';
import type {EasingFunction} from '../utils/easing';

/**
 * useAnimation — convenience hook that binds useCurrentFrame() to the
 * core animation helpers, so call sites stay clean.
 */
export function useAnimation() {
  const frame = useCurrentFrame();

  return {
    frame,

    /** Interpolate across arbitrary keyframes */
    kf: (kfs: Keyframe[]) => animateKeyframes(frame, kfs),

    /** Single from→to tween */
    tween: (
      from: number,
      to: number,
      start: number,
      end: number,
      ease?: EasingFunction,
    ) => anim(frame, from, to, start, end, ease),

    /** Opacity fade in */
    fadeIn: (start: number, duration: number, ease?: EasingFunction) =>
      fadeIn(frame, start, duration, ease),

    /** Opacity fade out */
    fadeOut: (start: number, duration: number, ease?: EasingFunction) =>
      fadeOut(frame, start, duration, ease),

    /** Normalised [0,1] progress in a window */
    progress: (start: number, duration: number) => {
      if (frame <= start) return 0;
      if (frame >= start + duration) return 1;
      return (frame - start) / duration;
    },
  };
}
