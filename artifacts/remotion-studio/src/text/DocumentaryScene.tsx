import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {interpolate} from 'remotion';
import {easeOutCubic} from '../utils/easing';

interface DocumentarySceneTemplateProps {
  /** Scene number or act label */
  sceneLabel?: string;
  /** Location text */
  location?: string;
  /** Year or time period */
  year?: string;
  startFrame?: number;
  accentColor?: string;
  textColor?: string;
  /** Position: 'top-left' | 'bottom-left' | 'center' */
  position?: 'top-left' | 'bottom-left' | 'center';
}

/**
 * DocumentaryScene — scene context card (location, year, act label).
 * Used at the start of a new scene or chapter.
 */
export const DocumentarySceneCard: React.FC<DocumentarySceneTemplateProps> = ({
  sceneLabel,
  location,
  year,
  startFrame = 0,
  accentColor = '#c9a84c',
  textColor = '#ffffff',
  position = 'bottom-left',
}) => {
  const frame = useCurrentFrame();

  const slideX = interpolate(frame, [startFrame, startFrame + 25], [-80, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });
  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const posStyle: React.CSSProperties =
    position === 'top-left'
      ? {top: 80, left: 80}
      : position === 'center'
      ? {top: '50%', left: '50%', transform: `translate(-50%, -50%) translateX(${slideX}px)` }
      : {bottom: 80, left: 80};

  const transform = position !== 'center' ? `translateX(${slideX}px)` : undefined;

  return (
    <div
      style={{
        position: 'absolute',
        ...posStyle,
        opacity,
        transform,
        pointerEvents: 'none',
      }}
    >
      {sceneLabel && (
        <div
          style={{
            color: accentColor,
            fontSize: 12,
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 6,
            fontWeight: 500,
          }}
        >
          {sceneLabel}
        </div>
      )}
      {location && (
        <div
          style={{
            color: textColor,
            fontSize: 36,
            fontFamily: 'Georgia, Times New Roman, serif',
            fontWeight: 700,
            lineHeight: 1.1,
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
          }}
        >
          {location}
        </div>
      )}
      {year && (
        <div
          style={{
            color: accentColor,
            fontSize: 16,
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontWeight: 400,
            marginTop: 6,
            letterSpacing: '0.1em',
          }}
        >
          {year}
        </div>
      )}
    </div>
  );
};
