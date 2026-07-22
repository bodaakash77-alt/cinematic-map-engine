import React, {useId} from 'react';
import {AbsoluteFill} from 'remotion';

interface GlowProps {
  children: React.ReactNode;
  /** Glow radius in pixels */
  radius?: number;
  /** Glow colour */
  color?: string;
  /** Glow intensity / opacity (0–1) */
  intensity?: number;
  /** Number of blur passes for a softer look */
  passes?: number;
}

/**
 * Glow — wraps children with an SVG feGaussianBlur composite glow.
 */
export const Glow: React.FC<GlowProps> = ({
  children,
  radius = 20,
  color = '#ffffff',
  intensity = 0.8,
  passes = 1,
}) => {
  const id = useId().replace(/:/g, '');

  return (
    <div style={{position: 'relative', width: '100%', height: '100%'}}>
      <svg style={{position: 'absolute', width: 0, height: 0}} aria-hidden>
        <defs>
          <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={radius} result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${intensity} 0`}
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div
        style={{
          width: '100%',
          height: '100%',
          filter: `url(#glow-${id})`,
        }}
      >
        {children}
      </div>
    </div>
  );
};
