import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {anim} from '../animations/keyframe';
import type {EasingFunction} from '../utils/easing';

interface FadeProps {
  children: React.ReactNode;
  /** Frame at which opacity reaches 1 (fade in) */
  inDuration?: number;
  /** Frame at which fade-out begins */
  outStart?: number;
  /** Duration of fade-out */
  outDuration?: number;
  easing?: EasingFunction;
}

/**
 * Fade — fade in and/or fade out wrapper.
 */
export const Fade: React.FC<FadeProps> = ({
  children,
  inDuration = 0,
  outStart,
  outDuration = 15,
  easing,
}) => {
  const frame = useCurrentFrame();

  let opacity = 1;
  if (inDuration > 0) {
    opacity = Math.min(opacity, anim(frame, 0, 1, 0, inDuration, easing));
  }
  if (outStart !== undefined) {
    opacity = Math.min(
      opacity,
      anim(frame, 1, 0, outStart, outStart + outDuration, easing),
    );
  }

  return (
    <AbsoluteFill style={{opacity}}>
      {children}
    </AbsoluteFill>
  );
};
