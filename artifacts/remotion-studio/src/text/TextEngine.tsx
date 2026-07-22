import React from 'react';
import {useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import type {EasingFunction} from '../utils/easing';

export type TextAnimationType =
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeIn'
  | 'slideLeft'
  | 'slideRight'
  | 'scaleUp'
  | 'typewriter'
  | 'reveal';       // mask-wipe reveal

export interface TextEngineProps {
  text: string;
  animation?: TextAnimationType;
  startFrame?: number;
  /** Delay between characters (frames) */
  stagger?: number;
  /** Duration of each character animation */
  charDuration?: number;
  easing?: EasingFunction;
  style?: React.CSSProperties;
  /** Animate word-by-word instead of character-by-character */
  wordMode?: boolean;
}

/**
 * TextEngine — the core text animation system.
 * Splits text into tokens (chars or words) and applies staggered animations.
 */
export const TextEngine: React.FC<TextEngineProps> = ({
  text,
  animation = 'fadeUp',
  startFrame = 0,
  stagger = 2,
  charDuration = 15,
  easing,
  style = {},
  wordMode = false,
}) => {
  const frame = useCurrentFrame();
  const tokens = wordMode ? text.split(' ') : text.split('');

  if (animation === 'typewriter') {
    const totalChars = text.length;
    const revealedCount = interpolate(
      frame,
      [startFrame, startFrame + totalChars * stagger],
      [0, totalChars],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
    );
    return (
      <span style={style}>
        {text.slice(0, Math.floor(revealedCount))}
        {Math.floor(revealedCount) < totalChars && (
          <span style={{opacity: frame % 30 < 15 ? 1 : 0}}>|</span>
        )}
      </span>
    );
  }

  if (animation === 'reveal') {
    const progress = interpolate(
      frame,
      [startFrame, startFrame + charDuration],
      [0, 1],
      {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing},
    );
    return (
      <span
        style={{
          ...style,
          position: 'relative',
          overflow: 'hidden',
          display: 'inline-block',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            transform: `translateX(${(1 - progress) * -101}%)`,
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </span>
      </span>
    );
  }

  return (
    <span style={{...style, display: 'inline-block'}}>
      {tokens.map((token, i) => {
        const tokenStart = startFrame + i * stagger;
        const p = interpolate(frame, [tokenStart, tokenStart + charDuration], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing,
        });

        let transform = '';
        let opacity = p;

        switch (animation) {
          case 'fadeUp':
            transform = `translateY(${(1 - p) * 20}px)`;
            break;
          case 'fadeDown':
            transform = `translateY(${(p - 1) * 20}px)`;
            break;
          case 'slideLeft':
            transform = `translateX(${(1 - p) * 30}px)`;
            opacity = p;
            break;
          case 'slideRight':
            transform = `translateX(${(p - 1) * 30}px)`;
            opacity = p;
            break;
          case 'scaleUp':
            transform = `scale(${0.5 + p * 0.5})`;
            opacity = p;
            break;
          default:
            transform = '';
        }

        const isSpace = !wordMode && token === ' ';

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: isSpace ? 1 : opacity,
              transform: isSpace ? '' : transform,
              whiteSpace: isSpace ? 'pre' : 'normal',
            }}
          >
            {wordMode && i < tokens.length - 1 ? token + ' ' : token}
          </span>
        );
      })}
    </span>
  );
};
