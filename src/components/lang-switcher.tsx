"use client";

import { useSyncExternalStore } from "react";
import { useT, type Lang } from "@/lib/i18n";

const subscribe = () => () => {};

export default function LangSwitcher() {
  const { lang, setLang } = useT();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <div
      role="group"
      aria-label="Language"
      className="relative flex items-center rounded-full p-0.5 text-xs font-semibold tracking-widest uppercase select-none"
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
    >
      {mounted && (
        <span
          aria-hidden="true"
          className="absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-full transition-all duration-200"
          style={{
            background: "rgba(34,197,94,0.85)",
            left: lang === "pt" ? "2px" : "calc(50%)",
          }}
        />
      )}
      {(["pt", "en"] as Lang[]).map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLang(code)}
          aria-pressed={mounted ? lang === code : false}
          aria-label={code === "pt" ? "PortuguÃªs" : "English"}
          className="relative z-10 px-3 py-1 rounded-full transition-colors duration-200"
          style={{ color: mounted && lang === code ? "#fff" : "rgba(255,255,255,0.45)" }}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
