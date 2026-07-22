import React, {useRef} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {interpolate} from 'remotion';

export interface PathPoint {
  x: number;
  y: number;
}

interface PathAnimationProps {
  /** Array of {x, y} waypoints in SVG coordinates */
  points: PathPoint[];
  startFrame?: number;
  duration?: number;
  strokeColor?: string;
  strokeWidth?: number;
  /** Dashed line: dash length */
  dashLength?: number;
  /** Trail colour (fading portion behind the head) */
  trailColor?: string;
  /** Show animated head dot */
  showHead?: boolean;
  headRadius?: number;
  headColor?: string;
  /** Draw as bezier curve (smooth) instead of polyline */
  smooth?: boolean;
}

function pointsToD(points: PathPoint[], smooth: boolean): string {
  if (points.length === 0) return '';
  if (!smooth) {
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  }
  // Catmull-Rom to bezier
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }
  return d;
}

/**
 * PathAnimation — draws an animated SVG path that reveals itself over time,
 * like the classic documentary route animation.
 */
export const PathAnimation: React.FC<PathAnimationProps> = ({
  points,
  startFrame = 0,
  duration = 90,
  strokeColor = '#f0c040',
  strokeWidth = 3,
  dashLength,
  trailColor,
  showHead = true,
  headRadius = 8,
  headColor,
  smooth = true,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Interpolate along the polyline
  const totalLen = points.reduce((acc, p, i) => {
    if (i === 0) return 0;
    const prev = points[i - 1];
    return acc + Math.sqrt((p.x - prev.x) ** 2 + (p.y - prev.y) ** 2);
  }, 0);

  const targetLen = totalLen * progress;
  let accumulated = 0;
  let headX = points[0]?.x ?? 0;
  let headY = points[0]?.y ?? 0;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const seg = Math.sqrt((curr.x - prev.x) ** 2 + (curr.y - prev.y) ** 2);
    if (accumulated + seg >= targetLen) {
      const t = (targetLen - accumulated) / seg;
      headX = prev.x + (curr.x - prev.x) * t;
      headY = prev.y + (curr.y - prev.y) * t;
      break;
    }
    accumulated += seg;
    headX = curr.x;
    headY = curr.y;
  }

  const pathD = pointsToD(points, smooth);
  const hc = headColor ?? strokeColor;

  return (
    <g>
      {/* Reference path for stroke-dasharray trick */}
      <defs>
        <path id="anim-path" d={pathD} />
      </defs>

      {/* Full path (dim trail) */}
      {trailColor && (
        <use
          href="#anim-path"
          fill="none"
          stroke={trailColor}
          strokeWidth={strokeWidth * 0.5}
          strokeOpacity={0.3}
          strokeDasharray={dashLength ? `${dashLength} ${dashLength}` : undefined}
        />
      )}

      {/* Animated path drawn up to progress */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={totalLen}
        strokeDashoffset={totalLen * (1 - progress)}
      />

      {/* Animated head */}
      {showHead && progress > 0 && (
        <>
          <circle
            cx={headX} cy={headY} r={headRadius * 1.8}
            fill={hc}
            fillOpacity={0.2}
          />
          <circle
            cx={headX} cy={headY} r={headRadius}
            fill={hc}
          />
          <circle
            cx={headX} cy={headY} r={headRadius * 0.45}
            fill="#fff"
          />
        </>
      )}
    </g>
  );
};
