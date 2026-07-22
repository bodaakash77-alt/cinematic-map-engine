import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {anim} from '../animations/keyframe';
import type {EasingFunction} from '../utils/easing';

interface ZoomTransitionProps {
  children: React.ReactNode;
  /** 'in' = start large, shrink to normal. 'out' = start normal, grow to large */
  mode?: 'in' | 'out';
  startFrame?: number;
  duration?: number;
  /** Scale at the extremity of the transition */
  extremeScale?: number;
  easing?: EasingFunction;
  fadeDuration?: number;
}

/**
 * ZoomTransition — punch-in or punch-out zoom with simultaneous fade.
 */
export const ZoomTransition: React.FC<ZoomTransitionProps> = ({
  children,
  mode = 'in',
  startFrame = 0,
  duration = 30,
  extremeScale = 1.4,
  easing,
  fadeDuration,
}) => {
  const frame = useCurrentFrame();
  const fd = fadeDuration ?? duration;

  const scale =
    mode === 'in'
      ? anim(frame, extremeScale, 1, startFrame, startFrame + duration, easing)
      : anim(frame, 1, extremeScale, startFrame, startFrame + duration, easing);

  const opacity =
    mode === 'in'
      ? anim(frame, 0, 1, startFrame, startFrame + fd, easing)
      : anim(frame, 1, 0, startFrame, startFrame + fd, easing);

  return (
    <AbsoluteFill
      style={{
        opacity,
        transformOrigin: '50% 50%',
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
