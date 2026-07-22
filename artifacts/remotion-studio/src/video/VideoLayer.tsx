import React from 'react';
import {AbsoluteFill, OffthreadVideo, useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import type {EasingFunction} from '../utils/easing';

export interface VideoLayerProps {
  /** Video source URL or imported asset */
  src: string;
  /** Frame in the source video to start from */
  startFrom?: number;
  /** End frame in source video */
  endAt?: number;
  /** Playback volume (0–1) */
  volume?: number;
  /** Mute audio */
  muted?: boolean;
  opacity?: number;
  fadeIn?: number;
  fadeOutStart?: number;
  fadeOutDuration?: number;
  easing?: EasingFunction;
  /** object-fit */
  fit?: 'cover' | 'contain' | 'fill';
  /** Colour tint overlay */
  tint?: string;
  tintOpacity?: number;
  /** Playback speed multiplier */
  playbackRate?: number;
  /** Loop the video */
  loop?: boolean;
  style?: React.CSSProperties;
}

/**
 * VideoLayer — AE-style video layer with fade, tint, and playback controls.
 * Uses OffthreadVideo for frame-accurate rendering.
 */
export const VideoLayer: React.FC<VideoLayerProps> = ({
  src,
  startFrom = 0,
  endAt,
  volume = 1,
  muted = false,
  opacity = 1,
  fadeIn = 0,
  fadeOutStart,
  fadeOutDuration = 20,
  easing,
  fit = 'cover',
  tint,
  tintOpacity = 0.2,
  playbackRate = 1,
  loop = false,
  style,
}) => {
  const frame = useCurrentFrame();

  const fadeInOpacity =
    fadeIn > 0
      ? interpolate(frame, [0, fadeIn], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing})
      : 1;

  const fadeOutOpacity =
    fadeOutStart !== undefined
      ? interpolate(frame, [fadeOutStart, fadeOutStart + fadeOutDuration], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  const finalOpacity = opacity * fadeInOpacity * fadeOutOpacity;

  return (
    <AbsoluteFill style={{opacity: finalOpacity}}>
      <OffthreadVideo
        src={src}
        startFrom={startFrom}
        endAt={endAt}
        volume={muted ? 0 : volume}
        playbackRate={playbackRate}

        style={{
          width: '100%',
          height: '100%',
          objectFit: fit,
          ...style,
        }}
      />
      {tint && (
        <AbsoluteFill
          style={{backgroundColor: tint, opacity: tintOpacity, pointerEvents: 'none'}}
        />
      )}
    </AbsoluteFill>
  );
};
