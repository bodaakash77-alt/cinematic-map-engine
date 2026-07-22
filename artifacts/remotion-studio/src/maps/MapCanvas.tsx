import React from 'react';
import {useVideoConfig} from 'remotion';

export interface MapPoint {
  id: string;
  /** Longitude -180 → 180 */
  lng: number;
  /** Latitude -90 → 90 */
  lat: number;
}

interface MapCanvasProps {
  children?: React.ReactNode;
  /** Background colour of the ocean */
  oceanColor?: string;
  /** Land fill colour */
  landColor?: string;
  /** Land border colour */
  borderColor?: string;
  borderWidth?: number;
  /** Map projection: 'mercator' | 'equirectangular' */
  projection?: 'mercator' | 'equirectangular';
  /** Padding around the map (0–1) */
  padding?: number;
}

/**
 * Convert lat/lng to SVG pixel coordinates using equirectangular projection.
 */
export function latLngToXY(
  lat: number,
  lng: number,
  width: number,
  height: number,
  padding = 0,
): {x: number; y: number} {
  const pw = width * padding;
  const ph = height * padding;
  const x = pw + ((lng + 180) / 360) * (width - pw * 2);
  const y = ph + ((90 - lat) / 180) * (height - ph * 2);
  return {x, y};
}

/**
 * MapCanvas — an abstract SVG world-map canvas.
 * Renders a stylised world-map background with children overlaid.
 *
 * For production use, swap the simplified continents below with a real
 * geo-JSON → SVG path pipeline (e.g. d3-geo + topojson).
 */
export const MapCanvas: React.FC<MapCanvasProps> = ({
  children,
  oceanColor = '#0d2a4a',
  landColor = '#1e3d58',
  borderColor = '#2a5880',
  borderWidth = 0.8,
  padding = 0.04,
}) => {
  const {width, height} = useVideoConfig();

  // Simplified continent outlines (very coarse, for illustration)
  const continents: {id: string; d: string}[] = [
    // North America (very rough)
    {id: 'na', d: 'M 220,60 L 310,50 L 340,90 L 320,160 L 290,200 L 250,220 L 200,200 L 180,160 L 195,110 Z'},
    // South America
    {id: 'sa', d: 'M 270,230 L 310,225 L 330,280 L 320,360 L 295,390 L 265,370 L 250,320 L 255,265 Z'},
    // Europe
    {id: 'eu', d: 'M 470,55 L 530,50 L 560,80 L 545,110 L 510,120 L 480,105 L 460,80 Z'},
    // Africa
    {id: 'af', d: 'M 480,130 L 540,125 L 570,165 L 575,250 L 545,300 L 505,310 L 480,270 L 465,210 L 468,160 Z'},
    // Asia
    {id: 'as', d: 'M 560,45 L 760,40 L 790,80 L 770,150 L 720,180 L 640,175 L 580,155 L 548,115 L 548,75 Z'},
    // Australia
    {id: 'au', d: 'M 700,250 L 770,240 L 800,270 L 795,320 L 755,340 L 710,325 L 695,290 Z'},
  ];

  const toXY = (lat: number, lng: number) =>
    latLngToXY(lat, lng, width, height, padding);

  return (
    <svg
      width={width}
      height={height}
      style={{position: 'absolute', top: 0, left: 0}}
      viewBox={`0 0 ${width} ${height}`}
    >
      {/* Ocean */}
      <rect width={width} height={height} fill={oceanColor} />

      {/* Latitude grid lines */}
      {[-60, -30, 0, 30, 60].map((lat) => {
        const {y} = toXY(lat, 0);
        return (
          <line
            key={lat}
            x1={0} y1={y} x2={width} y2={y}
            stroke={borderColor}
            strokeWidth={0.3}
            strokeOpacity={0.4}
          />
        );
      })}
      {/* Longitude grid lines */}
      {[-120, -60, 0, 60, 120].map((lng) => {
        const {x} = toXY(0, lng);
        return (
          <line
            key={lng}
            x1={x} y1={0} x2={x} y2={height}
            stroke={borderColor}
            strokeWidth={0.3}
            strokeOpacity={0.4}
          />
        );
      })}

      {/* Continents — scale from 1920×1080 viewBox */}
      <g transform={`scale(${width / 1000}, ${height / 500})`}>
        {continents.map((c) => (
          <path
            key={c.id}
            d={c.d}
            fill={landColor}
            stroke={borderColor}
            strokeWidth={borderWidth}
          />
        ))}
      </g>

      {/* Overlay children (paths, dots, labels) */}
      {children}
    </svg>
  );
};
