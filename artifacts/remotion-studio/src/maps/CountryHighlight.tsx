import React from 'react';
import {useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';

interface CountryHighlightProps {
  /** SVG path 'd' attribute for the country shape */
  pathD: string;
  startFrame?: number;
  duration?: number;
  /** Fill colour of the highlighted country */
  fillColor?: string;
  /** Fill at rest (before highlight) */
  restColor?: string;
  /** Border colour */
  strokeColor?: string;
  strokeWidth?: number;
  /** Pulse / glow animation */
  pulse?: boolean;
  /** Pulse period in frames */
  pulsePeriod?: number;
  /** Optional label */
  label?: string;
  labelX?: number;
  labelY?: number;
  labelColor?: string;
  labelSize?: number;
}

/**
 * CountryHighlight — animates a country fill for documentary map sequences.
 * Pass a real SVG path for the country's border geometry.
 */
export const CountryHighlight: React.FC<CountryHighlightProps> = ({
  pathD,
  startFrame = 0,
  duration = 20,
  fillColor = '#c9a84c',
  restColor = 'transparent',
  strokeColor = '#f0d080',
  strokeWidth = 1.5,
  pulse = false,
  pulsePeriod = 60,
  label,
  labelX = 0,
  labelY = 0,
  labelColor = '#ffffff',
  labelSize = 14,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [startFrame, startFrame + duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const fillOpacity = progress * (pulse
    ? 0.5 + 0.5 * Math.sin(((frame - startFrame) / pulsePeriod) * Math.PI * 2)
    : 1);

  const strokeOpacity = progress;

  return (
    <g>
      {/* Rest fill */}
      <path d={pathD} fill={restColor} stroke="none" />

      {/* Animated highlight */}
      <path
        d={pathD}
        fill={fillColor}
        fillOpacity={fillOpacity * 0.6}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeOpacity={strokeOpacity}
      />

      {/* Outer glow ring */}
      {pulse && progress > 0.5 && (
        <path
          d={pathD}
          fill="none"
          stroke={fillColor}
          strokeWidth={strokeWidth * 3}
          strokeOpacity={
            0.3 * (0.5 + 0.5 * Math.sin(((frame - startFrame) / pulsePeriod) * Math.PI * 2))
          }
        />
      )}

      {/* Country label */}
      {label && progress > 0.8 && (
        <text
          x={labelX}
          y={labelY}
          fill={labelColor}
          fontSize={labelSize}
          fontFamily="Helvetica Neue, Arial, sans-serif"
          fontWeight="600"
          textAnchor="middle"
          opacity={interpolate(progress, [0.8, 1], [0, 1])}
          style={{letterSpacing: '0.05em'}}
        >
          {label.toUpperCase()}
        </text>
      )}
    </g>
  );
};
