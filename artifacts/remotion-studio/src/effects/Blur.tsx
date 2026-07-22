import React, {useId} from 'react';

interface BlurProps {
  children: React.ReactNode;
  /** Blur radius in pixels */
  radius?: number;
  /** Optional: animate from/to radius using progress (0-1) */
  progress?: number;
  fromRadius?: number;
  toRadius?: number;
}

/**
 * Blur — applies Gaussian blur to children.
 * Supports static and animated blur radius.
 */
export const Blur: React.FC<BlurProps> = ({
  children,
  radius,
  progress,
  fromRadius = 0,
  toRadius = 20,
}) => {
  const id = useId().replace(/:/g, '');
  const r =
    radius !== undefined
      ? radius
      : fromRadius + (toRadius - fromRadius) * (progress ?? 0);

  return (
    <div style={{position: 'relative', width: '100%', height: '100%'}}>
      <svg style={{position: 'absolute', width: 0, height: 0}} aria-hidden>
        <defs>
          <filter id={`blur-${id}`}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={r} />
          </filter>
        </defs>
      </svg>
      <div style={{width: '100%', height: '100%', filter: `url(#blur-${id})`}}>
        {children}
      </div>
    </div>
  );
};
