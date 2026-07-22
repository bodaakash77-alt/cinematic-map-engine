import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {anim} from '../animations/keyframe';
import type {EasingFunction} from '../utils/easing';

interface RotationProps {
  children: React.ReactNode;
  from?: number;
  to?: number;
  startFrame?: number;
  endFrame?: number;
  easing?: EasingFunction;
  origin?: string;
}

/**
 * Rotation — rotates the child layer around a transform origin.
 */
export const Rotation: React.FC<RotationProps> = ({
  children,
  from = 0,
  to = 360,
  startFrame = 0,
  endFrame = 60,
  easing,
  origin = '50% 50%',
}) => {
  const frame = useCurrentFrame();
  const deg = anim(frame, from, to, startFrame, endFrame, easing);

  return (
    <AbsoluteFill
      style={{
        transformOrigin: origin,
        transform: `rotate(${deg}deg)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
