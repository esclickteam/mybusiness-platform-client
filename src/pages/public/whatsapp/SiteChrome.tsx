import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { LANGUAGE_META } from "../../../i18n/languages";
import { changeAppLanguage } from "../../../i18n/persistLanguage";
import MenuSelect from "../MenuSelect";
import {
  ACCESSIBILITY_URL,
  API_REFERENCE_URL,
  NAV_ITEMS,
  OPENAPI_URL,
  PRIVACY_URL,
  SIGN_IN_URL,
  SUPPORT_EMAIL,
  SiteLink,
  TERMS_URL,
  useSitePath,
} from "./siteConfig";

type ChromeCopy = {
  nav: Record<string, string>;
  login: string;
  start: string;
  openMenu: string;
  closeMenu: string;
  skip: string;
  footer: FooterCopy;
};

type FooterCopy = {
  blurb: string;
  product: string;
  developers: string;
  company: string;
  legal: string;
  calculator: string;
  apiReference: string;
  security: string;
  privacy: string;
  terms: string;
  accessibility: string;
  rights: string;
  trademark: string;
};

const EN: ChromeCopy = {
  nav: {
    overview: "Overview",
    developers: "Developers",
    agencies: "Agencies",
    pricing: "Pricing",
    docs: "Documentation",
    help: "Help Center",
  },
  login: "Log in",
  start: "Get Started",
  openMenu: "Open menu",
  closeMenu: "Close menu",
  skip: "Skip to content",
  footer: {
    blurb: "WhatsApp Business API built on Meta's WhatsApp Cloud API, for developers, agencies and businesses. $29/month per WhatsApp number. Meta messaging fees are billed separately.",
    product: "Product",
    developers: "Developers",
    company: "Company",
    legal: "Legal",
    calculator: "Cost calculator",
    apiReference: "OpenAPI reference",
    security: "Security",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    accessibility: "Accessibility",
    rights: "All rights reserved.",
    trademark: "WhatsApp and Meta are trademarks of Meta Platforms, Inc.",
  },
};

