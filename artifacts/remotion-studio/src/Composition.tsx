import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate} from 'remotion';
import {z} from 'zod';

export const myCompSchema = z.object({
  titleText: z.string(),
  titleColor: z.string(),
  logoColor: z.string(),
});

export const MyComposition: React.FC<z.infer<typeof myCompSchema>> = ({
  titleText,
  titleColor,
  logoColor,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, 20], [0.8, 1], {
    extrapolateRight: 'clamp',
  });

  const slideUp = interpolate(frame, [0, 20], [30, 0], {
    extrapolateRight: 'clamp',
  });

  const progress = frame / durationInFrames;
  const barWidth = interpolate(progress, [0, 1], [0, 100]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: logoColor,
          boxShadow: `0 0 60px ${logoColor}88`,
        }}
      />

      {/* Title */}
      <div
        style={{
          opacity,
          transform: `translateY(${slideUp}px)`,
          fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
          fontSize: 64,
          fontWeight: 700,
          color: titleColor,
          letterSpacing: -2,
          textAlign: 'center',
          maxWidth: 1200,
        }}
      >
        {titleText}
      </div>

      {/* Progress bar */}
      <div
        style={{
          opacity,
          width: 400,
          height: 4,
          backgroundColor: '#e5e7eb',
          borderRadius: 2,
          overflow: 'hidden',
          marginTop: 16,
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: '100%',
            backgroundColor: logoColor,
            borderRadius: 2,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
