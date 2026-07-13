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
    backgroundImage?: CycloraMediaValue;
    orbitMedia: CycloraMediaValue[];
  };
  strategyProof: {
    text: string;
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
    proofLabel: string;
    proofMeta: string;
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

const media = {
  hero: [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=85",
  ],
  cases: [
    "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1800&q=90",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=90",
  ],
  cta: [
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=85",
  ],
};

export const cycloraDefaultData: CycloraData = {
  brand: {
    name: "סיקלורה",
    tagline: "סטודיו שיווק חכם לצמיחה מדידה",
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
    marquee: "שיווק חכם",
    title: "חוויית שיווק מבוססת נתונים",
    accent: "שנבנתה לצמיחה.",
    description:
      "אסטרטגיה, אוטומציות, קריאייטיב ומדידה מתחברים למערכת אחת שמקדמת את העסק מהר יותר.",
    microcopy:
      "מעטפת שיווקית לעסקים שרוצים לעבוד מדויק, להיראות מקצועיים ולהפוך יותר עניין להכנסות.",
    primaryButton: "בואו נתחיל",
    secondaryButton: "הסיפור שלנו",
    scrollLabel: "המשיכו לגלול",
    backgroundImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=85",
    orbitMedia: media.hero,
  },

  strategyProof: {
    text: "✦ נבחרים על ידי צוותים שממוקדים בצמיחה.",
  },

  strategyHeading: {
    eyebrow: "הפתרונות שלנו",
    title: "אסטרטגיות",
    accent: "שגדלות איתכם",
  },

  strategies: [
    {
      eyebrow: "אוטומציה חכמה",
      title: "תהליכים",
      description:
        "מערכי לידים, ניהול לקוחות ותהליכים אוטומטיים שמורידים עומס ומקצרים זמני תגובה.",
      metric: "-61% זמן טיפול",
    },
    {
      eyebrow: "תובנות בזמן אמת",
      title: "אנליטיקה",
      description:
        "דשבורדים ותובנות שמראים מה באמת עובד, איפה נשרף תקציב ומה הצעד הבא.",
      metric: "200+ לקוחות • 4.9/5",
    },
    {
      eyebrow: "תכנון צמיחה",
      title: "אסטרטגיה",
      description:
        "תוכנית מותאמת לעסק עם מסרים, הצעה, משפך ותעדוף שמייצרים צמיחה יציבה.",
      metric: "תוכנית 90 יום",
    },
    {
      eyebrow: "מיקוד מדויק",
      title: "פרסום",
      description:
        "קמפיינים מדויקים שמחברים בין קריאייטיב חזק, קהלים נכונים ומדידה אמיתית.",
      metric: "החזר פי 4.8",
    },
  ],

  workHeading: {
    eyebrow: "עבודות נבחרות",
    title: "צמיחה",
    accent: "בפועל",
    proofLabel: "תוצאות מוכחות",
    proofMeta: "(2023–2026)",
  },

  cases: [
    {
      eyebrow: "השקה · אנליטיקה",
      title: "מנוע ניתוח נובה",
      category: "קמפיין השקה",
      year: "2026",
      image: media.cases[0],
    },
    {
      eyebrow: "אסטרטגיה · מוצר",
      title: "חזון צמיחה",
      category: "מיתוג ומוצר",
      year: "2026",
      image: media.cases[1],
    },
    {
      eyebrow: "אוטומציה · מסחר",
      title: "זרם מסחר",
      category: "מסע לקוח",
      year: "2025",
      image: media.cases[2],
    },
    {
      eyebrow: "פרסום · ביצועים",
      title: "פולס שיווק",
      category: "קריאייטיב ביצועים",
      year: "2026",
      image: media.cases[3],
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
      name: "דניאל כהן",
      role: "מנהל שיווק",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=85",
      badge: "מרשים",
    },
    {
      quote:
        "עברנו מניחושים להחלטות מבוססות נתונים. השילוב בין אסטרטגיה, אוטומציה וקריאייטיב נתן לנו תוצאות מהירות ומדידות.",
      name: "סופיה לוי",
      role: "מנהלת צמיחה",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=85",
      badge: "יוצא דופן",
    },
    {
      quote:
        "הצוות הצליח לפשט מוצר מורכב ולבנות מסע שמרגיש מדויק בכל נקודת מגע. גם המספרים וגם חוויית המותג השתפרו.",
      name: "איתן שרון",
      role: "מנהל אסטרטגיה",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=85",
      badge: "מבריק",
    },
    {
      quote:
        "צוות חושב קדימה. האנליטיקה החיזויית נתנה לנו בהירות וביטחון בכל החלטה.",
      name: "נועה לוי",
      role: "סמנכ״לית שיווק",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=85",
      badge: "מדהים",
    },
    {
      quote:
        "רמת התובנות שיושמו עזרה לנו להוריד עלויות ולהגדיל ביצועים בכל קמפיין.",
      name: "אוליביה רוזנברג",
      role: "אסטרטגית מותג",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=85",
      badge: "אהבתי",
    },
    {
      quote:
        "שיעורי ההמרה עלו משמעותית אחרי יישום הגישה החכמה שלהם לפרסונליזציה.",
      name: "רועי מזרחי",
      role: "ראש דיגיטל",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=85",
      badge: "מצוין",
    },
  ],

  pricingHeading: {
    eyebrow: "השקעה בצמיחה",
    title: "תוכניות שנבנו",
    accent: "כדי לגדול",
  },

  plans: [
    {
      name: "צמיחה",
      tag: "בסיסי",
      price: "₪4,900",
      suffix: "/ חודש",
      description:
        "מעטפת ממוקדת לעסק שרוצה לבנות בסיס שיווקי ברור ולהתחיל לגדול באופן עקבי.",
      features: [
        "אסטרטגיית שיווק ומסרים",
        "ניהול קמפיין מרכזי",
        "אוטומציית לידים בסיסית",
        "דוח ביצועים חודשי",
        "פגישת מיטוב",
      ],
      button: "מתחילים",
    },
    {
      name: "ביצועים",
      tag: "מתקדם",
      price: "₪9,500",
      suffix: "/ חודש",
      description:
        "פתרון מתקדם למותגים שרוצים לגדול בכמה ערוצים עם נתונים, קריאייטיב ואוטומציה.",
      features: [
        "אסטרטגיית צמיחה רב־ערוצית",
        "ניהול קמפיינים מלא",
        "מערכי ניהול לקוחות ואוטומציה",
        "קריאייטיב שוטף",
        "לוח בקרת נתונים",
        "ליווי שבועי",
      ],
      button: "בונים צמיחה",
      featured: true,
    },
  ],

  faqHeading: {
    eyebrow: "שאלות נפוצות",
    title: "שאלות",
    accent: "שכבר ענינו",
  },

  faq: [
    {
      question: "במה הגישה שלכם שונה מסוכנות רגילה?",
      answer:
        "אנחנו מחברים אסטרטגיה, קריאייטיב, מדיה, ניהול לקוחות ואוטומציות למערכת אחת. כך כל פעולה משרתת את אותה מטרת צמיחה.",
    },
    {
      question: "איך בינה מלאכותית משפרת את ביצועי הקמפיינים?",
      answer:
        "בינה מלאכותית עוזרת לנתח התנהגות, לזהות דפוסים, לייצר וריאציות ולתעדף פעולות. ההחלטות המרכזיות נשארות תחת בקרה אנושית.",
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
      question: "האם אתם עובדים עם חברות חדשות וגם עם עסקים ותיקים?",
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
    eyebrow: "מתחילים עכשיו",
    title: "בואו נניע",
    accent: "צמיחה",
    description:
      "מערכת שיווק חכמה, מותאמת לעסק שלכם ונבנית כדי להפוך תשומת לב לתוצאות.",
    button: "קובעים שיחת היכרות",
    orbitMedia: media.cta,
  },

  footer: {
    description: "שיווק חכם לצמיחה מדידה.",
    copyright: "© 2026 סיקלורה. כל הזכויות שמורות.",
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
