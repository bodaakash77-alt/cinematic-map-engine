import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {interpolate} from 'remotion';
import {ParticleEngine} from '../effects/ParticleEngine';
import {LensFlare} from '../effects/LensFlare';
import {Glow} from '../effects/Glow';
import {ColorGrade} from '../effects/ColorGrade';
import {TextEngine} from '../text/TextEngine';
import {ShapeLayer} from '../components/ShapeLayer';
import {easeOutElastic, easeOutCubic} from '../utils/easing';

/**
 * ParticleScene — multi-layer particle system showcase.
 *
 * Demonstrates:
 *   • ParticleEngine (3 simultaneous particle layers with different configs)
 *   • Glow (bloom on central shape)
 *   • LensFlare (practical light)
 *   • ShapeLayer (glowing orb + accent rings)
 *   • ColorGrade (deep space look)
 */
export const ParticleSceneComp: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();

  const cx = width / 2;
  const cy = height / 2;

  // Central orb pulse
  const orbScale = 1 + 0.06 * Math.sin(frame * 0.08);
  const orbRadius = 80 * orbScale;

  const titleOpacity = interpolate(frame, [30, 55, durationInFrames - 25, durationInFrames], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ringScale = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
    easing: easeOutElastic,
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#02020a'}}>

      {/* ── Background gradient ──────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 50%, #0a0a2a 0%, #02020a 100%)`,
        }}
      />

      {/* ── Layer 1: Wide ambient dust particles ─────────────────── */}
      <ParticleEngine
        count={120}
        shape="circle"
        colors={['#4060ff', '#6040ff', '#2040a0']}
        minSize={1}
        maxSize={3}
        minSpeed={0.2}
        maxSpeed={0.8}
        gravity={0}
        spawnArea="full"
        wind={0.1}
        lifespan={180}
        fadeTail={60}
        opacity={0.4}
      />

      {/* ── Layer 2: Bright rising sparkles ──────────────────────── */}
      <ParticleEngine
        count={50}
        shape="star"
        colors={['#c9a84c', '#ffe080', '#ffffff']}
        minSize={2}
        maxSize={6}
        minSpeed={0.5}
        maxSpeed={2}
        gravity={-0.01}
        spawnArea="center"
        lifespan={120}
        fadeTail={40}
        opacity={0.9}
        spin={1.5}
      />

      {/* ── Layer 3: Fast streaks (energy lines) ─────────────────── */}
      <ParticleEngine
        count={30}
        shape="line"
        colors={['#80c0ff', '#40a0ff']}
        minSize={8}
        maxSize={20}
        minSpeed={3}
        maxSpeed={6}
        gravity={0.05}
        spawnArea="top"
        lifespan={60}
        fadeTail={20}
        opacity={0.5}
      />

      {/* ── Central glowing orb ──────────────────────────────────── */}
      <Glow radius={40} color="#4060ff" intensity={0.7}>
        <svg width={width} height={height} style={{position: 'absolute'}}>
          {/* Outer rings */}
          {[160, 220, 290].map((r, i) => (
            <circle
              key={r}
              cx={cx}
              cy={cy}
              r={r * ringScale}
              fill="none"
              stroke="#4060ff"
              strokeWidth={i === 0 ? 1.5 : 0.8}
              strokeOpacity={0.3 - i * 0.07}
              strokeDasharray={i === 2 ? '8 12' : undefined}
            />
          ))}
          {/* Core orb */}
          <circle
            cx={cx}
            cy={cy}
            r={orbRadius}
            fill="url(#orb-grad)"
          />
          <defs>
            <radialGradient id="orb-grad" cx="40%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#a0b0ff" />
              <stop offset="60%" stopColor="#4060ff" />
              <stop offset="100%" stopColor="#1020a0" />
            </radialGradient>
          </defs>
          {/* Inner highlight */}
          <ellipse
            cx={cx - orbRadius * 0.2}
            cy={cy - orbRadius * 0.25}
            rx={orbRadius * 0.3}
            ry={orbRadius * 0.18}
            fill="rgba(255,255,255,0.15)"
          />
        </svg>
      </Glow>

      {/* Lens flare from the orb */}
      <LensFlare x={0.5} y={0.5} intensity={0.5} fadeIn={10} />

      {/* ── Title ────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 160,
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            color: '#c8d8ff',
            fontSize: 48,
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.05em',
          }}
        >
          <TextEngine
            text="PARTICLE ENGINE"
            animation="fadeUp"
            startFrame={30}
            stagger={3}
            charDuration={15}
            easing={easeOutCubic}
          />
        </div>
        <div
          style={{
            color: '#6080c0',
            fontSize: 14,
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            letterSpacing: '0.25em',
            marginTop: 12,
          }}
        >
          <TextEngine
            text="MULTI-LAYER · DETERMINISTIC · FULLY CONFIGURABLE"
            animation="fadeIn"
            startFrame={45}
            stagger={1}
            charDuration={10}
          />
        </div>
      </div>

      {/* Corner accent shapes */}
      {[[40, 40], [width - 40, 40], [40, height - 40], [width - 40, height - 40]].map(([x, y], i) => (
        <ShapeLayer
          key={i}
          shape="circle"
          x={x - 4}
          y={y - 4}
          width={8}
          height={8}
          fill="#4060ff"
          fillOpacity={0.6}
          startFrame={i * 5}
          duration={15}
          easing={easeOutCubic}
        />
      ))}

      {/* ── Space grade ──────────────────────────────────────────── */}
      <ColorGrade
        brightness={0.95}
        contrast={1.15}
        saturation={1.1}
        vignette={0.5}
      />
    </AbsoluteFill>
  );
};
