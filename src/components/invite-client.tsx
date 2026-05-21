"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import RsvpForm from "@/components/rsvp-form";
import { I18nProvider, useT } from "@/lib/i18n";
import { getEnv } from "@/lib/env";

const { NEXT_PUBLIC_VIDEO_HERO } = getEnv();

type Props = {
  code: string;
  label: string | null;
  expired: boolean;
  exhausted: boolean;
};

function VideoBackground() {
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
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.50)" }} />
    </div>
  );
}

function InviteInner({ code, label, expired, exhausted }: Props) {
  const [mounted, setMounted] = useState(false);
  const { t } = useT();

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const blocked = expired || exhausted;

  return (
    <div className={`relative min-h-screen flex flex-col${mounted ? "" : " opacity-0"}`} style={{ transition: "opacity 0.3s ease" }}>
      <VideoBackground />

      <div className="relative z-10 flex-1 flex flex-col">
        {/* Mobile: logo + form stacked. Desktop: branding left, form right */}
        <div className="flex-1 flex flex-col lg:flex-row lg:items-center lg:justify-center w-full max-w-[1100px] mx-auto px-4 sm:px-6 pt-8 pb-10 gap-6 lg:gap-20">

          {/* Branding */}
          <div className="flex flex-col items-center text-center lg:flex-1 lg:justify-center">
            <Image
              src="/goalfest-logo.webp"
              alt="Goalfest Lisboa 2026"
              width={320}
              height={320}
              unoptimized
              className="w-40 sm:w-56 lg:w-80 h-auto object-contain drop-shadow-2xl"
              priority
            />
            <p className="text-white font-bold leading-tight mt-2 lg:mt-4" style={{ fontFamily: "var(--font-oswald, sans-serif)", fontSize: "clamp(1.1rem, 3vw, 2rem)", textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}>
              MAIS DO QUE UMA <span className="text-green-400">FANZONE</span>
            </p>
            <p className="text-white/70 text-xs tracking-[0.2em] uppercase mt-1">
              Vale do Silêncio · Lisboa · 11 Jun – 19 Jul
            </p>
            <div className="hidden lg:flex flex-row items-center gap-2 mt-6">
              <span className="text-white/60 text-[10px] uppercase tracking-widest leading-none">powered by</span>
              <Image
                src="/quicnation-logo.png"
                alt="QUIC Nation"
                width={80}
                height={28}
                style={{ width: "auto", height: "40px" }}
                className="object-contain"
              />
            </div>
          </div>

          {/* Form */}
          <div className="w-full lg:w-[420px] lg:flex-shrink-0">
            {expired && (
              <div className="mb-4 px-4 py-3 rounded-xl border border-red-500/40 text-red-300 text-sm" style={{ background: "rgba(200,16,46,0.15)" }} role="alert">
                Este convite expirou. Contacta o organizador.
              </div>
            )}
            {exhausted && !expired && (
              <div className="mb-4 px-4 py-3 rounded-xl border border-red-500/40 text-red-300 text-sm" style={{ background: "rgba(200,16,46,0.15)" }} role="alert">
                Convite esgotado. Já não há convites neste link.
              </div>
            )}
            {!blocked && <RsvpForm inviteCode={code} label={label} />}
          </div>

          {/* powered by — mobile only, below form */}
          <div className="flex lg:hidden flex-row items-center justify-center gap-2 pb-2">
            <span className="text-white/50 text-[10px] uppercase tracking-widest leading-none">powered by</span>
            <Image
              src="/quicnation-logo.png"
              alt="QUIC Nation"
              width={60}
              height={20}
              style={{ width: "auto", height: "32px" }}
              className="object-contain"
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default function InviteClient(props: Props) {
  return (
    <I18nProvider>
      <InviteInner {...props} />
    </I18nProvider>
  );
}
