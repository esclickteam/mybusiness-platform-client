export type CycloraPageId = "home";

export type CycloraMediaValue =
  | string
  | {
      url?: string;
      src?: string;
      secureUrl?: string;
      secure_url?: string;
      originalUrl?: string;
      type?: "image" | "video" | string;
    };

export type CycloraNavItem = {
  label: string;
  href: string;
};

export type CycloraStrategy = {
  eyebrow: string;
  title: string;
  description: string;
  metric?: string;
};

export type CycloraCase = {
  eyebrow: string;
  title: string;
  category: string;
  year: string;
  image: CycloraMediaValue;
};

export type CycloraTestimonial = {
  quote: string;
  name: string;
  role: string;
  avatar: CycloraMediaValue;
  badge: string;
};

export type CycloraPlan = {
  name: string;
  tag: string;
  price: string;
  suffix: string;
  description: string;
  features: string[];
  button: string;
  featured?: boolean;
};

export type CycloraFaq = {
  question: string;
  answer: string;
};

export type CycloraData = {
  brand: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
  };
  nav: CycloraNavItem[];
  hero: {
    marquee: string;
    title: string;
    accent: string;
    description: string;
    microcopy: string;
    primaryButton: string;
    secondaryButton: string;
    scrollLabel: string;
    orbitMedia: CycloraMediaValue[];
  };
  strategyHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  strategies: CycloraStrategy[];
  workHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  cases: CycloraCase[];
  testimonialHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  testimonials: CycloraTestimonial[];
  pricingHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  plans: CycloraPlan[];
  faqHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  faq: CycloraFaq[];
  cta: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    button: string;
    orbitMedia: CycloraMediaValue[];
  };
  footer: {
    description: string;
    copyright: string;
    links: CycloraNavItem[];
  };
};

export const cycloraPages = [
  {
    id: "home" as CycloraPageId,
    name: "בית",
    slug: "/",
  },
];

const media = [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=85",
];

