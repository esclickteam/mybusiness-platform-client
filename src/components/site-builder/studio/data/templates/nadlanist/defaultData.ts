export const nadlanistDefaultData = {
  templateId: "nadlanist",
  name: "Nadlanist",
  title: "Nadlanist",

  brand: {
    name: "Nadlanist",
    logo: "ND",
    tagline: "יועץ נדל״ן אישי",
  },

  navigation: [
    { id: "home", label: "בית", page: "home", href: "/" },
    { id: "about", label: "אודות", page: "about", href: "/about" },
    { id: "properties", label: "נכסים", page: "properties", href: "/properties" },
    { id: "services", label: "שירותים", page: "services", href: "/services" },
    { id: "blog", label: "מגזין", page: "blog", href: "/blog" },
    { id: "contact", label: "יצירת קשר", page: "contact", href: "/contact" },
  ],

  marquee: [],

  images: {
    hero:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",
    heroAlt:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
    portrait:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=85",
    office:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85",
  },

  hero: {
    chips: ["יוקרה", "פרטי", "אישי", "ליווי", "מכירה", "קנייה"],
    title: "נדל״ן שמרגיש אישי",
    subtitle:
      "תבנית יוקרתית לסוכן נדל״ן שמעדיף לבנות אמון, להציג נכסים נבחרים ולייצר פניות איכותיות — בלי לפרסם מחירי בתים באתר.",
    primaryButton: "צפייה בנכסים",
    secondaryButton: "לקביעת שיחה",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85",
    imageTitle: "ליווי נדל״ן פרטי",
    badge: "יועץ נדל״ן אישי",
    statNumber: "120+",
    statLabel: "לקוחות שלוו בהצלחה",
    floatingLabel: "תיאום סיור",
  },

  partners: {
    eyebrow: "רשת מקצועית",
    items: ["שמאים", "עו״ד", "משכנתאות", "אדריכלים", "מעצבים", "משקיעים"],
  },

  manifesto: {
    title: "החלטות נדל״ן גדולות צריכות ליווי רגוע ומדויק.",
    text:
      "התבנית בנויה לסוכן נדל״ן שרוצה להיראות מקצועי ויוקרתי, אבל לא עמוס או אגרסיבי. המטרה היא לגרום ללקוח להשאיר פרטים, לקבוע שיחה ולהרגיש שיש כאן מישהו שמבין את התהליך.",
    button: "קצת עליי",
  },

  servicesSection: {
    eyebrow: "שירותים",
    title: "ליווי שמסדר את כל התהליך.",
    text:
      "מכירה, קנייה, שיווק נכס, סינון פניות ותיאום פגישות — בצורה ברורה, שקטה ומקצועית.",
  },

  services: [
    {
      title: "ליווי מוכרים",
      text:
        "בניית אסטרטגיית מכירה, הצגת הנכס בצורה נכונה, סינון קונים רציניים וניהול משא ומתן.",
      image:
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=85",
    },
    {
      title: "ליווי קונים",
      text:
        "הבנת הצרכים, מיקוד אזורים, בדיקת התאמה ותיאום סיורים רק לנכסים שבאמת רלוונטיים.",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    },
    {
      title: "שיווק נכסים",
      text:
        "תמונות נכונות, ניסוח מדויק, הצגת יתרונות הנכס ויצירת תהליך שמייצר פניות איכותיות.",
      image:
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85",
    },
  ],

  propertiesSection: {
    eyebrow: "נכסים נבחרים",
    title: "נכסים שמוצגים בלי מחיר פומבי.",
    text:
      "אפשר להציג נכסים לפי סגנון, אזור, מאפיינים וקריאה לפעולה — בלי לחשוף מחיר באתר.",
    button: "לכל הנכסים",
  },

  properties: [
    {
      title: "וילה מודרנית",
      location: "אזור החוף",
      tag: "סיור פרטי",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
      details: ["5 חדרים", "בריכה", "גינה פרטית"],
    },
    {
      title: "פנטהאוז מעוצב",
      location: "מרכז העיר",
      tag: "בלעדי",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
      details: ["נוף פתוח", "מרפסת גדולה", "עיצוב יוקרתי"],
    },
    {
      title: "בית משפחתי",
      location: "שכונה שקטה",
      tag: "למשפחות",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      details: ["4 חדרים", "חניה", "קרוב לבתי ספר"],
    },
    {
      title: "דירת גן",
      location: "רובע ירוק",
      tag: "אורח חיים",
      image:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1400&q=85",
      details: ["גינה", "משופצת", "מוארת"],
    },
  ],

  reviewsSection: {
    eyebrow: "לקוחות מספרים",
    title: "אמון נבנה דרך תהליך ברור.",
    text: "מילים של לקוחות שקיבלו ליווי אישי, רגוע ומקצועי.",
  },

  reviews: [
    {
      quote:
        "הכול היה ברור ומסודר מהרגע הראשון. הרגשנו שיש מי שמוביל אותנו בלי לחץ.",
      name: "מיה כהן",
      role: "מוכרת נכס",
      rating: "5/5",
    },
    {
      quote:
        "חסכו לנו המון זמן. ראינו רק נכסים שהתאימו באמת למה שחיפשנו.",
      name: "דניאל לוי",
      role: "קונה",
      rating: "4.9/5",
    },
    {
      quote:
        "מקצועיות, דיסקרטיות וניהול משא ומתן מדויק. בדיוק מה שהיינו צריכים.",
      name: "נועה אמיר",
      role: "בעלת נכס",
      rating: "5/5",
    },
  ],

  processSection: {
    eyebrow: "התהליך",
    title: "מהשיחה הראשונה ועד החלטה בטוחה.",
    text: "תהליך קצר, ברור ומקצועי שעוזר ללקוח להבין מה נכון לו.",
  },

  process: [
    {
      step: "01",
      title: "שיחת היכרות",
      text: "מבינים מטרה, אזור, תקציב פנימי, זמן ותנאים חשובים.",
    },
    {
      step: "02",
      title: "אסטרטגיה",
      text: "בונים דרך פעולה למכירה או קנייה בלי הצפה ובלי בלבול.",
    },
    {
      step: "03",
      title: "סיורים פרטיים",
      text: "מתאמים פגישות רק לנכסים או קונים שבאמת רלוונטיים.",
    },
    {
      step: "04",
      title: "משא ומתן",
      text: "ליווי מלא בקבלת החלטות עד סגירת העסקה.",
    },
  ],

  faqSection: {
    eyebrow: "שאלות נפוצות",
    title: "מה חשוב לדעת לפני שמתחילים?",
    text:
      "התבנית מתאימה לסוכני נדל״ן שרוצים להציג נכסים בלי מחירים ולייצר שיחות איכותיות.",
    button: "דברו איתי",
  },

  faq: [
    {
      q: "למה אין מחירים באתר?",
      a:
        "כי בנדל״ן יוקרתי או אישי עדיף לפעמים לסנן פניות, להבין התאמה ולמסור פרטים בשיחה פרטית.",
    },
    {
      q: "אפשר עדיין להציג נכסים?",
      a:
        "כן. כל נכס מוצג עם תמונות, אזור, מאפיינים וקריאה ליצירת קשר — בלי מחיר פומבי.",
    },
    {
      q: "זה מתאים גם לקונים וגם למוכרים?",
      a: "כן. המבנה מתאים לליווי מוכרים, קונים, בעלי נכסים ומשקיעים.",
    },
    {
      q: "אפשר לערוך את כל הטקסטים והתמונות?",
      a:
        "כן. התוכן מחובר ל־defaultData כדי שהמערכת שלך תוכל להזרים תוכן ולעדכן אותו.",
    },
  ],

  cta: {
    title: "מתחילים בצעד נדל״ני נכון",
    button: "לקביעת שיחה",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
  },

  about: {
    eyebrow: "אודות",
    title: "ליווי נדל״ן אישי, ברור ובגובה העיניים.",
    text:
      "Nadlanist נבנתה עבור סוכן נדל״ן שרוצה לשדר אמינות, יוקרה ושקט. בלי עומס, בלי מחירים פומביים ובלי עיצוב שמשתלט על התוכן.",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=900&q=85",
    stats: [
      ["120+", "לקוחות שלוו"],
      ["4.9", "דירוג ממוצע"],
      ["10Y", "ניסיון בשוק"],
    ],
  },

  blog: {
    eyebrow: "מגזין",
    title: "טיפים, אזורים ותובנות נדל״ן.",
    text: "כרטיסי תוכן למדריכים, עדכוני שוק וטיפים לקונים ומוכרים.",
    posts: [
      {
        title: "איך להכין נכס לפני סיור פרטי",
        image:
          "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1000&q=85",
        date: "12 ביוני 2026",
      },
      {
        title: "מה קונים חייבים לבדוק לפני הצעה",
        image:
          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
        date: "28 במאי 2026",
      },
      {
        title: "למה מחיר פרטי יכול לייצר פניות טובות יותר",
        image:
          "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1000&q=85",
        date: "18 באפריל 2026",
      },
    ],
  },

  contact: {
    eyebrow: "יצירת קשר",
    title: "מתחילים בשיחת ייעוץ פרטית.",
    text:
      "ספרו אם אתם מוכרים, קונים או רק בודקים אפשרויות — ונחזור אליכם עם הצעד הבא.",
    button: "שליחת הודעה",
  },

  footer: {
    text: "ליווי נדל״ן יוקרתי, אישי ודיסקרטי — בלי לחשוף מחירים באתר.",
    backToTop: "חזרה למעלה",
  },
};

export type NadlanistDefaultData = typeof nadlanistDefaultData;

export default nadlanistDefaultData;