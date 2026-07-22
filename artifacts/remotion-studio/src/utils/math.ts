/** Linear interpolation */
export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

/** Clamp value between min and max */
export const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, value));

/** Normalize value to [0, 1] */
export const normalize = (value: number, min: number, max: number): number =>
  (value - min) / (max - min);

/** Map value from one range to another */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
): number => outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);

/** Degrees → radians */
export const toRad = (deg: number): number => (deg * Math.PI) / 180;

/** Radians → degrees */
export const toDeg = (rad: number): number => (rad * 180) / Math.PI;

/** Smooth step (3-edge version, differs from easing.ts smoothstep which takes t∈[0,1]) */
export const smoothstepRange = (edge0: number, edge1: number, x: number): number => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};

/** Euclidean distance */
export const distance = (
  x1: number, y1: number, x2: number, y2: number,
): number => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

/** Wrap value within [min, max] range */
export const wrap = (value: number, min: number, max: number): number => {
  const range = max - min;
  return ((((value - min) % range) + range) % range) + min;
};

/** Round to N decimal places */
export const roundTo = (value: number, decimals: number): number =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

/** Random between min and max (seeded by frame for determinism) */
export const pseudoRandom = (seed: number): number => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

// ─── 2D / 3D Vector Types ─────────────────────────────────────────────────────
export interface Vec2 {
  x: number;
  y: number;
}
export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export const lerpVec2 = (a: Vec2, b: Vec2, t: number): Vec2 => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
});

export const lerpVec3 = (a: Vec3, b: Vec3, t: number): Vec3 => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
  z: lerp(a.z, b.z, t),
});

export const project3D = (
  vec: Vec3,
  fov: number,
  width: number,
  height: number,
): Vec2 => {
  const z = vec.z + fov;
  const scale = fov / z;
  return {
    x: width / 2 + vec.x * scale,
    y: height / 2 + vec.y * scale,
  };
};
