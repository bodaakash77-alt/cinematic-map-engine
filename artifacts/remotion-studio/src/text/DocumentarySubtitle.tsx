import React from 'react';
import {useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import {easeOutCubic} from '../utils/easing';

interface DocumentarySubtitleProps {
  /** Spoken / translation subtitle text */
  text: string;
  startFrame?: number;
  duration?: number;
  color?: string;
  outlineColor?: string;
  fontSize?: number;
  /** Vertical position: 'bottom' | 'top' | number (px from top) */
  position?: 'bottom' | 'top' | number;
  /** Box style: 'none' | 'semi' | 'solid' */
  background?: 'none' | 'semi' | 'solid';
  backgroundColor?: string;
  /** Italicise for foreign-language translations */
  italic?: boolean;
}

/**
 * DocumentarySubtitle — cinema-style subtitles with optional background panel.
 */
export const DocumentarySubtitle: React.FC<DocumentarySubtitleProps> = ({
  text,
  startFrame = 0,
  duration = 90,
  color = '#ffffff',
  outlineColor = 'rgba(0,0,0,0.9)',
  fontSize = 38,
  position = 'bottom',
  background = 'none',
  backgroundColor = 'rgba(0,0,0,0.65)',
  italic = false,
}) => {
  const frame = useCurrentFrame();

  const fadeDur = 8;
  const opacity = interpolate(
    frame,
    [
      startFrame,
      startFrame + fadeDur,
      startFrame + duration - fadeDur,
      startFrame + duration,
    ],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const posStyle: React.CSSProperties =
    position === 'bottom'
      ? {bottom: 80, left: 0, right: 0}
      : position === 'top'
      ? {top: 60, left: 0, right: 0}
      : {top: position, left: 0, right: 0};

  const textShadow = background === 'none'
    ? `0 0 4px ${outlineColor}, 0 0 8px ${outlineColor}, 1px 1px 2px ${outlineColor}, -1px -1px 2px ${outlineColor}`
    : 'none';

  return (
    <div
      style={{
        position: 'absolute',
        ...posStyle,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          backgroundColor:
            background !== 'none'
              ? backgroundColor
              : 'transparent',
          padding: background !== 'none' ? '6px 20px' : 0,
          borderRadius: background === 'solid' ? 4 : 0,
          maxWidth: '80%',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontSize,
            color,
            fontStyle: italic ? 'italic' : 'normal',
            fontWeight: 400,
            textShadow,
            lineHeight: 1.4,
          }}
        >
          {text}
        </span>
      </div>
    </div>
  );
};
