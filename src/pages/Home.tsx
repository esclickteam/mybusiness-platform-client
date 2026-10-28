"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { marketingPublicUrl } from "../lib/localePathCore.mjs";

import HomeShowcase from "../components/HomeShowcase";

const HREFLANG = [
  ["en", "https://bizuply.com/"],
  ["he", "https://bizuply.com/he/"],
  ["es", "https://bizuply.com/es/"],
  ["pt-BR", "https://bizuply.com/pt-br/"],
  ["ar", "https://bizuply.com/ar/"],
  ["x-default", "https://bizuply.com/"],
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
      <HomeShowcase />
    </main>
  );
}
