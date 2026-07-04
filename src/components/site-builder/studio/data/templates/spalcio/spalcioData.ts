export type SpalcioPageId =
  | "home"
  | "about"
  | "services"
  | "projects"
  | "contact";

export type SpalcioSectionId =
  | "header"
  | "hero"
  | "services"
  | "projects"
  | "about"
  | "process"
  | "testimonials"
  | "contact"
  | "footer";

export type SpalcioPage = {
  id: SpalcioPageId;
  name: string;
  slug: string;
  sections: SpalcioSectionId[];
};

export type SpalcioSection = {
  id: SpalcioSectionId;
  type: SpalcioSectionId;
  title: string;
};

export type SpalcioService = {
  title: string;
  text: string;
};

export type SpalcioProject = {
  title: string;
  text: string;
  image: string;
};

export type SpalcioProcessStep = {
  number: string;
  title: string;
  text: string;
};

export type SpalcioContactItem = {
  type: "phone" | "email" | "location" | "hours";
  text: string;
};

export const spalcioPages: SpalcioPage[] = [
  {
    id: "home",
    name: "בית",
    slug: "/",
    sections: [
      "header",
      "hero",
      "services",
      "projects",
      "about",
      "process",
      "testimonials",
      "contact",
      "footer",
    ],
  },
  {
    id: "about",
    name: "אודות",
    slug: "/about",
    sections: ["header", "about", "process", "testimonials", "contact", "footer"],
  },
  {
    id: "services",
    name: "שירותים",
    slug: "/services",
    sections: ["header", "services", "process", "contact", "footer"],
  },
  {
    id: "projects",
    name: "פרויקטים",
    slug: "/projects",
    sections: ["header", "projects", "testimonials", "contact", "footer"],
  },
  {
    id: "contact",
    name: "יצירת קשר",
    slug: "/contact",
    sections: ["header", "contact", "footer"],
  },
];

export const spalcioSections: SpalcioSection[] = [
  { id: "header", type: "header", title: "כותרת עליונה" },
  { id: "hero", type: "hero", title: "אזור פתיחה" },
  { id: "services", type: "services", title: "שירותים" },
  { id: "projects", type: "projects", title: "פרויקטים" },
  { id: "about", type: "about", title: "אודות" },
  { id: "process", type: "process", title: "תהליך עבודה" },
  { id: "testimonials", type: "testimonials", title: "המלצות" },
  { id: "contact", type: "contact", title: "יצירת קשר" },
  { id: "footer", type: "footer", title: "פוטר" },
];

export const spalcioData = {
  brand: {
    name: "Spalcio",
    subtitle: "סטודיו עסקי",
    footerText: "תבנית אתר פרימיום לעסקים מקצועיים ונותני שירות.",
  },

  navigation: [
    { label: "שירותים", href: "#services" },
    { label: "פרויקטים", href: "#projects" },
    { label: "אודות", href: "#about" },
    { label: "יצירת קשר", href: "#contact" },
  ],

  hero: {
    badge: "נבנה מתוך חזון, מעוצב למטרה ברורה",
    title: "אתר עסקי מקצועי עם נראות נקייה וביטחון מהשנייה הראשונה.",
    subtitle:
      "תבנית פרימיום ליועצים, סטודיואים, סוכנויות ונותני שירות שרוצים להציג את העסק בצורה אמינה, מודרנית וברורה.",
    primaryButton: "קביעת שיחת ייעוץ",
    secondaryButton: "צפייה בפרויקטים",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "משרד עסקי מודרני",
    floatingTitle: "נוכחות עסקית פרימיום",
    floatingText:
      "מבנה נקי, מסרים חדים, אזורי תוכן מקצועיים וקריאה ברורה לפעולה.",
    stats: [
      { value: "180+", label: "פרויקטים" },
      { value: "12", label: "שנות ניסיון" },
      { value: "98%", label: "אמון לקוחות" },
    ],
  },

  services: {
    eyebrow: "שירותים",
    title: "כל מה שעסק צריך כדי להיראות רציני, ברור ומקצועי אונליין.",
    text: "תבנית שנבנתה לעסקים שמוכרים אמון, מומחיות ותוצאות.",
    items: [
      {
        title: "אסטרטגיה עסקית",
        text: "חידוד ההצעה, המסרים והכיוון העסקי כדי שהאתר יעבוד בצורה ברורה ומדויקת.",
      },
      {
        title: "נראות מותג מקצועית",
        text: "יצירת נוכחות דיגיטלית יוקרתית, אמינה וזכירה שמחזקת את העסק.",
      },
      {
        title: "מערכת לידים ולקוחות",
        text: "הפיכת עניין לפניות אמיתיות באמצעות טפסים, קריאות לפעולה ועמודי שירות מסודרים.",
      },
    ] as SpalcioService[],
  },

  projects: {
    eyebrow: "עבודות נבחרות",
    title: "מבנה שנועד להציג הוכחות, לא רק מילים יפות.",
    items: [
      {
        title: "סטודיו לייעוץ עסקי",
        text: "מבנה נקי להצגת שירותים, הוכחות, תהליך עבודה וערך עסקי ברור.",
        image:
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "חברת נדל״ן והשקעות",
        text: "עמוד מקצועי שמייצר אמון ומציג ניסיון, מומחיות ופרויקטים.",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "סוכנות קריאייטיב",
        text: "תצוגת עבודות חזקה שמציגה יכולות, תהליך ותוצאות.",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      },
    ] as SpalcioProject[],
  },

  about: {
    eyebrow: "אודות",
    title: "תבנית שמייצרת אמון כבר מהכניסה הראשונה לאתר.",
    text:
      "Spalcio נותנת לעסק מבוסס שירותים מבנה מלא: כותרת חזקה, מיצוב, שירותים, הוכחות, תהליך עבודה ויצירת קשר.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "פגישת עבודה עסקית",
    bullets: [
      "סקשנים מקצועיים לעסקים רציניים",
      "היררכיה ויזואלית ברורה למסרים החשובים",
      "מוכן לפניות, קביעת שיחות ויצירת לידים",
    ],
  },

  process: {
    eyebrow: "תהליך עבודה",
    title: "מרעיון ראשוני לאתר עסקי מלוטש וברור.",
    steps: [
      {
        number: "01",
        title: "אפיון",
        text: "הבנת העסק, השירותים, הקהל והמסר המרכזי.",
      },
      {
        number: "02",
        title: "מבנה",
        text: "בניית עמודים וסקשנים שמובילים את הלקוח לפעולה.",
      },
      {
        number: "03",
        title: "השקה",
        text: "פרסום אתר מקצועי, נקי ומוכן לקבלת פניות.",
      },
    ] as SpalcioProcessStep[],
  },

  testimonials: {
    quote:
      "המבנה של האתר גרם לעסק שלנו להיראות גדול יותר, ברור יותר והרבה יותר מקצועי.",
    name: "דניאל כהן",
    role: "מייסד סטודיו",
  },

  contact: {
    eyebrow: "יצירת קשר",
    title: "מוכנים ליצור אתר עסקי מקצועי?",
    items: [
      { type: "phone", text: "052-000-0000" },
      { type: "email", text: "hello@spalcio.com" },
      { type: "location", text: "מרכז עסקים, תל אביב" },
      { type: "hours", text: "א׳–ה׳, 09:00–18:00" },
    ] as SpalcioContactItem[],
    form: {
      firstName: "שם פרטי",
      lastName: "שם משפחה",
      email: "כתובת אימייל",
      message: "ספרו לנו על הפרויקט שלכם",
      button: "שליחת הודעה",
    },
  },
};

export default spalcioData;