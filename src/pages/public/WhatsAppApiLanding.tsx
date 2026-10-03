import React, { Suspense, lazy, useEffect, useLayoutEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  WHATSAPP_CANONICAL_URL,
  WHATSAPP_PRODUCT_SCHEMA,
  WHATSAPP_SEO_DESCRIPTION,
  WHATSAPP_SEO_KEYWORDS,
  getWhatsAppPageMeta,
  whatsappCanonicalUrl,
  whatsappSiteBase,
} from "../../lib/whatsappHost.mjs";
import { coerceSupportedLanguage, getTextDirection } from "../../i18n/localeUtils";
import { SiteFooter, SiteHeader } from "./whatsapp/SiteChrome";
import { SiteBaseProvider, SiteLink, englishOnly, useSiteHref, useSitePath } from "./whatsapp/siteConfig";
import { useReveal } from "./whatsapp/ui";
import OverviewPage from "./whatsapp/pages/OverviewPage";
import "./whatsapp/whatsappSite.css";

const DevelopersPage = lazy(() => import("./whatsapp/pages/DevelopersPage"));
const AgenciesPage = lazy(() => import("./whatsapp/pages/AgenciesPage"));
const PricingPage = lazy(() => import("./whatsapp/pages/PricingPage"));
const DocsPage = lazy(() => import("./whatsapp/pages/DocsPage"));
const HelpPage = lazy(() => import("./whatsapp/pages/HelpPage"));
const GetStartedPage = lazy(() => import("./whatsapp/pages/GetStartedPage"));
const SecurityPage = lazy(() => import("./whatsapp/pages/SecurityPage"));

/** Anchors from the previous single-page site, mapped to their new pages. */
const LEGACY_HASHES: Record<string, string> = {
  "#pricing": "/pricing",
  "#calculator": "/pricing#calculator",
  "#developers": "/developers",
  "#audiences": "/agencies",
  "#faq": "/help",
  "#contact": "/get-started#request-access",
  "#how": "/get-started",
};

const BG = "#05070d";

function NotFound() {
  return (
    <section className="wa-not-found">
      <div className="wa-wrap">
        <p className="wa-eyebrow">404</p>
        <h1 className="wa-h2">This page doesn't exist.</h1>
        <p className="wa-lead" style={{ marginInline: "auto" }}>The link may be outdated. Try one of these instead.</p>
        <div className="wa-actions" style={{ justifyContent: "center" }}>
          <SiteLink to="/" className="wa-btn wa-btn-primary">Overview</SiteLink>
          <SiteLink to="/docs" className="wa-btn wa-btn-ghost">Documentation</SiteLink>
          <SiteLink to="/help" className="wa-btn wa-btn-ghost">Help Center</SiteLink>
        </div>
      </div>
    </section>
  );
}

function PageFallback() {
  return <div style={{ minHeight: "70vh" }} aria-busy="true" />;
}

