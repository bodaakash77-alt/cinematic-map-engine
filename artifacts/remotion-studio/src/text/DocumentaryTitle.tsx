import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {interpolate} from 'remotion';
import {TextEngine} from './TextEngine';
import {easeOutCubic, easeInCubic, CINEMATIC} from '../utils/easing';

interface DocumentaryTitleProps {
  /** Main title text */
  title: string;
  /** Optional episode / chapter label above the title */
  label?: string;
  /** Optional sub-line below the title */
  tagline?: string;
  startFrame?: number;
  holdDuration?: number;
  outDuration?: number;
  accentColor?: string;
  titleColor?: string;
  labelColor?: string;
  taglineColor?: string;
  /** Background: 'dark' | 'transparent' */
  background?: 'dark' | 'transparent';
}

/**
 * DocumentaryTitle — a full-screen cinematic title card.
 * Typically used as the cold-open or act-break title.
 */
export const DocumentaryTitle: React.FC<DocumentaryTitleProps> = ({
  title,
  label,
  tagline,
  startFrame = 0,
  holdDuration = 60,
  outDuration = 30,
  accentColor = '#c9a84c',
  titleColor = '#f5f5f0',
  labelColor = '#c9a84c',
  taglineColor = '#aaaaaa',
  background = 'dark',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const inDur = 30;
  const outStart = durationInFrames - outDuration;

  const masterOpacity = interpolate(
    frame,
    [startFrame, startFrame + inDur, outStart, outStart + outDuration],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );

  const lineWidth = interpolate(frame, [startFrame + 10, startFrame + 40], [0, 200], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: background === 'dark' ? 'rgba(8,8,8,0.92)' : 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 24,
        opacity: masterOpacity,
      }}
    >
      {/* Episode label */}
      {label && (
        <div
          style={{
            color: labelColor,
            fontSize: 13,
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            fontWeight: 500,
          }}
        >
          <TextEngine
            text={label.toUpperCase()}
            animation="fadeIn"
            startFrame={startFrame + 5}
            stagger={2}
            charDuration={12}
          />
        </div>
      )}

      {/* Accent line */}
      <div
        style={{
          width: lineWidth,
          height: 1,
          backgroundColor: accentColor,
          opacity: 0.8,
        }}
      />

      {/* Main title */}
      <div
        style={{
          color: titleColor,
          fontSize: 82,
          fontFamily: 'Georgia, Times New Roman, serif',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          textAlign: 'center',
          lineHeight: 1.1,
          maxWidth: 1400,
        }}
      >
        <TextEngine
          text={title}
          animation="fadeUp"
          startFrame={startFrame + 12}
          stagger={3}
          charDuration={20}
          wordMode
          easing={CINEMATIC}
        />
      </div>

      {/* Accent line (bottom) */}
      <div
        style={{
          width: lineWidth * 0.5,
          height: 1,
          backgroundColor: accentColor,
          opacity: 0.5,
        }}
      />

      {/* Tagline */}
      {tagline && (
        <div
          style={{
            color: taglineColor,
            fontSize: 18,
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            fontWeight: 400,
            marginTop: 8,
          }}
        >
          <TextEngine
            text={tagline}
            animation="fadeIn"
            startFrame={startFrame + 30}
            stagger={2}
            charDuration={15}
          />
        </div>
      )}
    </AbsoluteFill>
  );
};
