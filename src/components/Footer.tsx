import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import { changeAppLanguage } from "../i18n/persistLanguage";
import { openCookieSettings } from "../lib/trackingConsent";
import { coerceSupportedLanguage, getTextDirection, normalizeLanguage } from "../i18n/localeUtils";
import "../styles/MarketingFooter.css";

type FooterLink = {
  label: string;
  to: string;
};

const SCAN_LABEL: Record<string, string> = {
  en: "AI website scan",
  he: "סריקת אתר חכמה AI",
  es: "Escaneo inteligente del sitio",
  "pt-BR": "Varredura inteligente do site",
  ar: "فحص ذكي للموقع",
};

const SYSTEMS: Record<string, string> = {
  en: "SaaS systems",
  he: "מערכות",
  es: "Sistemas",
  "pt-BR": "Sistemas",
  ar: "الأنظمة",
};

const REGION = [
  ["he", "ישראל"],
  ["en", "United States"],
  ["es", "España"],
  ["pt-BR", "Brasil"],
  ["ar", "المنطقة العربية"],
] as const;

const SOLUTION_LABELS: Record<string, Record<string, string>> = {
  clinics: { en: "Clinics", he: "קליניקות", es: "Clínicas", "pt-BR": "Clínicas", ar: "عيادات" },
  beauty: { en: "Beauty", he: "מכוני יופי", es: "Belleza", "pt-BR": "Beleza", ar: "التجميل" },
  realEstate: { en: "Real estate", he: "נדל״ן", es: "Inmuebles", "pt-BR": "Imóveis", ar: "العقارات" },
  restaurants: { en: "Restaurants", he: "מסעדות", es: "Restaurantes", "pt-BR": "Restaurantes", ar: "المطاعم" },
  service: { en: "Service businesses", he: "נותני שירות", es: "Servicios", "pt-BR": "Prestadores", ar: "مقدمو الخدمات" },
  agencies: { en: "Agencies", he: "סוכנויות", es: "Agencias", "pt-BR": "Agências", ar: "الوكالات" },
  leads: { en: "Lead-based businesses", he: "עסקים מבוססי לידים", es: "Negocios de leads", "pt-BR": "Negócios de leads", ar: "أعمال العملاء المحتملين" },
  ready: { en: "Ready systems", he: "מערכות מוכנות", es: "Sistemas listos", "pt-BR": "Sistemas prontos", ar: "أنظمة جاهزة" },
};

const REGION_COPY: Record<string, { label: string; aria: string }> = {
  he: { label: "אזור", aria: "בחירת אזור" },
  en: { label: "Region", aria: "Choose a region" },
  es: { label: "Región", aria: "Elegir región" },
  "pt-BR": { label: "Região", aria: "Escolher região" },
  ar: { label: "المنطقة", aria: "اختيار المنطقة" },
};

function solutionLabel(locale: string, key: string) {
  const row = SOLUTION_LABELS[key];
  return row[locale] || row.en;
}

