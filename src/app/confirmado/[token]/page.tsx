import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateQrDataUrl } from "@/lib/qr";
import { verifyQrToken } from "@/lib/qr-token";
import ConfirmadoActions from "@/components/confirmado-actions";
import ConfirmadoVideo from "@/components/confirmado-video";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false, nocache: true, noarchive: true },
};

export default async function ConfirmadoPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token: rawToken } = await params;

  const verified = await verifyQrToken(rawToken);
  if (!verified.ok) notFound();

  const admin = supabaseAdmin();
  const { data: guest } = await admin
    .from("guests")
    .select("name,token,companion_count,companion_names")
    .eq("token", verified.uuid)
    .maybeSingle();

  if (!guest) notFound();

  const qr = await generateQrDataUrl(rawToken);

  return (
    <main className="relative h-dvh overflow-hidden bg-bg-primary flex flex-col items-center justify-start">
      <ConfirmadoVideo />
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(13,26,13,0.70) 100%)" }} />

      {/* Logo */}
      <div className="relative z-10 flex justify-center pt-3 pb-1 shrink-0">
        <Image
          src="/goalfest-main-logo.webp"
          alt="Goalfest Lisboa 2026"
          width={240}
          height={240}
          className="w-40 sm:w-48 h-auto object-contain drop-shadow-2xl"
          priority
        />
      </div>

      {/* Card */}
      <div className="relative z-10 flex justify-center px-4 pb-4 w-full">
        <div className="w-full max-w-[320px] rounded-2xl border border-white/10 px-5 py-4 text-center"
          style={{ background: "rgba(20,50,20,0.40)", backdropFilter: "blur(24px)" }}>

          <h1 className="text-2xl font-black uppercase tracking-widest text-white leading-none" style={{ fontFamily: "var(--font-bebas, sans-serif)" }}>
            Tás <span style={{ color: "#5ea63b" }}>dentro</span>
          </h1>
          <p className="text-[11px] text-white/55 mt-1 mb-3 leading-snug">
            Olá <span className="text-white/85">{guest.name}</span>. Mostra este QR à entrada do Golden Circle.
          </p>

          {/* QR */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qr}
            alt="QR de entrada"
            className="mx-auto w-44 h-44 rounded-lg p-1.5 bg-white shadow-xl"
          />

          {guest.companion_count > 0 && (
            <p className="text-[11px] text-white/45 mt-2">
              + {guest.companion_names.join(", ")}
            </p>
          )}

          <ConfirmadoActions qrDataUrl={qr} token={rawToken} name={guest.name} />

          <p className="text-[9px] text-white/30 mt-3 tracking-widest uppercase">
            Vale do Silêncio · Lisboa · 11 Jun – 19 Jul
          </p>
        </div>
      </div>
    </main>
  );
}
