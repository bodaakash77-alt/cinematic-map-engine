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
import {USTradeDocumentary}  from './compositions/USTradeDocumentary';
import {CinematicDocumentary} from './compositions/CinematicDocumentary';

const W = 1920;
const H = 1080;
const FPS = 30;

export const Root: React.FC = () => {
  return (
    <>
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

      <Composition id="TitleAnimation" component={TitleAnimation} durationInFrames={180} fps={FPS} width={W} height={H} />
      <Composition id="DocumentaryScene" component={DocumentarySceneComp} durationInFrames={300} fps={FPS} width={W} height={H} />
      <Composition id="MapAnimation" component={MapAnimationComp} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition id="ImageParallax" component={ImageParallaxComp} durationInFrames={240} fps={FPS} width={W} height={H} />
      <Composition id="VideoSequence" component={VideoSequenceComp} durationInFrames={300} fps={FPS} width={W} height={H} />
      <Composition id="USTradeDocumentary" component={USTradeDocumentary} durationInFrames={450} fps={FPS} width={W} height={H} />
      <Composition id="ParticleScene" component={ParticleSceneComp} durationInFrames={300} fps={FPS} width={W} height={H} />

      {/* ── New professional documentary showcase ─────────────────── */}
      <Composition
        id="CinematicDocumentary"
        component={CinematicDocumentary}
        durationInFrames={450}
        fps={FPS}
        width={W}
        height={H}
      />
    </>
  );
};
