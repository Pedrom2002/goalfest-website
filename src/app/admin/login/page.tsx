"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Mode = "password" | "magic";

const VIDEO_SRC = process.env.NEXT_PUBLIC_VIDEO_HERO ?? "/hero.mp4";

export default function AdminLoginPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<Mode>("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const canSubmit = status !== "sending";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.src = VIDEO_SRC;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches) void video.play()?.catch(() => undefined);
    const onMotion = (e: MediaQueryListEvent) => {
      if (e.matches) { video.pause(); video.currentTime = 0; }
      else void video.play()?.catch(() => undefined);
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") video.pause();
      else if (!mq.matches) void video.play()?.catch(() => undefined);
    };
    mq.addEventListener("change", onMotion);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mq.removeEventListener("change", onMotion);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    if (mode === "password") {
      const res = await fetch("/api/admin/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      /* v8 ignore next */
      }).catch(() => null);
      const json = (await res?.json().catch(() => ({}))) as { error?: string } | null;
      if (!res?.ok) {
        setStatus("error");
        setMessage(json?.error ?? "Erro de rede.");
        return;
      }
      router.push("/admin");
      router.refresh();
      return;
    }

    const res = await fetch("/api/admin/sign-in/otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
      }),
    /* v8 ignore next */
    }).catch(() => null);
    const json = (await res?.json().catch(() => ({}))) as { error?: string } | null;
    if (!res?.ok) {
      setStatus("error");
      setMessage(json?.error ?? "Erro a enviar magic link.");
      return;
    }
    setStatus("sent");
    setMessage("Se o email existir, recebes um link em breve.");
  }

  return (
    <main className="relative min-h-dvh flex items-center justify-center p-6 overflow-hidden">
      {/* Video background */}
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
      {/* Overlays - identical to Hero */}
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.15) 50%, rgba(13,26,13,0.85) 100%)" }} />
      <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.28) 100%)" }} />

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md text-text-primary p-8 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/goalfest-main-logo.webp"
            alt="Goalfest"
            width={160}
            height={160}
            className="object-contain w-32 h-auto"
          />
          <p className="text-xs tracking-[.22em] uppercase text-[#FFD700] mt-1">painel de gestão</p>
        </div>

        <div className="flex gap-1 rounded-full border border-white/20 p-1 mb-5 text-xs">
          <button
            type="button"
            onClick={() => setMode("magic")}
            className={`flex-1 px-3 py-2 rounded-full tracking-[.14em] uppercase font-bold transition ${
              mode === "magic" ? "bg-[#FFD700] text-bg-primary" : "opacity-60 hover:opacity-100"
            }`}
          >
            Magic Link
          </button>
          <button
            type="button"
            onClick={() => setMode("password")}
            className={`flex-1 px-3 py-2 rounded-full tracking-[.14em] uppercase font-bold transition ${
              mode === "password" ? "bg-[#FFD700] text-bg-primary" : "opacity-60 hover:opacity-100"
            }`}
          >
            Password
          </button>
        </div>

        <label className="block text-xs font-bold tracking-[.1em] uppercase mb-1 opacity-70">Email</label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border-b border-white/30 bg-transparent py-2 text-base outline-none focus:border-[#FFD700] mb-4 transition-colors placeholder:opacity-30"
          placeholder="tu@goalfest.pt"
        />

        {mode === "password" && (
          <>
            <label className="block text-xs font-bold tracking-[.1em] uppercase mb-1 opacity-70">Password</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-white/30 bg-transparent py-2 text-base outline-none focus:border-[#FFD700] mb-4 transition-colors placeholder:opacity-30"
              placeholder="••••••••"
            />
          </>
        )}

        <button
          disabled={status === "sending" || !canSubmit}
          className="mt-2 w-full rounded-full bg-[#FFD700] text-bg-primary px-4 py-3 font-black tracking-[.14em] uppercase disabled:opacity-50 hover:brightness-110 transition-all"
        >
          {status === "sending"
            ? "A ENTRAR…"
            : mode === "password"
              ? "ENTRAR"
              : "ENVIAR MAGIC LINK"}
        </button>

        {message && (
          <p className={`mt-3 text-sm text-center ${status === "error" ? "text-red-400" : "text-green-400"}`}>
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
