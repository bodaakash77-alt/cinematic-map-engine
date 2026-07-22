import React from 'react';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {DocumentaryTitle} from '../text/DocumentaryTitle';
import {LightRays} from '../effects/LightRays';
import {ColorGrade} from '../effects/ColorGrade';
import {ShapeLayer} from '../components/ShapeLayer';
import {CINEMATIC, easeOutCubic} from '../utils/easing';

/**
 * TitleAnimation — cinematic documentary title card composition.
 *
 * Demonstrates:
 *   • DocumentaryTitle (text engine with staggered word animation)
 *   • LightRays (atmospheric background effect)
 *   • ColorGrade (warm tint + vignette + letterbox)
 *   • ShapeLayer (decorative accent lines)
 */
export const TitleAnimation: React.FC = () => {
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill style={{backgroundColor: '#080808'}}>
      {/* Atmospheric light rays behind the title */}
      <LightRays
        count={16}
        color="#c9a84c"
        intensity={0.08}
        speed={0.3}
        originX={0.5}
        originY={-0.1}
        fadeIn={20}
      />

      {/* Horizontal accent rules */}
      <ShapeLayer
        shape="line"
        x={760}
        y={390}
        width={400}
        height={1}
        stroke="#c9a84c"
        strokeWidth={1}
        fill="none"
        fillOpacity={0}
        startFrame={8}
        duration={25}
        drawProgress={1}
        easing={easeOutCubic}
        style={{opacity: 0.6}}
      />
      <ShapeLayer
        shape="line"
        x={760}
        y={700}
        width={400}
        height={1}
        stroke="#c9a84c"
        strokeWidth={1}
        fill="none"
        fillOpacity={0}
        startFrame={12}
        duration={25}
        drawProgress={1}
        easing={easeOutCubic}
        style={{opacity: 0.4}}
      />

      {/* Main title card */}
      <DocumentaryTitle
        label="A Documentary Film"
        title="The Long Way Home"
        tagline="Some journeys change everything"
        startFrame={0}
        holdDuration={durationInFrames - 50}
        outDuration={30}
        accentColor="#c9a84c"
        titleColor="#f5f5f0"
      />

      {/* Final colour grade */}
      <ColorGrade
        brightness={0.95}
        contrast={1.08}
        saturation={0.85}
        sepia={0.1}
        tint="#3a2a10"
        tintOpacity={0.12}
        vignette={0.5}
        letterbox={0.06}
      />
    </AbsoluteFill>
  );
};
