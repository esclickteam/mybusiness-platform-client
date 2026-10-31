import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { marketingPublicUrl } from "../lib/localePathCore.mjs";
import HomeExperienceSections from "../components/home-experience/HomeExperienceSections";
import HomeExperienceFooter from "../components/home-experience/HomeExperienceFooter";
import { FilmProvider, type Film } from "../components/home-experience/film";
import "../styles/homeExperience.css";

const HREFLANG = [
  ["en", marketingPublicUrl("/", "en")],
  ["he", marketingPublicUrl("/", "he")],
  ["es", marketingPublicUrl("/", "es")],
  ["pt-BR", marketingPublicUrl("/", "pt-BR")],
  ["ar", marketingPublicUrl("/", "ar")],
  ["x-default", marketingPublicUrl("/", "en")],
] as const;

function setMeta(attr: "name" | "property", key: string, content: string) {
  let node = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attr, key);
    document.head.appendChild(node);
  }
  node.content = content;
}

export default function HomeExperiencePreview({ indexed = false }: { indexed?: boolean }) {
  const { t, i18n } = useTranslation();
  const [film, setFilm] = useState<Film | null>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const canonical = marketingPublicUrl("/", i18n.language);

  useEffect(() => {
    if (!indexed) return undefined;
    document.title = t("seo.homeTitle");
    setMeta("name", "description", t("seo.homeDescription"));
    setMeta("property", "og:title", t("seo.homeTitle"));
    setMeta("property", "og:description", t("seo.homeDescription"));
    setMeta("property", "og:type", "website");
    setMeta("property", "og:url", canonical);
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    for (const [lang, href] of HREFLANG) {
      let alt = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!alt) {
        alt = document.createElement("link");
        alt.rel = "alternate";
        alt.hreflang = lang;
        alt.dataset.bizuplyHome = "1";
        document.head.appendChild(alt);
      }
      alt.href = href;
    }
    return undefined;
  }, [canonical, i18n.language, indexed, t]);

  useEffect(() => {
    const node = pageRef.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        node.style.setProperty("--hx-x", `${event.clientX}px`);
        node.style.setProperty("--hx-y", `${event.clientY}px`);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  useLayoutEffect(() => {
    document.documentElement.classList.add("hx-preview");
    if (indexed) {
      document.getElementById("bizuply-first-paint")?.remove();
      document.getElementById("root")?.removeAttribute("hidden");
      return () => {
        document.documentElement.classList.remove("hx-preview");
      };
    }
    const previousTitle = document.title;
    document.title = "Bizuply";
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const created = !robots;
    const previousRobots = robots?.content ?? null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";
    return () => {
      document.documentElement.classList.remove("hx-preview");
      document.title = previousTitle;
      if (!robots) return;
      if (created) robots.remove();
      else if (previousRobots != null) robots.content = previousRobots;
    };
  }, [indexed]);

  useEffect(() => {
    if (!film) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFilm(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [film]);

  return (
    <FilmProvider value={setFilm}>
      <div className="hx-page" ref={pageRef} dir={getTextDirection(i18n.language)}>
        <HomeExperienceSections />
        <HomeExperienceFooter />
      </div>
      {film ? <FilmDialog film={film} onClose={() => setFilm(null)} /> : null}
    </FilmProvider>
  );
}

function FilmDialog({ film, onClose }: { film: Film; onClose: () => void }) {
  const { i18n } = useTranslation();
  const he = i18n.language.startsWith("he");
  const [sound, setSound] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
  }, []);
  return (
    <div className="hx-modal" role="dialog" aria-modal="true" aria-label={film.title} onClick={onClose}>
      <div className="hx-modal-card" onClick={(event) => event.stopPropagation()}>
        <button ref={closeRef} type="button" className="hx-modal-close text-inherit" onClick={onClose} aria-label={he ? "סגירה" : "Close"}>
          ×
        </button>
        <button type="button" className="hx-modal-sound text-inherit" onClick={() => setSound((value) => !value)}>
          {sound ? (he ? "השתקה" : "Mute") : he ? "הפעלת קול" : "Sound"}
        </button>
        <video src={film.src} poster={film.poster} autoPlay muted={!sound} controls playsInline />
        <p>{film.caption}</p>
      </div>
    </div>
  );
}
