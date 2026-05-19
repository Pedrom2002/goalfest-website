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

        <div className="flex-1 flex flex-col lg:flex-row items-start justify-center px-4 sm:px-6 lg:pl-[42px] lg:pr-12 pt-6 pb-10 gap-8 lg:gap-24 w-full max-w-[1200px] mx-auto">

          {/* Left: branding */}
          <div className="flex flex-col items-center justify-start pt-16 text-center lg:flex-1 gap-0">
            <Image
              src="/goalfest-logo.webp"
              alt="Goalfest Lisboa 2026"
              width={420}
              height={420}
              unoptimized
              className="w-64 sm:w-80 lg:w-[420px] h-auto object-contain drop-shadow-2xl mb-[-100px]"
              priority
            />

            <div className="flex flex-col items-center">
              <p className="text-white font-bold leading-tight" style={{ fontFamily: "var(--font-oswald, sans-serif)", fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", textShadow: "0 2px 24px rgba(0,0,0,0.7)" }}>
                MAIS DO QUE UMA <span className="text-green-400">FANZONE</span>
              </p>
              <p className="text-white/80 text-xs tracking-[0.2em] uppercase mt-1.5">
                Vale do Silêncio · Lisboa · 11 Jun – 19 Jul
              </p>
              <div className="flex flex-row items-center gap-2 mt-6">
                <span className="text-white/60 text-[10px] uppercase tracking-widest leading-none">powered by</span>
                <Image
                  src="/quicnation-logo.png"
                  alt="QUIC Nation"
                  width={80}
                  height={28}
                  style={{ width: "auto", height: "48px" }}
                  className="object-contain"
                />
              </div>
            </div>

            {label && (
              <div className="inline-block px-4 py-1.5 rounded-full border border-green-400/40 text-green-300 text-sm font-medium tracking-wide" style={{ background: "rgba(94,166,59,0.12)" }}>
                {t("invite.banner.for")} {label.charAt(0).toUpperCase() + label.slice(1)}
              </div>
            )}
          </div>

          {/* Right: form */}
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
            {!blocked && <RsvpForm inviteCode={code} />}
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
