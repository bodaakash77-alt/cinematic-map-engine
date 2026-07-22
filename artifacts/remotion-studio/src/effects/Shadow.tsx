import React from 'react';

interface ShadowProps {
  children: React.ReactNode;
  /** X offset in pixels */
  x?: number;
  /** Y offset in pixels */
  y?: number;
  /** Blur radius */
  blur?: number;
  /** Shadow colour */
  color?: string;
  /** Shadow opacity (0–1) */
  opacity?: number;
  /** Spread radius (px) */
  spread?: number;
}

/**
 * Shadow — drop shadow wrapper using CSS filter drop-shadow.
 * Unlike box-shadow, this follows the alpha channel of the content.
 */
export const Shadow: React.FC<ShadowProps> = ({
  children,
  x = 4,
  y = 4,
  blur = 12,
  color = '#000000',
  opacity = 0.5,
  spread = 0,
}) => {
  const rgba = `${color}${Math.round(opacity * 255)
    .toString(16)
    .padStart(2, '0')}`;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        filter: `drop-shadow(${x}px ${y}px ${blur}px ${rgba})`,
      }}
    >
      {children}
    </div>
  );
};
