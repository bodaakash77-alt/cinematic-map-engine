import React from 'react';
import {AbsoluteFill} from 'remotion';

export interface ColorGradeProps {
  children?: React.ReactNode;
  /** Brightness multiplier (1 = normal) */
  brightness?: number;
  /** Contrast multiplier (1 = normal) */
  contrast?: number;
  /** Saturation multiplier (1 = normal, 0 = grayscale) */
  saturation?: number;
  /** Hue rotation in degrees */
  hue?: number;
  /** Sepia amount (0–1) */
  sepia?: number;
  /** Overall opacity */
  opacity?: number;
  /** Warm/cool tint overlay color (CSS color string) */
  tint?: string;
  /** Tint opacity (0–1) */
  tintOpacity?: number;
  /** Vignette strength (0–1) */
  vignette?: number;
  /** Cinematic letter-box bars ratio (0 = none, 0.1 = 10% bars) */
  letterbox?: number;
}

/**
 * ColorGrade — non-destructive colour grade layer.
 * Stacks CSS filters with an optional warm/cool tint overlay and vignette.
 */
export const ColorGrade: React.FC<ColorGradeProps> = ({
  children,
  brightness = 1,
  contrast = 1,
  saturation = 1,
  hue = 0,
  sepia = 0,
  opacity = 1,
  tint,
  tintOpacity = 0.15,
  vignette = 0,
  letterbox = 0,
}) => {
  const filter = [
    `brightness(${brightness})`,
    `contrast(${contrast})`,
    `saturate(${saturation})`,
    `hue-rotate(${hue}deg)`,
    sepia > 0 ? `sepia(${sepia})` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const vigRadius = `${50 - vignette * 30}%`;
  const vigGradient =
    vignette > 0
      ? `radial-gradient(ellipse ${vigRadius} ${vigRadius} at 50% 50%, transparent 40%, rgba(0,0,0,${vignette * 0.85}) 100%)`
      : undefined;

  return (
    <AbsoluteFill style={{filter, opacity}}>
      {children}

      {/* Tint overlay */}
      {tint && (
        <AbsoluteFill
          style={{backgroundColor: tint, opacity: tintOpacity, mixBlendMode: 'multiply'}}
        />
      )}

      {/* Vignette overlay */}
      {vignette > 0 && (
        <AbsoluteFill style={{background: vigGradient, pointerEvents: 'none'}} />
      )}

      {/* Letterbox bars */}
      {letterbox > 0 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: `${letterbox * 100}%`,
              background: '#000',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: `${letterbox * 100}%`,
              background: '#000',
            }}
          />
        </>
      )}
    </AbsoluteFill>
  );
};
