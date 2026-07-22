import React from 'react';
import {Audio, useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import type {EasingFunction} from '../utils/easing';

export interface AudioLayerProps {
  /** Audio source URL or imported asset */
  src: string;
  /** Master volume (0–1) */
  volume?: number;
  /** Fade in over N frames */
  fadeIn?: number;
  /** Frame at which fade-out begins */
  fadeOutStart?: number;
  fadeOutDuration?: number;
  easing?: EasingFunction;
  /** Frame in source audio to start from */
  startFrom?: number;
  /** Playback speed */
  playbackRate?: number;
  /** Loop audio */
  loop?: boolean;
}

/**
 * AudioLayer — AE-style audio layer with fade in/out and volume envelope.
 * Renders no visible element; pure audio track.
 */
export const AudioLayer: React.FC<AudioLayerProps> = ({
  src,
  volume = 1,
  fadeIn = 0,
  fadeOutStart,
  fadeOutDuration = 30,
  easing,
  startFrom = 0,
  playbackRate = 1,
  loop = false,
}) => {
  const frame = useCurrentFrame();

  const fadeInVol =
    fadeIn > 0
      ? interpolate(frame, [0, fadeIn], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing,
        })
      : 1;

  const fadeOutVol =
    fadeOutStart !== undefined
      ? interpolate(frame, [fadeOutStart, fadeOutStart + fadeOutDuration], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  const finalVolume = volume * fadeInVol * fadeOutVol;

  return (
    <Audio
      src={src}
      volume={finalVolume}
      startFrom={startFrom}
      playbackRate={playbackRate}
      loop={loop}
    />
  );
};
