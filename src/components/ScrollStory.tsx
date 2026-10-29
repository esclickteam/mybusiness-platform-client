"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getTextDirection } from "../i18n/localeUtils";
import "../styles/homeWow.css";

gsap.registerPlugin(ScrollTrigger);

type FilmId = "crm" | "whatsapp" | "campaigns" | "automations" | "websites" | "appointments";

const BLOCKS: { id: FilmId; to: string; layout: string; side: "copy-left" | "media-left" }[] = [
  { id: "crm", to: "/crm", layout: "split", side: "copy-left" },
  { id: "whatsapp", to: "/whatsapp-api", layout: "chat", side: "media-left" },
  { id: "campaigns", to: "/meta-campaigns", layout: "wide", side: "copy-left" },
  { id: "automations", to: "/automations", layout: "flow", side: "media-left" },
  { id: "websites", to: "/website-builder", layout: "devices", side: "copy-left" },
  { id: "appointments", to: "/appointments", layout: "calendar", side: "media-left" },
];

const COPY: Record<FilmId, { title: string; body: string; cta: string; video: string; points: string }> = {
  crm: { title: "crmTitle", body: "crmBody", cta: "crmCta", video: "crmVideo", points: "crmPoint" },
  whatsapp: { title: "waTitle", body: "waBody", cta: "waCta", video: "waVideo", points: "waPoint" },
  campaigns: { title: "adsTitle", body: "adsBody", cta: "adsCta", video: "adsVideo", points: "adsPoint" },
  automations: { title: "autoTitle", body: "autoBody", cta: "autoCta", video: "autoVideo", points: "autoPoint" },
  websites: { title: "webTitle", body: "webBody", cta: "webCta", video: "webVideo", points: "webPoint" },
  appointments: { title: "calTitle", body: "calBody", cta: "calCta", video: "calVideo", points: "calPoint" },
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
  const src = `/demo-media/home/${id}.mp4?v=5`;
  const poster = `/demo-media/home/${id}.jpg?v=5`;

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    const desktopFocus = window.matchMedia("(min-width: 981px) and (prefers-reduced-motion: no-preference)").matches;
    if (reduce || paused || desktopFocus) {
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
        aria-pressed={paused || Boolean(reduce)}
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
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const node = root.current;
    if (!node) return undefined;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(max-width: 980px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".home-show__block", node).forEach((card) => {
          gsap.fromTo(card, { scale: 0.94 }, {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "center 42%",
              scrub: true,
            },
          });
        });
      });
      mm.add("(min-width: 981px) and (prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".home-show__block", node);
        const stage = node.querySelector<HTMLElement>(".home-show__stage");
        if (!cards.length || !stage) return;
        const beat = 2.6;
        gsap.set(cards, {
          xPercent: -50,
          yPercent: -50,
          scale: 0.46,
          autoAlpha: 0,
          y: 0,
          zIndex: 1,
          force3D: true,
        });
        gsap.set(cards[0], { scale: 0.46, autoAlpha: 1, zIndex: 8 });
        const depth = node.querySelector<HTMLElement>(".home-show__depth");
        const focus = (index: number) => {
          cards.forEach((card, cardIndex) => {
            card.classList.toggle("is-focus", cardIndex === index);
            const video = card.querySelector("video");
            if (!video) return;
            if (cardIndex === index) void video.play().catch(() => undefined);
            else video.pause();
          });
        };
        focus(0);
        let active = 0;
        const timeline = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        cards.forEach((card, index) => {
          const media = card.querySelector<HTMLElement>(".home-show__screen");
          const start = index === 0 ? 0 : index * beat - 0.85;
          if (index === 0) {
            timeline.fromTo(card, { scale: 0.46, autoAlpha: 1, y: 0, zIndex: 8 }, {
              scale: 1,
              autoAlpha: 1,
              y: 0,
              zIndex: 8,
              duration: 0.7,
              immediateRender: true,
            }, 0);
          } else {
            timeline.fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, immediateRender: false }, start);
            timeline.fromTo(card, { scale: 0.86, x: 0, y: 12, zIndex: 3 }, {
              scale: 1,
              x: 0,
              y: 0,
              zIndex: 3,
              duration: 0.9,
              immediateRender: false,
            }, start);
            timeline.set(card, { zIndex: 8 }, start + 0.7);
          }
          if (media) {
            timeline.fromTo(media, { scale: 0.92, y: 28 }, {
              scale: 1,
              y: 0,
              duration: 0.9,
              ease: "power2.out",
            }, start);
          }
          if (index < cards.length - 1) {
            const exitAt = (index + 1) * beat - 0.7;
            timeline.to(card, { scale: 0.56, x: -720, y: -12, zIndex: 9, duration: 0.5 }, exitAt);
            timeline.to(card, { autoAlpha: 0, x: -860, scale: 0.48, zIndex: 2, duration: 0.2 }, exitAt + 0.42);
          }
        });
        if (depth) {
          timeline.fromTo(depth, { scale: 0.8, autoAlpha: 0.3 }, {
            scale: 1.06,
            autoAlpha: 0.55,
            duration: timeline.duration(),
            ease: "none",
          }, 0);
        }
        ScrollTrigger.create({
          animation: timeline,
          trigger: node.querySelector(".home-show__pin"),
          start: "top 72px",
          end: () => `+=${cards.length * 1600}`,
          pin: stage,
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (!self.isActive) return;
            stage.style.zIndex = "1";
            const index = Math.min(cards.length - 1, Math.max(0, Math.round((timeline.duration() * self.progress) / beat)));
            if (index === active) return;
            active = index;
            focus(index);
          },
        });
      });
    }, node);
    return () => ctx.revert();
  }, [i18n.language]);

  return (
    <section className="home-show" ref={root} dir={getTextDirection(i18n.language)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <h2 className="home-show__title">{t("home.showTitle")}</h2>
        <p className="home-show__lead">{t("home.showLead")}</p>
      </div>
      <div className="home-show__pin">
        <div className="home-show__stage home-show__stack">
          <div className="home-show__depth" aria-hidden="true" />
          {BLOCKS.map((block) => {
              const copy = COPY[block.id];
              return (
                <article key={block.id} className={`home-show__block home-show__block--${block.layout} home-show__block--${block.side}`}>
                  <div className="home-show__copy" dir={getTextDirection(i18n.language)}>
                    <h3>{t(`home.${copy.title}`)}</h3>
                    <p>{t(`home.${copy.body}`)}</p>
                    <ul className="home-show__points">
                      {[1, 2, 3].map((point) => (
                        <li key={point}>{t(`home.${copy.points}${point}`)}</li>
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
