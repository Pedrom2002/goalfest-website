"use client";

import { useEffect, useRef } from "react";
import { getEnv } from "@/lib/env";

const { NEXT_PUBLIC_VIDEO_HERO } = getEnv();

export default function ConfirmadoVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !NEXT_PUBLIC_VIDEO_HERO) return;
    video.src = NEXT_PUBLIC_VIDEO_HERO;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const play = () => void video.play()?.catch(() => undefined);
    if (!mq.matches) play();
    const onMotion = (e: MediaQueryListEvent) => {
      if (e.matches) { video.pause(); video.currentTime = 0; } else play();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") video.pause();
      else if (!mq.matches) play();
    };
    mq.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mq.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        className="absolute inset-0 w-full h-full object-cover"
        aria-hidden="true"
      />
    </div>
  );
}
