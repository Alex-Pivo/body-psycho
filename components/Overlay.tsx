"use client";

import type { CSSProperties } from "react";
import { SECTIONS } from "@/data/sections";
import { LOCALES, LOCALE_NAMES, isLocale } from "@/i18n/config";
import { useBodyStore } from "@/store/useBodyStore";
import { useI18n } from "./LocaleProvider";

export function Overlay() {
  const activeIndex = useBodyStore((s) => s.activeIndex);
  const mode = useBodyStore((s) => s.mode);
  const setMode = useBodyStore((s) => s.setMode);
  const { locale, setLocale, messages } = useI18n();
  const { ui } = messages;

  return (
    <>
      <header className="topbar">
        <span className="brand">{ui.brand}</span>

        <div className="controls">
          <div className="switch" role="group" aria-label={ui.modeLabel}>
            <button
              type="button"
              aria-pressed={mode === "organs"}
              onClick={() => setMode("organs")}
            >
              {ui.organs}
            </button>
            <button
              type="button"
              aria-pressed={mode === "psyche"}
              onClick={() => setMode("psyche")}
            >
              {ui.psyche}
            </button>
          </div>

          <label className="lang">
            <span className="sr-only">{ui.languageLabel}</span>
            <select
              value={locale}
              onChange={(e) => {
                const next = e.target.value;
                if (isLocale(next)) setLocale(next);
              }}
            >
              {LOCALES.map((l) => (
                <option key={l} value={l}>
                  {LOCALE_NAMES[l]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <div className="overlay">
        {SECTIONS.map((s, i) => {
          const isActive = i === activeIndex;
          const side = i % 2 === 0 ? "left" : "right";
          const accent = mode === "psyche" ? s.psyche?.color : s.organ?.color;
          const tx = messages.sections[s.id];

          let heading = tx.title ?? "";
          let body = tx.text ?? "";
          let kicker: string | undefined;
          if (s.kind === "organ" && tx.organ && tx.psyche) {
            heading = mode === "psyche" ? tx.psyche.emotion : tx.organ.name;
            body = mode === "psyche" ? tx.psyche.text : tx.organ.fact;
            kicker = mode === "psyche" ? tx.organ.name : tx.psyche.emotion;
          }

          return (
            <section
              key={s.id}
              className={`panel ${side}`}
              style={{ "--accent": accent ?? "#9db7ff" } as CSSProperties}
            >
              <div className={`card ${isActive ? "is-active" : ""}`}>
                {kicker && <p className="kicker">{kicker}</p>}
                <h2>{heading}</h2>
                <p>{body}</p>
                {s.kind === "intro" && <p className="hint">{ui.scrollHint}</p>}
              </div>
            </section>
          );
        })}
      </div>

      <nav className="rail" aria-hidden="true">
        {SECTIONS.map((s, i) => (
          <i key={s.id} className={i === activeIndex ? "on" : ""} />
        ))}
      </nav>
    </>
  );
}
