import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import { elevoraEditorCss } from "./editorCss";

export type ElevoraPageId = "home" | "about" | "services" | "contact";

export type ElevoraNavItem = {
  label: string;
  page: ElevoraPageId;
};

export type ElevoraService = {
  title: string;
  text: string;
  icon: string;
};

export type ElevoraProcessStep = {
  number: string;
  title: string;
  text: string;
};

export type ElevoraTestimonial = {
  name: string;
  role: string;
  quote: string;
};

export type ElevoraFaq = {
  question: string;
  answer: string;
};

export type ElevoraData = {
  brand: {
    name: string;
    label: string;
    phone: string;
    email: string;
  };
  nav: ElevoraNavItem[];
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    text: string;
    primaryCta: string;
    secondaryCta: string;
    image: string;
    badgeTitle: string;
    badgeText: string;
  };
  stats: {
    value: string;
    label: string;
  }[];
  services: ElevoraService[];
  process: ElevoraProcessStep[];
  testimonials: ElevoraTestimonial[];
  faq: ElevoraFaq[];
  about: {
    eyebrow: string;
    title: string;
    text: string;
    image: string;
    points: string[];
  };
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

export const elevoraPages = [
  { id: "home", title: "בית" },
  { id: "about", title: "אודות" },
  { id: "services", title: "שירותים" },
  { id: "contact", title: "יצירת קשר" },
] as const;

export const elevoraDefaultData: ElevoraData = {
  brand: {
    name: "Elevora",
    label: "ייעוץ עסקי ואסטרטגי",
    phone: "03-555-1840",
    email: "hello@elevora.co.il",
  },
  nav: [
    { label: "בית", page: "home" },
    { label: "אודות", page: "about" },
    { label: "שירותים", page: "services" },
    { label: "יצירת קשר", page: "contact" },
  ],
  hero: {
    eyebrow: "אסטרטגיה, צמיחה ותוצאות",
    title: "עוזרים לעסקים לבנות תהליך מכירה ברור",
    highlight: "ולהפוך יותר לידים ללקוחות.",
    text:
      "תבנית מקצועית לעסקים שרוצים להציג שירותים, לבנות אמון, לקבל פניות איכותיות ולשדר מותג יוקרתי כבר מהרגע הראשון.",
    primaryCta: "לקביעת שיחת ייעוץ",
    secondaryCta: "צפו בשירותים",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    badgeTitle: "‎+38%",
    badgeText: "שיפור ממוצע בהמרת לידים",
  },
  stats: [
    { value: "12+", label: "שנות ניסיון" },
    { value: "240+", label: "עסקים שליווינו" },
    { value: "4.9", label: "דירוג לקוחות" },
    { value: "‎72h", label: "תוכנית פעולה ראשונית" },
  ],
  services: [
    {
      icon: "01",
      title: "אסטרטגיה עסקית",
      text: "מיקוד קהל יעד, הצעת ערך, מסרים, בידול ותוכנית פעולה ברורה לצמיחה.",
    },
    {
      icon: "02",
      title: "שיפור מכירות",
      text: "בניית תהליך מכירה, טיפול בלידים, מעקב אחרי פניות והגדלת אחוזי סגירה.",
    },
    {
      icon: "03",
      title: "מיתוג ושיווק",
      text: "דיוק השפה, הנראות והמסרים כדי שהעסק ייראה מקצועי וימשוך לקוחות נכונים.",
    },
    {
      icon: "04",
      title: "אוטומציות ותהליכים",
      text: "חיבור טפסים, CRM, תזכורות, תהליכי עבודה ומעקב כדי שלא יפלו לידים בדרך.",
    },
  ],
  process: [
    {
      number: "01",
      title: "אבחון העסק",
      text: "מבינים את המצב הנוכחי, השירותים, הקהל, נקודות החוזקה ומה עוצר את הצמיחה.",
    },
    {
      number: "02",
      title: "בניית תוכנית",
      text: "מגדירים אסטרטגיה, מסרים, מבנה הצעה, תהליך ליד ותוכנית יישום ברורה.",
    },
    {
      number: "03",
      title: "יישום ושיפור",
      text: "מטמיעים בפועל, מודדים תוצאות ומשפרים את התהליך עד שהוא עובד בצורה יציבה.",
    },
  ],
  testimonials: [
    {
      name: "נועה ברק",
      role: "בעלת קליניקה",
      quote:
        "אחרי התהליך הבנו סוף סוף איך להציג את השירותים שלנו ואיך לטפל בלידים בצורה מסודרת. הפניות הפכו להרבה יותר איכותיות.",
    },
    {
      name: "איתי לוי",
      role: "מנכ״ל סוכנות שירותים",
      quote:
        "האתר והתהליך העסקי נראים הרבה יותר מקצועיים. יש מסר ברור, הצעה ברורה ולקוחות מבינים מהר למה לבחור בנו.",
    },
    {
      name: "מיכל אדרי",
      role: "יועצת פיננסית",
      quote:
        "קיבלתי אתר שמשדר בדיוק את הרמה שרציתי. נקי, יוקרתי, אמין ומאוד קל ללקוח להשאיר פרטים.",
    },
  ],
  faq: [
    {
      question: "למי התבנית מתאימה?",
      answer:
        "לעסקים נותני שירות, יועצים, סוכנויות, מאמנים, קליניקות, עורכי דין, רואי חשבון וכל עסק שרוצה אתר תדמיתי מקצועי שמייצר פניות.",
    },
    {
      question: "אפשר להתאים את הטקסטים והתמונות?",
      answer:
        "כן. כל הטקסטים, התמונות, הכפתורים והאזורים בנויים כך שיהיה קל להחליף אותם בעורך.",
    },
    {
      question: "אפשר לחבר טופס לידים?",
      answer:
        "כן. אזור יצירת הקשר בנוי לטופס ליד, וניתן לחבר אותו ל־CRM, וואטסאפ, מייל או אוטומציה.",
    },
  ],
  about: {
    eyebrow: "מי אנחנו",
    title: "צוות שמחבר בין חשיבה עסקית, נראות מקצועית ותוצאות.",
    text:
      "אנחנו מלווים עסקים שרוצים להיראות טוב יותר, למכור ברור יותר ולבנות תהליך שמייצר יותר פניות איכותיות. התהליך שלנו משלב אסטרטגיה, UX, מסרים, שירותים ואוטומציות.",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    points: [
      "בניית מסר עסקי חד וברור",
      "שיפור תהליך קבלת לידים",
      "עיצוב אתר תדמיתי מקצועי",
      "התאמה לעסקים קטנים ובינוניים",
    ],
  },
  cta: {
    title: "רוצים אתר עסקי שנראה מקצועי ומביא יותר פניות?",
    text:
      "השאירו פרטים ונחזור אליכם עם כיוון ראשוני, המלצות ותוכנית פעולה שמתאימה לעסק שלכם.",
    button: "דברו איתנו",
  },
  contact: {
    eyebrow: "בואו נתחיל",
    title: "השאירו פרטים ונחזור אליכם לשיחת התאמה.",
    text:
      "ספרו לנו במה העסק עוסק ומה המטרה המרכזית שלכם — אתר תדמית, יותר לידים, שיפור מכירות או בניית תהליך מלא.",
    address: "תל אביב, ישראל",
    hours: "א׳-ה׳ 09:00-18:00",
  },
};

