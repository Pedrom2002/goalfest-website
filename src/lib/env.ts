const NEXT_PUBLIC_VIDEO_HERO =
  process.env.NEXT_PUBLIC_VIDEO_HERO ?? "";

const NEXT_PUBLIC_MODEL_VENUE =
  process.env.NEXT_PUBLIC_MODEL_VENUE ?? "/venue_optimized.glb";

const NEXT_PUBLIC_ENV_VENUE =
  process.env.NEXT_PUBLIC_ENV_VENUE ?? "";

export function getEnv() {
  return { NEXT_PUBLIC_VIDEO_HERO, NEXT_PUBLIC_MODEL_VENUE, NEXT_PUBLIC_ENV_VENUE };
}
