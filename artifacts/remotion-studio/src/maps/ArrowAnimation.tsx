import React from 'react';
import {useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';

interface ArrowAnimationProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  startFrame?: number;
  duration?: number;
  color?: string;
  strokeWidth?: number;
  headSize?: number;
  /** Animate opacity in */
  fadeIn?: number;
  /** Curve amount (0 = straight) */
  curve?: number;
  style?: 'solid' | 'dashed' | 'dotted';
}

/**
 * ArrowAnimation — draws an animated arrow between two points.
 * Supports curved arrows via a quadratic bezier control point.
 */
export const ArrowAnimation: React.FC<ArrowAnimationProps> = ({
  x1,
  y1,
  x2,
  y2,
  startFrame = 0,
  duration = 30,
  color = '#f0c040',
  strokeWidth = 3,
  headSize = 12,
  fadeIn = 10,
  curve = 0,
  style = 'solid',
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(frame, [startFrame, startFrame + fadeIn], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Control point for bezier curve
  const mx = (x1 + x2) / 2 - curve * (y2 - y1);
  const my = (y1 + y2) / 2 + curve * (x2 - x1);

  // Point at progress along quadratic bezier
  const t = progress;
  const hx = (1 - t) ** 2 * x1 + 2 * (1 - t) * t * mx + t ** 2 * x2;
  const hy = (1 - t) ** 2 * y1 + 2 * (1 - t) * t * my + t ** 2 * y2;

  // Tangent at t for arrowhead rotation
  const tx = 2 * (1 - t) * (mx - x1) + 2 * t * (x2 - mx);
  const ty = 2 * (1 - t) * (my - y1) + 2 * t * (y2 - my);
  const angle = (Math.atan2(ty, tx) * 180) / Math.PI;

  const dashProps =
    style === 'dashed'
      ? {strokeDasharray: '12 6'}
      : style === 'dotted'
      ? {strokeDasharray: '2 8', strokeLinecap: 'round' as const}
      : {};

  const pathD = curve !== 0
    ? `M${x1},${y1} Q${mx},${my} ${hx},${hy}`
    : `M${x1},${y1} L${hx},${hy}`;

  return (
    <g opacity={opacity}>
      <defs>
        <marker
          id={`arrow-head-${x1}-${y1}`}
          markerWidth={headSize}
          markerHeight={headSize}
          refX={headSize * 0.9}
          refY={headSize / 2}
          orient="auto"
        >
          <path
            d={`M0,0 L${headSize},${headSize / 2} L0,${headSize} L${headSize * 0.25},${headSize / 2} Z`}
            fill={color}
          />
        </marker>
      </defs>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        markerEnd={progress > 0.95 ? `url(#arrow-head-${x1}-${y1})` : undefined}
        {...dashProps}
      />
    </g>
  );
};
