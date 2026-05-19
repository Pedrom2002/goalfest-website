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
    <main className="relative min-h-dvh flex items-center justify-center p-4 overflow-hidden bg-bg-primary">
      <ConfirmadoVideo />
      <div className="absolute inset-0 z-0" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(13,26,13,0.75) 100%)" }} />

      <div className="relative z-10 w-full max-w-xs flex flex-col items-center">
        {/* Logo overlapping card top */}
        <Image
          src="/goalfest-main-logo.webp"
          alt="Goalfest Lisboa 2026"
          width={280}
          height={280}
          className="relative z-10 w-52 h-auto object-contain drop-shadow-2xl mb-[-64px]"
          priority
        />

        {/* Card */}
        <div className="w-full rounded-3xl border border-white/10 pt-20 pb-7 px-7 text-center"
          style={{ background: "rgba(10,30,10,0.85)", backdropFilter: "blur(20px)" }}>

          {/* Check badge */}
          <div className="mx-auto mb-3 w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-lg border border-[#5ea63b]/50"
            style={{ background: "rgba(94,166,59,0.15)" }}>
            <span style={{ color: "#5ea63b" }}>✓</span>
          </div>

          <h1 className="text-3xl font-black uppercase tracking-widest text-white" style={{ fontFamily: "var(--font-bebas, sans-serif)" }}>
            Tás <span style={{ color: "#5ea63b" }}>dentro</span>
          </h1>
          <p className="text-xs text-white/50 mt-1 mb-6 tracking-wide">
            Olá <span className="text-white/80">{guest.name}</span>. Mostra este QR à entrada do Golden Circle.
          </p>

          {/* QR */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qr}
            alt="QR de entrada"
            className="mx-auto w-64 h-64 rounded-2xl p-3 bg-white shadow-lg"
          />

          {guest.companion_count > 0 && (
            <p className="text-xs text-white/40 mt-4">
              + {guest.companion_names.join(", ")}
            </p>
          )}

          <ConfirmadoActions qrDataUrl={qr} token={rawToken} name={guest.name} />

          <p className="text-[10px] text-white/25 mt-5 tracking-widest uppercase">
            Vale do Silêncio · Lisboa · 11 Jun – 19 Jul
          </p>
        </div>
      </div>
    </main>
  );
}
