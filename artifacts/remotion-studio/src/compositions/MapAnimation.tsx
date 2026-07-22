import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {interpolate} from 'remotion';
import {MapCanvas, latLngToXY} from '../maps/MapCanvas';
import {PathAnimation} from '../maps/PathAnimation';
import {ArrowAnimation} from '../maps/ArrowAnimation';
import {CountryHighlight} from '../maps/CountryHighlight';
import {ColorGrade} from '../effects/ColorGrade';
import {TextEngine} from '../text/TextEngine';
import {easeOutCubic, CINEMATIC} from '../utils/easing';

// Simplified country paths (scaled to 1920×1080)
const AFGHANISTAN_PATH =
  'M 1112,168 L 1145,160 L 1175,172 L 1195,190 L 1185,215 L 1160,228 L 1130,222 L 1108,208 Z';
const PAKISTAN_PATH =
  'M 1160,228 L 1210,220 L 1240,240 L 1250,275 L 1225,300 L 1185,305 L 1155,285 L 1150,255 Z';

/**
 * MapAnimation — animated world-map sequence.
 *
 * Demonstrates:
 *   • MapCanvas (world map base layer)
 *   • CountryHighlight (Afghanistan, Pakistan)
 *   • PathAnimation (route from London to Kabul)
 *   • ArrowAnimation (directional indicator)
 *   • TextEngine (animated city labels)
 *   • ColorGrade (cool cartographic tone)
 */
export const MapAnimationComp: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  // City coordinates → pixel positions
  const london  = latLngToXY(51.5,   -0.12,  width, height, 0.04);
  const istanbul = latLngToXY(41.0,  28.9,   width, height, 0.04);
  const tehran  = latLngToXY(35.7,   51.4,   width, height, 0.04);
  const kabul   = latLngToXY(34.5,   69.2,   width, height, 0.04);

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: '#0d2a4a'}}>

      {/* ── Base map ─────────────────────────────────────────────── */}
      <MapCanvas
        oceanColor="#0d2a4a"
        landColor="#1e3d58"
        borderColor="#2a5880"
      >
        {/* Country highlights */}
        <CountryHighlight
          pathD={AFGHANISTAN_PATH}
          startFrame={30}
          duration={25}
          fillColor="#c9a84c"
          strokeColor="#f0d080"
          pulse
          pulsePeriod={90}
          label="Afghanistan"
          labelX={1152}
          labelY={200}
          labelSize={11}
        />
        <CountryHighlight
          pathD={PAKISTAN_PATH}
          startFrame={55}
          duration={25}
          fillColor="#4ca8c9"
          strokeColor="#80d0f0"
          pulse
          pulsePeriod={110}
          label="Pakistan"
          labelX={1200}
          labelY={268}
          labelSize={11}
        />

        {/* ── Animated route ──────────────────────────────────────── */}
        <PathAnimation
          points={[london, istanbul, tehran, kabul]}
          startFrame={10}
          duration={100}
          strokeColor="#f0c040"
          strokeWidth={2.5}
          trailColor="#f0c04040"
          smooth
          showHead
          headRadius={7}
        />

        {/* ── Direction arrow from Tehran → Kabul (appears late) ── */}
        <ArrowAnimation
          x1={tehran.x} y1={tehran.y}
          x2={kabul.x}  y2={kabul.y}
          startFrame={90}
          duration={20}
          color="#ff8040"
          curve={-0.15}
          style="dashed"
        />

        {/* ── City label dots ──────────────────────────────────────── */}
        {([
          {city: 'London',   pos: london,   frame: 10},
          {city: 'Istanbul', pos: istanbul,  frame: 35},
          {city: 'Tehran',   pos: tehran,    frame: 60},
          {city: 'Kabul',    pos: kabul,     frame: 95},
        ] as const).map(({city, pos, frame: f}) => {
          const labelOpacity = interpolate(frame, [f, f + 12], [0, 1], {extrapolateRight: 'clamp'});
          return (
            <g key={city} opacity={labelOpacity}>
              <circle cx={pos.x} cy={pos.y} r={5} fill="#f0c040" />
              <circle cx={pos.x} cy={pos.y} r={9} fill="none" stroke="#f0c040" strokeWidth={1} strokeOpacity={0.4} />
              <text
                x={pos.x + 12}
                y={pos.y + 4}
                fill="#ffffff"
                fontSize={11}
                fontFamily="Helvetica Neue, Arial, sans-serif"
                fontWeight="600"
                letterSpacing="0.08em"
              >
                {city.toUpperCase()}
              </text>
            </g>
          );
        })}
      </MapCanvas>

      {/* ── Map title ────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: 80,
          opacity: titleOpacity,
          color: '#f5f5f0',
          fontFamily: 'Helvetica Neue, Arial, sans-serif',
          fontSize: 13,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontWeight: 500,
        }}
      >
        <TextEngine
          text="Route of the Expedition"
          animation="fadeIn"
          startFrame={5}
          stagger={1.5}
          charDuration={10}
        />
      </div>

      {/* ── Cool cartographic grade ──────────────────────────────── */}
      <ColorGrade
        brightness={1.0}
        contrast={1.05}
        saturation={0.9}
        vignette={0.4}
      />
    </AbsoluteFill>
  );
};
