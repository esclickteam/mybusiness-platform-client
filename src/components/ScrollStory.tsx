"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "framer-motion";
import { getTextDirection } from "../i18n/localeUtils";
import "../styles/homeWow.css";

type FilmId = "crm" | "whatsapp" | "campaigns" | "automations" | "websites" | "appointments";

const BLOCKS: { id: FilmId; to: string; layout: string }[] = [
  { id: "crm", to: "/crm", layout: "split" },
  { id: "whatsapp", to: "/whatsapp-api", layout: "chat" },
  { id: "campaigns", to: "/meta-campaigns", layout: "wide" },
  { id: "automations", to: "/automations", layout: "flow" },
  { id: "websites", to: "/website-builder", layout: "devices" },
  { id: "appointments", to: "/appointments", layout: "calendar" },
];

const COPY: Record<FilmId, { title: string; body: string; cta: string; video: string }> = {
  crm: { title: "crmTitle", body: "crmBody", cta: "crmCta", video: "crmVideo" },
  whatsapp: { title: "waTitle", body: "waBody", cta: "waCta", video: "waVideo" },
  campaigns: { title: "adsTitle", body: "adsBody", cta: "adsCta", video: "adsVideo" },
  automations: { title: "autoTitle", body: "autoBody", cta: "autoCta", video: "autoVideo" },
  websites: { title: "webTitle", body: "webBody", cta: "webCta", video: "webVideo" },
  appointments: { title: "calTitle", body: "calBody", cta: "calCta", video: "calVideo" },
};

function ProductFilm({
  id,
  label,
  className,
  controls = true,
}: {
  id: FilmId;
  label: string;
  className?: string;
  controls?: boolean;
}) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(Boolean(reduce));
  const src = `/demo-media/home/${id}.mp4?v=3`;
  const poster = `/demo-media/home/${id}.jpg?v=3`;

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (reduce || paused) {
      node.pause();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void node.play().catch(() => undefined);
        else node.pause();
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [paused, reduce, src]);

  return (
    <div className={className || "home-show__screen"}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
      />
      {controls ? (
        <button
          type="button"
          className="home-show__toggle"
          onClick={() => setPaused((value) => !value)}
        >
          {paused || reduce ? t("home.showPlay") : t("home.showPause")}
        </button>
      ) : null}
    </div>
  );
}

export default function ScrollStory() {
  const { t, i18n } = useTranslation();

  return (
    <section className="home-show" dir={getTextDirection(i18n.language)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h2 className="home-show__title">{t("home.showTitle")}</h2>
        <p className="home-show__lead">{t("home.showLead")}</p>
        <div className="home-show__stack">
          {BLOCKS.map((block) => {
            const copy = COPY[block.id];
            return (
              <article key={block.id} className={`home-show__block home-show__block--${block.layout}`}>
                <div className="home-show__copy" dir={getTextDirection(i18n.language)}>
                  <h3>{t(`home.${copy.title}`)}</h3>
                  <p>{t(`home.${copy.body}`)}</p>
                  {block.id === "crm" ? (
                    <div className="home-show__facts">
                      <p>
                        <span>{t("home.crmStatus")}</span>
                        <strong>{t("home.crmStatusValue")}</strong>
                      </p>
                      <p>
                        <span>{t("home.crmTask")}</span>
                        <strong>{t("home.crmTaskValue")}</strong>
                      </p>
                    </div>
                  ) : null}
                  {block.id === "campaigns" ? (
                    <div className="home-show__marks" aria-hidden="true">
                      <img src="/meta.svg" alt="" width="28" height="28" />
                      <svg viewBox="0 0 24 24" width="28" height="28">
                        <path fill="#1877F2" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06z" />
                      </svg>
                      <svg viewBox="0 0 24 24" width="28" height="28">
                        <defs>
                          <radialGradient id="home-ig" cx="30%" cy="110%" r="120%">
                            <stop offset="0%" stopColor="#feda75" />
                            <stop offset="45%" stopColor="#d62976" />
                            <stop offset="100%" stopColor="#4f5bd5" />
                          </radialGradient>
                        </defs>
                        <rect width="24" height="24" rx="6" fill="url(#home-ig)" />
                        <circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" strokeWidth="1.6" />
                        <circle cx="17.2" cy="6.8" r="1" fill="#fff" />
                      </svg>
                    </div>
                  ) : null}
                  <Link to={block.to}>{t(`home.${copy.cta}`)}</Link>
                </div>
                {block.layout === "devices" ? (
                  <div className="home-show__devices">
                    <ProductFilm id={block.id} label={t(`home.${copy.video}`)} className="home-show__desktop" />
                    <ProductFilm id={block.id} label={t(`home.${copy.video}`)} className="home-show__phone" controls={false} />
                  </div>
                ) : (
                  <ProductFilm id={block.id} label={t(`home.${copy.video}`)} />
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
