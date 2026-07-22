import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence} from 'remotion';
import {ColorGrade} from '../effects/ColorGrade';
import {LightRays} from '../effects/LightRays';
import {LensFlare} from '../effects/LensFlare';
import {LowerThird} from '../text/LowerThird';
import {DocumentarySceneCard} from '../text/DocumentaryScene';
import {DocumentarySubtitle} from '../text/DocumentarySubtitle';
import {ShapeLayer} from '../components/ShapeLayer';
import {easeOutCubic} from '../utils/easing';

/**
 * DocumentaryScene — a full documentary scene composition.
 *
 * Demonstrates:
 *   • LowerThird (classic + modern variants)
 *   • DocumentarySceneCard (location / year slug)
 *   • DocumentarySubtitle (sync'd translation subtitles)
 *   • LightRays + LensFlare (atmospheric lighting)
 *   • ShapeLayer (decorative elements)
 *   • ColorGrade (cinematic warm grade)
 */
export const DocumentarySceneComp: React.FC = () => {
  const {durationInFrames} = useVideoConfig();

  // Simulated darkened background (in production, replace with ImageLayer)
  return (
    <AbsoluteFill style={{backgroundColor: '#1a1208'}}>

      {/* ── Background atmosphere ─────────────────────────────────── */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 30% 40%, #2a1e0a 0%, #0d0905 100%)',
        }}
      />

      <LightRays
        count={10}
        color="#e8a030"
        intensity={0.06}
        speed={0.25}
        originX={0.25}
        originY={0.0}
        fadeIn={40}
      />

      <LensFlare x={0.22} y={0.08} intensity={0.6} fadeIn={20} />

      {/* ── Scene card: location slug ─────────────────────────────── */}
      <DocumentarySceneCard
        sceneLabel="Chapter One"
        location="Kabul, Afghanistan"
        year="2001"
        startFrame={10}
        accentColor="#c9a84c"
        position="bottom-left"
      />

      {/* ── Lower third: speaker identification ──────────────────── */}
      <Sequence from={40} durationInFrames={120}>
        <LowerThird
          name="Ahmad Karimi"
          descriptor="Former Intelligence Officer"
          startFrame={0}
          exitFrame={90}
          exitDuration={20}
          variant="classic"
          accentColor="#c9a84c"
        />
      </Sequence>

      {/* ── Second lower third, modern variant ───────────────────── */}
      <Sequence from={180} durationInFrames={100}>
        <LowerThird
          name="Dr. Sarah Nolan"
          descriptor="UN Special Envoy · Kabul Office"
          startFrame={0}
          exitFrame={75}
          exitDuration={20}
          variant="modern"
          accentColor="#4ca8c9"
        />
      </Sequence>

      {/* ── Subtitle track ───────────────────────────────────────── */}
      <Sequence from={50} durationInFrames={60}>
        <DocumentarySubtitle
          text="We knew something was coming. We just didn't know when."
          startFrame={0}
          duration={55}
          italic
          background="none"
        />
      </Sequence>

      <Sequence from={130} durationInFrames={50}>
        <DocumentarySubtitle
          text="The city had changed beyond recognition."
          startFrame={0}
          duration={45}
        />
      </Sequence>

      {/* ── Decorative corner bracket (top-right) ────────────────── */}
      <ShapeLayer
        shape="line"
        x={1760}
        y={60}
        width={80}
        height={1}
        stroke="#c9a84c"
        strokeWidth={1.5}
        fill="none"
        fillOpacity={0}
        startFrame={5}
        duration={15}
        style={{opacity: 0.5}}
      />

      {/* ── Cinematic grade ──────────────────────────────────────── */}
      <ColorGrade
        brightness={0.88}
        contrast={1.12}
        saturation={0.75}
        sepia={0.12}
        tint="#3a2010"
        tintOpacity={0.18}
        vignette={0.65}
        letterbox={0.07}
      />
    </AbsoluteFill>
  );
};
