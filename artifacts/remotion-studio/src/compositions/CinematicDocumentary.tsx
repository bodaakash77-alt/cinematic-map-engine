import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

const gold = '#d7b56d';
const ink = '#07090c';
const paper = '#e7e0d2';

const continents = [
  'M120 180 L210 120 300 135 330 205 285 270 205 265 155 225 Z',
  'M300 300 L360 330 375 430 330 505 285 445 295 365 Z',
  'M470 155 L560 125 625 155 650 205 585 225 510 205 Z',
  'M500 235 L595 220 650 285 630 405 565 455 505 405 480 310 Z',
  'M650 145 L835 125 960 175 935 260 820 295 700 255 640 205 Z',
  'M790 395 L900 375 965 425 940 485 845 500 785 455 Z',
];

const ease = Easing.bezier(0.22, 1, 0.36, 1);

export const CinematicDocumentary: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();

  const camera = interpolate(frame, [0, 450], [1.0, 1.075], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

  const intro = spring({frame, fps, config: {damping: 200}});
  const titleY = interpolate(intro, [0, 1], [90, 0]);
  const titleOpacity = interpolate(frame, [8, 34], [0, 1], {extrapolateRight: 'clamp'});
  const line = interpolate(frame, [28, 65], [0, 1], {extrapolateRight: 'clamp'});
  const mapOpacity = interpolate(frame, [45, 85], [0, 1], {extrapolateRight: 'clamp'});
  const routeProgress = interpolate(frame, [105, 185], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
  const lowerThird = interpolate(frame, [205, 240], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const outro = interpolate(frame, [405, 450], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const grainDots = Array.from({length: 90}, (_, i) => {
    const x = (i * 83) % width;
    const y = (i * 47) % height;
    const opacity = 0.025 + (((i * 17) % 10) / 100);
    return <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.2 : 0.7} fill="#fff" opacity={opacity} />;
  });

  return (
    <AbsoluteFill style={{backgroundColor: ink, color: paper, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${camera})`, transformOrigin: '50% 50%'}}>
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 42%, #17212a 0%, #0a0e12 48%, #030405 100%)'}} />

        <svg width={width} height={height} viewBox="0 0 1000 562.5" style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: mapOpacity}}>
          <defs>
            <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          <g opacity="0.14" stroke={gold} strokeWidth="0.7">
            {[80, 160, 240, 320, 400, 480].map(y => <line key={y} x1="0" y1={y} x2="1000" y2={y}/>)}
            {[100, 200, 300, 400, 500, 600, 700, 800, 900].map(x => <line key={x} x1={x} y1="0" x2={x} y2="562.5"/>)}
          </g>

          <g fill="#28343b" stroke="#56636b" strokeWidth="1.2">
            {continents.map((d, i) => <path key={i} d={d}/>)}
          </g>

          <path
            d="M610 315 C650 285 700 285 750 305 C800 325 830 350 865 380"
            fill="none"
            stroke={gold}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="700"
            strokeDashoffset={700 * (1 - routeProgress)}
            filter="url(#glow)"
          />

          {[
            [610,315,'ORIGIN'],
            [865,380,'DESTINATION'],
          ].map(([x,y,label], i) => (
            <g key={i}>
              <circle cx={x as number} cy={y as number} r="7" fill={gold} opacity="0.18"/>
              <circle cx={x as number} cy={y as number} r="3.5" fill={gold}/>
              <text x={(x as number) + 12} y={(y as number) - 10} fill={paper} fontSize="9" letterSpacing="2">{label}</text>
            </g>
          ))}
        </svg>

        <div style={{position: 'absolute', left: 110, top: 105, opacity: titleOpacity, transform: `translateY(${titleY}px)`}}>
          <div style={{fontFamily: 'Arial, sans-serif', fontSize: 16, letterSpacing: 6, color: gold, fontWeight: 700}}>
            A VISUAL DOCUMENTARY
          </div>
          <div style={{fontFamily: 'Georgia, serif', fontSize: 78, lineHeight: 0.98, fontWeight: 700, marginTop: 18, maxWidth: 820}}>
            HOW THE WORLD<br/>CHANGED
          </div>
          <div style={{marginTop: 28, width: 310, height: 2, backgroundColor: gold, transformOrigin: 'left', transform: `scaleX(${line})`}}/>
          <div style={{marginTop: 18, fontFamily: 'Arial, sans-serif', fontSize: 18, letterSpacing: 1.5, color: '#aeb7bd', maxWidth: 600}}>
            A cinematic motion-graphics study of place, movement and time.
          </div>
        </div>

        <div style={{
          position: 'absolute', left: 110, bottom: 92, opacity: lowerThird,
          fontFamily: 'Arial, sans-serif', borderLeft: `3px solid ${gold}`, paddingLeft: 18
        }}>
          <div style={{fontSize: 13, letterSpacing: 3, color: gold, fontWeight: 700}}>CHAPTER 01</div>
          <div style={{fontSize: 26, marginTop: 6, fontWeight: 600}}>FROM ONE PLACE TO ANOTHER</div>
        </div>

        <div style={{position: 'absolute', right: 80, bottom: 72, fontFamily: 'monospace', fontSize: 11, letterSpacing: 2, color: '#7f8a91'}}>
          00:15 / DOCUMENTARY ENGINE
        </div>
      </div>

      <svg width={width} height={height} style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
        {grainDots}
        <rect width={width} height={height} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2"/>
      </svg>

      <div style={{
        position: 'absolute', inset: 0, opacity: 0.22,
        background: 'radial-gradient(ellipse at center, transparent 42%, rgba(0,0,0,0.8) 100%)',
        pointerEvents: 'none'
      }}/>
      <AbsoluteFill style={{backgroundColor: '#000', opacity: 1 - outro, pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
