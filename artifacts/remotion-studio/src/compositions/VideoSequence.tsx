import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, Sequence} from 'remotion';
import {interpolate} from 'remotion';
import {ColorGrade} from '../effects/ColorGrade';
import {LightRays} from '../effects/LightRays';
import {LowerThird} from '../text/LowerThird';
import {DocumentarySubtitle} from '../text/DocumentarySubtitle';
import {DocumentarySceneCard} from '../text/DocumentaryScene';
import {TextEngine} from '../text/TextEngine';
import {ShapeLayer} from '../components/ShapeLayer';
import {Fade} from '../transitions/Fade';
import {Wipe} from '../transitions/Wipe';
import {easeOutCubic, CINEMATIC} from '../utils/easing';

/**
 * VideoSequence — a multi-act documentary sequence using Remotion Sequences.
 *
 * Acts as a template for real video-backed sequences: each Sequence block
 * would normally contain a <VideoLayer>, but here uses colour-coded
 * placeholders so the composition renders without external media.
 *
 * Demonstrates:
 *   • Sequence (multi-act timeline layout)
 *   • Fade / Wipe transitions between acts
 *   • LowerThird, DocumentarySubtitle, DocumentarySceneCard
 *   • TextEngine (act titles)
 *   • ColorGrade (per-act grading)
 *   • LightRays (atmospheric overlay)
 *   • ShapeLayer (frame / border elements)
 */
export const VideoSequenceComp: React.FC = () => {
  const {durationInFrames} = useVideoConfig();

  // ── Act timing (frames) ───────────────────────────────────────────────────
  const ACT1_START  = 0;
  const ACT1_DUR    = 100;
  const ACT2_START  = 90;   // 10-frame overlap for cross-dissolve
  const ACT2_DUR    = 100;
  const ACT3_START  = 180;
  const ACT3_DUR    = 120;

  return (
    <AbsoluteFill>

      {/* ══════════════════════════════════════════════════════════════
          ACT 1  —  Establishing shot (warm interior)
      ══════════════════════════════════════════════════════════════ */}
      <Sequence from={ACT1_START} durationInFrames={ACT1_DUR}>
        <Fade inDuration={15} outStart={80} outDuration={20}>
          {/* Placeholder for <VideoLayer src={staticFile('act1.mp4')} /> */}
          <AbsoluteFill
            style={{background: 'linear-gradient(135deg, #1a0e04 0%, #3a2010 50%, #1a0e04 100%)'}}
          />

          <LightRays count={8} color="#e8a030" intensity={0.07} originX={0.15} originY={0} fadeIn={20} />

          <DocumentarySceneCard
            sceneLabel="Act I"
            location="New York City"
            year="September 2001"
            startFrame={10}
            accentColor="#c9a84c"
          />

          <DocumentarySubtitle
            text="Everything we knew was about to change."
            startFrame={25}
            duration={55}
            italic
          />

          <LowerThird
            name="James Mitchell"
            descriptor="Correspondent · Ground Zero"
            startFrame={20}
            exitFrame={65}
            variant="classic"
            accentColor="#c9a84c"
          />

          <ColorGrade brightness={0.85} contrast={1.1} saturation={0.8} sepia={0.08} vignette={0.55} />
        </Fade>
      </Sequence>

      {/* ══════════════════════════════════════════════════════════════
          ACT 2  —  Aerial / exterior (cool blue)
      ══════════════════════════════════════════════════════════════ */}
      <Sequence from={ACT2_START} durationInFrames={ACT2_DUR}>
        <Wipe direction="left" startFrame={0} duration={20}>
          {/* Placeholder for <VideoLayer src={staticFile('act2.mp4')} /> */}
          <AbsoluteFill
            style={{background: 'linear-gradient(180deg, #04101a 0%, #0a2040 60%, #041018 100%)'}}
          />

          <DocumentarySceneCard
            sceneLabel="Act II"
            location="Kandahar Province"
            year="March 2002"
            startFrame={25}
            accentColor="#4ca8c9"
            position="top-left"
          />

          <DocumentarySubtitle
            text="Three thousand kilometres away, another story was beginning."
            startFrame={30}
            duration={60}
          />

          <LowerThird
            name="Col. David Reyes"
            descriptor="U.S. Army · 10th Mountain Division"
            startFrame={35}
            exitFrame={75}
            variant="modern"
            accentColor="#4ca8c9"
            bottom={160}
          />

          {/* Widescreen bars for this act */}
          <ShapeLayer
            shape="rect"
            x={0} y={0} width={1920} height={80}
            fill="#000" fillOpacity={0.7}
            stroke="none"
          />
          <ShapeLayer
            shape="rect"
            x={0} y={1000} width={1920} height={80}
            fill="#000" fillOpacity={0.7}
            stroke="none"
          />

          <ColorGrade brightness={0.9} contrast={1.05} saturation={0.75} vignette={0.5} tint="#001030" tintOpacity={0.15} />
        </Wipe>
      </Sequence>

      {/* ══════════════════════════════════════════════════════════════
          ACT 3  —  Aftermath (desaturated, high contrast)
      ══════════════════════════════════════════════════════════════ */}
      <Sequence from={ACT3_START} durationInFrames={ACT3_DUR}>
        <Fade inDuration={25} outStart={ACT3_DUR - 30} outDuration={30}>
          {/* Placeholder for <VideoLayer src={staticFile('act3.mp4')} /> */}
          <AbsoluteFill
            style={{background: 'linear-gradient(160deg, #0e0e0e 0%, #1e1e1e 50%, #0a0a0a 100%)'}}
          />

          <DocumentarySceneCard
            sceneLabel="Epilogue"
            location="Washington D.C."
            year="2023"
            startFrame={15}
            accentColor="#aaaaaa"
            position="bottom-left"
          />

          {/* Closing credits-style subtitle */}
          <div style={{
            position: 'absolute',
            bottom: 120,
            left: 0,
            right: 0,
            textAlign: 'center',
          }}>
            <TextEngine
              text="Twenty years later, the questions remain."
              animation="fadeUp"
              startFrame={30}
              stagger={3}
              charDuration={18}
              wordMode
              easing={CINEMATIC}
              style={{
                color: '#e0e0e0',
                fontSize: 36,
                fontFamily: 'Georgia, Times New Roman, serif',
                fontStyle: 'italic',
                fontWeight: 400,
              }}
            />
          </div>

          <DocumentarySubtitle
            text="Based on first-hand accounts and declassified documents."
            startFrame={60}
            duration={50}
            fontSize={28}
            italic
            background="none"
          />

          <ColorGrade
            brightness={0.92}
            contrast={1.2}
            saturation={0.2}
            vignette={0.7}
            letterbox={0.06}
          />
        </Fade>
      </Sequence>

    </AbsoluteFill>
  );
};
