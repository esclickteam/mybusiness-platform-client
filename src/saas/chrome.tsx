import { useEffect, useState, type ReactNode } from "react";
import "../i18n/i18n";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { getHtmlLang, getTextDirection } from "../i18n/localeUtils";
import { whatsappHref } from "./logic";

export function SaasSeo({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.setAttribute("name", "robots");
      document.head.appendChild(robots);
    }
    robots.setAttribute("content", "noindex, follow");
  }, [title]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, follow" />
      <meta name="googlebot" content="noindex, follow" />
    </Helmet>
  );
}

export function MixedText({ value }: { value: string }) {
  const source = String(value || "");
  const rtl = /[\u0590-\u08FF]/.test(source);
  const isolated = source.replace(
    /([A-Za-z][A-Za-z0-9+./-]*(?:[ \u00A0-][A-Za-z][A-Za-z0-9+./-]*)*)/g,
    "\u2066$1\u2069"
  );
  const text = rtl ? isolated.replace(/([?؟!:])/g, "\u200F$1") : isolated;
  return <>{text}</>;
}

export function useSaasLocale() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage || i18n.language || "en";
  return { t, i18n, lang, dir: getTextDirection(lang), htmlLang: getHtmlLang(lang) };
}

export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [node, setNode] = useState<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!node || shown) return;
    if (typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setShown(true);
      },
      { threshold: 0.14 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node, shown]);
  return (
    <div ref={setNode} className={`saas-reveal ${shown ? "is-in" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  href,
  onClick,
  type = "button",
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const className =
    "inline-flex items-center justify-center rounded-full bg-[#24124d] px-5 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgba(36,18,77,0.25)] transition hover:-translate-y-0.5 hover:bg-[#3b1d86]";
  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }
  return (
    <button className={className} type={type} onClick={onClick}>
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  href,
  onClick,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-[#c4b5fd]";
  if (href) {
    return (
      <a className={className} href={href}>
        {children}
      </a>
    );
  }
  return (
    <button className={className} type="button" onClick={onClick}>
      {children}
    </button>
  );
}

export function SaasHeader({ onTalk, tone = "light" }: { onTalk: () => void; tone?: "light" | "dark" }) {
  const { t } = useSaasLocale();
  const dark = tone === "dark";
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    ["#what-is-saas", t("saasMarket.nav.saas")],
    ["#platforms", t("saasMarket.nav.platforms")],
    ["#models", t("saasMarket.nav.models")],
    ["#exclusive", t("saasMarket.nav.exclusive")],
    ["#faq", t("saasMarket.nav.faq")],
  ];
  return (
    <header className={`saas-header sticky top-0 z-30 ${dark ? "is-dark" : ""} ${scrolled ? "is-scrolled" : ""}`}>
      <div className="saas-header-inner">
        <Link to="/" className="saas-logo">
          Bizuply
        </Link>
        <nav className="saas-nav">
          {links.map(([href, label]) => (
            <a key={href} href={href}>
              <MixedText value={label} />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button type="button" onClick={onTalk} className="saas-nav-cta">
            {t("saasMarket.nav.talk")}
          </button>
        </div>
      </div>
    </header>
  );
}

export function SaasFooter({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { t } = useSaasLocale();
  const dark = tone === "dark";
  return (
    <footer className={`px-4 py-10 text-center text-sm font-semibold ${dark ? "border-t border-white/10 bg-[#070b16] text-white/55" : "border-t border-white/80 text-slate-500"}`}>
      <MixedText value={t("saasMarket.footer")} />
    </footer>
  );
}

export function WhatsAppDock({ href }: { href: string }) {
  const { t } = useSaasLocale();
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-24 end-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#128C7E] px-4 py-3 text-sm font-black text-white shadow-xl lg:bottom-6"
    >
      {t("saasMarket.whatsapp.button")}
    </a>
  );
}

export function buildWhatsappLink(e164: string, message: string) {
  return whatsappHref(e164, message);
}

export function StickyActions({
  items,
}: {
  items: { label: string; href?: string; onClick?: () => void }[];
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 gap-1 border-t border-slate-200 bg-white/95 p-2 backdrop-blur lg:hidden">
      {items.map((item) =>
        item.href ? (
          <a
            key={item.label}
            href={item.href}
            className="rounded-2xl bg-slate-950 px-1 py-2 text-center text-[11px] font-black text-white"
          >
            {item.label}
          </a>
        ) : (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className="rounded-2xl bg-slate-100 px-1 py-2 text-center text-[11px] font-black text-slate-900"
          >
            {item.label}
          </button>
        )
      )}
    </div>
  );
}
