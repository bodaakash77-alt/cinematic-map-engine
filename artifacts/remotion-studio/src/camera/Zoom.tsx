import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {anim} from '../animations/keyframe';
import type {EasingFunction} from '../utils/easing';

interface ZoomProps {
  children: React.ReactNode;
  /** Scale at frame 0 */
  from?: number;
  /** Scale at endFrame */
  to?: number;
  /** Frame to start zooming */
  startFrame?: number;
  /** Frame to finish zooming */
  endFrame?: number;
  easing?: EasingFunction;
  /** Transform origin — default '50% 50%' */
  origin?: string;
}

/**
 * Zoom — animates scale from one value to another over time.
 */
export const Zoom: React.FC<ZoomProps> = ({
  children,
  from = 1,
  to = 1.2,
  startFrame = 0,
  endFrame = 30,
  easing,
  origin = '50% 50%',
}) => {
  const frame = useCurrentFrame();
  const scale = anim(frame, from, to, startFrame, endFrame, easing);

  return (
    <AbsoluteFill
      style={{
        transformOrigin: origin,
        transform: `scale(${scale})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
