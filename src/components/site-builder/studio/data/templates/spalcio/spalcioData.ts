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
    subtitle: "סטודיו לצמיחה עסקית",
    footerText:
      "תבנית אתר פרימיום לעסקים שרוצים לשדר אמינות, מקצועיות ונוכחות חזקה מהרגע הראשון.",
  },

  navigation: [
    { label: "שירותים", href: "#services" },
    { label: "פרויקטים", href: "#projects" },
    { label: "אודות", href: "#about" },
    { label: "יצירת קשר", href: "#contact" },
  ],

  hero: {
    badge: "אסטרטגיה · מיתוג · נוכחות דיגיטלית",
    title: "אתר עסקי שמרגיש יוקרתי, ברור ומוכן להביא לקוחות.",
    subtitle:
      "תבנית פרימיום לעסקים, יועצים, סוכנויות ונותני שירות שרוצים להיראות גדולים יותר, מקצועיים יותר ומשכנעים יותר — בלי אתר משעמם ובלי עומס מיותר.",
    primaryButton: "קביעת שיחת ייעוץ",
    secondaryButton: "צפייה בפרויקטים",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "משרד עסקי יוקרתי ומודרני",
    floatingTitle: "נוכחות עסקית שמייצרת אמון",
    floatingText:
      "היררכיה ברורה, אזורי תוכן חזקים, הוכחות, שירותים וקריאה לפעולה שמובילה לפניות.",
    stats: [
      { value: "180+", label: "פרויקטים" },
      { value: "12", label: "שנות ניסיון" },
      { value: "98%", label: "שביעות רצון" },
    ],
  },

  services: {
    eyebrow: "מה אנחנו עושים",
    title: "כל מה שעסק צריך כדי להיראות כמו מותג רציני ולא כמו עוד אתר רגיל.",
    text:
      "Spalcio בנויה לעסקים שמוכרים אמון, מומחיות ותוצאה — עם מבנה שמציג ערך מהר, ברור וחזק.",
    items: [
      {
        title: "אסטרטגיה ומיצוב",
        text:
          "חידוד המסר, קהל היעד וההצעה העסקית כדי שכל אזור באתר יעבוד לטובת מכירה ופנייה.",
      },
      {
        title: "נראות פרימיום",
        text:
          "עיצוב נקי, אלגנטי ובטוח שמייצר תחושה של עסק מבוסס, מקצועי ואמין כבר מהכניסה הראשונה.",
      },
      {
        title: "מערכת שמביאה פניות",
        text:
          "מבנה שמוביל את הגולש משלב ההתעניינות לשלב הפעולה: טופס, שיחה, קביעת פגישה או יצירת קשר.",
      },
    ] as SpalcioService[],
  },

  projects: {
    eyebrow: "עבודות נבחרות",
    title: "תצוגת פרויקטים שמוכיחה יכולת, ניסיון ותוצאה — לא רק טקסט יפה.",
    items: [
      {
        title: "סטודיו לייעוץ עסקי",
        text:
          "אתר תדמית נקי ויוקרתי שמציג מומחיות, שירותים ותהליך עבודה בצורה שמייצרת אמון.",
        image:
          "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "חברת נדל״ן והשקעות",
        text:
          "עמוד עסקי חזק עם נראות יציבה, אזורי הוכחה, פרויקטים וקריאה ברורה לפעולה.",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
      },
      {
        title: "סוכנות קריאייטיב",
        text:
          "תצוגת עבודות מודרנית שמדגישה יכולות, תוצאות, תהליך וייחודיות של המותג.",
        image:
          "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
      },
    ] as SpalcioProject[],
  },

  about: {
    eyebrow: "למה זה עובד",
    title: "האתר לא רק נראה טוב — הוא בנוי כדי לגרום ללקוח להבין למה לבחור בכם.",
    text:
      "Spalcio נותנת לעסק מבוסס שירותים מבנה מלא עם מסר חד, הצגת שירותים, פרויקטים, תהליך עבודה, המלצות ויצירת קשר. כל חלק באתר נועד לחזק אמון ולהוביל לפעולה.",
    image:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1400&q=80",
    imageAlt: "פגישת עבודה עסקית",
    bullets: [
      "נראות יוקרתית שמתאימה לעסקים רציניים",
      "מסרים ברורים שמסבירים מהר מה הערך שלכם",
      "מבנה מוכן לפניות, שיחות ייעוץ ויצירת לידים",
    ],
  },

  process: {
    eyebrow: "תהליך עבודה",
    title: "מבנה פשוט וברור שמוביל את הלקוח מהיכרות לפנייה.",
    steps: [
      {
        number: "01",
        title: "מגדירים מסר",
        text:
          "מציגים בצורה ברורה מי אתם, למי אתם עוזרים ולמה כדאי לבחור דווקא בכם.",
      },
      {
        number: "02",
        title: "בונים אמון",
        text:
          "מוסיפים שירותים, פרויקטים, יתרונות, המלצות ותהליך שמחזקים את הביטחון של הלקוח.",
      },
      {
        number: "03",
        title: "מובילים לפעולה",
        text:
          "מסיימים עם קריאה ברורה לפעולה כדי שהגולש ידע בדיוק מה הצעד הבא.",
      },
    ] as SpalcioProcessStep[],
  },

  testimonials: {
    quote:
      "האתר החדש שינה לגמרי את הרושם הראשוני. פתאום העסק נראה מסודר, מקצועי והרבה יותר יוקרתי.",
    name: "דניאל כהן",
    role: "מייסד סטודיו",
  },

  contact: {
    eyebrow: "בואו נתחיל",
    title: "רוצים אתר עסקי שנראה מקצועי ומייצר יותר פניות?",
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
      message: "ספרו לנו על העסק או הפרויקט שלכם",
      button: "שליחת הודעה",
    },
  },
};

export default spalcioData;