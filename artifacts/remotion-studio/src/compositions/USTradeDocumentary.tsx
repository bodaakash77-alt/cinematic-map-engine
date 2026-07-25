import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {CameraController} from '../camera/CameraController';
import {ColorGrade} from '../effects/ColorGrade';
import {Glow} from '../effects/Glow';
import {LightRays} from '../effects/LightRays';
import {CountryHighlight} from '../maps/CountryHighlight';
import {MapCanvas, latLngToXY} from '../maps/MapCanvas';
import {PathAnimation} from '../maps/PathAnimation';
import {TextEngine} from '../text/TextEngine';
import {easeInOutCubic, easeOutCubic} from '../utils/easing';

const US_PATH =
  'M 325,194 L 495,184 L 545,220 L 525,274 L 472,295 L 402,285 L 338,252 L 302,218 Z';
const CALIFORNIA_PATH =
  'M 300,206 L 326,196 L 342,226 L 354,275 L 338,302 L 316,284 L 304,244 Z';

const sceneOpacity = (frame: number, start: number, end: number) =>
  interpolate(frame, [start - 12, start, end - 12, end], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const labelOpacity = (frame: number, start: number) =>
  interpolate(frame, [start, start + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

const MapLabel: React.FC<{x: number; y: number; label: string; start: number}> = ({
  x,
  y,
  label,
  start,
}) => {
  const frame = useCurrentFrame();
  const opacity = labelOpacity(frame, start);

  return (
    <g opacity={opacity}>
      <circle cx={x} cy={y} r={7} fill="#f7c948" />
      <circle cx={x} cy={y} r={18} fill="none" stroke="#f7c948" strokeOpacity={0.35} />
      <text
        x={x + 20}
        y={y + 5}
        fill="#fff7d6"
        fontFamily="Helvetica Neue, Arial, sans-serif"
        fontSize={20}
        fontWeight={700}
        letterSpacing="0.08em"
      >
        {label.toUpperCase()}
      </text>
    </g>
  );
};

const ContainerShip: React.FC<{startFrame: number; points: {x: number; y: number}[]}> = ({
  startFrame,
  points,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, startFrame + 85], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOutCubic,
  });
  const from = points[0];
  const to = points[points.length - 1];
  const x = from.x + (to.x - from.x) * progress;
  const y = from.y + (to.y - from.y) * progress - Math.sin(progress * Math.PI) * 70;

  return (
    <g transform={`translate(${x}, ${y}) rotate(-8)`} opacity={progress > 0 && progress < 1 ? 1 : 0}>
      <rect x={-34} y={-10} width={68} height={18} rx={5} fill="#17233a" stroke="#8fd7ff" strokeWidth={2} />
      <rect x={-20} y={-24} width={12} height={14} fill="#f26d4f" />
      <rect x={-4} y={-24} width={12} height={14} fill="#f7c948" />
      <rect x={12} y={-24} width={12} height={14} fill="#4fd1c5" />
      <path d="M -40,8 L 40,8 L 26,24 L -25,24 Z" fill="#d8f3ff" fillOpacity={0.9} />
    </g>
  );
};

export const USTradeDocumentary: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const losAngeles = latLngToXY(33.74, -118.26, width, height, 0.04);
  const sanFrancisco = latLngToXY(37.77, -122.42, width, height, 0.04);
  const centralValley = latLngToXY(36.7, -119.4, width, height, 0.04);
  const tokyo = latLngToXY(35.68, 139.69, width, height, 0.04);
  const shanghai = latLngToXY(31.23, 121.47, width, height, 0.04);
  const honolulu = latLngToXY(21.31, -157.86, width, height, 0.04);

  const cameraScale = interpolate(
    frame,
    [0, 90, 180, 270, 360, 450],
    [0.72, 1.05, 2.15, 4.6, 5.35, 2.55],
    {extrapolateRight: 'clamp', easing: easeInOutCubic},
  );
  const cameraX = interpolate(frame, [0, 90, 180, 270, 360, 450], [0, -85, -420, -1110, -1200, -320], {
    extrapolateRight: 'clamp',
    easing: easeInOutCubic,
  });
  const cameraY = interpolate(frame, [0, 90, 180, 270, 360, 450], [0, -40, -125, -245, -280, -150], {
    extrapolateRight: 'clamp',
    easing: easeInOutCubic,
  });

  const earthScale = interpolate(frame, [0, 90], [0.74, 1.02], {
    extrapolateRight: 'clamp',
    easing: easeOutCubic,
  });

  return (
    <AbsoluteFill style={{backgroundColor: '#030712', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 50% 48%, rgba(22,76,119,0.95) 0%, rgba(6,26,50,0.98) 34%, rgba(3,7,18,1) 67%)',
          transform: `scale(${earthScale})`,
        }}
      />
      <LightRays count={10} color="#9bdcff" intensity={0.08} originX={0.52} originY={0.22} fadeIn={40} />

      <CameraController x={cameraX} y={cameraY} scale={cameraScale} origin="50% 50%">
        <MapCanvas oceanColor="rgba(8,38,73,0.72)" landColor="#173b4f" borderColor="#6ab7d6" borderWidth={0.75}>
          <CountryHighlight
            pathD={US_PATH}
            startFrame={96}
            duration={36}
            fillColor="#2dd4bf"
            strokeColor="#b9fff6"
            strokeWidth={2.5}
            pulse
            pulsePeriod={72}
            label="United States"
            labelX={430}
            labelY={175}
            labelSize={14}
          />
          <CountryHighlight
            pathD={CALIFORNIA_PATH}
            startFrame={186}
            duration={30}
            fillColor="#f7c948"
            strokeColor="#fff3b0"
            strokeWidth={2.1}
            pulse
            pulsePeriod={54}
            label="California"
            labelX={332}
            labelY={192}
            labelSize={12}
          />

          <g opacity={sceneOpacity(frame, 180, 282)}>
            <MapLabel x={sanFrancisco.x} y={sanFrancisco.y} label="San Francisco" start={190} />
            <MapLabel x={centralValley.x} y={centralValley.y} label="Central Valley" start={212} />
            <MapLabel x={losAngeles.x} y={losAngeles.y} label="Los Angeles" start={232} />
          </g>

          <g opacity={sceneOpacity(frame, 270, 372)}>
            <PathAnimation
              points={[losAngeles, {x: losAngeles.x - 130, y: losAngeles.y + 32}, honolulu]}
              startFrame={278}
              duration={74}
              strokeColor="#f7c948"
              strokeWidth={4}
              trailColor="#f7c94866"
              smooth
              showHead
              headRadius={8}
            />
            <ContainerShip startFrame={286} points={[losAngeles, honolulu]} />
          </g>

          <g opacity={sceneOpacity(frame, 360, 450)}>
            <PathAnimation points={[losAngeles, honolulu, tokyo]} startFrame={360} duration={76} strokeColor="#4fd1c5" strokeWidth={3.5} trailColor="#4fd1c555" />
            <PathAnimation points={[losAngeles, {x: 124, y: 535}, shanghai]} startFrame={376} duration={68} strokeColor="#8fd7ff" strokeWidth={3.5} trailColor="#8fd7ff55" />
            <ContainerShip startFrame={372} points={[losAngeles, tokyo]} />
            <ContainerShip startFrame={394} points={[losAngeles, shanghai]} />
          </g>
        </MapCanvas>
      </CameraController>

      <Glow radius={18} color="#8fd7ff" intensity={0.45}>
        <AbsoluteFill style={{pointerEvents: 'none'}}>
          <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 52%, transparent 36%, rgba(143,215,255,0.16) 37%, transparent 40%)', opacity: sceneOpacity(frame, 0, 95)}} />
        </AbsoluteFill>
      </Glow>

      <div style={{position: 'absolute', top: 120, left: 120, opacity: sceneOpacity(frame, 0, 98), color: '#f8fafc'}}>
        <div style={{fontSize: 74, fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'Helvetica Neue, Arial, sans-serif'}}>
          <TextEngine text="The Gateway of American Trade" animation="fadeUp" startFrame={18} stagger={1.2} charDuration={18} />
        </div>
        <div style={{marginTop: 18, fontSize: 18, letterSpacing: '0.32em', color: '#9bdcff', textTransform: 'uppercase'}}>
          Pacific commerce begins on the coast
        </div>
      </div>

      <div style={{position: 'absolute', left: 112, bottom: 96, color: '#e0f2fe', opacity: sceneOpacity(frame, 270, 372), fontSize: 32, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase'}}>
        Port of Los Angeles · America’s Pacific Gateway
      </div>

      <div style={{position: 'absolute', right: 108, bottom: 106, opacity: sceneOpacity(frame, 372, 450), textAlign: 'right', color: '#fff7d6', fontFamily: 'Helvetica Neue, Arial, sans-serif'}}>
        <div style={{fontSize: 62, fontWeight: 800}}>Across the Pacific</div>
        <div style={{fontSize: 20, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#8fd7ff'}}>Trade routes connect continents</div>
      </div>

      <ColorGrade brightness={1.03} contrast={1.12} saturation={1.05} tint="#0b1830" tintOpacity={0.16} vignette={0.45} letterbox={0.065} />
    </AbsoluteFill>
  );
};
