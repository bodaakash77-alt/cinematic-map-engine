import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {interpolate} from 'remotion';
import {Parallax3D} from '../camera/Parallax3D';
import {ColorGrade} from '../effects/ColorGrade';
import {LensFlare} from '../effects/LensFlare';
import {TextEngine} from '../text/TextEngine';
import {ShapeLayer} from '../components/ShapeLayer';
import {CINEMATIC, easeOutCubic} from '../utils/easing';

/**
 * ImageParallax — a 3-D parallax scene built from layered colour planes.
 * In production, replace each AbsoluteFill colour with an <ImageLayer>.
 *
 * Demonstrates:
 *   • Parallax3D (depth-based multi-layer camera pan)
 *   • CameraController (global zoom)
 *   • LensFlare (practical light element)
 *   • ShapeLayer (foreground decorative elements)
 *   • ColorGrade (moody cinematic look)
 */
export const ImageParallaxComp: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height, durationInFrames} = useVideoConfig();

  // Slow camera pan across the scene
  const panX = interpolate(frame, [0, durationInFrames], [0, -120], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CINEMATIC,
  });
  const panY = interpolate(frame, [0, durationInFrames], [0, -30], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: CINEMATIC,
  });

  const titleOpacity = interpolate(frame, [20, 50, durationInFrames - 30, durationInFrames - 5], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Mountain silhouette path (parallax depth 0.2)
  const mountainPath = `M0,${height} L0,${height * 0.55} L${width * 0.2},${height * 0.35} L${width * 0.4},${height * 0.5} L${width * 0.6},${height * 0.3} L${width * 0.8},${height * 0.45} L${width},${height * 0.38} L${width},${height} Z`;

  return (
    <AbsoluteFill>
      <Parallax3D
        panX={panX}
        panY={panY}
        startFrame={0}
        endFrame={durationInFrames}
        perspective={900}
        layers={[
          // ── Layer 0: Sky (stationary) ─────────────────────────────
          {
            depth: 0,
            zIndex: 0,
            children: (
              <AbsoluteFill
                style={{
                  background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a3a 40%, #2a1a0a 100%)',
                }}
              />
            ),
          },
          // ── Layer 1: Stars (subtle) ──────────────────────────────
          {
            depth: 0.05,
            zIndex: 1,
            children: (
              <svg width={width} height={height} style={{position: 'absolute'}}>
                {Array.from({length: 60}, (_, i) => {
                  const sx = (((i * 317) % 1000) / 1000) * width;
                  const sy = (((i * 211) % 1000) / 1000) * height * 0.6;
                  const sr = 0.5 + ((i * 137) % 10) / 10 * 1.5;
                  return <circle key={i} cx={sx} cy={sy} r={sr} fill="#fff" fillOpacity={0.5 + ((i * 53) % 10) / 20} />;
                })}
              </svg>
            ),
          },
          // ── Layer 2: Far mountain range ───────────────────────────
          {
            depth: 0.2,
            zIndex: 2,
            children: (
              <svg width={width} height={height} style={{position: 'absolute'}}>
                <path
                  d={mountainPath}
                  fill="#1a2a3a"
                />
              </svg>
            ),
          },
          // ── Layer 3: Mid hills ────────────────────────────────────
          {
            depth: 0.5,
            zIndex: 3,
            children: (
              <svg width={width} height={height} style={{position: 'absolute'}}>
                <path
                  d={`M0,${height} L0,${height * 0.7} L${width * 0.15},${height * 0.6} L${width * 0.35},${height * 0.68} L${width * 0.55},${height * 0.58} L${width * 0.75},${height * 0.66} L${width},${height * 0.62} L${width},${height} Z`}
                  fill="#0d1a0d"
                />
              </svg>
            ),
          },
          // ── Layer 4: Foreground ground ────────────────────────────
          {
            depth: 0.85,
            zIndex: 4,
            children: (
              <svg width={width} height={height} style={{position: 'absolute'}}>
                <path
                  d={`M0,${height} L0,${height * 0.82} Q${width * 0.25},${height * 0.78} ${width * 0.5},${height * 0.80} Q${width * 0.75},${height * 0.82} ${width},${height * 0.79} L${width},${height} Z`}
                  fill="#080808"
                />
              </svg>
            ),
          },
        ]}
      />

      {/* Lens flare in the sky */}
      <LensFlare x={0.72} y={0.12} intensity={0.8} fadeIn={15} />

      {/* Title overlay */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: 0,
          right: 0,
          textAlign: 'center',
          opacity: titleOpacity,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            color: '#f5f5f0',
            fontSize: 64,
            fontFamily: 'Georgia, Times New Roman, serif',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            textShadow: '0 4px 30px rgba(0,0,0,0.8)',
          }}
        >
          <TextEngine
            text="Beyond the Horizon"
            animation="fadeUp"
            startFrame={20}
            stagger={4}
            charDuration={20}
            wordMode
            easing={easeOutCubic}
          />
        </div>
        <div
          style={{
            color: '#c9a84c',
            fontSize: 14,
            fontFamily: 'Helvetica Neue, Arial, sans-serif',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginTop: 20,
          }}
        >
          <TextEngine
            text="A JOURNEY THROUGH THE MOUNTAINS"
            animation="fadeIn"
            startFrame={40}
            stagger={1.5}
            charDuration={12}
          />
        </div>
      </div>

      {/* Decorative horizontal rule */}
      <ShapeLayer
        shape="line"
        x={810}
        y={height / 2 + 60}
        width={300}
        height={1}
        stroke="#c9a84c"
        strokeWidth={0.8}
        fill="none"
        fillOpacity={0}
        startFrame={38}
        duration={20}
        style={{opacity: titleOpacity * 0.6}}
      />

      {/* Cinematic grade */}
      <ColorGrade
        brightness={0.92}
        contrast={1.1}
        saturation={0.8}
        vignette={0.6}
        letterbox={0.07}
        tint="#1a0a00"
        tintOpacity={0.1}
      />
    </AbsoluteFill>
  );
};
