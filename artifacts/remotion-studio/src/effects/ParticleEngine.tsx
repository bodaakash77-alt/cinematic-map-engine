import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {pseudoRandom} from '../utils/math';

export type ParticleShape = 'circle' | 'square' | 'triangle' | 'star' | 'line';

export interface ParticleConfig {
  /** Total number of particles */
  count?: number;
  /** Particle shape */
  shape?: ParticleShape;
  /** Base particle colour (or array of colours) */
  colors?: string[];
  /** Min / max size in px */
  minSize?: number;
  maxSize?: number;
  /** Min / max speed (px per frame) */
  minSpeed?: number;
  maxSpeed?: number;
  /** Gravity per frame */
  gravity?: number;
  /** Spawn area: 'full' | 'top' | 'bottom' | 'left' | 'right' | 'center' */
  spawnArea?: 'full' | 'top' | 'bottom' | 'left' | 'right' | 'center';
  /** Turbulence / wind (x per frame) */
  wind?: number;
  /** Particle life in frames (after which it resets) */
  lifespan?: number;
  /** Fade out over last N frames of life */
  fadeTail?: number;
  /** Starting opacity */
  opacity?: number;
  /** Rotation per frame (degrees) */
  spin?: number;
}

interface Particle {
  id: number;
  seed: number;
  initialX: number;
  initialY: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  lifeOffset: number;
  spin: number;
}

const star = (cx: number, cy: number, r: number): string => {
  let d = '';
  for (let i = 0; i < 5; i++) {
    const outer = ((i * 72 - 90) * Math.PI) / 180;
    const inner = (((i * 72 + 36) - 90) * Math.PI) / 180;
    d += `${i === 0 ? 'M' : 'L'}${cx + Math.cos(outer) * r},${cy + Math.sin(outer) * r}`;
    d += `L${cx + Math.cos(inner) * (r * 0.4)},${cy + Math.sin(inner) * (r * 0.4)}`;
  }
  return d + 'Z';
};

/**
 * ParticleEngine — a fully configurable SVG particle system.
 * All motion is deterministic: the same frame always produces the same output.
 */
export const ParticleEngine: React.FC<ParticleConfig> = ({
  count = 80,
  shape = 'circle',
  colors = ['#ffffff', '#ffe0a0', '#a0d0ff'],
  minSize = 2,
  maxSize = 8,
  minSpeed = 0.5,
  maxSpeed = 3,
  gravity = 0.02,
  spawnArea = 'full',
  wind = 0,
  lifespan = 120,
  fadeTail = 30,
  opacity = 0.8,
  spin: spinRate = 0,
}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const particles = useMemo<Particle[]>(() => {
    return Array.from({length: count}, (_, i) => {
      const seed = i * 137.508;
      const r1 = pseudoRandom(seed);
      const r2 = pseudoRandom(seed + 1);
      const r3 = pseudoRandom(seed + 2);
      const r4 = pseudoRandom(seed + 3);
      const r5 = pseudoRandom(seed + 4);
      const r6 = pseudoRandom(seed + 5);
      const r7 = pseudoRandom(seed + 6);

      let ix = r1 * width;
      let iy = r2 * height;
      if (spawnArea === 'top') iy = r2 * height * 0.2;
      else if (spawnArea === 'bottom') iy = height * 0.8 + r2 * height * 0.2;
      else if (spawnArea === 'left') ix = r1 * width * 0.2;
      else if (spawnArea === 'right') ix = width * 0.8 + r1 * width * 0.2;
      else if (spawnArea === 'center') {
        ix = width * 0.3 + r1 * width * 0.4;
        iy = height * 0.3 + r2 * height * 0.4;
      }

      return {
        id: i,
        seed,
        initialX: ix,
        initialY: iy,
        vx: (r3 - 0.5) * 2 * (maxSpeed - minSpeed) + (r3 - 0.5 > 0 ? minSpeed : -minSpeed),
        vy: -(r4 * (maxSpeed - minSpeed) + minSpeed),
        size: minSize + r5 * (maxSize - minSize),
        color: colors[Math.floor(r6 * colors.length)],
        lifeOffset: Math.floor(r7 * lifespan),
        spin: spinRate * (r3 > 0.5 ? 1 : -1),
      };
    });
  }, [count, colors, minSize, maxSize, minSpeed, maxSpeed, spawnArea, lifespan, spinRate]);

  return (
    <svg
      width={width}
      height={height}
      style={{position: 'absolute', top: 0, left: 0, pointerEvents: 'none'}}
    >
      {particles.map((p) => {
        const localF = ((frame + p.lifeOffset) % lifespan);
        const x = p.initialX + p.vx * localF + wind * localF;
        const y = p.initialY + p.vy * localF + 0.5 * gravity * localF ** 2;
        const rot = p.spin * localF;
        const tailProgress = localF / lifespan;
        const alpha =
          tailProgress > (lifespan - fadeTail) / lifespan
            ? ((1 - tailProgress) / (fadeTail / lifespan))
            : 1;

        const transform = `translate(${x},${y}) rotate(${rot})`;

        if (shape === 'circle') {
          return (
            <circle
              key={p.id}
              cx={0} cy={0}
              r={p.size / 2}
              fill={p.color}
              fillOpacity={opacity * alpha}
              transform={transform}
            />
          );
        }
        if (shape === 'square') {
          return (
            <rect
              key={p.id}
              x={-p.size / 2} y={-p.size / 2}
              width={p.size} height={p.size}
              fill={p.color}
              fillOpacity={opacity * alpha}
              transform={transform}
            />
          );
        }
        if (shape === 'triangle') {
          const h = p.size * Math.sqrt(3) / 2;
          return (
            <polygon
              key={p.id}
              points={`0,${-h * 0.67} ${p.size / 2},${h * 0.33} ${-p.size / 2},${h * 0.33}`}
              fill={p.color}
              fillOpacity={opacity * alpha}
              transform={transform}
            />
          );
        }
        if (shape === 'star') {
          return (
            <path
              key={p.id}
              d={star(0, 0, p.size / 2)}
              fill={p.color}
              fillOpacity={opacity * alpha}
              transform={transform}
            />
          );
        }
        // line
        return (
          <line
            key={p.id}
            x1={0} y1={-p.size}
            x2={0} y2={p.size}
            stroke={p.color}
            strokeWidth={2}
            strokeOpacity={opacity * alpha}
            transform={transform}
          />
        );
      })}
    </svg>
  );
};
