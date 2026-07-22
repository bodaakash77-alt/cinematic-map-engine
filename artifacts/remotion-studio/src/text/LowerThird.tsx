import React from 'react';
import {useCurrentFrame} from 'remotion';
import {interpolate} from 'remotion';
import type {EasingFunction} from '../utils/easing';
import {easeOutCubic, easeInCubic} from '../utils/easing';

interface LowerThirdProps {
  /** Primary name / title */
  name: string;
  /** Secondary descriptor (role, location, date…) */
  descriptor?: string;
  startFrame?: number;
  /** Duration before the lower-third exits (auto-exit) */
  exitFrame?: number;
  exitDuration?: number;
  inDuration?: number;
  easing?: EasingFunction;
  /** Accent bar colour */
  accentColor?: string;
  /** Background colour */
  backgroundColor?: string;
  nameColor?: string;
  descriptorColor?: string;
  /** Position from bottom (px) */
  bottom?: number;
  /** Position from left (px) */
  left?: number;
  /** Style variant */
  variant?: 'classic' | 'modern' | 'minimal';
}

/**
 * LowerThird — professional broadcast-style lower third.
 * Supports classic bar, modern split-block, and minimal line variants.
 */
export const LowerThird: React.FC<LowerThirdProps> = ({
  name,
  descriptor,
  startFrame = 0,
  exitFrame,
  exitDuration = 20,
  inDuration = 25,
  easing = easeOutCubic,
  accentColor = '#c9a84c',
  backgroundColor = 'rgba(10,10,10,0.88)',
  nameColor = '#ffffff',
  descriptorColor = '#cccccc',
  bottom = 140,
  left = 80,
  variant = 'classic',
}) => {
  const frame = useCurrentFrame();

  const slideIn = interpolate(frame, [startFrame, startFrame + inDuration], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });
  const opacity = interpolate(frame, [startFrame, startFrame + inDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const exitOpacity =
    exitFrame !== undefined
      ? interpolate(frame, [exitFrame, exitFrame + exitDuration], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: easeInCubic,
        })
      : 1;
  const exitSlide =
    exitFrame !== undefined
      ? interpolate(frame, [exitFrame, exitFrame + exitDuration], [0, 60], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  const finalOpacity = opacity * exitOpacity;
  const finalSlide = slideIn + exitSlide;

  if (variant === 'minimal') {
    return (
      <div
        style={{
          position: 'absolute',
          bottom,
          left,
          opacity: finalOpacity,
          transform: `translateX(${finalSlide}px)`,
        }}
      >
        <div
          style={{
            width: 40,
            height: 3,
            backgroundColor: accentColor,
            marginBottom: 10,
          }}
        />
        <div style={{color: nameColor, fontSize: 28, fontWeight: 700, fontFamily: 'Helvetica Neue, Arial, sans-serif'}}>
          {name}
        </div>
        {descriptor && (
          <div style={{color: descriptorColor, fontSize: 16, marginTop: 4, fontFamily: 'Helvetica Neue, Arial, sans-serif', letterSpacing: '0.12em', textTransform: 'uppercase'}}>
            {descriptor}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'modern') {
    return (
      <div
        style={{
          position: 'absolute',
          bottom,
          left,
          display: 'flex',
          opacity: finalOpacity,
          transform: `translateX(${finalSlide}px)`,
        }}
      >
        <div style={{width: 6, backgroundColor: accentColor, marginRight: 16, borderRadius: 2}} />
        <div>
          <div style={{color: nameColor, fontSize: 32, fontWeight: 800, fontFamily: 'Helvetica Neue, Arial, sans-serif', lineHeight: 1}}>
            {name}
          </div>
          {descriptor && (
            <div style={{
              backgroundColor: accentColor,
              color: '#000',
              fontSize: 13,
              fontWeight: 700,
              padding: '3px 10px',
              marginTop: 8,
              display: 'inline-block',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontFamily: 'Helvetica Neue, Arial, sans-serif',
            }}>
              {descriptor}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Classic
  return (
    <div
      style={{
        position: 'absolute',
        bottom,
        left,
        opacity: finalOpacity,
        transform: `translateX(${finalSlide}px)`,
      }}
    >
      <div
        style={{
          backgroundColor,
          padding: '12px 20px 12px 16px',
          borderLeft: `5px solid ${accentColor}`,
        }}
      >
        <div style={{color: nameColor, fontSize: 28, fontWeight: 700, fontFamily: 'Helvetica Neue, Arial, sans-serif'}}>
          {name}
        </div>
        {descriptor && (
          <div style={{color: descriptorColor, fontSize: 16, marginTop: 4, fontFamily: 'Helvetica Neue, Arial, sans-serif'}}>
            {descriptor}
          </div>
        )}
      </div>
    </div>
  );
};