export const cycloraDefaultData: CycloraData = {
  brand: {
    name: "Cyclora",
    tagline: "AI-powered growth studio",
    email: "hello@cyclora.studio",
    phone: "+972-50-555-0199",
  },

  nav: [
    { label: "אודות", href: "#strategy" },
    { label: "עבודות", href: "#work" },
    { label: "המלצות", href: "#testimonials" },
    { label: "מחירים", href: "#pricing" },
    { label: "שאלות", href: "#faq" },
  ],

  hero: {
    marquee: "Marketing, Reimagined",
    title: "חוויית שיווק חכמה",
    accent: "שנבנתה לצמיחה אמיתית.",
    description:
      "אסטרטגיה, אוטומציות, קריאייטיב ונתונים מתחברים למערכת אחת שמקדמת את העסק מהר יותר.",
    microcopy:
      "מעטפת שיווקית מבוססת AI לעסקים שרוצים לעבוד מדויק, להיראות אחרת ולהפוך יותר עניין להכנסות.",
    primaryButton: "בואו נתחיל",
    secondaryButton: "הסיפור שלנו",
    scrollLabel: "Keep scrolling",
    orbitMedia: media.slice(0, 8),
  },

  strategyHeading: {
    eyebrow: "הפתרונות שלנו",
    title: "אסטרטגיות",
    accent: "שגדלות איתכם",
  },

  strategies: [
    {
      eyebrow: "Smart traction",
      title: "פרסום",
      description:
        "קמפיינים מדויקים שמחברים בין קריאייטיב חזק, קהלים נכונים ומדידה אמיתית.",
      metric: "4.8X ROAS",
    },
    {
      eyebrow: "Workflow optimization",
      title: "אוטומציה",
      description:
        "מערכי לידים, CRM ותהליכים אוטומטיים שמורידים עומס ומקצרים זמני תגובה.",
      metric: "-61% זמן טיפול",
    },
    {
      eyebrow: "Predictive insights",
      title: "אנליטיקה",
      description:
        "דשבורדים ותובנות שמראים מה באמת עובד, איפה נשרף תקציב ומה הצעד הבא.",
      metric: "+38% המרות",
    },
    {
      eyebrow: "Growth planning",
      title: "אסטרטגיה",
      description:
        "תוכנית מותאמת לעסק עם מסרים, הצעה, משפך ותעדוף שמייצרים צמיחה יציבה.",
      metric: "90-day plan",
    },
  ],

  workHeading: {
    eyebrow: "עבודות נבחרות",
    title: "צמיחה",
    accent: "בתנועה",
  },

  cases: [
    {
      eyebrow: "Launch · Analytics",
      title: "Nova Run",
      category: "קמפיין השקה",
      year: "2026",
      image:
        "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1800&q=90",
    },
    {
      eyebrow: "Strategy · Product",
      title: "Vision Form",
      category: "מיתוג ומוצר",
      year: "2026",
      image:
        "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=1800&q=90",
    },
    {
      eyebrow: "Automation · Commerce",
      title: "Mono Case",
      category: "מסע לקוח",
      year: "2025",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1800&q=90",
    },
    {
      eyebrow: "Advertising · Fashion",
      title: "Motion Study",
      category: "קריאייטיב ביצועים",
      year: "2026",
      image:
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1800&q=90",
    },
  ],

  testimonialHeading: {
    eyebrow: "נבחרים על ידי מובילים",
    title: "מה הלקוחות",
    accent: "אומרים",
  },

  testimonials: [
    {
      quote:
        "המערכת החדשה הפכה את השיווק שלנו מתהליך מבולגן למנוע צמיחה ברור. בתוך שלושה חודשים קיצרנו זמני טיפול והגדלנו את כמות הפגישות.",
      name: "דניאל קרטר",
      role: "Marketing Director",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=85",
      badge: "Exceptional",
    },
    {
      quote:
        "עברנו מניחושים להחלטות מבוססות נתונים. השילוב בין אסטרטגיה, אוטומציה וקריאייטיב נתן לנו תוצאות מהירות ומדידות.",
      name: "סופיה מיטשל",
      role: "Growth Manager",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=85",
      badge: "Transformative",
    },
    {
      quote:
        "הצוות הצליח לפשט מוצר מורכב ולבנות מסע שמרגיש מדויק בכל נקודת מגע. גם המספרים וגם חוויית המותג השתפרו.",
      name: "נועה לוי",
      role: "Founder",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=85",
      badge: "Impressive",
    },
  ],

  pricingHeading: {
    eyebrow: "השקעה בצמיחה",
    title: "תוכניות שנבנו",
    accent: "כדי לגדול",
  },

  plans: [
    {
      name: "Growth",
      tag: "Essential",
      price: "₪4,900",
      suffix: "/ חודש",
      description:
        "מעטפת ממוקדת לעסק שרוצה לבנות בסיס שיווקי ברור ולהתחיל לגדול באופן עקבי.",
      features: [
        "אסטרטגיית שיווק ומסרים",
        "ניהול קמפיין מרכזי",
        "אוטומציית לידים בסיסית",
        "דוח ביצועים חודשי",
        "פגישת אופטימיזציה",
      ],
      button: "מתחילים",
    },
    {
      name: "Performance",
      tag: "Advanced",
      price: "₪9,500",
      suffix: "/ חודש",
      description:
        "פתרון מתקדם למותגים שרוצים לגדול בכמה ערוצים עם דאטה, קריאייטיב ואוטומציה.",
      features: [
        "אסטרטגיית צמיחה רב־ערוצית",
        "ניהול קמפיינים מלא",
        "מערכי CRM ואוטומציה",
        "קריאייטיב שוטף",
        "דשבורד נתונים",
        "ליווי שבועי",
      ],
      button: "בונים צמיחה",
      featured: true,
    },
  ],

  faqHeading: {
    eyebrow: "FAQ",
    title: "שאלות",
    accent: "שכבר ענינו עליהן",
  },

  faq: [
    {
      question: "במה הגישה שלכם שונה מסוכנות רגילה?",
      answer:
        "אנחנו מחברים אסטרטגיה, קריאייטיב, מדיה, CRM ואוטומציות למערכת אחת. כך כל פעולה משרתת את אותה מטרת צמיחה.",
    },
    {
      question: "איך AI משפר את ביצועי הקמפיינים?",
      answer:
        "AI עוזר לנתח התנהגות, לזהות דפוסים, לייצר וריאציות ולתעדף פעולות. ההחלטות המרכזיות נשארות תחת בקרה אנושית.",
    },
    {
      question: "האם השירות מתאים גם לעסק קטן?",
      answer:
        "כן. אנחנו מתאימים את היקף העבודה, הערוצים והתהליך לשלב שבו העסק נמצא ולתקציב הקיים.",
    },
    {
      question: "תוך כמה זמן רואים תוצאות?",
      answer:
        "שיפורים ראשונים נראים לרוב בשבועות הראשונים, אבל בניית מנוע צמיחה יציב היא תהליך של מדידה, למידה ואופטימיזציה.",
    },
    {
      question: "האם אתם עובדים עם סטארטאפים וגם עם עסקים ותיקים?",
      answer:
        "כן. אנחנו עובדים עם חברות בשלבי השקה, צמיחה והתרחבות, ומתאימים את המערכת למורכבות וליעדים של כל עסק.",
    },
    {
      question: "איך מודדים הצלחה?",
      answer:
        "מגדירים מראש מדדי הצלחה עסקיים: עלות ליד, שיעור המרה, הכנסה, מהירות טיפול, ערך לקוח ועוד.",
    },
  ],

  cta: {
    eyebrow: "Start now",
    title: "בואו נניע",
    accent: "צמיחה",
    description:
      "מערכת שיווק חכמה, מותאמת לעסק שלכם ונבנית כדי להפוך תשומת לב לתוצאות.",
    button: "קובעים שיחת היכרות",
    orbitMedia: media,
  },

  footer: {
    description: "AI-powered marketing for scalable growth.",
    copyright: "© 2026 Cyclora. כל הזכויות שמורות.",
    links: [
      { label: "בית", href: "#top" },
      { label: "אודות", href: "#strategy" },
      { label: "עבודות", href: "#work" },
      { label: "שירותים", href: "#strategy" },
      { label: "מחירים", href: "#pricing" },
      { label: "יצירת קשר", href: "#contact" },
    ],
  },
};
