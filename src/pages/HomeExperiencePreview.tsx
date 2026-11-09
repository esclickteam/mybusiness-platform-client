import { useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { marketingPublicUrl } from "../lib/localePathCore.mjs";
import HomeExperienceSections from "../components/home-experience/HomeExperienceSections";
import HomeExperienceFooter from "../components/home-experience/HomeExperienceFooter";
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

  useLayoutEffect(() => {
    document.documentElement.classList.add("hx-preview");
    if (indexed) {
      // Swap only after this cinematic tree is committed (same gate as App release).
      document.getElementById("root")?.removeAttribute("hidden");
      document.getElementById("bizuply-first-paint")?.remove();
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

  return (
    <div className="hx-page" dir={getTextDirection(i18n.language)}>
      <HomeExperienceSections />
      <HomeExperienceFooter />
    </div>
  );
}
