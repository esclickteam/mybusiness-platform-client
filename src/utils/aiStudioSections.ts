type Palette = {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  text?: string;
};

type NavPage = { id?: string; title?: string; slug?: string; isHome?: boolean };

export type AiSectionRenderInput = {
  libraryId: string;
  content?: Record<string, any>;
  palette?: Palette;
  pages?: NavPage[];
  motion?: string;
};

function esc(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function asList(value: unknown): any[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim().startsWith("[")) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function paletteOf(palette?: Palette) {
  return {
    primary: palette?.primary || "#c4a574",
    secondary: palette?.secondary || "#8c7355",
    accent: palette?.accent || "#e6d3b3",
    background: palette?.background || "#0c0b0a",
    text: palette?.text || "#f6f1e8",
  };
}

export function aiStudioCss(palette?: Palette) {
  const color = paletteOf(palette);
  return `
.ai-studio{color:${color.text};background:${color.background};font-family:Georgia,"Times New Roman",serif}
.ai-studio *{box-sizing:border-box}
.ai-studio a{color:inherit}
.ai-wrap{width:min(1120px,calc(100% - 32px));margin:0 auto}
.ai-header{position:sticky;top:0;z-index:5;display:flex;flex-wrap:wrap;gap:16px 28px;align-items:center;justify-content:space-between;padding:18px 0;background:${color.background}ee;backdrop-filter:blur(10px)}
.ai-brand{font-weight:700;letter-spacing:.14em;text-transform:uppercase;font-size:13px;text-decoration:none}
.ai-nav{display:flex;flex-wrap:wrap;gap:14px 22px}
.ai-nav a{text-decoration:none;font-size:15px}
.ai-hero{position:relative;min-height:100svh;display:flex;align-items:flex-end;padding:48px 0 72px;overflow:hidden}
.ai-hero-media{position:absolute;inset:0;background-size:cover;background-position:center}
.ai-hero-media:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,11,10,.2),rgba(12,11,10,.88))}
.ai-hero-copy{position:relative;z-index:1;max-width:760px}
.ai-kicker{letter-spacing:.18em;text-transform:uppercase;font-size:12px;color:${color.accent};margin:0 0 14px}
.ai-hero h1{font-size:clamp(42px,7vw,88px);line-height:1.02;margin:0 0 18px;font-weight:500}
.ai-hero p,.ai-copy{font-family:Arial,sans-serif;font-size:18px;line-height:1.7;max-width:62ch}
.ai-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:28px}
.ai-btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 22px;border-radius:999px;text-decoration:none;font-family:Arial,sans-serif;font-size:15px}
.ai-btn-primary{background:${color.primary};color:#1a140e}
.ai-btn-ghost{border:1px solid ${color.accent};color:${color.text}}
.ai-section{padding:72px 0}
.ai-section h2{font-size:clamp(32px,4vw,56px);line-height:1.1;margin:0 0 16px;font-weight:500}
.ai-stats{display:grid;grid-template-columns:1fr;gap:18px}
.ai-stat{padding:22px;border-top:1px solid ${color.accent}55}
.ai-stat b{display:block;font-size:32px;color:${color.accent}}
.ai-grid{display:grid;grid-template-columns:1fr;gap:18px}
.ai-card{display:flex;flex-direction:column;background:#161411;color:${color.text};text-decoration:none;min-width:0;overflow:hidden}
.ai-card img{width:100%;height:240px;object-fit:cover;display:block}
.ai-card div{padding:18px 18px 22px}
.ai-card h3{margin:0 0 8px;font-size:26px}
.ai-meta{font-family:Arial,sans-serif;font-size:14px;color:${color.accent}}
.ai-price{font-family:Arial,sans-serif;margin-top:10px}
.ai-filters{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 22px}
.ai-filters label{font-family:Arial,sans-serif;border:1px solid ${color.accent}88;border-radius:999px;padding:8px 14px;cursor:pointer}
.ai-filter{position:absolute;opacity:0;pointer-events:none}
.ai-props{position:relative}
.ai-detail{display:grid;grid-template-columns:1fr;gap:22px}
.ai-detail img{width:100%;height:min(68vh,640px);object-fit:cover}
.ai-specs{display:grid;grid-template-columns:1fr 1fr;gap:10px;font-family:Arial,sans-serif}
.ai-specs div{padding:12px;background:#161411}
.ai-gallery{display:grid;grid-template-columns:1fr;gap:10px}
.ai-gallery img{width:100%;height:220px;object-fit:cover}
.ai-form{display:grid;gap:10px;font-family:Arial,sans-serif}
.ai-form input,.ai-form textarea{width:100%;padding:14px;border:1px solid ${color.accent}66;background:transparent;color:inherit}
.ai-cta{padding:28px;background:#161411}
.ai-footer{padding:28px 0 48px;font-family:Arial,sans-serif;opacity:.8}
.ai-rise{animation:ai-rise .9s ease both}
.ai-scroll{animation:ai-rise 1s ease both}
@keyframes ai-rise{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:none}}
@media (min-width:800px){
  .ai-stats{grid-template-columns:repeat(3,1fr)}
  .ai-grid{grid-template-columns:repeat(2,1fr)}
  .ai-gallery{grid-template-columns:repeat(2,1fr)}
  .ai-detail{grid-template-columns:1.2fr .8fr;align-items:start}
}
@media (min-width:1100px){
  .ai-grid{grid-template-columns:repeat(3,1fr)}
}
@media (max-width:800px){
  .ai-grid,.ai-stats,.ai-gallery,.ai-detail{grid-template-columns:1fr}
  .ai-hero{min-height:auto;padding-top:72px}
  .ai-hero h1{font-size:42px}
  .ai-card img,.ai-cta,.ai-banner{max-width:100%;height:auto}
  .ai-card img{height:220px}
}
@supports (animation-timeline:view()){
  .ai-scroll{animation:ai-rise linear both;animation-timeline:view();animation-range:entry 0% cover 40%}
}
@media (prefers-reduced-motion:reduce){
  .ai-rise,.ai-scroll{animation:none}
}
`.trim();
}

function navHtml(pages: NavPage[] = []) {
  return pages
    .map((page) => {
      const home = Boolean(page.isHome || page.id === "home");
      const href = home ? "/" : `/${String(page.slug || page.id || "").replace(/^\//, "")}`;
      return `<a href="${esc(href)}">${esc(page.title || page.id || "")}</a>`;
    })
    .join("");
}

function motionClass(motion?: string) {
  return motion === "calm" ? "ai-rise" : "ai-scroll";
}

export function renderAiSectionHtml(input: AiSectionRenderInput) {
  const content = input.content || {};
  const color = paletteOf(input.palette);
  const motion = motionClass(input.motion || content.motion);
  const id = String(input.libraryId || "");

  if (id === "section-ai-header") {
    return `<header class="ai-studio ai-header" dir="rtl"><style>${aiStudioCss(input.palette)}</style><div class="ai-wrap" style="display:flex;flex-wrap:wrap;gap:16px 28px;align-items:center;justify-content:space-between;width:min(1120px,calc(100% - 32px))"><a class="ai-brand" href="/">${esc(content.title || "AI Studio")}</a><nav class="ai-nav">${navHtml(input.pages)}</nav></div></header>`;
  }

  if (id === "section-ai-hero") {
    const image = String(content.image || "");
    return `<section class="ai-studio ai-hero ${motion}" dir="rtl"><div class="ai-hero-media" style="background-image:linear-gradient(180deg,rgba(12,11,10,.15),rgba(12,11,10,.82)),url('${esc(image)}')"></div><div class="ai-wrap ai-hero-copy"><p class="ai-kicker">${esc(content.eyebrow || content.badge || "")}</p><h1>${esc(content.title || "")}</h1><p>${esc(content.copy || "")}</p><div class="ai-actions"><a class="ai-btn ai-btn-primary" href="/contact">${esc(content.primary || content.ctaButton || "צרו קשר")}</a><a class="ai-btn ai-btn-ghost" href="${esc(content.secondaryHref || "/contact")}">${esc(content.secondary || "עוד")}</a></div></div></section>`;
  }

  if (id === "section-ai-stats") {
    const items = asList(content.items)
      .map(
        (item) =>
          `<div class="ai-stat"><b>${esc(item.value)}</b><span>${esc(item.label)}</span></div>`
      )
      .join("");
    return `<section class="ai-studio ai-section ${motion}" dir="rtl"><div class="ai-wrap"><div class="ai-stats">${items}</div></div></section>`;
  }

  if (id === "section-ai-about") {
    return `<section class="ai-studio ai-section ${motion}" dir="rtl"><div class="ai-wrap ai-detail"><img src="${esc(content.image || "")}" alt=""/><div><h2>${esc(content.title || "")}</h2><p class="ai-copy">${esc(content.copy || "")}</p></div></div></section>`;
  }

  if (id === "section-ai-properties") {
    const items = asList(content.items);
    const areas = Array.from(
      new Set(items.map((item) => String(item.area || "")).filter(Boolean))
    );
    const filterOn = String(content.filter) === "true" && areas.length > 1;
    const scope = `f-${id}-${Math.abs(hash(items.map((item) => item.id).join("")))}`;
    const radios = filterOn
      ? [`<input class="ai-filter" type="radio" name="${scope}" id="${scope}-all" checked>`]
          .concat(
            areas.map(
              (area, index) =>
                `<input class="ai-filter" type="radio" name="${scope}" id="${scope}-${index}">`
            )
          )
          .join("")
      : "";
    const labels = filterOn
      ? `<div class="ai-filters"><label for="${scope}-all">הכל</label>${areas
          .map((area, index) => `<label for="${scope}-${index}">${esc(area)}</label>`)
          .join("")}</div>`
      : "";
    const hideCss = filterOn
      ? `<style>${areas
          .map(
            (area, index) =>
              `#${scope}-${index}:checked ~ .ai-wrap .ai-card:not([data-area="${esc(area)}"]){display:none}`
          )
          .join("")}</style>`
      : "";
    const cards = items
      .map((item) => {
        const href = "/property";
        return `<a class="ai-card" data-area="${esc(item.area || "")}" href="${href}"><img src="${esc(item.image || "")}" alt="${esc(item.name || "")}"><div><p class="ai-meta">${esc(item.area || "")}</p><h3>${esc(item.name || "")}</h3><p class="ai-copy">${esc(item.copy || "")}</p><p class="ai-price">${esc(item.price || "")} · ${esc(item.beds || "")} חדרי שינה</p><span class="ai-btn ai-btn-ghost">לפרטי הנכס</span></div></a>`;
      })
      .join("");
    return `<section class="ai-studio ai-section ai-props ${motion}" dir="rtl">${hideCss}${radios}<div class="ai-wrap"><h2>${esc(content.title || "נכסים")}</h2><p class="ai-copy">${esc(content.copy || "")}</p>${labels}<div class="ai-grid">${cards}</div></div></section>`;
  }

  if (id === "section-ai-property") {
    const gallery = asList(content.gallery)
      .map((src) => `<img src="${esc(src)}" alt="${esc(content.name || content.title || "")}">`)
      .join("");
    const highlights = asList(content.highlights)
      .map((item) => `<li>${esc(item)}</li>`)
      .join("");
    return `<article class="ai-studio ai-section ${motion}" dir="rtl"><div class="ai-wrap ai-detail"><img src="${esc(content.image || "")}" alt="${esc(content.name || "")}"><div><p class="ai-kicker">${esc(content.area || "")}</p><h2>${esc(content.title || content.name || "")}</h2><p class="ai-copy">${esc(content.copy || "")}</p><div class="ai-specs"><div>${esc(content.beds || "")} חדרי שינה</div><div>${esc(content.baths || "")} חדרי רחצה</div><div>${esc(content.size || "")}</div><div>${esc(content.price || "")}</div></div><ul>${highlights}</ul><div class="ai-actions"><a class="ai-btn ai-btn-primary" href="/contact">${esc(content.primary || "קבעו פגישה")}</a></div></div></div><div class="ai-wrap ai-gallery">${gallery}</div></article>`;
  }

  if (id === "section-ai-neighborhoods" || id === "section-ai-services") {
    const items = asList(content.items)
      .map(
        (item) =>
          `<article class="ai-card"><div><h3>${esc(item.name)}</h3><p class="ai-copy">${esc(item.copy || "")}</p></div></article>`
      )
      .join("");
    return `<section class="ai-studio ai-section ${motion}" dir="rtl"><div class="ai-wrap"><h2>${esc(content.title || "")}</h2><div class="ai-grid">${items}</div></div></section>`;
  }

  if (id === "section-ai-contact") {
    return `<section class="ai-studio ai-section ${motion}" dir="rtl"><div class="ai-wrap ai-detail"><div><h2>${esc(content.title || "צור קשר")}</h2><p class="ai-copy">${esc(content.copy || "")}</p><p class="ai-meta">${esc(content.address || "")}</p><p class="ai-meta">${esc(content.phone || "")}</p><p class="ai-meta">${esc(content.email || "")}</p></div><form class="ai-form" action="/contact" method="get"><input name="name" placeholder="שם" aria-label="שם"><input name="phone" placeholder="טלפון" aria-label="טלפון"><textarea name="note" rows="4" placeholder="איזה נכס מעניין אתכם?" aria-label="הודעה"></textarea><button class="ai-btn ai-btn-primary" type="submit">${esc(content.cta || "שליחה")}</button></form></div></section>`;
  }

  if (id === "section-ai-cta") {
    return `<section class="ai-studio ai-section ${motion}" dir="rtl"><div class="ai-wrap ai-cta"><h2>${esc(content.title || "")}</h2><p class="ai-copy">${esc(content.copy || "")}</p><div class="ai-actions"><a class="ai-btn ai-btn-primary" href="/contact">${esc(content.primary || "צרו קשר")}</a></div></div></section>`;
  }

  if (id === "section-ai-footer") {
    return `<footer class="ai-studio ai-footer" dir="rtl" style="background:${color.background}"><div class="ai-wrap">${esc(content.copy || content.title || "")}</div></footer>`;
  }

  return `<section class="ai-studio ai-section" dir="rtl"><div class="ai-wrap"><h2>${esc(content.title || "")}</h2><p class="ai-copy">${esc(content.copy || "")}</p></div></section>`;
}

function hash(value: string) {
  let out = 0;
  for (let index = 0; index < value.length; index += 1) {
    out = (out * 31 + value.charCodeAt(index)) | 0;
  }
  return out;
}
