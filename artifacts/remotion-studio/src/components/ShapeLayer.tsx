import React from 'react';
import {useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import type {EasingFunction} from '../utils/easing';

export type ShapeType =
  | 'rect'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'pentagon'
  | 'hexagon'
  | 'star'
  | 'line'
  | 'cross';

export interface ShapeLayerProps {
  shape: ShapeType;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  /** Radius (for circle / ellipse / polygon) */
  radius?: number;
  fill?: string;
  fillOpacity?: number;
  stroke?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  /** Rotation in degrees */
  rotation?: number;
  opacity?: number;
  /** Animate: draw stroke from 0 → 1 */
  drawProgress?: number;
  /** Animate fill fade-in */
  fillProgress?: number;
  /** Scale animation */
  scale?: number;
  /** Rounded corners (rect only) */
  rx?: number;
  /** Number of star points */
  starPoints?: number;
  /** Star inner radius ratio (0–1) */
  starInnerRatio?: number;
  /** Entry animation: fade in from startFrame over duration */
  startFrame?: number;
  duration?: number;
  easing?: EasingFunction;
  style?: React.CSSProperties;
}

// ─── Polygon path helpers ─────────────────────────────────────────────────────
function polygonPoints(sides: number, r: number, cx: number, cy: number): string {
  return Array.from({length: sides}, (_, i) => {
    const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(' ');
}

function starPath(points: number, outerR: number, innerR: number, cx: number, cy: number): string {
  let d = '';
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    d += `${i === 0 ? 'M' : 'L'}${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }
  return d + 'Z';
}

/**
 * ShapeLayer — an AE-style shape layer. Supports all common primitives
 * with stroke draw-on, fill fade, scale and rotation animation.
 */
export const ShapeLayer: React.FC<ShapeLayerProps> = ({
  shape,
  x = 0,
  y = 0,
  width = 100,
  height = 100,
  radius,
  fill = '#ffffff',
  fillOpacity = 1,
  stroke = 'none',
  strokeWidth = 2,
  strokeOpacity = 1,
  rotation = 0,
  opacity = 1,
  drawProgress = 1,
  fillProgress = 1,
  scale = 1,
  rx = 0,
  starPoints = 5,
  starInnerRatio = 0.4,
  startFrame,
  duration = 20,
  easing,
  style,
}) => {
  const frame = useCurrentFrame();

  // Entry animation
  const entryOpacity =
    startFrame !== undefined
      ? interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing,
        })
      : 1;

  const finalOpacity = opacity * entryOpacity;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const r = radius ?? Math.min(width, height) / 2;

  // Stroke dash trick for draw-on
  const approxPerimeter =
    shape === 'circle'
      ? 2 * Math.PI * r
      : shape === 'ellipse'
      ? Math.PI * (3 * (width / 2 + height / 2) - Math.sqrt((3 * width / 2 + height / 2) * (width / 2 + 3 * height / 2)))
      : 2 * (width + height);
  const dashTotal = approxPerimeter + 10;

  const strokeDasharray = drawProgress < 1 ? `${dashTotal}` : undefined;
  const strokeDashoffset = drawProgress < 1 ? `${dashTotal * (1 - drawProgress)}` : undefined;

  const sharedStroke = {
    stroke,
    strokeWidth,
    strokeOpacity,
    strokeDasharray,
    strokeDashoffset,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  const sharedFill = {fill, fillOpacity: fillOpacity * fillProgress};

  const transform = `translate(${cx}, ${cy}) rotate(${rotation}) scale(${scale}) translate(${-cx}, ${-cy})`;

  const renderShape = () => {
    switch (shape) {
      case 'rect':
        return <rect x={x} y={y} width={width} height={height} rx={rx} {...sharedFill} {...sharedStroke} />;
      case 'circle':
        return <circle cx={cx} cy={cy} r={r} {...sharedFill} {...sharedStroke} />;
      case 'ellipse':
        return <ellipse cx={cx} cy={cy} rx={width / 2} ry={height / 2} {...sharedFill} {...sharedStroke} />;
      case 'triangle':
        return (
          <polygon
            points={polygonPoints(3, r, cx, cy)}
            {...sharedFill}
            {...sharedStroke}
          />
        );
      case 'pentagon':
        return <polygon points={polygonPoints(5, r, cx, cy)} {...sharedFill} {...sharedStroke} />;
      case 'hexagon':
        return <polygon points={polygonPoints(6, r, cx, cy)} {...sharedFill} {...sharedStroke} />;
      case 'star':
        return (
          <path
            d={starPath(starPoints, r, r * starInnerRatio, cx, cy)}
            {...sharedFill}
            {...sharedStroke}
          />
        );
      case 'line':
        return (
          <line
            x1={x} y1={cy}
            x2={x + width} y2={cy}
            stroke={stroke}
            strokeWidth={strokeWidth}
            strokeOpacity={strokeOpacity}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
        );
      case 'cross': {
        const hw = strokeWidth * 2;
        return (
          <g>
            <rect x={cx - hw / 2} y={y} width={hw} height={height} {...sharedFill} {...sharedStroke} />
            <rect x={x} y={cy - hw / 2} width={width} height={hw} {...sharedFill} {...sharedStroke} />
          </g>
        );
      }
      default:
        return null;
    }
  };

  return (
    <svg
      style={{position: 'absolute', top: 0, left: 0, overflow: 'visible', opacity: finalOpacity, ...style}}
      width="100%"
      height="100%"
    >
      <g transform={transform}>{renderShape()}</g>
    </svg>
  );
};
