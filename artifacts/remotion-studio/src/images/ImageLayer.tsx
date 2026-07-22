import React from 'react';
import {Img, AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {interpolate} from 'remotion';
import type {EasingFunction} from '../utils/easing';

export interface KenBurnsConfig {
  /** Starting scale (e.g. 1.0) */
  fromScale?: number;
  /** Ending scale (e.g. 1.12) */
  toScale?: number;
  /** Starting X position shift (px) */
  fromX?: number;
  toX?: number;
  fromY?: number;
  toY?: number;
}

export interface ImageLayerProps {
  /** URL or imported asset path */
  src: string;
  /** object-fit value */
  fit?: 'cover' | 'contain' | 'fill';
  opacity?: number;
  /** Fade in over N frames */
  fadeIn?: number;
  /** Fade out starting at frame */
  fadeOutStart?: number;
  fadeOutDuration?: number;
  /** Ken Burns (slow zoom/pan) configuration */
  kenBurns?: KenBurnsConfig;
  easing?: EasingFunction;
  /** Horizontal flip */
  flipX?: boolean;
  /** Vertical flip */
  flipY?: boolean;
  /** Overlay colour tint */
  tint?: string;
  tintOpacity?: number;
  style?: React.CSSProperties;
  /** Alt text */
  alt?: string;
}

/**
 * ImageLayer — a documentary-grade image layer.
 * Supports Ken Burns effect, fade in/out, tint overlay, and flip.
 */
export const ImageLayer: React.FC<ImageLayerProps> = ({
  src,
  fit = 'cover',
  opacity = 1,
  fadeIn = 0,
  fadeOutStart,
  fadeOutDuration = 20,
  kenBurns,
  easing,
  flipX = false,
  flipY = false,
  tint,
  tintOpacity = 0.2,
  style,
  alt = '',
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  // Fade in
  const fadeInOpacity =
    fadeIn > 0
      ? interpolate(frame, [0, fadeIn], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing,
        })
      : 1;

  // Fade out
  const fadeOutOpacity =
    fadeOutStart !== undefined
      ? interpolate(frame, [fadeOutStart, fadeOutStart + fadeOutDuration], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 1;

  const finalOpacity = opacity * fadeInOpacity * fadeOutOpacity;

  // Ken Burns
  const kb = kenBurns;
  const totalFrames = durationInFrames;
  const kbScale = kb
    ? interpolate(frame, [0, totalFrames], [kb.fromScale ?? 1, kb.toScale ?? 1.08], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing,
      })
    : 1;
  const kbX = kb
    ? interpolate(frame, [0, totalFrames], [kb.fromX ?? 0, kb.toX ?? 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing,
      })
    : 0;
  const kbY = kb
    ? interpolate(frame, [0, totalFrames], [kb.fromY ?? 0, kb.toY ?? 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing,
      })
    : 0;

  const flipTransform = [flipX ? 'scaleX(-1)' : '', flipY ? 'scaleY(-1)' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <AbsoluteFill style={{opacity: finalOpacity}}>
      <AbsoluteFill
        style={{
          transform: `translate(${kbX}px, ${kbY}px) scale(${kbScale}) ${flipTransform}`.trim(),
          transformOrigin: '50% 50%',
        }}
      >
        <Img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: fit,
            display: 'block',
            ...style,
          }}
        />
      </AbsoluteFill>

      {/* Colour tint overlay */}
      {tint && (
        <AbsoluteFill
          style={{backgroundColor: tint, opacity: tintOpacity, pointerEvents: 'none'}}
        />
      )}
    </AbsoluteFill>
  );
};
