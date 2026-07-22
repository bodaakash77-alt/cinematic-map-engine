/** Convert seconds → frames */
export const s = (seconds: number, fps = 30): number =>
  Math.round(seconds * fps);

/** Convert frames → seconds */
export const framesToSeconds = (frames: number, fps: number): number =>
  frames / fps;

/** Convert milliseconds → frames */
export const ms = (milliseconds: number, fps = 30): number =>
  Math.round((milliseconds / 1000) * fps);

/** Get normalised progress [0, 1] within a window */
export const progress = (
  frame: number,
  start: number,
  duration: number,
): number => {
  if (frame <= start) return 0;
  if (frame >= start + duration) return 1;
  return (frame - start) / duration;
};

/** Is the current frame within [start, start + duration)? */
export const isActive = (frame: number, start: number, duration: number): boolean =>
  frame >= start && frame < start + duration;

/** Get local frame within a sequence (frame relative to its start) */
export const localFrame = (frame: number, from: number): number =>
  Math.max(0, frame - from);

/** Stagger offset — useful for animating lists */
export const stagger = (index: number, delay: number): number => index * delay;
