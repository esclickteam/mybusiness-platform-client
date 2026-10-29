"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { marketingPublicUrl } from "../lib/localePathCore.mjs";

import HeroSection from "../components/HeroSection";
import { HomeAudiences, HomeJourney } from "../components/HomeNarrative";
import PlatformDomains from "../components/PlatformDomains";
import ScrollStory from "../components/ScrollStory";
import WhyBizuply from "../components/WhyBizuply";
import FAQMini from "../components/FAQMini";

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

export default function Home() {
  const { t, i18n } = useTranslation();
  const canonical = marketingPublicUrl("/", i18n.language);

  useEffect(() => {
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
  }, [canonical, i18n.language, t]);

  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-800" dir={getTextDirection(i18n.language)}>
      <HeroSection />
      <PlatformDomains />
      <ScrollStory />
      <HomeJourney />
      <HomeAudiences />
      <WhyBizuply />
      <FAQMini />
    </main>
  );
}
