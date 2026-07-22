import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {anim} from '../animations/keyframe';
import type {EasingFunction} from '../utils/easing';

interface PanProps {
  children: React.ReactNode;
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
  startFrame?: number;
  endFrame?: number;
  easing?: EasingFunction;
}

/**
 * Pan — translates the child layer horizontally and/or vertically.
 */
export const Pan: React.FC<PanProps> = ({
  children,
  fromX = 0,
  toX = 0,
  fromY = 0,
  toY = 0,
  startFrame = 0,
  endFrame = 60,
  easing,
}) => {
  const frame = useCurrentFrame();
  const x = anim(frame, fromX, toX, startFrame, endFrame, easing);
  const y = anim(frame, fromY, toY, startFrame, endFrame, easing);

  return (
    <AbsoluteFill style={{transform: `translate(${x}px, ${y}px)`}}>
      {children}
    </AbsoluteFill>
  );
};
