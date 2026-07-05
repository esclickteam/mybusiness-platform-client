import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import { servoraEditorCss } from "./editorCss";

export type ServoraPageId =
  | "home"
  | "services"
  | "pricing"
  | "gallery"
  | "contact";

export type ServoraNavItem = {
  label: string;
  page: ServoraPageId;
};

export type ServoraService = {
  icon: string;
  title: string;
  text: string;
};

export type ServoraStat = {
  value: string;
  label: string;
};

export type ServoraProcessStep = {
  number: string;
  title: string;
  text: string;
};

export type ServoraPrice = {
  title: string;
  price: string;
  text: string;
};

export type ServoraTestimonial = {
  name: string;
  role: string;
  quote: string;
};

export type ServoraFaq = {
  question: string;
  answer: string;
};

export type ServoraData = {
  brand: {
    name: string;
    label: string;
    phone: string;
    email: string;
    whatsapp: string;
  };
  nav: ServoraNavItem[];
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    text: string;
    primaryCta: string;
    secondaryCta: string;
    image: string;
    emergencyTitle: string;
    emergencyText: string;
  };
  stats: ServoraStat[];
  services: ServoraService[];
  areas: string[];
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
  { id: "home", title: "בית", slug: "/" },
  { id: "services", title: "שירותים", slug: "/services" },
  { id: "pricing", title: "מחירון", slug: "/pricing" },
  { id: "gallery", title: "עבודות", slug: "/gallery" },
  { id: "contact", title: "יצירת קשר", slug: "/contact" },
] as const;

