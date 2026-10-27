import { getWebsiteBuilderCopy, WB_MEDIA } from "./websiteBuilderCopy.mjs";
import { splitMarketingLocale } from "../lib/localePath.mjs";

function esc(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function buildWebsiteBuilderFirstPaint(pathname) {
  const { locale, path } = splitMarketingLocale(pathname);
  if (path !== "/website-builder") return null;
  const copy = getWebsiteBuilderCopy(locale);
  const home = locale === "en" ? "/" : `/${locale === "pt-BR" ? "pt-br" : locale}/`;
  const faqs = copy.faq.items
    .map(([question, answer]) => `<details open><summary><h3>${esc(question)}</h3></summary><p>${esc(answer)}</p></details>`)
    .join("");
  const style = `<style>
    .wb-first{margin:0;background:#071426;color:#f8fafc;font-family:Inter,Assistant,Arial,sans-serif}
    .wb-first a{color:inherit}
    .wb-first header{display:flex;align-items:center;justify-content:space-between;padding:14px 22px}
    .wb-first header img{height:40px;width:auto}
    .wb-first .hero{display:grid;grid-template-columns:1fr 1fr;gap:28px;align-items:center;padding:28px 6vw 64px}
    .wb-first h1{font-size:clamp(2rem,4vw,3.4rem);line-height:1.1;margin:8px 0}
    .wb-first p{color:#e7eef8;line-height:1.6}
    .wb-first .rest{background:#fff;color:#0f172a;padding:48px 6vw}
    .wb-first .rest p,.wb-first .rest h2,.wb-first .rest h3{color:#0f172a}
    @media(max-width:800px){.wb-first .hero{grid-template-columns:1fr}}
  </style>`;
  return {
    lang: copy.lang,
    dir: copy.dir,
    inner: `${style}<div class="wb-first" lang="${copy.lang}" dir="${copy.dir}"><header class="site-header"><a href="${esc(home)}"><img src="/logo-mark.svg" alt="BizUply" width="176" height="52"></a><a href="${esc(home)}login">${locale === "he" ? "כניסה" : locale === "ar" ? "دخول" : locale === "es" ? "Entrar" : locale === "pt-BR" ? "Entrar" : "Login"}</a></header><section class="hero"><div><p>${esc(copy.hero.eyebrow)}</p><h1>${esc(copy.hero.title)}</h1><p>${esc(copy.hero.description)}</p></div><img src="${WB_MEDIA.heroDesktop}" alt="${esc(copy.hero.desktopAlt)}" width="1440" height="900"></section><div class="rest"><h2>${esc(copy.about.title)}</h2><p>${esc(copy.about.lead)}</p><p>${esc(copy.about.more)}</p><h2>${esc(copy.faq.title)}</h2>${faqs}</div></div>`,
  };
}
