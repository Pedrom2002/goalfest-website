const NEXT_PUBLIC_VIDEO_HERO =
  process.env.NEXT_PUBLIC_VIDEO_HERO ?? "";

export function getEnv() {
  return { NEXT_PUBLIC_VIDEO_HERO };
}
