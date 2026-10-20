/**
 * Scroll state shared between the smooth-scroll controller and the WebGL
 * scenes. It deliberately lives outside React so the render loop can read it
 * on every frame without triggering a single re-render.
 */
export const scrollStore = {
  /** Whole-page progress, 0 → 1. */
  progress: 0,
  /** Progress through the hero band, 0 → 1. */
  hero: 0,
  /** Raw scroll offset in pixels. */
  y: 0,
};

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