export default function Footer() {
  const { t, i18n } = useTranslation();
  const year = new Date().getFullYear();
  const language = normalizeLanguage(i18n.language);
  const footerDir = getTextDirection(language);
  const region = coerceSupportedLanguage(i18n.language);
  const logoAlt = language === "he" ? "ביזאפלי (BizUply)" : "BizUply";
  const regionCopy = REGION_COPY[region] || REGION_COPY.en;

  const columns: { title: string; links: FooterLink[] }[] = [
    {
      title: t("footer.products"),
      links: [
        { label: t("footer.platform"), to: "/platform" },
        { label: t("footer.crm"), to: "/crm" },
        { label: SCAN_LABEL[region] || SCAN_LABEL.en, to: "/website-scan" },
        {
          label: region === "he" ? "סורק נראות AI" : region === "ar" ? "فاحص ظهور AI" : "AI Visibility Scanner",
          to: "/products/ai-visibility-scanner",
        },
        { label: t("footer.appointments"), to: "/appointments" },
        { label: t("footer.whatsapp"), to: "/whatsapp-api" },
        { label: t("footer.meta"), to: "/meta-campaigns" },
        { label: t("footer.automations"), to: "/automations" },
        { label: t("footer.website"), to: "/website-builder" },
        { label: t("footer.agents"), to: "/agents" },
        { label: SYSTEMS[region] || SYSTEMS.en, to: "/saas" },
      ],
    },
    {
      title: t("footer.solutions"),
      links: [
        { label: solutionLabel(region, "clinics"), to: "/solutions/clinics" },
        { label: solutionLabel(region, "beauty"), to: "/solutions/beauty" },
        { label: solutionLabel(region, "realEstate"), to: "/solutions/real-estate" },
        { label: solutionLabel(region, "restaurants"), to: "/solutions/restaurants" },
        { label: solutionLabel(region, "service"), to: "/solutions/service-businesses" },
        { label: solutionLabel(region, "agencies"), to: "/solutions/agencies" },
        { label: solutionLabel(region, "leads"), to: "/solutions/lead-based" },
        { label: solutionLabel(region, "ready"), to: "/solutions/ready-systems" },
      ],
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("footer.aboutUs"), to: "/about" },
        { label: t("footer.pricing"), to: "/pricing" },
        { label: t("footer.contact"), to: "/contact" },
        { label: t("footer.partners"), to: "/partners" },
        { label: t("footer.collaborations"), to: "/collaborations" },
      ],
    },
    {
      title: t("footer.resources"),
      links: [
        { label: t("footer.guides"), to: "/guides" },
        { label: t("footer.faq"), to: "/faq" },
        { label: t("footer.services"), to: "/services" },
      ],
    },
    {
      title: t("footer.support"),
      links: [
        { label: t("footer.support"), to: "/support" },
        { label: t("footer.contact"), to: "/contact" },
        { label: t("footer.accessibility"), to: "/accessibility" },
      ],
    },
  ];

  return (
    <footer className="site-footer hx-footer" dir={footerDir}>
      <div className="site-footer__main">
        <div className="site-footer__brand">
          <Link to="/" aria-label={t("footer.logoAria")}>
            <img src="/logo-mark-light.png" alt={logoAlt} width="180" height="56" />
          </Link>
          <p>{t("footer.tagline")}</p>
        </div>
        {columns.map((column) => (
          <FooterColumn key={column.title} title={column.title} links={column.links} />
        ))}
      </div>
      <div className="site-footer__bar">
        <p>{t("footer.rights", { year })}</p>
        <div className="site-footer__legal">
          <Link to="/terms">{t("footer.terms")}</Link>
          <Link to="/privacy">{t("footer.privacy")}</Link>
          <button type="button" className="site-footer__cookie" onClick={openCookieSettings}>
            {t("footer.cookieSettings")}
          </button>
          <Link to="/accessibility">{t("footer.accessibility")}</Link>
        </div>
        <div className="site-footer__tools">
          <LanguageSwitcher />
          <label className="site-footer__region">
            <span>{regionCopy.label}</span>
            <select
              value={region}
              aria-label={regionCopy.aria}
              onChange={(event) => {
                void changeAppLanguage(event.target.value);
              }}
            >
              {REGION.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <div className="site-footer__social">
            <a href="https://www.facebook.com/bizuply" target="_blank" rel="noreferrer">Facebook</a>
            <a href="https://www.instagram.com/bizuply" target="_blank" rel="noreferrer">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function scrollPageToTop() {
  const scroller = document.querySelector(".app-scroll-area");
  if (scroller instanceof HTMLElement) scroller.scrollTop = 0;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="site-footer__col">
      <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={`${title}-${link.to}`}>
            <Link
              to={link.to}
              onClick={() => {
                window.setTimeout(scrollPageToTop, 0);
                window.setTimeout(scrollPageToTop, 50);
              }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
