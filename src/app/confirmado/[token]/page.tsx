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
    <main className="relative min-h-dvh overflow-hidden bg-bg-primary">
      <ConfirmadoVideo />
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.40) 0%, rgba(13,26,13,0.70) 100%)" }} />

      {/* Logo - full width header */}
      <div className="relative z-10 flex justify-center pt-8 pb-2">
        <Image
          src="/goalfest-main-logo.webp"
          alt="Goalfest Lisboa 2026"
          width={320}
          height={320}
          className="w-64 sm:w-72 h-auto object-contain drop-shadow-2xl"
          priority
        />
      </div>

      {/* Card */}
      <div className="relative z-10 flex justify-center px-4 pb-10">
        <div className="w-full max-w-[340px] rounded-2xl border border-white/10 p-6 text-center"
          style={{ background: "rgba(20,50,20,0.40)", backdropFilter: "blur(24px)" }}>

          <h1 className="text-3xl font-black uppercase tracking-widest text-white" style={{ fontFamily: "var(--font-bebas, sans-serif)" }}>
            Tás <span style={{ color: "#5ea63b" }}>dentro</span>
          </h1>
          <p className="text-xs text-white/55 mt-1 mb-5 leading-snug">
            Olá <span className="text-white/85">{guest.name}</span>. Mostra este QR à entrada do Golden Circle.
          </p>

          {/* QR */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qr}
            alt="QR de entrada"
            className="mx-auto w-56 h-56 rounded-xl p-2 bg-white shadow-xl"
          />

          {guest.companion_count > 0 && (
            <p className="text-xs text-white/45 mt-3">
              + {guest.companion_names.join(", ")}
            </p>
          )}

          <ConfirmadoActions qrDataUrl={qr} token={rawToken} name={guest.name} />

          <p className="text-[10px] text-white/30 mt-5 tracking-widest uppercase">
            Vale do Silêncio · Lisboa · 11 Jun – 19 Jul
          </p>
        </div>
      </div>
    </main>
  );
}
