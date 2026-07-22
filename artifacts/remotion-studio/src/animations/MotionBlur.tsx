import React, {useId} from 'react';
import {useVideoConfig} from 'remotion';

interface MotionBlurProps {
  children: React.ReactNode;
  /**
   * Shutter angle in degrees (0–360).
   * 180° = cinematic standard. Higher = more blur.
   */
  shutterAngle?: number;
  /** Directional blur: 'horizontal' | 'vertical' | 'both' */
  direction?: 'horizontal' | 'vertical' | 'both';
  /** Override blur strength (px). Derived from shutterAngle by default. */
  strength?: number;
}

/**
 * MotionBlur — wraps children with a directional Gaussian blur that
 * simulates film shutter motion blur.
 */
export const MotionBlur: React.FC<MotionBlurProps> = ({
  children,
  shutterAngle = 180,
  direction = 'horizontal',
  strength,
}) => {
  const {fps} = useVideoConfig();
  const id = useId().replace(/:/g, '');
  const derived = strength ?? (shutterAngle / 360) * (60 / fps) * 8;
  const stdX = direction !== 'vertical' ? derived : 0;
  const stdY = direction !== 'horizontal' ? derived : 0;

  return (
    <div style={{position: 'relative', width: '100%', height: '100%'}}>
      <svg style={{position: 'absolute', width: 0, height: 0}} aria-hidden>
        <defs>
          <filter id={`mb-${id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={`${stdX} ${stdY}`} />
          </filter>
        </defs>
      </svg>
      <div
        style={{
          width: '100%',
          height: '100%',
          filter: `url(#mb-${id})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
