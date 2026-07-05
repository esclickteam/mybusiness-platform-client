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
    name: "ברקמן",
    label: "פתרונות חשמל לבית ולעסק",
    phone: "03-683-7420",
    email: "info@barakman.co.il",
    whatsapp: "050-683-7420",
  },
  nav: [
    { label: "הבית", page: "home" },
    { label: "שירותים", page: "services" },
    { label: "התהליך", page: "gallery" },
    { label: "מחירים", page: "pricing" },
    { label: "שאלות", page: "contact" },
  ],
  hero: {
    eyebrow: "חשמלאי מוסמך עם ניסיון לבית ולעסק",
    title: "מתקנים, משדרגים ומשפצים מערכות חשמל",
    highlight: "בכל סוגי הבתים והעסקים.",
    text:
      "שירות חשמל מקצועי, מהיר ובטוח — מתיקון תקלה ועד תכנון מערכת מלאה. זמינים לקריאות דחופות, התקנות, לוחות חשמל, תאורה, נקודות חדשות ותחזוקה שוטפת.",
    primaryCta: "לקביעת ביקור",
    secondaryCta: "צפו בשירותים",
    image:
      "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=90",
    emergencyTitle: "24/7",
    emergencyText: "זמינות לקריאות חשמל דחופות ותיאום מהיר",
  },
  stats: [
    { value: "+15", label: "שנות ניסיון" },
    { value: "1,200+", label: "לקוחות מרוצים" },
    { value: "98%", label: "שביעות רצון" },
    { value: "24/7", label: "זמינות מלאה" },
    { value: "+15", label: "חשמלאים מוסמכים" },
  ],
  services: [
    {
      icon: "⚙",
      title: "תיקונים ושדרוגים",
      text:
        "תיקון תקלות, שדרוג לוח החשמל, החלפת שקעים ונקודות חשמל בצורה בטוחה.",
    },
    {
      icon: "▣",
      title: "התקנות חדשות",
      text:
        "התקנת גופי תאורה, נקודות חשמל, מפסקים, מאווררים ומערכות ביתיות.",
    },
    {
      icon: "↗",
      title: "שדרוג ואוטומציה",
      text:
        "שדרוג מערכות, הכנה לבית חכם, עומסים, תכנון ותשתיות חשמל מתקדמות.",
    },
    {
      icon: "⌁",
      title: "התקנת אביזרים",
      text:
        "פתרונות מתח חכם, חכם, מצלמות, תקשורת, ארונות ותשתיות משלימות.",
    },
    {
      icon: "⬟",
      title: "תחזוקה מונעת",
      text:
        "בדיקות תקופתיות, מניעת תקלות, איתור עומסים וסריקות בטיחות למערכות.",
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
    eyebrow: "העבודה שלנו",
    title: "שירות חשמל נקי, מסודר ובטוח — עם תוצאה שנראית מקצועית.",
    text:
      "הצגת עבודות, התקנות, תיקונים ולוחות חשמל בצורה שמחזקת אמון ומראה ללקוח שאתם עובדים מסודר, בטיחותי ומקצועי.",
    image:
      "https://images.unsplash.com/photo-1604762524889-3e2fcc145683?auto=format&fit=crop&w=1300&q=90",
    points: [
      "אחריות מלאה לאחר ביצוע",
      "אחריות מלאה לפני עבודה",
      "ביצוע נקי, בטיחותי ומקצועי",
      "התאמה לבית פרטי או עסק",
    ],
  },
  process: [
    {
      number: "01",
      title: "פנייה ואבחון",
      text: "מספרים לנו מה הבעיה ומקבלים הכוונה ראשונית.",
    },
    {
      number: "02",
      title: "בדיקה ותכנון",
      text: "מתאמים ביקור, בודקים עומסים ומציעים פתרון.",
    },
    {
      number: "03",
      title: "הצעת מחיר",
      text: "מקבלים הצעה מסודרת וברורה לפני תחילת העבודה.",
    },
    {
      number: "04",
      title: "ביצוע מקצועי",
      text: "מבצעים את העבודה בצורה נקייה, בטוחה ומדויקת.",
    },
    {
      number: "05",
      title: "שירות וליווי",
      text: "אחריות מלאה וליווי גם לאחר הביצוע.",
    },
  ],
  pricing: [
    {
      title: "תיקון מהיר",
      price: "₪150+",
      text: "הגעה לאבחון ותיקון תקלה בסיסית בבית או בעסק.",
    },
    {
      title: "חבילת שדרוג",
      price: "₪180+",
      text: "שדרוג נקודות, התקנות אביזרים ותיקונים מתקדמים.",
    },
    {
      title: "שדרוג בית חכם",
      price: "₪290+",
      text: "התקנות מתקדמות, תכנון מערכת וחיבור פתרונות חכמים.",
    },
  ],
  testimonials: [
    {
      name: "יוסי כהן",
      role: "חולון",
      quote:
        "שירות מעולה, מהיר ואמין. פתרו את התקלה במקצועיות והשאירו הכל מסודר.",
    },
    {
      name: "מיכל לוי",
      role: "רמת גן",
      quote:
        "הגיעו בזמן, הסבירו בדיוק מה צריך לעשות והמחיר היה ברור מראש.",
    },
    {
      name: "אבי דניאל",
      role: "תל אביב",
      quote:
        "עבודה נקייה מאוד, התקנה מקצועית ושירות אדיב. ממליץ בחום.",
    },
  ],
  faq: [
    {
      question: "האם אתם נותנים אחריות על העבודה?",
      answer:
        "כן. כל עבודה מתבצעת על ידי חשמלאי מוסמך וכוללת אחריות בהתאם לסוג העבודה.",
    },
    {
      question: "כמה זמן לוקח להגיע לטיפול?",
      answer:
        "בקריאות דחופות ניתן לתאם הגעה מהירה לפי אזור וזמינות. עבודות מתוכננות נקבעות מראש.",
    },
    {
      question: "האם השירות מתאים גם לבתים וגם לעסקים?",
      answer:
        "כן. השירות מתאים לדירות, בתים פרטיים, משרדים, חנויות ועסקים קטנים.",
    },
    {
      question: "איך מתבצע התשלום?",
      answer:
        "התשלום מתבצע לאחר ביצוע העבודה או לפי שלבי הפרויקט, בהתאם למה שסוכם מראש.",
    },
  ],
  cta: {
    title: "זקוקים לחשמלאי עכשיו?",
    text:
      "השאירו פרטים ונחזור אליכם עם אבחון ראשוני, הצעת מחיר ותיאום ביקור.",
    button: "התייעצו עכשיו",
  },
  contact: {
    eyebrow: "לקביעת ביקור או ייעוץ",
    title: "ספרו לנו מה התקלה ונחזור אליכם במהירות.",
    text:
      "אפשר לחבר את הטופס ל־CRM, וואטסאפ או פתיחת קריאת שירות אוטומטית.",
    address: "החשמלאי 12, תל אביב",
    hours: "זמינים 24/7 לקריאות דחופות",
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
  { type: "hero", variant: "handyman-request-hero-rtl", title: "Hero" },
  { type: "trust", variant: "service-trust-strip-rtl", title: "Trust Strip" },
  { type: "about", variant: "home-service-intro-rtl", title: "Intro" },
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

function getPageCopy(page: ServoraPageId) {
  const data = servoraDefaultData;

  if (page === "services") {
    return {
      eyebrow: "השירותים שלנו",
      title: "שירותי בית ברורים, אמינים ומהירים.",
      text:
        "עמוד שירותים שמציג לכל לקוח מה אתם עושים, למה לבחור בכם ואיך מזמינים שירות.",
    };
  }

  if (page === "pricing") {
    return {
      eyebrow: "מחירון",
      title: "חבילות מומלצות",
      text:
        "אפשר להציג מחירים לפי שירות, קריאת שירות, עבודה לפי שעה או הצעת מחיר מותאמת.",
    };
  }

  if (page === "gallery") {
    return {
      eyebrow: "עבודות",
      title: "תוצאות, עבודות לדוגמה והוכחות שהעסק מקצועי.",
      text:
        "אזור עבודות שמציג ללקוחות את איכות השירות עוד לפני שהם משאירים פרטים.",
    };
  }

  if (page === "contact") {
    return {
      eyebrow: data.contact.eyebrow,
      title: data.contact.title,
      text: data.contact.text,
    };
  }

  return {
    eyebrow: data.hero.eyebrow,
    title: `${data.hero.title} ${data.hero.highlight}`,
    text: data.hero.text,
  };
}

function createServiceRequestCardHtml(compact = false) {
  const data = servoraDefaultData;

  return `
<div
  class="servora-request-card${compact ? " servora-request-card-float servora-free-move-element" : ""}"
  data-gjs-type="default"
  data-gjs-draggable="true"
  data-gjs-droppable="true"
  data-gjs-resizable="true"
  data-gjs-removable="true"
  data-gjs-copyable="true"
  data-gjs-highlightable="true"
  data-gjs-selectable="true"
  data-gjs-hoverable="true"
  ${compact ? `style="position:absolute; right:54px; bottom:26px; width:min(430px, 46%);"` : ""}
>
  <div class="servora-request-card-head">
    <span class="servora-request-icon">⚡</span>
    <div>
      <h3 data-gjs-type="text">בקשת שירות מהיר</h3>
      <p data-gjs-type="text">השאירו פרטים ונחזור אליכם תוך זמן קצר.</p>
    </div>
  </div>

  <form class="servora-request-form">
    <input type="text" name="name" placeholder="שם מלא" dir="rtl" />
<input type="tel" name="phone" placeholder="טלפון" dir="rtl" />
<select name="service" dir="rtl">
      ${data.services
        .map((service) => `<option>${escapeHtml(service.title)}</option>`)
        .join("")}
    </select>
    <button type="submit" class="servora-btn servora-btn-orange servora-request-submit">
      שלחו בקשה
    </button>
  </form>
</div>`;
}

function createHeaderHtml() {
  const data = servoraDefaultData;

  return `
<header data-section-kind="header" data-section-title="Header" class="servora-header">
  <div class="servora-shell">
    <div class="servora-header-inner">
      <div class="servora-brand">
        <span class="servora-brand-mark">⚡</span>
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

      <div class="servora-header-actions">
        <a data-editable-link="true" href="tel:${escapeHtml(data.brand.phone)}" class="servora-phone-pill">
          <span>☎</span>
          <strong data-gjs-type="text">${escapeHtml(data.brand.phone)}</strong>
        </a>

        <a data-editable-link="true" href="/contact" class="servora-btn servora-btn-orange servora-header-cta">
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
<section data-section-kind="hero" data-section-title="Hero" class="servora-hero servora-handyman-hero">
  <div class="servora-hero-grid-bg"></div>
  <div class="servora-hero-glow servora-hero-glow-one"></div>
  <div class="servora-hero-glow servora-hero-glow-two"></div>

  <div class="servora-shell">
    <div class="servora-hero-grid servora-handyman-hero-grid">
      <div class="servora-hero-content">
        <span data-gjs-type="text" class="servora-eyebrow servora-reveal">${escapeHtml(data.hero.eyebrow)}</span>

        <h1 class="servora-hero-title servora-reveal servora-delay-1">
          <span data-gjs-type="text">${escapeHtml(data.hero.title)}</span>
          <span data-gjs-type="text" class="servora-highlight">${escapeHtml(data.hero.highlight)}</span>
        </h1>

        <p data-gjs-type="text" class="servora-hero-text servora-reveal servora-delay-2">${escapeHtml(data.hero.text)}</p>

        <div class="servora-hero-actions servora-reveal servora-delay-3">
          <a data-editable-link="true" href="/contact" class="servora-btn servora-btn-orange">${escapeHtml(data.hero.primaryCta)}</a>
          <a data-editable-link="true" href="/services" class="servora-btn servora-btn-outline">${escapeHtml(data.hero.secondaryCta)}</a>
        </div>

        <div class="servora-trust-row servora-reveal servora-delay-4">
          <div class="servora-trust-item"><span>✓</span><strong data-gjs-type="text">חשמלאי מוסמך</strong></div>
          <div class="servora-trust-item"><span>✓</span><strong data-gjs-type="text">שירות 24/7</strong></div>
          <div class="servora-trust-item"><span>✓</span><strong data-gjs-type="text">אחריות מלאה</strong></div>
        </div>

        <div class="servora-hero-note servora-reveal servora-delay-4">
          <span class="servora-status-dot"></span>
          <span data-gjs-type="text">זמינים עכשיו לקריאות חשמל באזור המרכז.</span>
        </div>
      </div>

      <div class="servora-hero-media servora-wide-hero-media servora-reveal servora-delay-2">
        <div class="servora-media-card servora-handyman-media servora-wide-media-card">
          <img src="${escapeHtml(data.hero.image)}" alt="שירותי חשמל מקצועיים" />
        </div>

        <div class="servora-floating-rating-card servora-small-rating-card">
          <span data-gjs-type="text" class="servora-rating-stars">★★★★★</span>
          <strong data-gjs-type="text">לקוחות מרוצים</strong>
          <p data-gjs-type="text">שירות מהיר, נקי ומקצועי — מהבית ועד העסק.</p>
        </div>

        ${createServiceRequestCardHtml(true)}
      </div>
    </div>
  </div>
</section>`;
}

function createPageHeroHtml(page: ServoraPageId) {
  const copy = getPageCopy(page);

  return `
<section data-section-kind="page-hero" data-section-title="Page Hero" class="servora-page-hero">
  <div class="servora-shell">
    <div class="servora-page-hero-inner servora-reveal">
      <span data-gjs-type="text" class="servora-eyebrow">${escapeHtml(copy.eyebrow)}</span>
      <h1 data-gjs-type="text" class="servora-page-title">${escapeHtml(copy.title)}</h1>
      <p data-gjs-type="text" class="servora-page-text">${escapeHtml(copy.text)}</p>
    </div>
  </div>
</section>`;
}

function createTrustStripHtml() {
  const data = servoraDefaultData;
  const items = ["זמינות גבוהה", "עבודה נקייה", "מחירים ברורים", "שירות עד הבית", "ליווי אישי"];

  return `
<section data-section-kind="trust" data-section-title="Trust Strip" class="servora-trust-strip">
  <div class="servora-shell">
    <div class="servora-trust-strip-inner">
      <span data-gjs-type="text" class="servora-trust-strip-title">
        עסקים ושירותים שסומכים על ${escapeHtml(data.brand.name)}
      </span>

      <div class="servora-logo-strip">
        ${items
          .map((item) => `<span data-gjs-type="text" class="servora-logo-pill">${escapeHtml(item)}</span>`)
          .join("")}
      </div>
    </div>
  </div>
</section>`;
}

function createIntroHtml() {
  return `
<section data-section-kind="about" data-section-title="Intro" class="servora-section servora-intro-section">
  <div class="servora-shell">
    <div class="servora-intro-grid">
      <div class="servora-intro-copy servora-reveal">
        <span data-gjs-type="text" class="servora-eyebrow">שירותי חשמל</span>
        <h2 data-gjs-type="text" class="servora-section-title">שירותי חשמל שמרגישים בטוחים כבר מהשנייה הראשונה.</h2>
        <p data-gjs-type="text" class="servora-section-text">
          האתר מציג ללקוח בדיוק מה הוא צריך לדעת: מי נותן את השירות, אילו עבודות קיימות, איך מזמינים ומה מקבלים אחרי הפנייה.
        </p>
      </div>

      <div class="servora-intro-card servora-reveal servora-delay-2">
        <strong data-gjs-type="text">15+</strong>
        <span data-gjs-type="text">שנות ניסיון</span>
        <p data-gjs-type="text">
          מתאים לבעלי מקצוע, שירותי תיקונים, תחזוקה, ניקיון, גינון, חשמל ואינסטלציה.
        </p>
      </div>
    </div>
  </div>
</section>`;
}

function createStatsHtml() {
  const data = servoraDefaultData;

  return `
<section data-section-kind="results" data-section-title="Stats" class="servora-section-tight">
  <div class="servora-shell">
    <div class="servora-stats-wrap">
      <div class="servora-stats">
        ${data.stats
          .map(
            (stat) => `
        <article class="servora-stat servora-reveal">
          <strong data-gjs-type="text" class="servora-stat-number">${escapeHtml(stat.value)}</strong>
          <span data-gjs-type="text" class="servora-stat-label">${escapeHtml(stat.label)}</span>
        </article>`,
          )
          .join("")}
      </div>
    </div>
  </div>
</section>`;
}

function createServicesHtml() {
  const data = servoraDefaultData;

  return `
<section data-section-kind="services" data-section-title="Services" class="servora-section">
  <div class="servora-shell">
    <div class="servora-section-head">
      <div>
        <span data-gjs-type="text" class="servora-eyebrow">השירותים שלנו</span>
        <h2 data-gjs-type="text" class="servora-section-title">כל שירותי החשמל במקום אחד</h2>
      </div>

      <p data-gjs-type="text" class="servora-section-text">
        במקום רשימה יבשה — כרטיסים ברורים עם אייקון, תיאור קצר וכפתור פעולה, כדי שהלקוח יבין מהר מה מתאים לו.
      </p>
    </div>

    <div class="servora-services-grid servora-handyman-services-grid">
      ${data.services
        .map(
          (service) => `
      <article class="servora-service-card servora-handyman-service-card servora-reveal">
        <div>
          <span data-gjs-type="text" class="servora-service-icon">${escapeHtml(service.icon)}</span>
          <h3 data-gjs-type="text">${escapeHtml(service.title)}</h3>
          <p data-gjs-type="text">${escapeHtml(service.text)}</p>
        </div>

        <a data-editable-link="true" href="/contact" class="servora-service-arrow">
          <span>קבלת הצעה</span>
          <span>←</span>
        </a>
      </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function createAreasHtml() {
  const data = servoraDefaultData;

  return `
<section data-section-kind="areas" data-section-title="Areas" class="servora-section-tight">
  <div class="servora-shell">
    <div class="servora-section-head">
      <div>
        <span data-gjs-type="text" class="servora-eyebrow">אזורי שירות</span>
        <h2 data-gjs-type="text" class="servora-section-title">הלקוחות מבינים מיד אם אתם מגיעים אליהם.</h2>
      </div>
    </div>

    <div class="servora-areas">
      ${data.areas
        .map((area) => `<span data-gjs-type="text" class="servora-area-pill">${escapeHtml(area)}</span>`)
        .join("")}
    </div>
  </div>
</section>`;
}

function createFeatureHtml() {
  const data = servoraDefaultData;

  return `
<section data-section-kind="gallery" data-section-title="Projects" class="servora-section servora-feature-section">
  <div class="servora-shell">
    <div class="servora-feature-grid">
      <div class="servora-feature-image servora-reveal">
        <img src="${escapeHtml(data.project.image)}" alt="עבודת שירות מקצועית" />

        <div class="servora-feature-image-badge">
          <strong data-gjs-type="text">24/7</strong>
          <span data-gjs-type="text">פניות דחופות</span>
        </div>
      </div>

      <div class="servora-feature-content servora-reveal servora-delay-2">
        <span data-gjs-type="text" class="servora-eyebrow">${escapeHtml(data.project.eyebrow)}</span>
        <h2 data-gjs-type="text">${escapeHtml(data.project.title)}</h2>
        <p data-gjs-type="text">${escapeHtml(data.project.text)}</p>

        <div class="servora-check-list servora-feature-check-list">
          ${data.project.points
            .map((point) => `<span data-gjs-type="text" class="servora-check">${escapeHtml(point)}</span>`)
            .join("")}
        </div>

        <div class="servora-feature-actions">
          <a data-editable-link="true" href="/contact" class="servora-btn servora-btn-orange">בקשת שירות</a>
          <a data-editable-link="true" href="/gallery" class="servora-btn servora-btn-outline">עבודות לדוגמה</a>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

function createProcessHtml() {
  const data = servoraDefaultData;

  return `
<section data-section-kind="process" data-section-title="Process" class="servora-section">
  <div class="servora-shell">
    <div class="servora-section-head">
      <div>
        <span data-gjs-type="text" class="servora-eyebrow">איך זה עובד</span>
        <h2 data-gjs-type="text" class="servora-section-title">איך זה עובד? תהליך ברור שמוריד חשש ומייצר פניות.</h2>
      </div>
    </div>

    <div class="servora-process servora-handyman-process">
      ${data.process
        .map(
          (step) => `
      <article class="servora-step servora-reveal">
        <span data-gjs-type="text" class="servora-step-number">${escapeHtml(step.number)}</span>
        <h3 data-gjs-type="text">${escapeHtml(step.title)}</h3>
        <p data-gjs-type="text">${escapeHtml(step.text)}</p>
      </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function createPricingHtml() {
  const data = servoraDefaultData;

  return `
<section data-section-kind="pricing" data-section-title="Pricing" class="servora-section">
  <div class="servora-shell">
    <div class="servora-section-head">
      <div>
        <span data-gjs-type="text" class="servora-eyebrow">מחירון</span>
        <h2 data-gjs-type="text" class="servora-section-title">חבילות מומלצות</h2>
      </div>

      <p data-gjs-type="text" class="servora-section-text">
        המחירון נותן תחושת שקיפות, אבל עדיין משאיר מקום להצעת מחיר מותאמת לפי סוג העבודה.
      </p>
    </div>

    <div class="servora-pricing-grid servora-handyman-pricing-grid">
      ${data.pricing
        .map(
          (price, index) => `
      <article class="servora-price-card servora-handyman-price-card servora-reveal ${index === 1 ? "is-popular" : ""}">
        ${index === 1 ? `<span data-gjs-type="text" class="servora-popular-badge">פופולרי</span>` : ""}
        <span data-gjs-type="text">${escapeHtml(price.title)}</span>
        <strong data-gjs-type="text">${escapeHtml(price.price)}</strong>
        <p data-gjs-type="text">${escapeHtml(price.text)}</p>

        <ul class="servora-price-features">
          <li data-gjs-type="text">בדיקת צורך ראשונית</li>
          <li data-gjs-type="text">הצעת מחיר מסודרת</li>
          <li data-gjs-type="text">תיאום הגעה מהיר</li>
        </ul>

        <a data-editable-link="true" href="/contact" class="servora-btn servora-btn-orange">התחלת הזמנה</a>
      </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function createTestimonialsHtml() {
  const data = servoraDefaultData;
  const [main, ...rest] = data.testimonials;

  return `
<section data-section-kind="testimonials" data-section-title="Testimonials" class="servora-section servora-testimonials-section">
  <div class="servora-shell">
    <div class="servora-section-head">
      <div>
        <span data-gjs-type="text" class="servora-eyebrow">לקוחות מספרים</span>
        <h2 data-gjs-type="text" class="servora-section-title">המלצות שמוכיחות שהשירות באמת מקצועי.</h2>
      </div>
    </div>

    <div class="servora-testimonials servora-handyman-testimonials">
      <article class="servora-testimonial-main servora-reveal">
        <div>
          <span data-gjs-type="text" class="servora-rating-stars">★★★★★</span>
          <p data-gjs-type="text">“${escapeHtml(main?.quote || "שירות מקצועי ומהיר.")}”</p>
        </div>

        <div class="servora-testimonial-person">
          <strong data-gjs-type="text">${escapeHtml(main?.name || "לקוח מרוצה")}</strong>
          <span data-gjs-type="text">${escapeHtml(main?.role || "אזור המרכז")}</span>
        </div>
      </article>

      <div class="servora-testimonial-list">
        ${rest
          .map(
            (testimonial) => `
        <article class="servora-mini-testimonial servora-reveal">
          <span data-gjs-type="text" class="servora-rating-stars">★★★★★</span>
          <p data-gjs-type="text">“${escapeHtml(testimonial.quote)}”</p>
          <strong data-gjs-type="text">${escapeHtml(testimonial.name)} · ${escapeHtml(testimonial.role)}</strong>
        </article>`,
          )
          .join("")}
      </div>
    </div>
  </div>
</section>`;
}

function createFaqHtml() {
  const data = servoraDefaultData;

  return `
<section data-section-kind="faq" data-section-title="FAQ" class="servora-section">
  <div class="servora-shell">
    <div class="servora-section-head">
      <div>
        <span data-gjs-type="text" class="servora-eyebrow">שאלות נפוצות</span>
        <h2 data-gjs-type="text" class="servora-section-title">כל מה שלקוח רוצה לדעת לפני שהוא משאיר פרטים.</h2>
      </div>
    </div>

    <div class="servora-faq">
      ${data.faq
        .map(
          (item) => `
      <article class="servora-faq-item">
        <h3 data-gjs-type="text">${escapeHtml(item.question)}</h3>
        <p data-gjs-type="text">${escapeHtml(item.answer)}</p>
      </article>`,
        )
        .join("")}
    </div>
  </div>
</section>`;
}

function createCtaHtml() {
  const data = servoraDefaultData;

  return `
<section data-section-kind="cta" data-section-title="CTA" class="servora-section">
  <div class="servora-shell">
    <div class="servora-cta servora-handyman-cta servora-reveal">
      <div>
        <span data-gjs-type="text" class="servora-eyebrow">צריכים בעל מקצוע?</span>
        <h2 data-gjs-type="text">${escapeHtml(data.cta.title)}</h2>
        <p data-gjs-type="text">${escapeHtml(data.cta.text)}</p>
      </div>

      <div class="servora-cta-actions">
        <a data-editable-link="true" href="/contact" class="servora-btn servora-btn-orange">${escapeHtml(data.cta.button)}</a>
        <a data-editable-link="true" href="tel:${escapeHtml(data.brand.phone)}" class="servora-btn servora-btn-outline">התקשרו עכשיו</a>
      </div>
    </div>
  </div>
</section>`;
}

function createContactHtml(fullContactPage = false) {
  const data = servoraDefaultData;

  return `
<section data-section-kind="contact" data-section-title="Contact" class="servora-section">
  <div class="servora-shell">
    <div class="servora-contact-grid">
      <div class="servora-contact-panel servora-reveal">
        <span data-gjs-type="text" class="servora-eyebrow">פרטי התקשרות</span>
        <h2 data-gjs-type="text" class="servora-section-title">
          ${fullContactPage ? "זמינים להצעות מחיר, קריאות שירות ותיאום הגעה." : escapeHtml(data.contact.title)}
        </h2>
        <p data-gjs-type="text" class="servora-section-text">
          ${fullContactPage ? "אפשר להחליף כאן טלפון, וואטסאפ, מייל, אזורי שירות ושעות פעילות." : escapeHtml(data.contact.text)}
        </p>

        <div class="servora-contact-info">
          <div class="servora-info-line">
            <span>טלפון</span>
            <strong data-gjs-type="text">${escapeHtml(data.brand.phone)}</strong>
          </div>

          <div class="servora-info-line">
            <span>וואטסאפ</span>
            <strong data-gjs-type="text">${escapeHtml(data.brand.whatsapp)}</strong>
          </div>

          <div class="servora-info-line">
            <span>מייל</span>
            <strong data-gjs-type="text">${escapeHtml(data.brand.email)}</strong>
          </div>

          <div class="servora-info-line">
            <span>כתובת / אזור</span>
            <strong data-gjs-type="text">${escapeHtml(data.contact.address)}</strong>
          </div>

          <div class="servora-info-line">
            <span>שעות פעילות</span>
            <strong data-gjs-type="text">${escapeHtml(data.contact.hours)}</strong>
          </div>
        </div>
      </div>

      <div class="servora-form-card servora-reveal servora-delay-2">
        ${createServiceRequestCardHtml(false)}
      </div>
    </div>
  </div>
</section>`;
}

function createFooterHtml() {
  const data = servoraDefaultData;

  return `
<footer data-section-kind="footer" data-section-title="Footer" class="servora-footer">
  <div class="servora-shell">
    <div class="servora-footer-inner">
      <div class="servora-footer-brand">
        <strong data-gjs-type="text">${escapeHtml(data.brand.name)}</strong>
        <span data-gjs-type="text">שירותי בית, תיקונים ותחזוקה באזור המרכז.</span>
      </div>

      <nav class="servora-nav">
        <a data-editable-link="true" href="/" class="servora-nav-link">בית</a>
        <a data-editable-link="true" href="/services" class="servora-nav-link">שירותים</a>
        <a data-editable-link="true" href="/pricing" class="servora-nav-link">מחירון</a>
        <a data-editable-link="true" href="/gallery" class="servora-nav-link">עבודות</a>
        <a data-editable-link="true" href="/contact" class="servora-nav-link">צור קשר</a>
      </nav>

      <div class="servora-footer-contact">
        <span data-gjs-type="text">${escapeHtml(data.brand.email)}</span>
        <strong data-gjs-type="text">${escapeHtml(data.brand.phone)}</strong>
      </div>
    </div>

    <div data-gjs-type="text" class="servora-footer-bottom">
      © ${new Date().getFullYear()} ${escapeHtml(data.brand.name)}. כל הזכויות שמורות.
    </div>
  </div>
</footer>`;
}

function createServoraEditorHtml(page: ServoraPageId) {
  if (page === "home") {
    return `
<main dir="rtl" data-template-id="servora" class="servora-page">
  ${createHeaderHtml()}
  ${createHomeHeroHtml()}
  ${createTrustStripHtml()}
  ${createIntroHtml()}
  ${createStatsHtml()}
  ${createServicesHtml()}
  ${createAreasHtml()}
  ${createFeatureHtml()}
  ${createProcessHtml()}
  ${createTestimonialsHtml()}
  ${createPricingHtml()}
  ${createFaqHtml()}
  ${createCtaHtml()}
  ${createFooterHtml()}
</main>`;
  }

  if (page === "services") {
    return `
<main dir="rtl" data-template-id="servora" class="servora-page">
  ${createHeaderHtml()}
  ${createPageHeroHtml("services")}
  ${createServicesHtml()}
  ${createAreasHtml()}
  ${createFeatureHtml()}
  ${createProcessHtml()}
  ${createCtaHtml()}
  ${createFooterHtml()}
</main>`;
  }

  if (page === "pricing") {
    return `
<main dir="rtl" data-template-id="servora" class="servora-page">
  ${createHeaderHtml()}
  ${createPageHeroHtml("pricing")}
  ${createPricingHtml()}
  ${createFaqHtml()}
  ${createCtaHtml()}
  ${createFooterHtml()}
</main>`;
  }

  if (page === "gallery") {
    return `
<main dir="rtl" data-template-id="servora" class="servora-page">
  ${createHeaderHtml()}
  ${createPageHeroHtml("gallery")}
  ${createFeatureHtml()}
  ${createTestimonialsHtml()}
  ${createCtaHtml()}
  ${createFooterHtml()}
</main>`;
  }

  return `
<main dir="rtl" data-template-id="servora" class="servora-page">
  ${createHeaderHtml()}
  ${createPageHeroHtml("contact")}
  ${createContactHtml(true)}
  ${createFooterHtml()}
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