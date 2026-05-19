"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { rsvpSchema, type RsvpInput } from "@/lib/validators";
import Turnstile from "@/components/turnstile";
import { useT } from "@/lib/i18n";
import LangSwitcher from "@/components/lang-switcher";

const SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Props = { inviteCode?: string };

export default function RsvpForm({ inviteCode }: Props = {}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverInfo, setServerInfo] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const prefersReduced = useReducedMotion();
  const captchaRequired = !!SITEKEY;
  const { t } = useT();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RsvpInput>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      acompanhante: undefined,
      companion_nome: "",
      companion_tel: "",
      companion_email: "",
    },
    mode: "onBlur",
  });

  const acompanhante = watch("acompanhante");
  const bringsCompanion = acompanhante === "sim";

  async function onSubmit(values: RsvpInput) {
    setServerError(null);
    setServerInfo(null);
    if (captchaRequired && !captchaToken) {
      setServerError(t("rsvp.error.captcha"));
      return;
    }
    try {
      const payload: Record<string, unknown> = { ...values };
      if (inviteCode) payload.inviteCode = inviteCode;
      if (captchaToken) payload.captchaToken = captchaToken;
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setServerError(json?.error ?? t("rsvp.error.generic"));
        return;
      }
      if (json?.token) {
        router.push(`/confirmado/${json.token}`);
        return;
      }
      setServerInfo(t("rsvp.info.received"));
    } catch {
      setServerError(t("rsvp.error.network"));
    }
  }

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: prefersReduced ? 0 : 0.08 } },
  };
  const item = {
    hidden: prefersReduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.5, ease: [0.2, 0.7, 0.3, 1] as const },
    },
  };

  const inputClass =
    "w-full bg-black/30 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-green-400 transition-colors text-sm backdrop-blur-sm";
  const labelClass = "block text-white/60 text-xs uppercase tracking-widest mb-1.5";
  const errorClass = "text-red-400 text-xs mt-1";

  return (
    <motion.form
      className="rounded-2xl p-6 space-y-4 ml-auto"
      style={{ background: "rgba(30,55,30,0.72)", backdropFilter: "blur(16px)", border: "1px solid rgba(94,166,59,0.35)" }}
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10%" }}
    >
      <div className="flex justify-end -mt-2 -mr-2 mb-1">
        <LangSwitcher />
      </div>

      <motion.div variants={item}>
        <h2 className="text-white text-xl font-bold uppercase tracking-wide" style={{ fontFamily: "var(--font-oswald, sans-serif)" }}>
          {t("rsvp.title.before")}<em className="text-green-400 not-italic">{t("rsvp.title.em")}</em>{t("rsvp.title.after")}
        </h2>
        <p className="text-white/50 text-sm mt-1">{t("rsvp.subtitle")}</p>
      </motion.div>

      <motion.div variants={item}>
        <label htmlFor="nome" className={labelClass}>
          {t("rsvp.name")} <span className="text-green-400">*</span>
        </label>
        <input id="nome" type="text" autoComplete="name" autoCapitalize="words" className={inputClass} {...register("name")} />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </motion.div>

      <motion.div variants={item}>
        <label htmlFor="tel" className={labelClass}>
          {t("rsvp.phone")} <span className="text-green-400">*</span>
        </label>
        <input id="tel" type="tel" inputMode="tel" autoComplete="tel" placeholder="9XXXXXXXX" className={inputClass} {...register("phone")} />
        {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
      </motion.div>

      <motion.div variants={item}>
        <label htmlFor="email" className={labelClass}>
          {t("rsvp.email")} <span className="text-green-400">*</span>
        </label>
        <input id="email" type="email" inputMode="email" autoComplete="email" autoCapitalize="off" placeholder={t("rsvp.email.placeholder")} className={inputClass} {...register("email")} />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </motion.div>

      <motion.fieldset variants={item}>
        <legend className={labelClass}>
          {t("rsvp.companion.q")} <span className="text-green-400">*</span>
        </legend>
        <div className="flex gap-3 mt-1" role="radiogroup">
          <label className="flex-1 cursor-pointer">
            <input type="radio" value="sim" className="sr-only peer" {...register("acompanhante")} />
            <span className="block text-center py-2.5 rounded-lg border border-white/15 text-white/60 text-sm font-medium transition-all peer-checked:border-green-400 peer-checked:text-green-400 peer-checked:bg-green-400/10 hover:border-white/30">
              {t("rsvp.yes")}
            </span>
          </label>
          <label className="flex-1 cursor-pointer">
            <input type="radio" value="nao" className="sr-only peer" {...register("acompanhante")} />
            <span className="block text-center py-2.5 rounded-lg border border-white/15 text-white/60 text-sm font-medium transition-all peer-checked:border-green-400 peer-checked:text-green-400 peer-checked:bg-green-400/10 hover:border-white/30">
              {t("rsvp.no")}
            </span>
          </label>
        </div>
        {errors.acompanhante && <p className={errorClass}>{errors.acompanhante.message}</p>}
      </motion.fieldset>

      <div
        className={`space-y-4 overflow-hidden transition-all duration-300 ${bringsCompanion ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
        inert={!bringsCompanion}
      >
        <div>
          <label htmlFor="c-nome" className={labelClass}>
            {t("rsvp.companion.name")} <span className="text-green-400">*</span>
          </label>
          <input id="c-nome" type="text" autoCapitalize="words" tabIndex={bringsCompanion ? 0 : -1} className={inputClass} {...register("companion_nome")} />
          {errors.companion_nome && <p className={errorClass}>{errors.companion_nome.message}</p>}
        </div>
        <div>
          <label htmlFor="c-tel" className={labelClass}>
            {t("rsvp.companion.phone")} <span className="text-green-400">*</span>
          </label>
          <input id="c-tel" type="tel" inputMode="tel" placeholder="9XXXXXXXX" tabIndex={bringsCompanion ? 0 : -1} className={inputClass} {...register("companion_tel")} />
          {errors.companion_tel && <p className={errorClass}>{errors.companion_tel.message}</p>}
        </div>
        <div>
          <label htmlFor="c-email" className={labelClass}>
            {t("rsvp.companion.email")} <span className="text-green-400">*</span>
          </label>
          <input id="c-email" type="email" inputMode="email" autoCapitalize="off" placeholder={t("rsvp.email.placeholder")} tabIndex={bringsCompanion ? 0 : -1} className={inputClass} {...register("companion_email")} />
          {errors.companion_email && <p className={errorClass}>{errors.companion_email.message}</p>}
        </div>
      </div>

      {captchaRequired && (
        <motion.div variants={item} className="mt-3">
          <Turnstile sitekey={SITEKEY} theme="dark" onToken={setCaptchaToken} />
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting || (captchaRequired && !captchaToken)}
        aria-busy={isSubmitting}
        variants={item}
        className="w-full py-3.5 rounded-lg font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        style={{ background: isSubmitting ? "rgba(94,166,59,0.5)" : "#5ea63b", color: "#0d1a0d" }}
      >
        <span>{isSubmitting ? t("rsvp.submitting") : t("rsvp.submit")}</span>
        {isSubmitting ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" className="w-4 h-4 animate-spin" aria-hidden="true">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
            <path d="M5 12h14" /><path d="M13 6l6 6-6 6" />
          </svg>
        )}
      </motion.button>

      {serverError && (
        <div className="px-4 py-3 rounded-xl border border-red-500/40 text-red-300 text-sm" style={{ background: "rgba(200,16,46,0.15)" }} role="alert">
          {serverError}
        </div>
      )}
      {serverInfo && (
        <div className="px-4 py-3 rounded-xl border border-green-500/40 text-green-300 text-sm" style={{ background: "rgba(94,166,59,0.15)" }} role="status">
          {serverInfo}
        </div>
      )}

      <motion.p className="text-white/30 text-xs leading-relaxed" variants={item}>
        {t("rsvp.fineprint")}
        <a href="/privacidade" style={{ color: "inherit", textDecoration: "underline" }}>/privacidade</a>.
      </motion.p>
    </motion.form>
  );
}
