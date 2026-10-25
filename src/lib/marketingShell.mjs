/**
 * Static public header for the first HTML paint.
 * It uses the same classes as Header.tsx. Pages that do not call this stay unchanged.
 */

import { marketingNav } from "./marketingNav.mjs";

const PREFIX = { en: "", he: "/he", es: "/es", "pt-BR": "/pt-br", ar: "/ar" };

const CHROME = {
  en: { dir: "ltr", login: "Login", cta: "Get Started", menu: "Open menu", language: "Change language", code: "EN", nav: "Main navigation" },
  he: { dir: "rtl", login: "התחברות", cta: "הירשמו עכשיו", menu: "פתח תפריט", language: "החלפת שפה", code: "HE", nav: "ניווט ראשי" },
  es: { dir: "ltr", login: "Iniciar sesión", cta: "Empezar", menu: "Abrir menú", language: "Cambiar idioma", code: "ES", nav: "Navegación principal" },
  "pt-BR": { dir: "ltr", login: "Entrar", cta: "Começar", menu: "Abrir menu", language: "Alterar idioma", code: "PT", nav: "Navegação principal" },
  ar: { dir: "rtl", login: "تسجيل الدخول", cta: "ابدأ الآن", menu: "فتح القائمة", language: "تغيير اللغة", code: "AR", nav: "التنقل الرئيسي" },
};

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function href(locale, path) {
  if (path === "/") return PREFIX[locale] || "/";
  return `${PREFIX[locale] || ""}${path}`;
}

const GLOBE = `<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9S14.5 18.2 12 21c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
const USER = `<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><circle cx="12" cy="8" r="3.2" fill="currentColor"/><path d="M5.5 19.2c1.4-2.6 3.7-3.8 6.5-3.8s5.1 1.2 6.5 3.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>`;

export function renderMarketingHeader(locale, activePath) {
  const chrome = CHROME[locale] || CHROME.en;
  const groups = marketingNav(locale);
  const nav = groups.map((group) => {
    if (!group.links) {
      const active = group.to === activePath ? " is-active" : "";
      return `<a class="site-header__link${active}" href="${esc(href(locale, group.to))}">${esc(group.label)}</a>`;
    }
    const links = group.links
      .map(([to, label]) => `<a href="${esc(href(locale, to))}">${esc(label)}</a>`)
      .join("");
    return `<div class="site-nav__item"><button type="button" class="site-header__link site-nav__button" aria-expanded="false">${esc(group.label)}</button><div class="site-nav__panel" hidden>${links}</div></div>`;
  }).join("");
  const home = esc(href(locale, "/"));
  const login = esc(href(locale, "/login"));
  const pricing = esc(href(locale, "/pricing"));
  return `<header class="site-header" data-bizuply-shell="header" dir="${chrome.dir}"><nav class="site-header__bar" aria-label="${esc(chrome.nav)}"><a class="site-header__logo" href="${home}" aria-label="BizUply"><img src="/brand/logo.svg" alt="BizUply" width="180" height="46"></a><div class="site-header__nav">${nav}</div><div class="site-header__actions"><button type="button" class="site-header__icon-btn" aria-label="${esc(chrome.language)}"><span class="site-header__lang-code">${chrome.code}</span>${GLOBE}</button><a class="site-header__signin" href="${login}">${esc(chrome.login)}</a><a class="site-header__cta" href="${pricing}">${esc(chrome.cta)}</a></div><div class="site-header__mobile"><button type="button" class="site-header__icon-btn" aria-label="${esc(chrome.language)}"><span class="site-header__lang-code">${chrome.code}</span>${GLOBE}</button><a class="site-header__icon-btn" href="${login}" aria-label="${esc(chrome.login)}">${USER}</a><button type="button" class="site-header__burger" aria-label="${esc(chrome.menu)}" aria-expanded="false"><span></span><span></span><span></span></button></div></nav></header>`;
}
