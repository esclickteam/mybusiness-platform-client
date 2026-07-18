import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import { servoraEditorCss } from "./editorCss";

export type ServoraPageId = "home" | "services" | "pricing" | "gallery" | "contact";

export type ServoraNavItem = { label: string; page: ServoraPageId };
export type ServoraStat = { icon: string; value: string; label: string };
export type ServoraService = { icon: string; title: string; text: string };
export type ServoraProcessStep = { icon: string; number: string; title: string; text: string };
export type ServoraPrice = { title: string; price: string; text: string; features: string[] };
export type ServoraTestimonial = { name: string; role: string; quote: string };
export type ServoraFaq = { question: string; answer: string };

export type ServoraData = {
  brand: {
    name: string;
    label: string;
    phone: string;
    email: string;
    whatsapp: string;
  };
  nav: ServoraNavItem[];
  trustPills: string[];
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    text: string;
    bullets: string[];
    primaryCta: string;
    secondaryCta: string;
    image: string;
    emergencyTitle: string;
    emergencyText: string;
  };
  stats: ServoraStat[];
  services: ServoraService[];
  project: {
    eyebrow: string;
    title: string;
    text: string;
    image: string;
    points: string[];
  };
  process: ServoraProcessStep[];
  pricing: ServoraPrice[];
  testimonials: ServoraTestimonial[];
  faq: ServoraFaq[];
  cta: {
    title: string;
    text: string;
    button: string;
  };
  contact: {
    eyebrow: string;
    title: string;
    text: string;
    address: string;
    hours: string;
  };
};

export const servoraPages = [
  { id: "home", title: "ראשי", slug: "/" },
  { id: "services", title: "שירותים", slug: "/services" },
  { id: "pricing", title: "מחירים", slug: "/pricing" },
  { id: "gallery", title: "עבודות", slug: "/gallery" },
  { id: "contact", title: "צור קשר", slug: "/contact" },
] as const;

export const servoraDefaultData: ServoraData = {
  brand: {
    name: "ברקמן",
    label: "שירות חשמל לבית ולעסק",
    phone: "03-683-7420",
    email: "info@barakman.co.il",
    whatsapp: "050-683-7420",
  },
  nav: [
    { label: "ראשי", page: "home" },
    { label: "שירותים", page: "services" },
    { label: "עבודות", page: "gallery" },
    { label: "מחירים", page: "pricing" },
    { label: "צור קשר", page: "contact" },
  ],
  trustPills: ["שירות 24/7", "מחירים הוגנים", "חשמלאים מוסמכים", "אחריות מלאה", "פריסה ארצית"],
  hero: {
    eyebrow: "חשמלאי מוסמך עם ניסיון",
    title: "מתקנים, משדרגים ומשפצים מערכות חשמל",
    highlight: "בכל סוגי הבתים והעסקים.",
    text:
      "שירות חשמל מקצועי, מהיר ובטוח — מתיקון תקלה ועד שדרוג מערכת מלאה. זמינים לקריאות דחופות, התקנות, לוחות חשמל ותחזוקה שוטפת.",
    bullets: ["שירות מהיר, אמין ומקצועי", "חשמלאים מוסמכים עם ניסיון רב", "מענה 24/7 לכל בעיה וקריאה"],
    primaryCta: "לקביעת ביקור",
    secondaryCta: "צפו בשירותים",
    image: "/images/servora-electric-hero-wide.png",
    emergencyTitle: "24/7",
    emergencyText: "זמינות לקריאות חשמל דחופות ותיאום מהיר",
  },
  stats: [
    { icon: "⚡", value: "+15", label: "שנות ניסיון" },
    { icon: "👥", value: "1,200+", label: "לקוחות מרוצים" },
    { icon: "🛡", value: "98%", label: "שביעות רצון" },
    { icon: "🕘", value: "24/7", label: "זמינות מלאה" },
    { icon: "★", value: "+15", label: "חשמלאים מוסמכים" },
  ],
  services: [
    { icon: "⚙", title: "תיקונים ושדרוגים", text: "תיקון תקלות, שדרוג לוח חשמל, החלפת שקעים ונקודות בצורה בטוחה." },
    { icon: "▣", title: "התקנות חדשות", text: "התקנת גופי תאורה, נקודות חשמל, מפסקים, מאווררים ומערכות ביתיות." },
    { icon: "↗", title: "שדרוג ואוטומציה", text: "הכנה לבית חכם, תכנון עומסים, חיבור מערכות ותשתיות מתקדמות." },
    { icon: "⌁", title: "פתרונות לעסקים", text: "תכנון וביצוע מערכות חשמל לעסקים, משרדים ומבנים מסחריים." },
    { icon: "💡", title: "התקנות תאורה", text: "גופי תאורה, פסי לד, תאורת חוץ, תאורת פנים ותכנון נקודות חדשות." },
    { icon: "⬟", title: "תחזוקה מונעת", text: "בדיקות תקופתיות, סריקות עומסים, איתור תקלות ומניעת בעיות מראש." },
  ],
  project: {
    eyebrow: "העבודה שלנו",
    title: "פתרונות חשמל מתקדמים, בטוחים ונוחים.",
    text: "התקנות, תיקונים ולוחות חשמל בצורה שמחזקת אמון ומראה ללקוח עבודה מסודרת, בטיחותית ומקצועית.",
    image: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=1400&q=90",
    points: ["בדיקה מקיפה לפני עבודה", "חומרים איכותיים ותקניים", "שקיפות מלאה במחיר", "שירות אישי וליווי עד סיום העבודה"],
  },
  process: [
    { number: "01", icon: "☎", title: "פנייה ואבחון", text: "מספרים לנו מה הבעיה ומקבלים הכוונה ראשונית." },
    { number: "02", icon: "▤", title: "בדיקה ותכנון", text: "מתאמים ביקור, בודקים עומסים ומציעים פתרון." },
    { number: "03", icon: "▧", title: "הצעת מחיר", text: "מקבלים הצעה מסודרת וברורה לפני תחילת העבודה." },
    { number: "04", icon: "🛠", title: "ביצוע מקצועי", text: "מבצעים את העבודה בצורה נקייה, בטוחה ומהירה." },
    { number: "05", icon: "🛡", title: "שירות וליווי", text: "אחריות מלאה וליווי גם לאחר הביצוע." },
  ],
  pricing: [
    { title: "תיקון מהיר", price: "₪150+", text: "הגעה לאבחון ותיקון תקלה בסיסית בבית או בעסק.", features: ["מענה 24/7", "מחיר שקוף", "אחריות מלאה"] },
    { title: "הכל משודרג", price: "₪180+", text: "שדרוג נקודות חשמל, התקנת אביזרים ותיקונים מתקדמים.", features: ["חומרים איכותיים", "עבודה מסודרת", "אחריות מלאה"] },
    { title: "התקנה בסיסית", price: "₪290+", text: "התקנת נקודה, גוף תאורה או מערכת חשמל בסיסית.", features: ["ייעוץ ראשוני", "בדיקת עומסים", "סיום נקי"] },
  ],
  testimonials: [
    { name: "יוסי כהן, חולון", role: "לקוח פרטי", quote: "שירות מעולה, מהיר ואמין. פתרו את התקלה במקצועיות ותודה רבה!" },
    { name: "מיכל לוי, רמת גן", role: "לקוחה פרטית", quote: "הגיעו בזמן, הסבירו בדיוק מה צריך לעשות והמחיר היה ברור מראש." },
    { name: "אבי דניאל, תל אביב", role: "בעל עסק", quote: "עבודה נקייה מאוד, התקנה מקצועית ושירות אדיב. ממליץ בחום." },
  ],
  faq: [
    { question: "האם אתם נותנים אחריות על העבודה?", answer: "כן. כל עבודה מתבצעת על ידי חשמלאי מוסמך וכוללת אחריות בהתאם לסוג העבודה." },
    { question: "כמה זמן לוקח להגיע לטיפול?", answer: "בקריאות דחופות ניתן לתאם הגעה מהירה לפי אזור וזמינות." },
    { question: "האם השירות מתאים גם לבתים וגם לעסקים?", answer: "כן. אנחנו עובדים עם דירות, בתים פרטיים, משרדים, חנויות ועסקים קטנים." },
    { question: "איך מתבצע התשלום?", answer: "התשלום מתבצע לאחר ביצוע העבודה או לפי שלבי הפרויקט, בהתאם למה שסוכם מראש." },
  ],
  cta: {
    title: "זקוקים לחשמלאי עכשיו?",
    text: "שירות מהיר, אמין ומקצועי — אנחנו כאן בשבילכם.",
    button: "התקשרו עכשיו",
  },
  contact: {
    eyebrow: "לקביעת ביקור או ייעוץ",
    title: "השאירו פרטים ונחזור אליכם במהירות.",
    text: "נשמח להבין מה התקלה, לתאם ביקור ולתת הצעת מחיר מסודרת.",
    address: "החשמלאי 12, תל אביב",
    hours: "א׳-ה׳ 08:00-20:00, שישי 08:00-13:00, חירום 24/7",
  },
};

