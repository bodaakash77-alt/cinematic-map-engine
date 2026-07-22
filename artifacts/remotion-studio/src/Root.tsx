import React from 'react';
import {Composition} from 'remotion';

// ── Original composition ──────────────────────────────────────────────────────
import {MyComposition, myCompSchema} from './Composition';

// ── Example compositions ──────────────────────────────────────────────────────
import {TitleAnimation}       from './compositions/TitleAnimation';
import {DocumentarySceneComp} from './compositions/DocumentaryScene';
import {MapAnimationComp}     from './compositions/MapAnimation';
import {ImageParallaxComp}    from './compositions/ImageParallax';
import {VideoSequenceComp}    from './compositions/VideoSequence';
import {ParticleSceneComp}    from './compositions/ParticleScene';

const W = 1920;
const H = 1080;
const FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
      {/* ── Original starter composition ─────────────────────────── */}
      <Composition
        id="MyComp"
        component={MyComposition}
        durationInFrames={150}
        fps={FPS}
        width={W}
        height={H}
        schema={myCompSchema}
        defaultProps={{
          titleText: 'Welcome to Remotion',
          titleColor: '#000000',
          logoColor: '#00bfff',
        }}
      />

      {/* ── Cinematic title card ──────────────────────────────────── */}
      <Composition
        id="TitleAnimation"
        component={TitleAnimation}
        durationInFrames={180}
        fps={FPS}
        width={W}
        height={H}
      />

      {/* ── Full documentary scene (lower thirds, subtitles, etc.) ── */}
      <Composition
        id="DocumentaryScene"
        component={DocumentarySceneComp}
        durationInFrames={300}
        fps={FPS}
        width={W}
        height={H}
      />

      {/* ── Animated world-map sequence ──────────────────────────── */}
      <Composition
        id="MapAnimation"
        component={MapAnimationComp}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />

      {/* ── 3-D parallax landscape ───────────────────────────────── */}
      <Composition
        id="ImageParallax"
        component={ImageParallaxComp}
        durationInFrames={240}
        fps={FPS}
        width={W}
        height={H}
      />

      {/* ── Multi-act video sequence with transitions ─────────────── */}
      <Composition
        id="VideoSequence"
        component={VideoSequenceComp}
        durationInFrames={300}
        fps={FPS}
        width={W}
        height={H}
      />

      {/* ── Particle engine showcase ──────────────────────────────── */}
      <Composition
        id="ParticleScene"
        component={ParticleSceneComp}
        durationInFrames={300}
        fps={FPS}
        width={W}
        height={H}
      />
    </>
  );
};
