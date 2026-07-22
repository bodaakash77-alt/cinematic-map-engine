import {useCurrentFrame, useVideoConfig} from 'remotion';
import {anim} from '../animations/keyframe';
import type {EasingFunction} from '../utils/easing';

export interface CameraState {
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

/**
 * useCamera — stateless camera helper.
 * Returns CSS transform string and individual values.
 */
export function useCamera(state: Partial<CameraState> = {}) {
  const {x = 0, y = 0, scale = 1, rotation = 0} = state;

  const transform = [
    `translate(${x}px, ${y}px)`,
    `scale(${scale})`,
    `rotate(${rotation}deg)`,
  ].join(' ');

  return {transform, x, y, scale, rotation};
}

/**
 * useCameraAnimation — animates camera state over time.
 */
export function useCameraAnimation(keyframes: {
  frame: number;
  state: Partial<CameraState>;
  ease?: EasingFunction;
}[]) {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();

  const sorted = [...keyframes].sort((a, b) => a.frame - b.frame);
  const first = sorted[0]?.state ?? {};
  const last = sorted[sorted.length - 1]?.state ?? {};

  const animVal = (key: keyof CameraState, defaultVal: number) => {
    const vals = sorted.map((k) => ({
      frame: k.frame,
      value: (k.state[key] as number) ?? defaultVal,
      easing: k.ease,
    }));
    if (vals.length === 0) return defaultVal;
    if (frame <= vals[0].frame) return vals[0].value;
    if (frame >= vals[vals.length - 1].frame) return vals[vals.length - 1].value;
    for (let i = 0; i < vals.length - 1; i++) {
      const a = vals[i];
      const b = vals[i + 1];
      if (frame >= a.frame && frame <= b.frame) {
        return anim(frame, a.value, b.value, a.frame, b.frame, b.easing);
      }
    }
    return defaultVal;
  };

  const x = animVal('x', 0);
  const y = animVal('y', 0);
  const scale = animVal('scale', 1);
  const rotation = animVal('rotation', 0);

  return {
    x, y, scale, rotation,
    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale}) rotate(${rotation}deg)`,
    originX: width / 2,
    originY: height / 2,
  };
}
