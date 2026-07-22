import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {anim} from '../animations/keyframe';
import type {EasingFunction} from '../utils/easing';

export interface ParallaxLayer {
  children: React.ReactNode;
  /** Depth factor: 0 = static, 1 = full motion, negative = counter-motion */
  depth?: number;
  zIndex?: number;
}

interface Parallax3DProps {
  layers: ParallaxLayer[];
  /** Camera pan in X */
  panX?: number;
  /** Camera pan in Y */
  panY?: number;
  /** Perspective distance */
  perspective?: number;
  startFrame?: number;
  endFrame?: number;
  easing?: EasingFunction;
}

/**
 * Parallax3D — renders multiple layers at different depths for
 * a convincing 3-D parallax effect, driven by animated camera panning.
 */
export const Parallax3D: React.FC<Parallax3DProps> = ({
  layers,
  panX = 0,
  panY = 0,
  perspective = 800,
  startFrame = 0,
  endFrame = 90,
  easing,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const px = anim(frame, 0, panX, startFrame, endFrame, easing);
  const py = anim(frame, 0, panY, startFrame, endFrame, easing);

  return (
    <AbsoluteFill style={{perspective, perspectiveOrigin: '50% 50%'}}>
      {layers.map((layer, i) => {
        const depth = layer.depth ?? (i / Math.max(layers.length - 1, 1));
        return (
          <AbsoluteFill
            key={i}
            style={{
              zIndex: layer.zIndex ?? i,
              transform: `translate3d(${px * depth}px, ${py * depth}px, ${depth * -100}px)`,
            }}
          >
            {layer.children}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