export const servoraPalette: ReadyWebsitePalette = {
  primary: "#07111F",
  secondary: "#FF6A1A",
  accent: "#FFD166",
  background: "#FFF7ED",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  dark: "#07111F",
};

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const blocks = [
  { type: "header", variant: "electric-sticky-rtl", title: "Header" },
  { type: "hero", variant: "electric-form-hero-rtl", title: "Hero" },
  { type: "trust", variant: "electric-trust-pills-rtl", title: "Trust" },
  { type: "about", variant: "electric-proof-rtl", title: "Proof" },
  { type: "results", variant: "dark-electric-stats-rtl", title: "Stats" },
  { type: "services", variant: "electric-services-grid-rtl", title: "Services" },
  { type: "process", variant: "electric-process-line-rtl", title: "Process" },
  { type: "testimonials", variant: "electric-testimonials-rtl", title: "Testimonials" },
  { type: "pricing", variant: "electric-pricing-rtl", title: "Pricing" },
  { type: "faq", variant: "electric-faq-rtl", title: "FAQ" },
  { type: "contact", variant: "electric-footer-form-rtl", title: "Contact" },
] as unknown as TemplateBlockInput[];

function withBlockIds(
  templateId: string,
  inputBlocks: TemplateBlockInput[],
): ReadyWebsiteBlock[] {
  return inputBlocks.map((block, index) => ({
    id: `${templateId}-${index + 1}-${block.type}`,
    ...block,
  }));
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type StaticVisualElementType =
  | "text"
  | "image"
  | "button"
  | "section"
  | "box";

function visualAttrs(
  id: string,
  type: StaticVisualElementType,
  label?: string,
) {
  const safeId = escapeHtml(id);
  const safeType = escapeHtml(type);
  const safeLabel = label
    ? ` data-visual-edit-label="${escapeHtml(label)}"`
    : "";

  return `data-visual-edit-id="${safeId}" data-visual-edit-type="${safeType}" data-visual-type="${safeType}" data-visual-editable="true"${safeLabel}`;
}

function textAttrs(id: string, label?: string) {
  return `${visualAttrs(id, "text", label)} data-editable="text" data-gjs-type="text"`;
}

function buttonAttrs(id: string, label?: string) {
  return `${visualAttrs(id, "button", label)} data-editable="button" data-editable-link="true"`;
}

function sectionAttrs(id: string, label: string, kind: string) {
  return `${visualAttrs(id, "section", label)} data-template-section-id="${escapeHtml(
    id,
  )}" data-section-kind="${escapeHtml(kind)}" data-section-title="${escapeHtml(
    label,
  )}"`;
}

function mediaAttrs(field: string, label: string) {
  return `${visualAttrs(
    field,
    "image",
    label,
  )} data-editable="image" data-field="${escapeHtml(
    field,
  )}" data-image-field="${escapeHtml(
    field,
  )}" data-visual-field="${escapeHtml(
    field,
  )}" data-visual-image-field="${escapeHtml(field)}"`;
}

function buttonHref(page: string) {
  return page === "home" ? "/" : `/${page}`;
}

function createServiceRequestCardHtml(
  compact = false,
  scope = "global.request",
) {
  const data = servoraDefaultData;

  return `
<div
  class="servora-request-card${
    compact
      ? " servora-request-card-float servora-free-move-element"
      : ""
  }"
  ${visualAttrs(scope, "section", "טופס בקשת שירות")}
  data-gjs-type="default"
  data-gjs-draggable="true"
  data-gjs-droppable="true"
  data-gjs-resizable="true"
  data-gjs-removable="true"
  data-gjs-copyable="true"
  data-gjs-selectable="true"
>
  <div class="servora-request-card-head">
    <div>
      <h3 ${textAttrs(`${scope}.title`, "כותרת הטופס")}>בקשת שירות מהירה</h3>
      <p ${textAttrs(
        `${scope}.text`,
        "תיאור הטופס",
      )}>השאירו פרטים ונחזור אליכם עם הצעה.</p>
    </div>
    <span class="servora-request-icon" aria-hidden="true">⚡</span>
  </div>

  <form class="servora-request-form">
    <input
      type="text"
      name="name"
      placeholder="שם מלא"
      aria-label="שם מלא"
      dir="rtl"
      ${visualAttrs(`${scope}.nameInput`, "box", "שדה שם")}
      data-editable="input"
    />
    <input
      type="tel"
      name="phone"
      placeholder="טלפון"
      aria-label="טלפון"
      dir="rtl"
      ${visualAttrs(`${scope}.phoneInput`, "box", "שדה טלפון")}
      data-editable="input"
    />
    <select
      name="service"
      aria-label="בחירת שירות"
      dir="rtl"
      ${visualAttrs(`${scope}.serviceSelect`, "box", "בחירת שירות")}
      data-editable="select"
    >
      ${data.services
        .map(
          (service) =>
            `<option>${escapeHtml(service.title)}</option>`,
        )
        .join("")}
    </select>
    <button
      type="submit"
      class="servora-btn servora-btn-orange servora-request-submit"
      ${buttonAttrs(`${scope}.submit`, "שליחת בקשה")}
    >
      שליחת בקשה
    </button>
  </form>
</div>`;
}

function createHeaderHtml() {
  const data = servoraDefaultData;

  return `
<header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header"
  class="servora-header"
  ${sectionAttrs("global.header", "כותרת עליונה", "header")}
>
  <div class="servora-shell">
    <div class="servora-header-inner">
      <a
        class="servora-brand"
        href="/"
        aria-label="חזרה לדף הבית"
        ${buttonAttrs("global.header.brand", "לוגו ומותג")}
      >
        <span class="servora-brand-mark" aria-hidden="true">⚡</span>
        <span>
          <strong
            class="servora-brand-name"
            ${textAttrs("global.header.brand.name", "שם העסק")}
          >${escapeHtml(data.brand.name)}</strong>
          <span
            class="servora-brand-label"
            ${textAttrs("global.header.brand.label", "תיאור העסק")}
          >${escapeHtml(data.brand.label)}</span>
        </span>
      </a>

      <nav class="servora-nav" aria-label="ניווט ראשי">
        ${data.nav
          .map(
            (item, index) => `
          <a
            class="servora-nav-link"
            href="${buttonHref(item.page)}"
            ${buttonAttrs(
              `global.header.nav.${index}`,
              `קישור ניווט ${index + 1}`,
            )}
          >${escapeHtml(item.label)}</a>`,
          )
          .join("")}
      </nav>

      <div class="servora-header-actions">
        <a
          href="tel:${escapeHtml(data.brand.phone)}"
          class="servora-phone-pill"
          ${buttonAttrs("global.header.phoneLink", "קישור טלפון")}
        >
          <span aria-hidden="true">☎</span>
          <strong
            ${textAttrs("global.header.phoneText", "מספר טלפון")}
          >${escapeHtml(data.brand.phone)}</strong>
        </a>

        <a
          href="/contact"
          class="servora-btn servora-btn-orange servora-header-cta"
          ${buttonAttrs(
            "global.header.primaryCta",
            "כפתור ראשי בכותרת",
          )}
        >
          לקביעת ביקור
        </a>
      </div>
    </div>
  </div>
</header>`;
}

function createHomeHeroHtml() {
  const data = servoraDefaultData;

  return `
<section
  class="servora-hero servora-electric-hero"
  ${sectionAttrs("home.hero", "אזור פתיחה", "hero")}
>
  <div class="servora-shell">
    <div class="servora-hero-grid">
      <div
        class="servora-hero-media servora-reveal"
        ${visualAttrs(
          "home.hero.mediaColumn",
          "box",
          "עמודת מדיה וטופס",
        )}
      >
        <div
          class="servora-media-card"
          ${visualAttrs(
            "home.hero.mediaCard",
            "box",
            "כרטיס תמונה ראשי",
          )}
        >
          <img
            src="${escapeHtml(data.hero.image)}"
            alt="חשמלאי מקצועי"
            data-visual-current-src="${escapeHtml(data.hero.image)}"
            data-visual-media-type="image"
            ${mediaAttrs("hero.image", "חשמלאי מקצועי")}
          />
        </div>

        ${createServiceRequestCardHtml(true, "home.hero.request")}
      </div>

      <div
        class="servora-hero-content servora-reveal servora-delay-1"
        ${visualAttrs(
          "home.hero.content",
          "box",
          "תוכן אזור הפתיחה",
        )}
      >
        <span
          class="servora-eyebrow"
          ${textAttrs("hero.eyebrow", "כותרת עליונה")}
        >${escapeHtml(data.hero.eyebrow)}</span>

        <h1
          class="servora-hero-title"
          ${visualAttrs(
            "home.hero.titleGroup",
            "box",
            "כותרת ראשית",
          )}
        >
          <span
            ${textAttrs("hero.title", "כותרת ראשית")}
          >${escapeHtml(data.hero.title)}</span>
          <span
            class="servora-highlight"
            ${textAttrs("hero.highlight", "הדגשת הכותרת")}
          >${escapeHtml(data.hero.highlight)}</span>
        </h1>

        <ul class="servora-hero-bullets">
          ${data.hero.bullets
            .map(
              (bullet, index) =>
                `<li ${textAttrs(
                  `hero.bullets.${index}`,
                  `יתרון ${index + 1}`,
                )}>${escapeHtml(bullet)}</li>`,
            )
            .join("")}
        </ul>

        <div class="servora-hero-actions">
          <a
            href="/contact"
            class="servora-btn servora-btn-orange"
            ${buttonAttrs("hero.primaryCta", "כפתור ראשי")}
          >${escapeHtml(data.hero.primaryCta)}</a>
          <a
            href="/services"
            class="servora-btn servora-btn-light"
            ${buttonAttrs("hero.secondaryCta", "כפתור משני")}
          >${escapeHtml(data.hero.secondaryCta)}</a>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function createTrustStripHtml(scope: string) {
  const data = servoraDefaultData;

  return `
<section
  class="servora-trust-strip"
  ${sectionAttrs(scope, "פס יתרונות", "trust")}
>
  <div class="servora-shell">
    <div class="servora-trust-pills">
      ${data.trustPills
        .map(
          (item, index) =>
            `<span class="servora-logo-pill" ${textAttrs(
              `trustPills.${index}`,
              `יתרון מהיר ${index + 1}`,
            )}>${escapeHtml(item)}</span>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function createIntroHtml(scope: string) {
  const data = servoraDefaultData;

  return `
<section
  class="servora-section servora-proof-section"
  ${sectionAttrs(scope, "למה לבחור בנו", "about")}
>
  <div class="servora-shell">
    <div class="servora-proof-grid">
      <article
        class="servora-emergency-panel servora-reveal"
        ${visualAttrs(
          `${scope}.emergencyCard`,
          "section",
          "כרטיס שירות חירום",
        )}
      >
        <span class="servora-neon-bolt" aria-hidden="true">ϟ</span>
        <h2
          ${textAttrs(
            `${scope}.emergencyTitle`,
            "כותרת שירות חירום",
          )}
        >שירות חשמלאי מקצועי 24/7</h2>
        <p
          ${textAttrs(
            `${scope}.emergencyText`,
            "תיאור שירות חירום",
          )}
        >זמינים לקריאות דחופות, תיקון תקלות, התקנות ושדרוג חשמל — עם אחריות מלאה.</p>
        <a
          class="servora-dark-phone"
          href="tel:${escapeHtml(data.brand.phone)}"
          ${buttonAttrs(
            `${scope}.emergencyCta`,
            "כפתור חייגו עכשיו",
          )}
        >חייגו עכשיו</a>
      </article>

      <article
        class="servora-proof-card servora-reveal servora-delay-1"
        ${visualAttrs(
          `${scope}.proofCard`,
          "section",
          "כרטיס הוכחת מקצועיות",
        )}
      >
        <span class="servora-large-icon" aria-hidden="true">🏅</span>
        <div>
          <span
            class="servora-eyebrow"
            ${textAttrs(`${scope}.proofEyebrow`, "כותרת משנה")}
          >למה לבחור בנו</span>
          <h2
            ${textAttrs(`${scope}.proofTitle`, "כותרת הכרטיס")}
          >שירותי חשמל שעושים את ההבדל</h2>
          <p
            ${textAttrs(`${scope}.proofText`, "תיאור הכרטיס")}
          >חשמלאים מוסמכים עם תהליך ברור: אבחון, הצעת מחיר מסודרת, ביצוע נקי ואחריות בסיום העבודה.</p>
        </div>
      </article>
    </div>
  </div>
</section>`;
}

function createStatsHtml(scope: string) {
  const data = servoraDefaultData;

  return `
<section
  class="servora-section-tight servora-stats-section"
  ${sectionAttrs(scope, "נתונים וסטטיסטיקות", "stats")}
>
  <div class="servora-shell">
    <div class="servora-stats-wrap">
      ${data.stats
        .map(
          (stat, index) => `
        <article
          class="servora-stat"
          ${visualAttrs(
            `${scope}.items.${index}`,
            "section",
            `כרטיס נתון ${index + 1}`,
          )}
        >
          <span
            class="servora-stat-icon"
            ${textAttrs(
              `stats.${index}.icon`,
              `אייקון נתון ${index + 1}`,
            )}
          >${escapeHtml(stat.icon)}</span>
          <strong
            class="servora-stat-number"
            ${textAttrs(
              `stats.${index}.value`,
              `ערך נתון ${index + 1}`,
            )}
          >${escapeHtml(stat.value)}</strong>
          <span
            class="servora-stat-label"
            ${textAttrs(
              `stats.${index}.label`,
              `תיאור נתון ${index + 1}`,
            )}
          >${escapeHtml(stat.label)}</span>
        </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function createSectionTitle(
  scope: string,
  eyebrow: string,
  title: string,
  text?: string,
) {
  return `
<div
  class="servora-section-head servora-reveal"
  ${visualAttrs(scope, "box", "כותרת אזור")}
>
  <span
    class="servora-eyebrow"
    ${textAttrs(`${scope}.eyebrow`, "כותרת קטנה")}
  >${escapeHtml(eyebrow)}</span>
  <h2
    class="servora-section-title"
    ${textAttrs(`${scope}.title`, "כותרת האזור")}
  >${escapeHtml(title)}</h2>
  ${
    text !== undefined
      ? `<p class="servora-section-text" ${textAttrs(
          `${scope}.text`,
          "תיאור האזור",
        )}>${escapeHtml(text)}</p>`
      : ""
  }
</div>`;
}

function createServicesHtml(scope: string) {
  const data = servoraDefaultData;

  return `
<section
  class="servora-section servora-services-section"
  ${sectionAttrs(scope, "שירותים", "services")}
>
  <div class="servora-shell">
    ${createSectionTitle(
      `${scope}.heading`,
      "השירותים שלנו",
      "כל שירותי החשמל במקום אחד",
      "כרטיסים נקיים וברורים כמו במוקאפ — אייקון כתום, כותרת, תיאור קצר וקריאה לפעולה.",
    )}

    <div class="servora-services-grid">
      ${data.services
        .map(
          (service, index) => `
        <article
          class="servora-service-card"
          ${visualAttrs(
            `${scope}.items.${index}`,
            "section",
            `כרטיס שירות ${index + 1}`,
          )}
        >
          <span
            class="servora-service-icon"
            ${textAttrs(
              `services.${index}.icon`,
              `אייקון שירות ${index + 1}`,
            )}
          >${escapeHtml(service.icon)}</span>
          <h3
            ${textAttrs(
              `services.${index}.title`,
              `כותרת שירות ${index + 1}`,
            )}
          >${escapeHtml(service.title)}</h3>
          <p
            ${textAttrs(
              `services.${index}.text`,
              `תיאור שירות ${index + 1}`,
            )}
          >${escapeHtml(service.text)}</p>
          <a
            href="/contact"
            class="servora-service-arrow"
            ${buttonAttrs(
              `${scope}.items.${index}.cta`,
              `כפתור שירות ${index + 1}`,
            )}
          >קראו עוד ←</a>
        </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function createFeatureHtml(scope: string) {
  const data = servoraDefaultData;

  return `
<section
  class="servora-section servora-feature-section"
  ${sectionAttrs(scope, "פרויקט מוביל", "gallery")}
>
  <div class="servora-shell">
    <div class="servora-feature-grid">
      <article
        class="servora-feature-content"
        ${visualAttrs(`${scope}.content`, "section", "תוכן הפרויקט")}
      >
        <span
          class="servora-eyebrow"
          ${textAttrs(
            "project.eyebrow",
            "כותרת עליונה לפרויקט",
          )}
        >${escapeHtml(data.project.eyebrow)}</span>
        <h2
          ${textAttrs("project.title", "כותרת הפרויקט")}
        >${escapeHtml(data.project.title)}</h2>
        <p
          ${textAttrs("project.text", "תיאור הפרויקט")}
        >${escapeHtml(data.project.text)}</p>

        <div class="servora-check-list">
          ${data.project.points
            .map(
              (point, index) =>
                `<span class="servora-check" ${textAttrs(
                  `project.points.${index}`,
                  `יתרון בפרויקט ${index + 1}`,
                )}>${escapeHtml(point)}</span>`,
            )
            .join("")}
        </div>

        <div class="servora-feature-actions">
          <a
            href="/contact"
            class="servora-btn servora-btn-orange"
            ${buttonAttrs(`${scope}.primaryCta`, "כפתור תיאום ייעוץ")}
          >לתיאום ייעוץ</a>
          <a
            href="/pricing"
            class="servora-btn servora-btn-dark-light"
            ${buttonAttrs(
              `${scope}.secondaryCta`,
              "כפתור צפייה במחירים",
            )}
          >צפו במחירים</a>
        </div>
      </article>

      <div
        class="servora-feature-image"
        ${visualAttrs(`${scope}.mediaBox`, "box", "תמונת הפרויקט")}
      >
        <img
          src="${escapeHtml(data.project.image)}"
          alt="עבודת חשמל מקצועית"
          data-visual-current-src="${escapeHtml(data.project.image)}"
          data-visual-media-type="image"
          ${mediaAttrs("project.image", "עבודת חשמל מקצועית")}
        />
        <div
          class="servora-feature-image-badge"
          ${visualAttrs(`${scope}.badge`, "box", "תג על התמונה")}
        >
          <strong
            ${textAttrs(`${scope}.badgeValue`, "ערך התג")}
          >24/7</strong>
          <span
            ${textAttrs(`${scope}.badgeText`, "טקסט התג")}
          >שירות זמין עבורכם</span>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function createProcessHtml(scope: string) {
  const data = servoraDefaultData;

  return `
<section
  class="servora-section servora-process-section"
  ${sectionAttrs(scope, "תהליך עבודה", "process")}
>
  <div class="servora-shell">
    ${createSectionTitle(
      `${scope}.heading`,
      "איך זה עובד",
      "תהליך קצר וברור שמוביל לתיקון בטוח",
    )}

    <div class="servora-process-line">
      ${data.process
        .map(
          (step, index) => `
        <article
          class="servora-step"
          ${visualAttrs(
            `${scope}.items.${index}`,
            "section",
            `שלב ${index + 1}`,
          )}
        >
          <span
            class="servora-step-icon"
            ${textAttrs(
              `process.${index}.icon`,
              `אייקון שלב ${index + 1}`,
            )}
          >${escapeHtml(step.icon)}</span>
          <h3
            ${textAttrs(
              `process.${index}.title`,
              `כותרת שלב ${index + 1}`,
            )}
          >${escapeHtml(step.title)}</h3>
          <p
            ${textAttrs(
              `process.${index}.text`,
              `תיאור שלב ${index + 1}`,
            )}
          >${escapeHtml(step.text)}</p>
        </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function createTestimonialsHtml(scope: string) {
  const data = servoraDefaultData;
  const [main, ...rest] = data.testimonials;

  if (!main) return "";

  return `
<section
  class="servora-section servora-testimonials-section"
  ${sectionAttrs(scope, "המלצות לקוחות", "testimonials")}
>
  <div class="servora-shell">
    ${createSectionTitle(
      `${scope}.heading`,
      "לקוחות מספרים",
      "מה אומרים עלינו",
    )}

    <div class="servora-testimonials-grid">
      <article
        class="servora-testimonial-main"
        ${visualAttrs(`${scope}.items.0`, "section", "המלצה ראשית")}
      >
        <span
          class="servora-stars"
          ${textAttrs(`${scope}.items.0.stars`, "דירוג ההמלצה")}
        >★★★★★</span>
        <p
          ${textAttrs(
            "testimonials.0.quote",
            "תוכן המלצה ראשית",
          )}
        >“${escapeHtml(main.quote)}”</p>
        <strong
          ${textAttrs("testimonials.0.name", "שם ממליץ ראשי")}
        >${escapeHtml(main.name)}</strong>
      </article>

      ${rest
        .map((item, restIndex) => {
          const index = restIndex + 1;

          return `
        <article
          class="servora-mini-testimonial"
          ${visualAttrs(
            `${scope}.items.${index}`,
            "section",
            `המלצה ${index + 1}`,
          )}
        >
          <span
            class="servora-stars"
            ${textAttrs(
              `${scope}.items.${index}.stars`,
              `דירוג המלצה ${index + 1}`,
            )}
          >★★★★★</span>
          <p
            ${textAttrs(
              `testimonials.${index}.quote`,
              `תוכן המלצה ${index + 1}`,
            )}
          >“${escapeHtml(item.quote)}”</p>
          <strong
            ${textAttrs(
              `testimonials.${index}.name`,
              `שם ממליץ ${index + 1}`,
            )}
          >${escapeHtml(item.name)}</strong>
        </article>`;
        })
        .join("")}
    </div>
  </div>
</section>`;
}

function createPricingHtml(scope: string) {
  const data = servoraDefaultData;

  return `
<section
  class="servora-section servora-pricing-section"
  ${sectionAttrs(scope, "מחירון", "pricing")}
>
  <div class="servora-shell">
    ${createSectionTitle(
      `${scope}.heading`,
      "מחירים הוגנים",
      "חבילות מומלצות",
      "מחירים התחלתיים וברורים לפני שמשאירים פרטים.",
    )}

    <div class="servora-pricing-grid">
      ${data.pricing
        .map(
          (item, index) => `
        <article
          class="servora-price-card ${index === 1 ? "is-popular" : ""}"
          ${visualAttrs(
            `${scope}.items.${index}`,
            "section",
            `חבילת מחיר ${index + 1}`,
          )}
        >
          ${
            index === 1
              ? `<span class="servora-popular-badge" ${textAttrs(
                  `${scope}.items.${index}.badge`,
                  "תג פופולרי",
                )}>הכי פופולרי</span>`
              : ""
          }
          <span
            class="servora-price-title"
            ${textAttrs(
              `pricing.${index}.title`,
              `שם חבילה ${index + 1}`,
            )}
          >${escapeHtml(item.title)}</span>
          <strong
            ${textAttrs(
              `pricing.${index}.price`,
              `מחיר חבילה ${index + 1}`,
            )}
          >${escapeHtml(item.price)}</strong>
          <p
            ${textAttrs(
              `pricing.${index}.text`,
              `תיאור חבילה ${index + 1}`,
            )}
          >${escapeHtml(item.text)}</p>
          <ul>
            ${item.features
              .map(
                (feature, featureIndex) =>
                  `<li ${textAttrs(
                    `pricing.${index}.features.${featureIndex}`,
                    `יתרון ${featureIndex + 1} בחבילה ${index + 1}`,
                  )}>${escapeHtml(feature)}</li>`,
              )
              .join("")}
          </ul>
          <a
            href="/contact"
            class="servora-btn servora-btn-orange"
            ${buttonAttrs(
              `${scope}.items.${index}.cta`,
              `כפתור הזמנה לחבילה ${index + 1}`,
            )}
          >הזמנה עכשיו</a>
        </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function createFaqHtml(scope: string) {
  const data = servoraDefaultData;

  return `
<section
  class="servora-section servora-faq-section"
  ${sectionAttrs(scope, "שאלות נפוצות", "faq")}
>
  <div class="servora-shell">
    ${createSectionTitle(
      `${scope}.heading`,
      "שאלות נפוצות",
      "כל מה שלקוח רוצה לדעת לפני שהוא משאיר פרטים.",
    )}

    <div class="servora-faq">
      ${data.faq
        .map(
          (item, index) => `
        <details
          class="servora-faq-item"
          ${visualAttrs(
            `${scope}.items.${index}`,
            "section",
            `שאלה נפוצה ${index + 1}`,
          )}
        >
          <summary
            ${textAttrs(
              `faq.${index}.question`,
              `שאלה ${index + 1}`,
            )}
          >${escapeHtml(item.question)}</summary>
          <p
            ${textAttrs(
              `faq.${index}.answer`,
              `תשובה ${index + 1}`,
            )}
          >${escapeHtml(item.answer)}</p>
        </details>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function createCtaHtml(scope: string) {
  const data = servoraDefaultData;

  return `
<section
  class="servora-section servora-cta-section"
  ${sectionAttrs(scope, "קריאה לפעולה", "cta")}
>
  <div class="servora-shell">
    <div
      class="servora-cta"
      ${visualAttrs(`${scope}.content`, "box", "תוכן קריאה לפעולה")}
    >
      <div>
        <span
          class="servora-eyebrow"
          ${textAttrs(
            `${scope}.eyebrow`,
            "כותרת משנה לקריאה לפעולה",
          )}
        >צריכים חשמלאי עכשיו?</span>
        <h2
          ${textAttrs("cta.title", "כותרת קריאה לפעולה")}
        >${escapeHtml(data.cta.title)}</h2>
        <p
          ${textAttrs("cta.text", "תיאור קריאה לפעולה")}
        >${escapeHtml(data.cta.text)}</p>
      </div>

      <div class="servora-cta-actions">
        <a
          href="tel:${escapeHtml(data.brand.phone)}"
          class="servora-btn servora-btn-orange"
          ${buttonAttrs("cta.button", "כפתור קריאה לפעולה")}
        >${escapeHtml(data.cta.button)}</a>
        <a
          href="/contact"
          class="servora-btn servora-btn-dark-light"
          ${buttonAttrs(`${scope}.secondaryCta`, "כפתור פרטים נוספים")}
        >פרטים נוספים</a>
      </div>
    </div>
  </div>
</section>`;
}

function createFooterHtml() {
  const data = servoraDefaultData;

  return `
<footer
  class="servora-footer"
  ${sectionAttrs("global.footer", "כותרת תחתונה", "footer")}
>
  <div class="servora-shell">
    <div class="servora-footer-grid">
      <div
        class="servora-footer-brand"
        ${visualAttrs(
          "global.footer.brandBlock",
          "box",
          "אודות העסק בפוטר",
        )}
      >
        <strong
          ${textAttrs(
            "global.footer.brandTitle",
            "שם העסק בפוטר",
          )}
        >${escapeHtml(data.brand.name)} — פתרונות חשמל</strong>
        <span
          ${textAttrs(
            "global.footer.brandText",
            "תיאור העסק בפוטר",
          )}
        >שירות נקי, מקצועי ומדויק בכל בית ועסק.</span>
        <b
          ${textAttrs("global.footer.areaText", "אזור שירות")}
        >בפריסה ארצית</b>
      </div>

      <div
        class="servora-footer-contact"
        ${visualAttrs(
          "global.footer.contactBlock",
          "box",
          "פרטי קשר בפוטר",
        )}
      >
        <strong
          ${textAttrs(
            "global.footer.contactTitle",
            "כותרת צור קשר",
          )}
        >צור קשר</strong>
        <span
          ${textAttrs("global.footer.phone", "טלפון בפוטר")}
        >${escapeHtml(data.brand.phone)}</span>
        <span
          ${textAttrs("global.footer.email", "אימייל בפוטר")}
        >${escapeHtml(data.brand.email)}</span>
        <span
          ${textAttrs("global.footer.address", "כתובת בפוטר")}
        >${escapeHtml(data.contact.address)}</span>
      </div>

      <div
        class="servora-footer-mini-form"
        ${visualAttrs("global.footer.formBox", "box", "טופס בפוטר")}
      >
        ${createServiceRequestCardHtml(false, "global.footer.request")}
      </div>
    </div>

    <div class="servora-footer-bottom">
      <span
        ${textAttrs(
          "global.footer.copyright",
          "זכויות יוצרים",
        )}
      >© ${new Date().getFullYear()} ${escapeHtml(
        data.brand.name,
      )}. כל הזכויות שמורות.</span>

      <nav>
        ${data.nav
          .map(
            (item, index) => `
          <a
            href="${buttonHref(item.page)}"
            ${buttonAttrs(
              `global.footer.nav.${index}`,
              `קישור פוטר ${index + 1}`,
            )}
          >${escapeHtml(item.label)}</a>`,
          )
          .join("")}
      </nav>
    </div>
  </div>
</footer>`;
}

function createPageHeroHtml(
  page: ServoraPageId,
  scope: string,
  fieldPrefix?: string,
) {
  const titles: Record<
    ServoraPageId,
    { eyebrow: string; title: string; text: string }
  > = {
    home: {
      eyebrow: servoraDefaultData.hero.eyebrow,
      title: `${servoraDefaultData.hero.title} ${servoraDefaultData.hero.highlight}`,
      text: servoraDefaultData.hero.text,
    },
    services: {
      eyebrow: "שירותי חשמל",
      title: "כל שירותי החשמל במקום אחד",
      text: "תיקונים, התקנות, שדרוגים ותחזוקה — עם מבנה תואם למוקאפ.",
    },
    pricing: {
      eyebrow: "מחירים",
      title: "חבילות ומחירים ברורים",
      text: "מחירון נקי ומקצועי שמוביל לפנייה.",
    },
    gallery: {
      eyebrow: "עבודות",
      title: "עבודות חשמל מסודרות ומקצועיות",
      text: "אזור פרויקטים, תהליך והוכחות חברתיות.",
    },
    contact: {
      eyebrow: servoraDefaultData.contact.eyebrow,
      title: servoraDefaultData.contact.title,
      text: servoraDefaultData.contact.text,
    },
  };

  const copy = titles[page];
  const eyebrowId = fieldPrefix
    ? `${fieldPrefix}.eyebrow`
    : `${scope}.eyebrow`;
  const titleId = fieldPrefix
    ? `${fieldPrefix}.title`
    : `${scope}.title`;
  const textId = fieldPrefix
    ? `${fieldPrefix}.text`
    : `${scope}.text`;

  return `
<section
  class="servora-page-hero"
  ${sectionAttrs(scope, "כותרת עמוד", "page-hero")}
>
  <div class="servora-shell">
    <div class="servora-page-hero-inner">
      <span
        class="servora-eyebrow"
        ${textAttrs(eyebrowId, "כותרת משנה לעמוד")}
      >${escapeHtml(copy.eyebrow)}</span>
      <h1
        class="servora-page-title"
        ${textAttrs(titleId, "כותרת העמוד")}
      >${escapeHtml(copy.title)}</h1>
      <p
        class="servora-page-text"
        ${textAttrs(textId, "תיאור העמוד")}
      >${escapeHtml(copy.text)}</p>
    </div>
  </div>
</section>`;
}

function createContactContentHtml() {
  const data = servoraDefaultData;

  return `
<section
  class="servora-section"
  ${sectionAttrs("contact.content", "פרטי יצירת קשר", "contact")}
>
  <div class="servora-shell servora-contact-grid">
    <article
      class="servora-contact-panel"
      ${visualAttrs(
        "contact.infoPanel",
        "section",
        "פרטי יצירת קשר",
      )}
    >
      <h2
        ${textAttrs(
          "contact.infoPanel.title",
          "כותרת פרטי קשר",
        )}
      >ברקמן — פתרונות חשמל שקטים, אמינים ונקיים.</h2>
      <p
        ${textAttrs(
          "contact.infoPanel.text",
          "תיאור פרטי קשר",
        )}
      >${escapeHtml(data.contact.text)}</p>

      <div class="servora-contact-info">
        <span
          ${textAttrs("contact.infoPanel.phone", "טלפון")}
        >טלפון: ${escapeHtml(data.brand.phone)}</span>
        <span
          ${textAttrs("contact.infoPanel.whatsapp", "וואטסאפ")}
        >וואטסאפ: ${escapeHtml(data.brand.whatsapp)}</span>
        <span
          ${textAttrs("contact.infoPanel.email", "אימייל")}
        >מייל: ${escapeHtml(data.brand.email)}</span>
        <span
          ${textAttrs("contact.infoPanel.address", "כתובת")}
        >כתובת: ${escapeHtml(data.contact.address)}</span>
      </div>
    </article>

    <div
      class="servora-form-card"
      ${visualAttrs(
        "contact.formCard",
        "box",
        "כרטיס טופס יצירת קשר",
      )}
    >
      ${createServiceRequestCardHtml(false, "contact.request")}
    </div>
  </div>
</section>`;
}

function createServoraEditorHtml(page: ServoraPageId) {
  const openMain = `<main dir="rtl" data-template-id="servora" data-template-mode="public" data-template-page-id="${escapeHtml(
    page,
  )}" data-active-page-id="${escapeHtml(
    page,
  )}" class="servora-page">`;

  const closeMain = `</main>`;

  if (page === "home") {
    return `${openMain}${createHeaderHtml()}${createHomeHeroHtml()}${createTrustStripHtml(
      "home.trust",
    )}${createIntroHtml("home.intro")}${createStatsHtml(
      "home.stats",
    )}${createServicesHtml("home.services")}${createFeatureHtml(
      "home.feature",
    )}${createProcessHtml("home.process")}${createTestimonialsHtml(
      "home.testimonials",
    )}${createPricingHtml("home.pricing")}${createFaqHtml(
      "home.faq",
    )}${createCtaHtml("home.cta")}${createFooterHtml()}${closeMain}`;
  }

  if (page === "services") {
    return `${openMain}${createHeaderHtml()}${createPageHeroHtml(
      "services",
      "services.pageHero",
    )}${createServicesHtml("services.services")}${createFeatureHtml(
      "services.feature",
    )}${createProcessHtml("services.process")}${createFooterHtml()}${closeMain}`;
  }

  if (page === "pricing") {
    return `${openMain}${createHeaderHtml()}${createPageHeroHtml(
      "pricing",
      "pricing.pageHero",
    )}${createPricingHtml("pricing.pricing")}${createFaqHtml(
      "pricing.faq",
    )}${createFooterHtml()}${closeMain}`;
  }

  if (page === "gallery") {
    return `${openMain}${createHeaderHtml()}${createPageHeroHtml(
      "gallery",
      "gallery.pageHero",
    )}${createFeatureHtml("gallery.feature")}${createTestimonialsHtml(
      "gallery.testimonials",
    )}${createFooterHtml()}${closeMain}`;
  }

  return `${openMain}${createHeaderHtml()}${createPageHeroHtml(
    "contact",
    "contact.pageHero",
    "contact",
  )}${createContactContentHtml()}${createFooterHtml()}${closeMain}`;
}

export const servoraSeed = {
  id: "servora",
  name: "Servora",
  category: "home-services",
  description: "תבנית פרימיום לחשמלאים ושירותי חשמל לבית ולעסק, תואמת למוקאפ החדש.",
  niche: "שירותי חשמל",
  layout: "rtlElectricLandingPremium",
  image: servoraDefaultData.hero.image,
  heroTitle: `${servoraDefaultData.hero.title} ${servoraDefaultData.hero.highlight}`,
  heroSubtitle: servoraDefaultData.hero.text,
  palette: servoraPalette,
  blocks: withBlockIds("servora", blocks),
  data: servoraDefaultData,
  pages: servoraPages,
  css: servoraEditorCss,
  editorCss: servoraEditorCss,
  preview: createServoraEditorHtml("home"),
  html: createServoraEditorHtml("home"),
  editor: {
    css: servoraEditorCss,
    pages: [
      { id: "home", title: "ראשי", slug: "", type: "home", isHome: true, html: createServoraEditorHtml("home"), css: servoraEditorCss },
      { id: "services", title: "שירותים", slug: "services", type: "service", html: createServoraEditorHtml("services"), css: servoraEditorCss },
      { id: "pricing", title: "מחירים", slug: "pricing", type: "pricing", html: createServoraEditorHtml("pricing"), css: servoraEditorCss },
      { id: "gallery", title: "עבודות", slug: "gallery", type: "gallery", html: createServoraEditorHtml("gallery"), css: servoraEditorCss },
      { id: "contact", title: "צור קשר", slug: "contact", type: "contact", html: createServoraEditorHtml("contact"), css: servoraEditorCss },
    ],
  },
} as unknown as ReadyWebsiteTemplateSeed;
