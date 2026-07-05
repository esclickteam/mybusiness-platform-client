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
    { label: "למה אנחנו", page: "gallery" },
    { label: "שאלות נפוצות", page: "contact" },
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
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=90",
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

function withBlockIds(templateId: string, inputBlocks: TemplateBlockInput[]): ReadyWebsiteBlock[] {
  return inputBlocks.map((block, index) => ({ id: `${templateId}-${index + 1}-${block.type}`, ...block }));
}

function escapeHtml(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buttonHref(page: string) {
  return page === "home" ? "/" : `/${page}`;
}

function createServiceRequestCardHtml(compact = false) {
  const data = servoraDefaultData;
  return `
<div class="servora-request-card${compact ? " servora-request-card-float servora-free-move-element" : ""}" data-gjs-type="default" data-gjs-draggable="true" data-gjs-droppable="true" data-gjs-resizable="true" data-gjs-removable="true" data-gjs-copyable="true" data-gjs-selectable="true">
  <div class="servora-request-card-head">
    <div>
      <h3 data-gjs-type="text">בקשת שירות מהירה</h3>
      <p data-gjs-type="text">השאירו פרטים ונחזור אליכם עם הצעה.</p>
    </div>
    <span class="servora-request-icon">⚡</span>
  </div>
  <form class="servora-request-form">
    <input type="text" name="name" placeholder="שם מלא" dir="rtl" />
    <input type="tel" name="phone" placeholder="טלפון" dir="rtl" />
    <select name="service" dir="rtl">
      ${data.services.map((service) => `<option>${escapeHtml(service.title)}</option>`).join("")}
    </select>
    <button type="submit" class="servora-btn servora-btn-orange servora-request-submit">שליחת בקשה</button>
  </form>
</div>`;
}

function createHeaderHtml() {
  const data = servoraDefaultData;
  return `
<header class="servora-header" data-section-kind="header" data-section-title="Header">
  <div class="servora-shell"><div class="servora-header-inner">
    <div class="servora-brand"><span class="servora-brand-mark">⚡</span><span><strong class="servora-brand-name" data-gjs-type="text">${escapeHtml(data.brand.name)}</strong><span class="servora-brand-label" data-gjs-type="text">${escapeHtml(data.brand.label)}</span></span></div>
    <nav class="servora-nav">
      ${data.nav.map((item) => `<a class="servora-nav-link" href="${buttonHref(item.page)}" data-editable-link="true">${escapeHtml(item.label)}</a>`).join("")}
    </nav>
    <div class="servora-header-actions"><a href="tel:${escapeHtml(data.brand.phone)}" class="servora-phone-pill"><span>☎</span><strong>${escapeHtml(data.brand.phone)}</strong></a><a href="/contact" class="servora-btn servora-btn-orange servora-header-cta">לקביעת ביקור</a></div>
  </div></div>
</header>`;
}

function createHomeHeroHtml() {
  const data = servoraDefaultData;
  return `
<section class="servora-hero servora-electric-hero" data-section-kind="hero" data-section-title="Hero">
  <div class="servora-shell"><div class="servora-hero-grid">
    <div class="servora-hero-media servora-reveal">
      <div class="servora-media-card"><img src="${escapeHtml(data.hero.image)}" alt="חשמלאי מקצועי" /></div>
      <div class="servora-rating-card"><span class="servora-stars">★★★★★</span><strong>לקוחות מרוצים</strong><p>שירות מהיר, מקצועי ונקי — רחבי המרכז.</p></div>
      ${createServiceRequestCardHtml(true)}
    </div>
    <div class="servora-hero-content servora-reveal servora-delay-1">
      <span class="servora-eyebrow" data-gjs-type="text">${escapeHtml(data.hero.eyebrow)}</span>
      <h1 class="servora-hero-title"><span data-gjs-type="text">${escapeHtml(data.hero.title)}</span><span class="servora-highlight" data-gjs-type="text">${escapeHtml(data.hero.highlight)}</span></h1>
      <ul class="servora-hero-bullets">${data.hero.bullets.map((bullet) => `<li data-gjs-type="text">${escapeHtml(bullet)}</li>`).join("")}</ul>
      <div class="servora-hero-actions"><a href="/contact" class="servora-btn servora-btn-orange">${escapeHtml(data.hero.primaryCta)}</a><a href="/services" class="servora-btn servora-btn-light">${escapeHtml(data.hero.secondaryCta)}</a></div>
    </div>
  </div></div>
</section>`;
}

function createTrustStripHtml() {
  const data = servoraDefaultData;
  return `<section class="servora-trust-strip"><div class="servora-shell"><div class="servora-trust-pills">${data.trustPills.map((item) => `<span class="servora-logo-pill" data-gjs-type="text">${escapeHtml(item)}</span>`).join("")}</div></div></section>`;
}

function createIntroHtml() {
  return `<section class="servora-section servora-proof-section"><div class="servora-shell"><div class="servora-proof-grid"><article class="servora-emergency-panel"><span class="servora-neon-bolt">ϟ</span><h2>שירות חשמלאי מקצועי 24/7</h2><p>זמינים לקריאות דחופות, תיקון תקלות, התקנות ושדרוג חשמל — עם אחריות מלאה.</p><a class="servora-dark-phone" href="tel:${servoraDefaultData.brand.phone}">חייגו עכשיו</a></article><article class="servora-proof-card"><span class="servora-large-icon">🏅</span><div><span class="servora-eyebrow">למה לבחור בנו</span><h2>שירותי חשמל שעושים את ההבדל</h2><p>חשמלאים מוסמכים עם תהליך ברור: אבחון, הצעת מחיר מסודרת, ביצוע נקי ואחריות בסיום העבודה.</p></div></article></div></div></section>`;
}

function createStatsHtml() {
  const data = servoraDefaultData;
  return `<section class="servora-section-tight servora-stats-section"><div class="servora-shell"><div class="servora-stats-wrap">${data.stats.map((stat) => `<article class="servora-stat"><span class="servora-stat-icon">${escapeHtml(stat.icon)}</span><strong class="servora-stat-number">${escapeHtml(stat.value)}</strong><span class="servora-stat-label">${escapeHtml(stat.label)}</span></article>`).join("")}</div></div></section>`;
}

function createSectionTitle(eyebrow: string, title: string, text = "") {
  return `<div class="servora-section-head"><span class="servora-eyebrow">${escapeHtml(eyebrow)}</span><h2 class="servora-section-title">${escapeHtml(title)}</h2>${text ? `<p class="servora-section-text">${escapeHtml(text)}</p>` : ""}</div>`;
}

function createServicesHtml() {
  const data = servoraDefaultData;
  return `<section class="servora-section servora-services-section"><div class="servora-shell">${createSectionTitle("השירותים שלנו", "כל שירותי החשמל במקום אחד", "כרטיסים נקיים וברורים כמו במוקאפ — אייקון כתום, כותרת, תיאור קצר וקריאה לפעולה.")}<div class="servora-services-grid">${data.services.map((service) => `<article class="servora-service-card"><span class="servora-service-icon">${escapeHtml(service.icon)}</span><h3>${escapeHtml(service.title)}</h3><p>${escapeHtml(service.text)}</p><a href="/contact" class="servora-service-arrow">קראו עוד ←</a></article>`).join("")}</div></div></section>`;
}

function createFeatureHtml() {
  const data = servoraDefaultData;
  return `<section class="servora-section servora-feature-section"><div class="servora-shell"><div class="servora-feature-grid"><article class="servora-feature-content"><span class="servora-eyebrow">${escapeHtml(data.project.eyebrow)}</span><h2>${escapeHtml(data.project.title)}</h2><p>${escapeHtml(data.project.text)}</p><div class="servora-check-list">${data.project.points.map((point) => `<span class="servora-check">${escapeHtml(point)}</span>`).join("")}</div><div class="servora-feature-actions"><a href="/contact" class="servora-btn servora-btn-orange">לתיאום ייעוץ</a><a href="/pricing" class="servora-btn servora-btn-dark-light">צפו במחירים</a></div></article><div class="servora-feature-image"><img src="${escapeHtml(data.project.image)}" alt="עבודת חשמל מקצועית" /><div class="servora-feature-image-badge"><strong>24/7</strong><span>שירות זמין עבורכם</span></div></div></div></div></section>`;
}

function createProcessHtml() {
  const data = servoraDefaultData;
  return `<section class="servora-section servora-process-section"><div class="servora-shell">${createSectionTitle("איך זה עובד", "תהליך קצר וברור שמוביל לתיקון בטוח")}<div class="servora-process-line">${data.process.map((step) => `<article class="servora-step"><span class="servora-step-icon">${escapeHtml(step.icon)}</span><h3>${escapeHtml(step.title)}</h3><p>${escapeHtml(step.text)}</p></article>`).join("")}</div></div></section>`;
}

function createTestimonialsHtml() {
  const data = servoraDefaultData;
  const [main, ...rest] = data.testimonials;
  return `<section class="servora-section servora-testimonials-section"><div class="servora-shell">${createSectionTitle("לקוחות מספרים", "מה אומרים עלינו")}<div class="servora-testimonials-grid"><article class="servora-testimonial-main"><span class="servora-stars">★★★★★</span><p>“${escapeHtml(main.quote)}”</p><strong>${escapeHtml(main.name)}</strong></article>${rest.map((item) => `<article class="servora-mini-testimonial"><span class="servora-stars">★★★★★</span><p>“${escapeHtml(item.quote)}”</p><strong>${escapeHtml(item.name)}</strong></article>`).join("")}</div></div></section>`;
}

function createPricingHtml() {
  const data = servoraDefaultData;
  return `<section class="servora-section servora-pricing-section"><div class="servora-shell">${createSectionTitle("מחירים הוגנים", "חבילות מומלצות", "מחירים התחלתיים וברורים לפני שמשאירים פרטים.")}<div class="servora-pricing-grid">${data.pricing.map((item, index) => `<article class="servora-price-card ${index === 1 ? "is-popular" : ""}">${index === 1 ? `<span class="servora-popular-badge">הכי פופולרי</span>` : ""}<span class="servora-price-title">${escapeHtml(item.title)}</span><strong>${escapeHtml(item.price)}</strong><p>${escapeHtml(item.text)}</p><ul>${item.features.map((feature) => `<li>${escapeHtml(feature)}</li>`).join("")}</ul><a href="/contact" class="servora-btn servora-btn-orange">הזמנה עכשיו</a></article>`).join("")}</div></div></section>`;
}

function createFaqHtml() {
  const data = servoraDefaultData;
  return `<section class="servora-section servora-faq-section"><div class="servora-shell">${createSectionTitle("שאלות נפוצות", "כל מה שלקוח רוצה לדעת לפני שהוא משאיר פרטים.")}<div class="servora-faq">${data.faq.map((item) => `<details class="servora-faq-item"><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join("")}</div></div></section>`;
}

function createCtaHtml() {
  const data = servoraDefaultData;
  return `<section class="servora-section servora-cta-section"><div class="servora-shell"><div class="servora-cta"><div><span class="servora-eyebrow">צריכים חשמלאי עכשיו?</span><h2>${escapeHtml(data.cta.title)}</h2><p>${escapeHtml(data.cta.text)}</p></div><div class="servora-cta-actions"><a href="tel:${escapeHtml(data.brand.phone)}" class="servora-btn servora-btn-orange">${escapeHtml(data.cta.button)}</a><a href="/contact" class="servora-btn servora-btn-dark-light">פרטים נוספים</a></div></div></div></section>`;
}

function createFooterHtml() {
  const data = servoraDefaultData;
  return `<footer class="servora-footer"><div class="servora-shell"><div class="servora-footer-grid"><div class="servora-footer-brand"><strong>${escapeHtml(data.brand.name)} — פתרונות חשמל</strong><span>שירות נקי, מקצועי ומדויק בכל בית ועסק.</span><b>בפריסה ארצית</b></div><div class="servora-footer-contact"><strong>צור קשר</strong><span>${escapeHtml(data.brand.phone)}</span><span>${escapeHtml(data.brand.email)}</span><span>${escapeHtml(data.contact.address)}</span></div><div class="servora-footer-mini-form">${createServiceRequestCardHtml(false)}</div></div><div class="servora-footer-bottom"><span>© ${new Date().getFullYear()} ${escapeHtml(data.brand.name)}. כל הזכויות שמורות.</span></div></div></footer>`;
}

function createPageHeroHtml(page: ServoraPageId) {
  const titles: Record<ServoraPageId, { eyebrow: string; title: string; text: string }> = {
    home: { eyebrow: servoraDefaultData.hero.eyebrow, title: `${servoraDefaultData.hero.title} ${servoraDefaultData.hero.highlight}`, text: servoraDefaultData.hero.text },
    services: { eyebrow: "שירותי חשמל", title: "כל שירותי החשמל במקום אחד", text: "תיקונים, התקנות, שדרוגים ותחזוקה — עם מבנה תואם למוקאפ." },
    pricing: { eyebrow: "מחירים", title: "חבילות ומחירים ברורים", text: "מחירון נקי ומקצועי שמוביל לפנייה." },
    gallery: { eyebrow: "עבודות", title: "עבודות חשמל מסודרות ומקצועיות", text: "אזור פרויקטים, תהליך והוכחות חברתיות." },
    contact: { eyebrow: servoraDefaultData.contact.eyebrow, title: servoraDefaultData.contact.title, text: servoraDefaultData.contact.text },
  };
  const copy = titles[page];
  return `<section class="servora-page-hero"><div class="servora-shell"><div class="servora-page-hero-inner"><span class="servora-eyebrow">${escapeHtml(copy.eyebrow)}</span><h1 class="servora-page-title">${escapeHtml(copy.title)}</h1><p class="servora-page-text">${escapeHtml(copy.text)}</p></div></div></section>`;
}

function createServoraEditorHtml(page: ServoraPageId) {
  if (page === "home") return `<main dir="rtl" data-template-id="servora" class="servora-page">${createHeaderHtml()}${createHomeHeroHtml()}${createTrustStripHtml()}${createIntroHtml()}${createStatsHtml()}${createServicesHtml()}${createFeatureHtml()}${createProcessHtml()}${createTestimonialsHtml()}${createPricingHtml()}${createFaqHtml()}${createCtaHtml()}${createFooterHtml()}</main>`;
  if (page === "services") return `<main dir="rtl" data-template-id="servora" class="servora-page">${createHeaderHtml()}${createPageHeroHtml("services")}${createServicesHtml()}${createFeatureHtml()}${createProcessHtml()}${createFooterHtml()}</main>`;
  if (page === "pricing") return `<main dir="rtl" data-template-id="servora" class="servora-page">${createHeaderHtml()}${createPageHeroHtml("pricing")}${createPricingHtml()}${createFaqHtml()}${createFooterHtml()}</main>`;
  if (page === "gallery") return `<main dir="rtl" data-template-id="servora" class="servora-page">${createHeaderHtml()}${createPageHeroHtml("gallery")}${createFeatureHtml()}${createTestimonialsHtml()}${createFooterHtml()}</main>`;
  return `<main dir="rtl" data-template-id="servora" class="servora-page">${createHeaderHtml()}${createPageHeroHtml("contact")}<section class="servora-section"><div class="servora-shell servora-contact-grid"><article class="servora-contact-panel"><h2>${escapeHtml(servoraDefaultData.contact.title)}</h2><p>${escapeHtml(servoraDefaultData.contact.text)}</p></article><div class="servora-form-card">${createServiceRequestCardHtml(false)}</div></div></section>${createFooterHtml()}</main>`;
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
