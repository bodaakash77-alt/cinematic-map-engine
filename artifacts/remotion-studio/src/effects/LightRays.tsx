import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {interpolate} from 'remotion';

interface LightRaysProps {
  /** Number of rays */
  count?: number;
  /** Base colour of rays */
  color?: string;
  /** Max ray opacity */
  intensity?: number;
  /** Animation speed multiplier */
  speed?: number;
  /** Origin X (0–1 relative to width) */
  originX?: number;
  /** Origin Y (0–1 relative to height) */
  originY?: number;
  /** Fade-in duration in frames */
  fadeIn?: number;
}

/**
 * LightRays — animated crepuscular rays radiating from a light source.
 */
export const LightRays: React.FC<LightRaysProps> = ({
  count = 12,
  color = '#fff8e0',
  intensity = 0.18,
  speed = 0.4,
  originX = 0.5,
  originY = 0.2,
  fadeIn = 30,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const opacity = interpolate(frame, [0, fadeIn], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const ox = originX * width;
  const oy = originY * height;
  const diag = Math.sqrt(width ** 2 + height ** 2) * 1.5;

  return (
    <svg
      width={width}
      height={height}
      style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}
    >
      {Array.from({length: count}).map((_, i) => {
        const baseAngle = (i / count) * 360;
        const wobble = Math.sin(frame * speed * 0.05 + i * 1.7) * 4;
        const angle = baseAngle + wobble;
        const rad = (angle * Math.PI) / 180;
        const ex = ox + Math.cos(rad) * diag;
        const ey = oy + Math.sin(rad) * diag;
        const spread = 30 + Math.sin(frame * speed * 0.03 + i * 2.3) * 12;
        const rayOpacity =
          (0.4 + 0.6 * Math.sin(frame * speed * 0.04 + i * 1.3)) * intensity;

        return (
          <line
            key={i}
            x1={ox}
            y1={oy}
            x2={ex}
            y2={ey}
            stroke={color}
            strokeWidth={spread}
            strokeOpacity={rayOpacity * opacity}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