const CHROME_I18N: Record<string, ChromeCopy> = {
  en: EN,
  he: {
    nav: {
      overview: "סקירה",
      developers: "מפתחים",
      agencies: "סוכנויות",
      pricing: "מחירים",
      docs: "תיעוד",
      help: "מרכז עזרה",
    },
    login: "התחברות",
    start: "התחילו עכשיו",
    openMenu: "פתיחת תפריט",
    closeMenu: "סגירת תפריט",
    skip: "דילוג לתוכן",
    footer: {
      blurb: "WhatsApp Business API מבוסס על WhatsApp Cloud API של Meta, למפתחים, לסוכנויות ולעסקים. ‎$29 לחודש לכל מספר WhatsApp. עלויות ההודעות של Meta מחויבות בנפרד.",
      product: "מוצר",
      developers: "מפתחים",
      company: "חברה",
      legal: "משפטי",
      calculator: "מחשבון עלויות",
      apiReference: "תיעוד OpenAPI",
      security: "אבטחה",
      privacy: "מדיניות פרטיות",
      terms: "תנאי שימוש",
      accessibility: "נגישות",
      rights: "כל הזכויות שמורות.",
      trademark: "WhatsApp ו-Meta הם סימנים מסחריים של Meta Platforms, Inc.",
    },
  },
  es: {
    nav: {
      overview: "Resumen",
      developers: "Desarrolladores",
      agencies: "Agencias",
      pricing: "Precios",
      docs: "Documentación",
      help: "Centro de ayuda",
    },
    login: "Iniciar sesión",
    start: "Empezar",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    skip: "Ir al contenido",
    footer: {
      blurb: "WhatsApp Business API basada en WhatsApp Cloud API de Meta, para desarrolladores, agencias y empresas. $29/mes por número de WhatsApp. Las tarifas de mensajería de Meta se facturan por separado.",
      product: "Producto",
      developers: "Desarrolladores",
      company: "Empresa",
      legal: "Legal",
      calculator: "Calculadora de costos",
      apiReference: "Referencia OpenAPI",
      security: "Seguridad",
      privacy: "Política de privacidad",
      terms: "Términos del servicio",
      accessibility: "Accesibilidad",
      rights: "Todos los derechos reservados.",
      trademark: "WhatsApp y Meta son marcas comerciales de Meta Platforms, Inc.",
    },
  },
  "pt-BR": {
    nav: {
      overview: "Visão geral",
      developers: "Desenvolvedores",
      agencies: "Agências",
      pricing: "Preços",
      docs: "Documentação",
      help: "Central de ajuda",
    },
    login: "Entrar",
    start: "Começar",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    skip: "Pular para o conteúdo",
    footer: {
      blurb: "WhatsApp Business API baseada na WhatsApp Cloud API da Meta, para desenvolvedores, agências e empresas. US$ 29/mês por número de WhatsApp. As tarifas de mensagens da Meta são cobradas separadamente.",
      product: "Produto",
      developers: "Desenvolvedores",
      company: "Empresa",
      legal: "Jurídico",
      calculator: "Calculadora de custos",
      apiReference: "Referência OpenAPI",
      security: "Segurança",
      privacy: "Política de Privacidade",
      terms: "Termos de Serviço",
      accessibility: "Acessibilidade",
      rights: "Todos os direitos reservados.",
      trademark: "WhatsApp e Meta são marcas comerciais da Meta Platforms, Inc.",
    },
  },
  ar: {
    nav: {
      overview: "نظرة عامة",
      developers: "المطورون",
      agencies: "الوكالات",
      pricing: "الأسعار",
      docs: "التوثيق",
      help: "مركز المساعدة",
    },
    login: "تسجيل الدخول",
    start: "ابدأ الآن",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    skip: "تخطَّ إلى المحتوى",
    footer: {
      blurb: "WhatsApp Business API مبنية على WhatsApp Cloud API من Meta، للمطورين والوكالات والشركات. ‎$29 شهريًا لكل رقم WhatsApp. تُحتسب رسوم رسائل Meta بشكل منفصل.",
      product: "المنتج",
      developers: "المطورون",
      company: "الشركة",
      legal: "قانوني",
      calculator: "حاسبة التكاليف",
      apiReference: "مرجع OpenAPI",
      security: "الأمان",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      accessibility: "إمكانية الوصول",
      rights: "جميع الحقوق محفوظة.",
      trademark: "WhatsApp وMeta علامتان تجاريتان لشركة Meta Platforms, Inc.",
    },
  },
};

export function useChromeCopy(lang: string): ChromeCopy {
  return CHROME_I18N[lang] || EN;
}

function LanguagePicker({ lang }: { lang: string }) {
  const { t } = useTranslation();
  return (
    <div className="wa-lang">
      <span className="wa-sr">{t("common.changeLanguage")}</span>
      <MenuSelect
        fit
        theme="dark"
        value={lang}
        ariaLabel={t("common.changeLanguage")}
        options={LANGUAGE_META.map((item) => ({ value: item.code, label: item.nativeLabel }))}
        onChange={(next) => {
          void changeAppLanguage(next);
        }}
      />
    </div>
  );
}

