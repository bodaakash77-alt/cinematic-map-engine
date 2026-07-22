import React from 'react';
import {useCurrentFrame, useVideoConfig, interpolate} from 'remotion';

interface FlareElement {
  dist: number;   // distance along axis from origin (0 = origin, 1 = far end)
  size: number;   // radius as fraction of min(width, height)
  opacity: number;
  color: string;
  type: 'circle' | 'ring' | 'streak';
}

interface LensFlareProps {
  /** Source position X (0–1) */
  x?: number;
  /** Source position Y (0–1) */
  y?: number;
  /** Overall brightness */
  intensity?: number;
  /** Base colour */
  color?: string;
  /** Fade-in / fade-out frames */
  fadeIn?: number;
  fadeOut?: number;
}

const DEFAULT_ELEMENTS: FlareElement[] = [
  {dist: 0,    size: 0.18, opacity: 0.9,  color: '#fffbe0', type: 'circle'},
  {dist: 0.05, size: 0.5,  opacity: 0.15, color: '#fff0a0', type: 'streak'},
  {dist: 0.3,  size: 0.06, opacity: 0.6,  color: '#a0d0ff', type: 'circle'},
  {dist: 0.45, size: 0.10, opacity: 0.4,  color: '#ffb060', type: 'ring'},
  {dist: 0.6,  size: 0.04, opacity: 0.7,  color: '#80c0ff', type: 'circle'},
  {dist: 0.75, size: 0.08, opacity: 0.35, color: '#ffd080', type: 'ring'},
  {dist: 0.9,  size: 0.03, opacity: 0.8,  color: '#ffffff', type: 'circle'},
  {dist: 1.0,  size: 0.05, opacity: 0.5,  color: '#c0e0ff', type: 'circle'},
];

/**
 * LensFlare — multi-element lens flare along the light-source → centre axis.
 */
export const LensFlare: React.FC<LensFlareProps> = ({
  x = 0.2,
  y = 0.15,
  intensity = 1,
  fadeIn = 15,
  fadeOut = 0,
}) => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();

  const srcX = x * width;
  const srcY = y * height;
  const ctrX = width / 2;
  const ctrY = height / 2;
  const axisX = ctrX - srcX;
  const axisY = ctrY - srcY;
  const minDim = Math.min(width, height);

  const fadeInOpacity = interpolate(frame, [0, fadeIn], [0, 1], {extrapolateRight: 'clamp'});
  const fadeOutOpacity =
    fadeOut > 0
      ? interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
      : 1;
  const masterOpacity = fadeInOpacity * fadeOutOpacity * intensity;

  const flicker = 1 + Math.sin(frame * 0.18) * 0.03;

  return (
    <svg
      width={width}
      height={height}
      style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}
    >
      {DEFAULT_ELEMENTS.map((el, i) => {
        const ex = srcX + axisX * el.dist;
        const ey = srcY + axisY * el.dist;
        const r = el.size * minDim * 0.5;
        const op = el.opacity * masterOpacity * flicker;

        if (el.type === 'streak') {
          const len = r * 6;
          const angle = Math.atan2(axisY, axisX);
          const dx = Math.cos(angle) * len;
          const dy = Math.sin(angle) * len;
          return (
            <line
              key={i}
              x1={ex - dx} y1={ey - dy}
              x2={ex + dx} y2={ey + dy}
              stroke={el.color}
              strokeWidth={r * 0.3}
              strokeOpacity={op}
              strokeLinecap="round"
            />
          );
        }
        if (el.type === 'ring') {
          return (
            <circle
              key={i}
              cx={ex} cy={ey} r={r}
              fill="none"
              stroke={el.color}
              strokeWidth={r * 0.15}
              strokeOpacity={op}
            />
          );
        }
        return (
          <circle
            key={i}
            cx={ex} cy={ey} r={r}
            fill={el.color}
            fillOpacity={op}
          />
        );
      })}
    </svg>
  );
};
