import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {anim} from '../animations/keyframe';
import type {EasingFunction} from '../utils/easing';

type WipeDirection = 'left' | 'right' | 'up' | 'down';

interface WipeProps {
  children: React.ReactNode;
  direction?: WipeDirection;
  startFrame?: number;
  duration?: number;
  easing?: EasingFunction;
  /** Soft edge feather (px) */
  feather?: number;
}

/**
 * Wipe — reveals children with a directional linear wipe.
 */
export const Wipe: React.FC<WipeProps> = ({
  children,
  direction = 'left',
  startFrame = 0,
  duration = 30,
  easing,
  feather = 20,
}) => {
  const frame = useCurrentFrame();
  const pct = anim(frame, 0, 100, startFrame, startFrame + duration, easing);
  const f = feather;

  const gradients: Record<WipeDirection, string> = {
    left:  `linear-gradient(to right,  transparent ${pct - f}%, black ${pct + f}%)`,
    right: `linear-gradient(to left,   transparent ${100 - pct - f}%, black ${100 - pct + f}%)`,
    up:    `linear-gradient(to bottom, transparent ${pct - f}%, black ${pct + f}%)`,
    down:  `linear-gradient(to top,    transparent ${100 - pct - f}%, black ${100 - pct + f}%)`,
  };

  return (
    <AbsoluteFill
      style={{
        WebkitMaskImage: gradients[direction],
        maskImage: gradients[direction],
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