export const servoraDefaultData: ServoraData = {
  brand: {
    name: "Servora",
    label: "שירותי בית ותיקונים",
    phone: "03-555-7420",
    email: "hello@servora.co.il",
    whatsapp: "050-555-7420",
  },
  nav: [
    { label: "בית", page: "home" },
    { label: "שירותים", page: "services" },
    { label: "מחירון", page: "pricing" },
    { label: "עבודות", page: "gallery" },
    { label: "צור קשר", page: "contact" },
  ],
  hero: {
    eyebrow: "שירותי בית מהירים, אמינים ומקצועיים",
    title: "מתקנים, משפצים ומטפלים בבית",
    highlight: "בלי כאב ראש ובלי לחכות ימים.",
    text:
      "תבנית פרימיום לעסקי שירות לבית: הנדימן, אינסטלטור, חשמלאי, מיזוג, ניקיון, הדברה, גינון ושיפוצים. בנויה ללידים, שיחות ווואטסאפ.",
    primaryCta: "הזמנת שירות עכשיו",
    secondaryCta: "צפו בשירותים",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=90",
    emergencyTitle: "24/7",
    emergencyText: "זמינות לקריאות דחופות ותיאום מהיר",
  },
  stats: [
    { value: "24/7", label: "זמינות לקריאות דחופות" },
    { value: "+1,200", label: "לקוחות שקיבלו שירות" },
    { value: "18", label: "דקות מענה ממוצע" },
    { value: "4.9", label: "דירוג לקוחות" },
  ],
  services: [
    {
      icon: "01",
      title: "תיקונים כלליים",
      text:
        "תיקוני בית, הרכבות, מדפים, דלתות, ידיות, צבע ותיקונים קטנים שמצטברים.",
    },
    {
      icon: "02",
      title: "אינסטלציה",
      text:
        "נזילות, סתימות, החלפת ברזים, תיקוני צנרת וטיפול מהיר בתקלות מים.",
    },
    {
      icon: "03",
      title: "חשמל ותאורה",
      text:
        "התקנת גופי תאורה, שקעים, מפסקים, מאווררים ותיקוני חשמל בסיסיים.",
    },
    {
      icon: "04",
      title: "מיזוג ותחזוקה",
      text:
        "ניקוי מזגנים, בדיקות תקינות, תחזוקה שוטפת ותיאום טכנאי שירות.",
    },
    {
      icon: "05",
      title: "ניקיון והדברה",
      text:
        "שירותי ניקיון, הדברה, תחזוקה אחרי שיפוץ וטיפול באזורים בעייתיים.",
    },
    {
      icon: "06",
      title: "גינון וחוץ",
      text:
        "גיזום, סידור גינה, תחזוקה חיצונית, תיקוני חצר והכנת הבית לעונה.",
    },
  ],
  areas: [
    "תל אביב",
    "רמת גן",
    "גבעתיים",
    "פתח תקווה",
    "הרצליה",
    "חולון",
    "בת ים",
    "ראשון לציון",
    "רעננה",
    "כפר סבא",
  ],
  project: {
    eyebrow: "לפני ואחרי",
    title: "מראים ללקוחות בדיוק למה אפשר לסמוך עליכם.",
    text:
      "אזור עבודות שמציג תמונות, תהליכים, תוצאות, המלצות והוכחות חברתיות — כדי להפוך מבקרים ללידים.",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1300&q=90",
    points: [
      "גלריית עבודות לפני/אחרי",
      "הדגשת שירותים רווחיים",
      "חיזוק אמון עם תמונות אמיתיות",
      "טופס ליד ווואטסאפ בכל עמוד",
    ],
  },
  process: [
    {
      number: "01",
      title: "משאירים פרטים",
      text: "הלקוח בוחר שירות, אזור ומועד נוח — ומקבל מענה מהיר.",
    },
    {
      number: "02",
      title: "מקבלים הצעת מחיר",
      text: "שיחה קצרה, תמונה או תיאור הבעיה — ומקבלים כיוון מחיר ברור.",
    },
    {
      number: "03",
      title: "טכנאי מגיע",
      text: "מתאמים הגעה, מבצעים את העבודה ומבקשים ביקורת/המלצה בסיום.",
    },
  ],
  pricing: [
    {
      title: "קריאת שירות",
      price: "₪180+",
      text: "בדיקה, אבחון ותיקונים קטנים לפי אזור וזמינות.",
    },
    {
      title: "תיקון ביתי",
      price: "₪290+",
      text: "תיקון ממוצע בבית: הרכבות, ברזים, תאורה, דלתות ועוד.",
    },
    {
      title: "עבודה מורכבת",
      price: "בהצעה",
      text: "שיפוץ קטן, תחזוקה, פרויקט חוץ או עבודה לפי שעות/חומרים.",
    },
  ],
  testimonials: [
    {
      name: "רוני כהן",
      role: "לקוחה פרטית",
      quote:
        "השארתי פנייה ותוך כמה דקות חזרו אליי. הטכנאי הגיע בזמן, פתר את הבעיה והמחיר היה ברור מראש.",
    },
    {
      name: "מיכל לוי",
      role: "בעלת דירה להשכרה",
      quote:
        "סוף סוף שירות שאני יכולה לשלוח לדיירים בלי לרדוף אחרי בעלי מקצוע. הכל מסודר וברור.",
    },
    {
      name: "אבי דניאל",
      role: "מנהל נכסים",
      quote:
        "האתר נראה מקצועי, מביא פניות איכותיות ומציג את השירותים בצורה שמייצרת אמון מהר.",
    },
  ],
  faq: [
    {
      question: "לאיזה עסקים התבנית מתאימה?",
      answer:
        "להנדימן, אינסטלטור, חשמלאי, טכנאי מיזוג, ניקיון, הדברה, גינון, שיפוצים וכל שירות מקומי לבית.",
    },
    {
      question: "אפשר לחבר וואטסאפ וטופס לידים?",
      answer:
        "כן. המבנה בנוי עם CTA ברור, טופס ליד, טלפון ווואטסאפ כדי לייצר פניות מהר.",
    },
    {
      question: "אפשר לשנות שירותים ואזורי שירות?",
      answer:
        "כן. כל השירותים, האזורים, המחירים, התמונות והטקסטים ניתנים לעריכה.",
    },
  ],
  cta: {
    title: "רוצים להפוך יותר מבקרים לשיחות, וואטסאפים ולידים?",
    text:
      "השאירו פרטים ותנו ללקוחות להבין מהר מה אתם עושים, איפה אתם עובדים ואיך מזמינים שירות.",
    button: "התחילו עכשיו",
  },
  contact: {
    eyebrow: "קבלת הצעת מחיר",
    title: "ספרו לנו מה התקלה ונחזור אליכם במהירות.",
    text:
      "אפשר להחליף כאן את כל השדות, לחבר ל־CRM, לשלוח לוואטסאפ, או לפתוח קריאת שירות אוטומטית.",
    address: "מרכז הארץ",
    hours: "א׳-ה׳ 08:00-20:00, שישי 08:00-13:00",
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
  { type: "header", variant: "home-services-rtl", title: "Header" },
  { type: "hero", variant: "emergency-service-rtl", title: "Hero" },
  { type: "results", variant: "counter-cards-rtl", title: "Stats" },
  { type: "services", variant: "home-services-grid-rtl", title: "Services" },
  { type: "gallery", variant: "before-after-rtl", title: "Projects" },
  { type: "process", variant: "booking-steps-rtl", title: "Process" },
  { type: "pricing", variant: "service-pricing-rtl", title: "Pricing" },
  { type: "testimonials", variant: "local-trust-rtl", title: "Testimonials" },
  { type: "faq", variant: "service-faq-rtl", title: "FAQ" },
  { type: "contact", variant: "lead-form-rtl", title: "Contact" },
  { type: "footer", variant: "service-footer-rtl", title: "Footer" },
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

function escapeHtml(value: string) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function createServoraEditorHtml(page: ServoraPageId) {
  const data = servoraDefaultData;

  const pageTitle =
    page === "services"
      ? "כל שירותי הבית במקום אחד — ברור, מהיר וממיר."
      : page === "pricing"
        ? "מחירון שירותים ברור שמקטין התנגדויות ומגדיל פניות."
        : page === "gallery"
          ? data.project.title
          : page === "contact"
            ? data.contact.title
            : `${data.hero.title} ${data.hero.highlight}`;

  const pageText =
    page === "services"
      ? "שירותים בכרטיסים ברורים עם כפתור פעולה לכל שירות."
      : page === "pricing"
        ? "מחירים התחלתיים, הסבר קצר וטופס לקבלת הצעה מדויקת."
        : page === "gallery"
          ? data.project.text
          : page === "contact"
            ? data.contact.text
            : data.hero.text;

  return `
<main dir="rtl" data-template-id="servora" class="servora-page">
  <header data-section-kind="header" data-section-title="Header" class="servora-header">
    <div class="servora-shell">
      <div class="servora-header-inner">
        <div class="servora-brand">
          <span class="servora-brand-mark">S</span>
          <span>
            <span data-gjs-type="text" class="servora-brand-name">${escapeHtml(data.brand.name)}</span>
            <span data-gjs-type="text" class="servora-brand-label">${escapeHtml(data.brand.label)}</span>
          </span>
        </div>

        <nav class="servora-nav">
          <a data-editable-link="true" href="/" class="servora-nav-link">בית</a>
          <a data-editable-link="true" href="/services" class="servora-nav-link">שירותים</a>
          <a data-editable-link="true" href="/pricing" class="servora-nav-link">מחירון</a>
          <a data-editable-link="true" href="/gallery" class="servora-nav-link">עבודות</a>
          <a data-editable-link="true" href="/contact" class="servora-nav-link">צור קשר</a>
        </nav>

        <a data-editable-link="true" href="/contact" class="servora-btn servora-btn-orange servora-header-cta">הזמנת שירות</a>
      </div>
    </div>
  </header>

  <section data-section-kind="hero" data-section-title="Hero" class="servora-hero">
    <div class="servora-hero-grid-bg"></div>
    <div class="servora-shell">
      <div class="servora-hero-grid">
        <div class="servora-hero-content">
          <span data-gjs-type="text" class="servora-eyebrow servora-reveal">${escapeHtml(data.hero.eyebrow)}</span>
          <h1 data-gjs-type="text" class="servora-hero-title servora-reveal servora-delay-1">${escapeHtml(pageTitle)}</h1>
          <p data-gjs-type="text" class="servora-hero-text servora-reveal servora-delay-2">${escapeHtml(pageText)}</p>
          <div class="servora-hero-actions">
            <a data-editable-link="true" href="/contact" class="servora-btn servora-btn-orange">${escapeHtml(data.hero.primaryCta)}</a>
            <a data-editable-link="true" href="/services" class="servora-btn servora-btn-outline">${escapeHtml(data.hero.secondaryCta)}</a>
          </div>
        </div>

        <div class="servora-hero-media">
          <div class="servora-media-card">
            <img src="${escapeHtml(data.hero.image)}" alt="שירותי בית" />
          </div>
          <div class="servora-emergency-card">
            <span>${escapeHtml(data.hero.emergencyTitle)}</span>
            <strong>${escapeHtml(data.brand.phone)}</strong>
            <p>${escapeHtml(data.hero.emergencyText)}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section data-section-kind="results" data-section-title="Stats" class="servora-section-tight">
    <div class="servora-shell">
      <div class="servora-stats-wrap">
        <div class="servora-stats">
          ${data.stats
            .map(
              (stat) => `
            <article class="servora-stat">
              <strong data-gjs-type="text" class="servora-stat-number">${escapeHtml(stat.value)}</strong>
              <span data-gjs-type="text" class="servora-stat-label">${escapeHtml(stat.label)}</span>
            </article>`,
            )
            .join("")}
        </div>
      </div>
    </div>
  </section>

  <section data-section-kind="services" data-section-title="Services" class="servora-section">
    <div class="servora-shell">
      <div class="servora-section-head">
        <div>
          <span data-gjs-type="text" class="servora-eyebrow">שירותים</span>
          <h2 data-gjs-type="text" class="servora-section-title">שירותים ברורים שהלקוח מבין תוך שנייה.</h2>
        </div>
      </div>

      <div class="servora-services-grid">
        ${data.services
          .map(
            (service) => `
          <article class="servora-service-card">
            <div>
              <span data-gjs-type="text" class="servora-service-icon">${escapeHtml(service.icon)}</span>
              <h3 data-gjs-type="text">${escapeHtml(service.title)}</h3>
              <p data-gjs-type="text">${escapeHtml(service.text)}</p>
            </div>
            <a data-editable-link="true" href="/contact" class="servora-btn servora-btn-outline">קבלת הצעה</a>
          </article>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section data-section-kind="gallery" data-section-title="Projects" class="servora-section">
    <div class="servora-shell">
      <div class="servora-project-grid">
        <div class="servora-project-image">
          <img src="${escapeHtml(data.project.image)}" alt="עבודת שירות לבית" />
        </div>

        <div class="servora-project-card">
          <span data-gjs-type="text" class="servora-eyebrow">${escapeHtml(data.project.eyebrow)}</span>
          <h2 data-gjs-type="text">${escapeHtml(data.project.title)}</h2>
          <p data-gjs-type="text">${escapeHtml(data.project.text)}</p>
          <div class="servora-check-list">
            ${data.project.points
              .map(
                (point) => `
              <span data-gjs-type="text" class="servora-check">${escapeHtml(point)}</span>`,
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section data-section-kind="pricing" data-section-title="Pricing" class="servora-section">
    <div class="servora-shell">
      <div class="servora-pricing-grid">
        ${data.pricing
          .map(
            (price) => `
          <article class="servora-price-card">
            <span data-gjs-type="text">${escapeHtml(price.title)}</span>
            <strong data-gjs-type="text">${escapeHtml(price.price)}</strong>
            <p data-gjs-type="text">${escapeHtml(price.text)}</p>
          </article>`,
          )
          .join("")}
      </div>
    </div>
  </section>

  <section data-section-kind="contact" data-section-title="Contact" class="servora-section">
    <div class="servora-shell">
      <div class="servora-contact-grid">
        <div class="servora-contact-panel">
          <span data-gjs-type="text" class="servora-eyebrow">${escapeHtml(data.contact.eyebrow)}</span>
          <h2 data-gjs-type="text" class="servora-section-title">${escapeHtml(data.contact.title)}</h2>
          <p data-gjs-type="text" class="servora-section-text">${escapeHtml(data.contact.text)}</p>
        </div>

        <div class="servora-form-card">
          <form class="servora-form">
            <div class="servora-field"><label>שם מלא</label><input type="text" placeholder="השם שלך" /></div>
            <div class="servora-field"><label>טלפון</label><input type="tel" placeholder="050-0000000" /></div>
            <div class="servora-field"><label>סוג שירות</label><select><option>תיקונים כלליים</option><option>אינסטלציה</option><option>חשמל ותאורה</option></select></div>
            <div class="servora-field"><label>מה צריך לתקן?</label><textarea placeholder="ספרו בקצרה על התקלה"></textarea></div>
            <button type="submit" class="servora-btn servora-btn-orange">שליחת פנייה</button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <footer data-section-kind="footer" data-section-title="Footer" class="servora-footer">
    <div class="servora-shell">
      <div class="servora-footer-inner">
        <div data-gjs-type="text">© ${new Date().getFullYear()} ${escapeHtml(data.brand.name)}. כל הזכויות שמורות.</div>
      </div>
    </div>
  </footer>
</main>`;
}

export const servoraSeed = {
  id: "servora",
  name: "Servora",
  category: "home-services",
  description:
    "תבנית פרימיום לעסקי שירות לבית: הנדימן, אינסטלטור, חשמלאי, מיזוג, ניקיון, הדברה, גינון ושיפוצים.",
  niche: "שירותי בית",
  layout: "rtlHomeServicesPremium",
  image:
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=90",
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
      {
        id: "home",
        title: "בית",
        slug: "",
        type: "home",
        isHome: true,
        html: createServoraEditorHtml("home"),
        css: servoraEditorCss,
      },
      {
        id: "services",
        title: "שירותים",
        slug: "services",
        type: "service",
        html: createServoraEditorHtml("services"),
        css: servoraEditorCss,
      },
      {
        id: "pricing",
        title: "מחירון",
        slug: "pricing",
        type: "pricing",
        html: createServoraEditorHtml("pricing"),
        css: servoraEditorCss,
      },
      {
        id: "gallery",
        title: "עבודות",
        slug: "gallery",
        type: "gallery",
        html: createServoraEditorHtml("gallery"),
        css: servoraEditorCss,
      },
      {
        id: "contact",
        title: "יצירת קשר",
        slug: "contact",
        type: "contact",
        html: createServoraEditorHtml("contact"),
        css: servoraEditorCss,
      },
    ],
  },
} as unknown as ReadyWebsiteTemplateSeed;