export function SiteHeader({ lang }: { lang: string }) {
  const copy = useChromeCopy(lang);
  const path = useSitePath();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === path;
  const close = () => setOpenOn(null);
  const [scrolled, setScrolled] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const scroller = document.documentElement;
    const previous = scroller.style.overflow;
    scroller.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenOn(null);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      scroller.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isCurrent = (target: string) => (target === "/" ? path === "/" : path === target || path.startsWith(`${target}/`));

  return (
    <header className={`wa-header${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <a className="wa-skip" href="#main">
        {copy.skip}
      </a>
      <div className="wa-wrap wa-header-inner">
        <SiteLink to="/" className="wa-brand" aria-label="Bizuply WhatsApp API home">
          <img src="/favicon-v2.png" alt="" width="34" height="34" />
          <span className="wa-brand-name">
            Bizuply <span>WhatsApp API</span>
          </span>
        </SiteLink>
        <nav className="wa-nav" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <SiteLink key={item.key} to={item.path} aria-current={isCurrent(item.path) ? "page" : undefined}>
              {copy.nav[item.key]}
            </SiteLink>
          ))}
        </nav>
        <div className="wa-header-end">
          <LanguagePicker lang={lang} />
          <a className="wa-btn wa-btn-quiet wa-hide-mobile" href={SIGN_IN_URL}>
            {copy.login}
          </a>
          <SiteLink to="/get-started" className="wa-btn wa-btn-primary wa-btn-sm">
            {copy.start}
          </SiteLink>
          <button
            ref={menuButton}
            type="button"
            className="wa-menu-btn"
            aria-label={open ? copy.closeMenu : copy.openMenu}
            aria-expanded={open}
            aria-controls="wa-drawer"
            onClick={() => setOpenOn(open ? null : path)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <div id="wa-drawer" className="wa-drawer" hidden={!open}>
        <nav aria-label="Mobile">
          {NAV_ITEMS.map((item) => (
            <SiteLink key={item.key} to={item.path} onClick={close} aria-current={isCurrent(item.path) ? "page" : undefined}>
              {copy.nav[item.key]}
            </SiteLink>
          ))}
        </nav>
        <div className="wa-actions">
          <SiteLink to="/get-started" onClick={close} className="wa-btn wa-btn-primary">
            {copy.start}
          </SiteLink>
          <a className="wa-btn wa-btn-ghost" href={SIGN_IN_URL}>
            {copy.login}
          </a>
        </div>
        <LanguagePicker lang={lang} />
      </div>
    </header>
  );
}

export function SiteFooter({ lang }: { lang: string }) {
  const copy = useChromeCopy(lang);
  const f = copy.footer;
  const year = new Date().getFullYear();
  return (
    <footer className="wa-footer">
      <div className="wa-wrap">
        <div className="wa-footer-grid">
          <div className="wa-footer-brand">
            <SiteLink to="/" className="wa-brand">
              <img src="/favicon-v2.png" alt="" width="30" height="30" loading="lazy" />
              <span className="wa-brand-name">
                Bizuply <span>WhatsApp API</span>
              </span>
            </SiteLink>
            <p>{f.blurb}</p>
          </div>
          <div>
            <h2>{f.product}</h2>
            <ul>
              <li><SiteLink to="/">{copy.nav.overview}</SiteLink></li>
              <li><SiteLink to="/pricing">{copy.nav.pricing}</SiteLink></li>
              <li><SiteLink to="/pricing#calculator">{f.calculator}</SiteLink></li>
              <li><SiteLink to="/get-started">{copy.start}</SiteLink></li>
            </ul>
          </div>
          <div>
            <h2>{f.developers}</h2>
            <ul>
              <li><SiteLink to="/developers">{copy.nav.developers}</SiteLink></li>
              <li><SiteLink to="/docs">{copy.nav.docs}</SiteLink></li>
              <li><a href={API_REFERENCE_URL}>{f.apiReference}</a></li>
              <li><a href={OPENAPI_URL}>openapi.json</a></li>
            </ul>
          </div>
          <div>
            <h2>{f.company}</h2>
            <ul>
              <li><SiteLink to="/agencies">{copy.nav.agencies}</SiteLink></li>
              <li><SiteLink to="/security">{f.security}</SiteLink></li>
              <li><SiteLink to="/help">{copy.nav.help}</SiteLink></li>
              <li><a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></li>
            </ul>
          </div>
          <div>
            <h2>{f.legal}</h2>
            <ul>
              <li><a href={PRIVACY_URL}>{f.privacy}</a></li>
              <li><a href={TERMS_URL}>{f.terms}</a></li>
              <li><a href={ACCESSIBILITY_URL}>{f.accessibility}</a></li>
            </ul>
          </div>
        </div>
        <div className="wa-footer-base">
          <span>© {year} Bizuply LLC. {f.rights}</span>
          <span>{f.trademark}</span>
        </div>
      </div>
    </footer>
  );
}
