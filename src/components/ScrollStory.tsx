"use client";

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "framer-motion";
import { getTextDirection } from "../i18n/localeUtils";
import "../styles/homeWow.css";

type FilmId = "crm" | "whatsapp" | "campaigns" | "automations" | "websites" | "appointments";

const BLOCKS: { id: FilmId; to: string; layout: string; side: "copy-left" | "media-left" }[] = [
  { id: "crm", to: "/crm", layout: "split", side: "copy-left" },
  { id: "whatsapp", to: "/whatsapp-api", layout: "chat", side: "media-left" },
  { id: "campaigns", to: "/meta-campaigns", layout: "wide", side: "copy-left" },
  { id: "automations", to: "/automations", layout: "flow", side: "media-left" },
  { id: "websites", to: "/website-builder", layout: "devices", side: "copy-left" },
  { id: "appointments", to: "/appointments", layout: "calendar", side: "media-left" },
];

const COPY: Record<FilmId, { title: string; body: string; cta: string; video: string; points: [string, string, string] }> = {
  crm: { title: "crmTitle", body: "crmBody", cta: "crmCta", video: "crmVideo", points: ["crmPoint1", "crmPoint2", "crmPoint3"] },
  whatsapp: { title: "waTitle", body: "waBody", cta: "waCta", video: "waVideo", points: ["waPoint1", "waPoint2", "waPoint3"] },
  campaigns: { title: "adsTitle", body: "adsBody", cta: "adsCta", video: "adsVideo", points: ["adsPoint1", "adsPoint2", "adsPoint3"] },
  automations: { title: "autoTitle", body: "autoBody", cta: "autoCta", video: "autoVideo", points: ["autoPoint1", "autoPoint2", "autoPoint3"] },
  websites: { title: "webTitle", body: "webBody", cta: "webCta", video: "webVideo", points: ["webPoint1", "webPoint2", "webPoint3"] },
  appointments: { title: "calTitle", body: "calBody", cta: "calCta", video: "calVideo", points: ["calPoint1", "calPoint2", "calPoint3"] },
};

const POSTER: Record<FilmId, string> = {
  crm: "/demo-media/home/frames/poster-crm.jpg",
  whatsapp: "/demo-media/home/whatsapp.jpg",
  campaigns: "/demo-media/home/campaigns.jpg",
  automations: "/demo-media/home/frames/poster-automations.jpg",
  websites: "/demo-media/home/websites.jpg",
  appointments: "/demo-media/home/frames/poster-calendar.jpg",
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
  const src = `/demo-media/home/${id}.mp4?v=6`;
  const poster = `${POSTER[id]}?v=6`;

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
        preload="none"
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
              <article key={block.id} className={`home-show__block home-show__block--${block.layout} home-show__block--${block.side}`}>
                <div className="home-show__copy" dir={getTextDirection(i18n.language)}>
                  <h3>{t(`home.${copy.title}`)}</h3>
                  <p>{t(`home.${copy.body}`)}</p>
                  <ul className="home-show__points">
                    {copy.points.map((point) => (
                      <li key={point}>{t(`home.${point}`)}</li>
                    ))}
                  </ul>
                  <Link to={block.to}>{t(`home.${copy.cta}`)}</Link>
                </div>
                <ProductFilm id={block.id} label={t(`home.${copy.video}`)} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