export const elevoraPalette: ReadyWebsitePalette = {
  primary: "#13231B",
  secondary: "#314739",
  accent: "#D8B56D",
  background: "#F6F1E7",
  surface: "#FFFFFF",
  text: "#13231B",
  muted: "#6F7D72",
  dark: "#09130E",
};

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const blocks: TemplateBlockInput[] = [
  { type: "header", variant: "professional-rtl", title: "Header" },
  { type: "hero", variant: "consulting-premium-rtl", title: "Hero" },

  // במקום stats כי stats לא קיים אצלך ב-ReadyBlockType
  { type: "results", variant: "business-metrics-rtl", title: "Stats" },

  { type: "services", variant: "consulting-cards-rtl", title: "Services" },
  { type: "about", variant: "split-image-rtl", title: "About" },
  { type: "process", variant: "three-steps-rtl", title: "Process" },
  { type: "testimonials", variant: "client-trust-rtl", title: "Testimonials" },
  { type: "faq", variant: "clean-faq-rtl", title: "FAQ" },
  { type: "contact", variant: "lead-form-rtl", title: "Contact" },
  { type: "footer", variant: "professional-footer-rtl", title: "Footer" },
];

function withBlockIds(
  templateId: string,
  inputBlocks: TemplateBlockInput[]
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

function createElevoraEditorHtml(page: ElevoraPageId) {
  const data = elevoraDefaultData;

  const pageTitle =
    page === "about"
      ? data.about.title
      : page === "services"
        ? "פתרונות עסקיים לאתר מקצועי, לידים ותהליך מכירה ברור."
        : page === "contact"
          ? data.contact.title
          : `${data.hero.title} ${data.hero.highlight}`;

  const pageText =
    page === "about"
      ? data.about.text
      : page === "services"
        ? "עמוד שירותים שמתאים לעסקים שרוצים להסביר במה הם עוזרים, למה לבחור בהם ואיך להשאיר פרטים."
        : page === "contact"
          ? data.contact.text
          : data.hero.text;

  return `
<main dir="rtl" data-template-id="elevora" class="elevora-page">
  <header data-section-kind="header" data-section-title="Header" class="elevora-header">
    <div class="elevora-shell">
      <div class="elevora-header-inner">
        <div class="elevora-brand">
          <span class="elevora-brand-mark">E</span>
          <span>
            <span data-gjs-type="text" class="elevora-brand-name">${escapeHtml(data.brand.name)}</span>
            <span data-gjs-type="text" class="elevora-brand-label">${escapeHtml(data.brand.label)}</span>
          </span>
        </div>

        <nav class="elevora-nav">
          <a data-editable-link="true" href="/" class="elevora-nav-link">בית</a>
          <a data-editable-link="true" href="/about" class="elevora-nav-link">אודות</a>
          <a data-editable-link="true" href="/services" class="elevora-nav-link">שירותים</a>
          <a data-editable-link="true" href="/contact" class="elevora-nav-link">יצירת קשר</a>
        </nav>

        <a data-editable-link="true" href="/contact" class="elevora-btn elevora-btn-primary elevora-header-cta">דברו איתנו</a>
      </div>
    </div>
  </header>

  <section data-section-kind="hero" data-section-title="Hero" class="elevora-hero">
    <div class="elevora-shell">
      <div class="elevora-hero-grid">
        <div class="elevora-hero-content">
          <span data-gjs-type="text" class="elevora-eyebrow elevora-reveal">${escapeHtml(data.hero.eyebrow)}</span>
          <h1 data-gjs-type="text" class="elevora-hero-title elevora-reveal elevora-delay-1">
            ${escapeHtml(pageTitle)}
          </h1>
          <p data-gjs-type="text" class="elevora-hero-text elevora-reveal elevora-delay-2">
            ${escapeHtml(pageText)}
          </p>
          <div class="elevora-hero-actions elevora-reveal elevora-delay-3">
            <a data-editable-link="true" href="/contact" class="elevora-btn elevora-btn-primary">${escapeHtml(data.hero.primaryCta)}</a>
            <a data-editable-link="true" href="/services" class="elevora-btn elevora-btn-outline">${escapeHtml(data.hero.secondaryCta)}</a>
          </div>
        </div>

        <div class="elevora-hero-media elevora-reveal elevora-delay-2">
          <span class="elevora-orbit"></span>
          <div class="elevora-media-card">
            <img src="${escapeHtml(data.hero.image)}" alt="פגישה עסקית מקצועית" />
          </div>
          <div class="elevora-floating-badge">
            <strong data-gjs-type="text">${escapeHtml(data.hero.badgeTitle)}</strong>
            <span data-gjs-type="text">${escapeHtml(data.hero.badgeText)}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section data-section-kind="results" data-section-title="Stats" class="elevora-section-tight">
    <div class="elevora-shell">
      <div class="elevora-stats">
        ${data.stats
          .map(
            (stat) => `
          <article class="elevora-stat">
            <strong data-gjs-type="text">${escapeHtml(stat.value)}</strong>
            <span data-gjs-type="text">${escapeHtml(stat.label)}</span>
          </article>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section data-section-kind="services" data-section-title="Services" class="elevora-section">
    <div class="elevora-shell">
      <div class="elevora-section-head">
        <div>
          <span data-gjs-type="text" class="elevora-eyebrow">שירותים</span>
          <h2 data-gjs-type="text" class="elevora-section-title">כל מה שעסק צריך כדי להיראות מקצועי ולסגור יותר לקוחות.</h2>
        </div>
      </div>

      <div class="elevora-services-grid">
        ${data.services
          .map(
            (service) => `
          <article class="elevora-service-card">
            <div>
              <span data-gjs-type="text" class="elevora-service-icon">${escapeHtml(service.icon)}</span>
              <h3 data-gjs-type="text">${escapeHtml(service.title)}</h3>
              <p data-gjs-type="text">${escapeHtml(service.text)}</p>
            </div>
            <a data-editable-link="true" href="/contact" class="elevora-btn elevora-btn-outline">קבלו פרטים</a>
          </article>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section data-section-kind="about" data-section-title="About" class="elevora-section">
    <div class="elevora-shell">
      <div class="elevora-about-grid">
        <div class="elevora-about-image">
          <img src="${escapeHtml(data.about.image)}" alt="צוות ייעוץ עסקי" />
        </div>

        <div class="elevora-about-card">
          <span data-gjs-type="text" class="elevora-eyebrow">${escapeHtml(data.about.eyebrow)}</span>
          <h2 data-gjs-type="text">${escapeHtml(data.about.title)}</h2>
          <p data-gjs-type="text">${escapeHtml(data.about.text)}</p>

          <div class="elevora-check-list">
            ${data.about.points
              .map(
                (point) => `
              <span data-gjs-type="text" class="elevora-check">${escapeHtml(point)}</span>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section data-section-kind="process" data-section-title="Process" class="elevora-section">
    <div class="elevora-shell">
      <div class="elevora-process">
        ${data.process
          .map(
            (step) => `
          <article class="elevora-step">
            <span data-gjs-type="text" class="elevora-step-number">${escapeHtml(step.number)}</span>
            <h3 data-gjs-type="text">${escapeHtml(step.title)}</h3>
            <p data-gjs-type="text">${escapeHtml(step.text)}</p>
          </article>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section data-section-kind="testimonials" data-section-title="Testimonials" class="elevora-section">
    <div class="elevora-shell">
      <div class="elevora-testimonial-list">
        ${data.testimonials
          .map(
            (testimonial) => `
          <article class="elevora-mini-testimonial">
            <p data-gjs-type="text">“${escapeHtml(testimonial.quote)}”</p>
            <strong data-gjs-type="text">${escapeHtml(testimonial.name)} · ${escapeHtml(testimonial.role)}</strong>
          </article>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section data-section-kind="faq" data-section-title="FAQ" class="elevora-section">
    <div class="elevora-shell">
      <div class="elevora-faq">
        ${data.faq
          .map(
            (item) => `
          <article class="elevora-faq-item">
            <h3 data-gjs-type="text">${escapeHtml(item.question)}</h3>
            <p data-gjs-type="text">${escapeHtml(item.answer)}</p>
          </article>`
          )
          .join("")}
      </div>
    </div>
  </section>

  <section data-section-kind="contact" data-section-title="Contact" class="elevora-section">
    <div class="elevora-shell">
      <div class="elevora-contact-grid">
        <div class="elevora-contact-panel">
          <span data-gjs-type="text" class="elevora-eyebrow">${escapeHtml(data.contact.eyebrow)}</span>
          <h2 data-gjs-type="text" class="elevora-section-title">${escapeHtml(data.contact.title)}</h2>
          <p data-gjs-type="text" class="elevora-section-text">${escapeHtml(data.contact.text)}</p>
        </div>

        <div class="elevora-form-card">
          <form class="elevora-form">
            <div class="elevora-field">
              <label>שם מלא</label>
              <input type="text" placeholder="השם שלך" />
            </div>
            <div class="elevora-field">
              <label>טלפון</label>
              <input type="tel" placeholder="050-0000000" />
            </div>
            <div class="elevora-field">
              <label>אימייל</label>
              <input type="email" placeholder="name@email.com" />
            </div>
            <div class="elevora-field">
              <label>איך אפשר לעזור?</label>
              <textarea placeholder="ספרו לנו בקצרה על העסק והמטרה שלכם"></textarea>
            </div>
            <button type="submit" class="elevora-btn elevora-btn-primary">שליחת פנייה</button>
          </form>
        </div>
      </div>
    </div>
  </section>

  <footer data-section-kind="footer" data-section-title="Footer" class="elevora-footer">
    <div class="elevora-shell">
      <div class="elevora-footer-inner">
        <div data-gjs-type="text">© ${new Date().getFullYear()} ${escapeHtml(data.brand.name)}. כל הזכויות שמורות.</div>
      </div>
    </div>
  </footer>
</main>`;
}

export const elevoraSeed = {
  id: "elevora",
  name: "Elevora",
  category: "business",
  description:
    "תבנית יוקרתית לעסקים נותני שירות, יועצים, סוכנויות, קליניקות ושירותים מקצועיים.",
  niche: "עסקים ושירותים מקצועיים",
  layout: "rtlProfessionalConsulting",
  image:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  heroTitle: `${elevoraDefaultData.hero.title} ${elevoraDefaultData.hero.highlight}`,
  heroSubtitle: elevoraDefaultData.hero.text,
  palette: elevoraPalette,
  blocks: withBlockIds("elevora", blocks),

  data: elevoraDefaultData,
  pages: elevoraPages,

  css: elevoraEditorCss,
  editorCss: elevoraEditorCss,
  preview: createElevoraEditorHtml("home"),
  html: createElevoraEditorHtml("home"),

  editor: {
    css: elevoraEditorCss,
    pages: [
      {
        id: "home",
        title: "בית",
        slug: "",
        type: "home",
        isHome: true,
        html: createElevoraEditorHtml("home"),
        css: elevoraEditorCss,
      },
      {
        id: "about",
        title: "אודות",
        slug: "about",
        type: "about",
        html: createElevoraEditorHtml("about"),
        css: elevoraEditorCss,
      },
      {
        id: "services",
        title: "שירותים",
        slug: "services",
        type: "service",
        html: createElevoraEditorHtml("services"),
        css: elevoraEditorCss,
      },
      {
        id: "contact",
        title: "יצירת קשר",
        slug: "contact",
        type: "contact",
        html: createElevoraEditorHtml("contact"),
        css: elevoraEditorCss,
      },
    ],
  },
} as unknown as ReadyWebsiteTemplateSeed;