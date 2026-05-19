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

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-6">
        {/* Logo */}
        <Image
          src="/goalfest-main-logo.webp"
          alt="Goalfest Lisboa 2026"
          width={200}
          height={200}
          className="w-56 sm:w-64 h-auto object-contain drop-shadow-2xl"
          priority
        />

        {/* Card */}
        <div className="w-full rounded-2xl border border-white/10 p-6 text-center"
          style={{ background: "rgba(22,50,22,0.80)", backdropFilter: "blur(16px)" }}>

          {/* Check */}
          <div className="mx-auto mb-4 w-14 h-14 rounded-full flex items-center justify-center text-bg-primary font-black text-2xl"
            style={{ background: "#5ea63b" }}>
            ✓
          </div>

          <h1 className="text-2xl font-black uppercase tracking-wide text-text-primary" style={{ fontFamily: "var(--font-oswald, sans-serif)" }}>
            Tás <em className="text-[#5ea63b] not-italic">dentro</em>.
          </h1>
          <p className="text-sm text-white/60 mt-1 mb-5">
            Olá {guest.name}. Mostra este QR à entrada.
          </p>

          {/* QR */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qr}
            alt="QR de entrada"
            className="mx-auto w-56 h-56 rounded-xl p-2 bg-white"
          />

          {guest.companion_count > 0 && (
            <p className="text-xs text-white/50 mt-3">
              Acompanhante: {guest.companion_names.join(", ")}
            </p>
          )}

          <ConfirmadoActions qrDataUrl={qr} token={rawToken} name={guest.name} />
        </div>

        <p className="text-xs text-white/30 text-center tracking-widest uppercase">
          Vale do Silêncio · Lisboa · 11 Jun – 19 Jul
        </p>
      </div>
    </main>
  );
}
