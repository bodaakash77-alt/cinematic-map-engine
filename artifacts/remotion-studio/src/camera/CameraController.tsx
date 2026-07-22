import React from 'react';
import {AbsoluteFill} from 'remotion';

export interface CameraTransform {
  /** Horizontal pan in pixels */
  x?: number;
  /** Vertical pan in pixels */
  y?: number;
  /** Scale / zoom factor (1 = 100%) */
  scale?: number;
  /** Rotation in degrees */
  rotation?: number;
  /** Perspective distance for 3-D layers (px) */
  perspective?: number;
  /** Transform-origin: default '50% 50%' */
  origin?: string;
}

interface CameraControllerProps extends CameraTransform {
  children: React.ReactNode;
}

/**
 * CameraController — the master camera layer.
 * Wraps children in a CSS-transform viewport so every child layer
 * moves together as if shot with a single camera.
 *
 * Usage:
 *   <CameraController x={panX} scale={zoom} rotation={rot}>
 *     {layers}
 *   </CameraController>
 */
export const CameraController: React.FC<CameraControllerProps> = ({
  x = 0,
  y = 0,
  scale = 1,
  rotation = 0,
  perspective = 800,
  origin = '50% 50%',
  children,
}) => {
  return (
    <AbsoluteFill style={{perspective}}>
      <AbsoluteFill
        style={{
          transformOrigin: origin,
          transform: [
            `translate(${x}px, ${y}px)`,
            `scale(${scale})`,
            `rotate(${rotation}deg)`,
          ].join(' '),
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