function SiteRoutes({ lang }: { lang: string }) {
  const path = useSitePath();
  const location = useLocation();
  const navigate = useNavigate();
  const href = useSiteHref();
  const meta = getWhatsAppPageMeta(path);

  useReveal(path);

  useEffect(() => {
    if (path !== "/" || !location.hash) return;
    const target = LEGACY_HASHES[location.hash];
    if (target) navigate(href(target), { replace: true });
  }, [href, location.hash, navigate, path]);

  useLayoutEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return undefined;
    }
    const id = decodeURIComponent(location.hash.slice(1));
    let tries = 0;
    let timer = 0;
    const attempt = () => {
      const node = document.getElementById(id);
      if (node) {
        node.scrollIntoView({ block: "start" });
        return;
      }
      if (tries++ < 20) timer = window.setTimeout(attempt, 100);
    };
    attempt();
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  const title = meta?.title || "Page not found | Bizuply WhatsApp API";
  const description = meta?.description || WHATSAPP_SEO_DESCRIPTION;
  const canonical = meta ? whatsappCanonicalUrl(path) : WHATSAPP_CANONICAL_URL;

  let page: React.ReactNode;
  switch (path) {
    case "/":
      page = <OverviewPage lang={lang} />;
      break;
    case "/developers":
      page = <DevelopersPage />;
      break;
    case "/agencies":
      page = <AgenciesPage />;
      break;
    case "/pricing":
      page = <PricingPage />;
      break;
    case "/docs":
      page = <DocsPage />;
      break;
    case "/help":
      page = <HelpPage />;
      break;
    case "/get-started":
      page = <GetStartedPage />;
      break;
    case "/security":
      page = <SecurityPage />;
      break;
    default:
      page = <NotFound />;
  }

  useEffect(() => {
    document.title = title;
    setHeadTag("meta", "name", "description", description);
    setHeadTag("meta", "name", "robots", meta ? "index, follow" : "noindex, follow");
    setHeadTag("link", "rel", "canonical", canonical);
    setHeadTag("meta", "property", "og:title", title);
    setHeadTag("meta", "property", "og:description", description);
    setHeadTag("meta", "property", "og:url", canonical);
    setHeadTag("meta", "name", "twitter:title", title);
    setHeadTag("meta", "name", "twitter:description", description);
  }, [title, description, canonical, meta]);

  return (
    <Suspense fallback={<PageFallback />}>
      {path === "/" ? page : <div {...englishOnly(lang)}>{page}</div>}
    </Suspense>
  );
}

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap";

/** react-helmet-async does not apply tags under React 19, so head tags are managed directly. */
function setHeadTag(tag: "meta" | "link", key: "name" | "property" | "rel", keyValue: string, value: string) {
  let node = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(`${tag}[${key}="${keyValue}"]`);
  if (!node) {
    node = document.createElement(tag);
    node.setAttribute(key, keyValue);
    document.head.appendChild(node);
  }
  node.setAttribute(tag === "link" ? "href" : "content", value);
}

function ensureLink(rel: string, href: string, crossOrigin?: string) {
  if (document.head.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
  const link = document.createElement("link");
  link.rel = rel;
  link.href = href;
  if (crossOrigin !== undefined) link.crossOrigin = crossOrigin;
  document.head.appendChild(link);
}

function ensureProductSchema() {
  if (document.getElementById("wa-product-schema")) return;
  const script = document.createElement("script");
  script.id = "wa-product-schema";
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(WHATSAPP_PRODUCT_SCHEMA);
  document.head.appendChild(script);
}

export default function WhatsAppApiLanding() {
  const { i18n } = useTranslation();
  const lang = coerceSupportedLanguage(i18n.language);
  const dir = getTextDirection(lang);
  const base = whatsappSiteBase(typeof window !== "undefined" ? window.location.hostname : "");

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  useEffect(() => {
    document.body.style.background = BG;
    document.documentElement.style.background = BG;
    setHeadTag("meta", "name", "keywords", WHATSAPP_SEO_KEYWORDS);
    setHeadTag("meta", "property", "og:type", "website");
    setHeadTag("meta", "property", "og:site_name", "Bizuply WhatsApp API");
    setHeadTag("meta", "property", "og:locale", "en_US");
    setHeadTag("meta", "name", "twitter:card", "summary_large_image");
    setHeadTag("meta", "name", "theme-color", BG);
    ensureLink("preconnect", "https://fonts.googleapis.com");
    ensureLink("preconnect", "https://fonts.gstatic.com", "");
    ensureLink("stylesheet", FONT_HREF);
    ensureProductSchema();
  }, []);

  return (
    <SiteBaseProvider base={base}>
      <div className="wa-page" dir={dir} lang={lang}>
        <div className="wa-ambient" aria-hidden="true" />
        <SiteHeader lang={lang} />
        <main id="main" tabIndex={-1}>
          <SiteRoutes lang={lang} />
        </main>
        <SiteFooter lang={lang} />
      </div>
    </SiteBaseProvider>
  );
}