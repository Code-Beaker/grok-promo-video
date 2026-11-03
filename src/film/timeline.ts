export const SIZE = 1440;
export const DURATION = 22;
export const BPM = 129.83;
export const DROP = 4.2;
export const SIXTEENTH = 60 / BPM / 4;
export const FADE = 0.34;
export const INK = "#111214";
export const PAPER = "#F7F6F4";

export type Scene = { id: number; t0: number; t1: number; z0: number; z1: number };

export const SCENES: Scene[] = [
  { id: 1, t0: 0, t1: 2.5, z0: 1, z1: 1.04 },
  { id: 2, t0: 2.5, t1: 4.2, z0: 1.04, z1: 1.08 },
  { id: 3, t0: 4.2, t1: 5.9, z0: 1.08, z1: 1.12 },
  { id: 4, t0: 5.9, t1: 9.1, z0: 1.12, z1: 1.16 },
  { id: 5, t0: 9.1, t1: 12.72, z0: 1.16, z1: 1.2 },
  { id: 6, t0: 12.72, t1: 16.28, z0: 1.2, z1: 1.24 },
  { id: 7, t0: 16.28, t1: 22, z0: 1.24, z1: 1.28 },
];

export type Token = { t: number; text: string; emphasis?: boolean };

export const STYLES = [
  "Editorial",
  "Field note",
  "Nocturne",
  "Atlas",
  "Daylight",
  "Archive",
  "Studio",
  "Polaroid",
  "Blueprint",
  "Soft grain",
  "Coastal",
  "Ink",
] as const;

export const ANSWERS = [
  "They read the sky",
  "A map of wind and light",
  "By stars, quietly",
  "Along old magnetic lines",
  "The sun is a compass",
  "Memory, passed wing to wing",
  "Practice, then instinct",
  "Home is a direction",
  "A route written in light",
  "They remember the air",
  "The shoreline pulls",
  "Ask, and the path appears",
];

export const PROMPT = "How do birds find home";

export function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function smooth(t: number) {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

export function easeOut(t: number) {
  const x = clamp01(t);
  return 1 - (1 - x) ** 3;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function sceneAlpha(t: number, index: number) {
  const sc = SCENES[index];
  const fade = FADE;
  const inn =
    index === 0
      ? smooth(clamp01(t / fade))
      : smooth(clamp01((t - (sc.t0 - fade)) / fade));
  const out =
    index === SCENES.length - 1
      ? 1
      : 1 - smooth(clamp01((t - (sc.t1 - fade)) / fade));
  return inn * out;
}

export function zoomAt(t: number) {
  if (t <= 0) return SCENES[0].z0;
  for (const sc of SCENES) {
    if (t <= sc.t1) {
      const u = clamp01((t - sc.t0) / (sc.t1 - sc.t0));
      return lerp(sc.z0, sc.z1, u);
    }
  }
  return SCENES[SCENES.length - 1].z1;
}

export function sixteenthIndex(t: number) {
  return Math.floor((t - DROP) / SIXTEENTH + 1e-6);
}

export function cutTimes() {
  const times: number[] = [];
  const push = (t0: number, t1: number) => {
    let n = Math.ceil((t0 - DROP) / SIXTEENTH - 1e-6);
    for (;;) {
      const tt = DROP + n * SIXTEENTH;
      if (tt > t1 + 1e-6) break;
      if (tt >= t0 - 1e-6) times.push(Number(tt.toFixed(4)));
      n += 1;
    }
  };
  push(SCENES[1].t0, SCENES[1].t1);
  push(SCENES[2].t0, SCENES[2].t1);
  push(14.42, 15.85);
  return times;
}

export function letterAlpha(t: number, t0: number) {
  return smooth(clamp01((t - t0) / 0.3));
}

export function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}
