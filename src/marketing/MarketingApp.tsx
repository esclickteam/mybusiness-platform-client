import { lazy, Suspense, useEffect, useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HeaderView from "../components/HeaderView";
import Footer from "../components/Footer";
import Home from "../pages/Home";
import { getHtmlLang, getTextDirection } from "../i18n/localeUtils";
import { splitMarketingLocale } from "../lib/localePathCore.mjs";

const AccessibilityWidget = lazy(() => import("../components/site-plugins/accessibility/AccessibilityWidget"));
const SupportChatWidget = lazy(() => import("../components/SupportChatWidget"));

function leaveMarketingSite(href: string) {
  const locale = splitMarketingLocale(window.location.pathname).locale || "en";
  const url = new URL(href, window.location.origin);
  if (!url.searchParams.has("lang")) url.searchParams.set("lang", locale);
  window.location.assign(`${url.pathname}${url.search}${url.hash}`);
}

export function installMarketingNavigation() {
  const onClick = (event: MouseEvent) => {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element | null)?.closest?.("a");
    if (!anchor || anchor.target === "_blank") return;
    const raw = anchor.getAttribute("href");
    if (!raw || raw.startsWith("#")) return;
    let url: URL;
    try {
      url = new URL(anchor.href, window.location.href);
    } catch {
      return;
    }
    if (url.origin !== window.location.origin) return;
    if (splitMarketingLocale(url.pathname).path === "/") return;
    event.preventDefault();
    leaveMarketingSite(`${url.pathname}${url.search}${url.hash}`);
  };
  document.addEventListener("click", onClick, true);
  return () => document.removeEventListener("click", onClick, true);
}

export default function MarketingApp() {
  const { i18n } = useTranslation();
  const [widgets, setWidgets] = useState(false);

  useLayoutEffect(() => {
    if (!document.getElementById("bizuply-first-paint")) return undefined;
    const release = () => {
      const shell = document.getElementById("bizuply-first-paint");
      const hero = shell?.querySelector(".home-hero");
      if (hero && document.querySelector("#root .app-main")) {
        shell.replaceChildren(hero);
        hero.setAttribute("data-kept-hero", "true");
      }
      document.getElementById("root")?.removeAttribute("hidden");
      if (!hero) shell?.remove();
    };
    const root = document.getElementById("root");
    if (root?.querySelector(".app-main")) {
      release();
      return undefined;
    }
    const observer = new MutationObserver(() => {
      if (root?.querySelector(".app-main")) {
        observer.disconnect();
        release();
      }
    });
    if (root) observer.observe(root, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => installMarketingNavigation(), []);

  useEffect(() => {
    const start = () => setWidgets(true);
    const timer = window.setTimeout(start, 4000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="app-layout" dir={getTextDirection(i18n.language)} lang={getHtmlLang(i18n.language)}>
      <HeaderView />
      <main className="app-main">
        <div className="app-scroll-area has-public-widgets">
          <Home />
        </div>
      </main>
      <Footer />
      {widgets ? (
        <Suspense fallback={null}>
          <SupportChatWidget />
          <AccessibilityWidget />
        </Suspense>
      ) : null}
    </div>
  );
}
