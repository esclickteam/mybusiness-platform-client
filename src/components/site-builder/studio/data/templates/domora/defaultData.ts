export const domoraDefaultData = {
  templateId: "domora",
  name: "Domora",
  title: "Domora",

  brand: {
    name: "Domora",
    logo: "DM",
    tagline: "נדל״ן יוקרתי",
  },

  navigation: [
    { id: "home", label: "בית", page: "home", href: "/" },
    { id: "properties", label: "נכסים", page: "properties", href: "/properties" },
    { id: "articles", label: "מאמרים", page: "articles", href: "/articles" },
    {
      id: "testimonials",
      label: "המלצות",
      page: "testimonials",
      href: "/testimonials",
    },
    { id: "faq", label: "שאלות", page: "faq", href: "/faq" },
    { id: "contact", label: "יצירת קשר", page: "contact", href: "/contact" },
  ],

  images: {
    heroCutout: "/images/domora/hero-house-cutout.png",
    hero: "/images/domora/hero-house-cutout.png",
    heroSecond:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1500&q=90",
    heroThird:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1500&q=90",
    fallback:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1500&q=90",
  },

  hero: {
    eyebrow: "מגורי יוקרה מודרניים",
    title: "חוויית מגורים שמתחילה נכון",
    italic: "בבית שמתאים לך",
    subtitle:
      "תבנית פרימיום לסוכני נדל״ן, יזמים ופרויקטים שרוצים לשדר יוקרה, סדר ואמון — עם עיצוב נקי, תמונות גדולות וקריאה ברורה לפנייה.",
    primaryButton: "לנכסים נבחרים",
    secondaryButton: "שיחת ייעוץ",
    image: "/images/domora/hero-house-cutout.png",
    cutoutImage: "/images/domora/hero-house-cutout.png",
  },

  essence: {
    eyebrow: "החוויה",
    title: "פרטים קטנים שיוצרים תחושת בית גדולה",
    text:
      "האתר מציג את הערך של הנכס דרך עיצוב, מיקום, תחושה ותהליך — בלי להעמיס על הלקוח ובלי להיראות כמו עוד תבנית רגילה.",
    cards: [
      {
        title: "עיצוב אישי",
        text: "הצגה אלגנטית של נכסים, פרויקטים וסגנונות מגורים.",
      },
      {
        title: "מיקום מדויק",
        text: "הדגשת אזורים, סביבת מגורים ויתרונות מקומיים.",
      },
      {
        title: "תהליך ברור",
        text: "הובלת הלקוח מהתרשמות ראשונה לפנייה איכותית.",
      },
      {
        title: "אמון ויוקרה",
        text: "שפה חזותית נקייה שמרגישה מקצועית וגבוהה.",
      },
    ],
  },

  propertiesSection: {
    eyebrow: "נכסים",
    title: "בתים שמעוררים השראה",
    text: "כרטיסי נכסים גדולים, תמונות רחבות ופרטים ברורים — בלי עומס מיותר.",
  },

  properties: [
    {
      title: "וילה אורבנית",
      location: "הרצליה פיתוח",
      tag: "חדש",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=90",
      details: ["5 חדרים", "בריכה", "גינה פרטית"],
    },
    {
      title: "בית קו ראשון",
      location: "אזור החוף",
      tag: "פרימיום",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=90",
      details: ["נוף פתוח", "מרפסת", "עיצוב מודרני"],
    },
    {
      title: "פנטהאוז שקט",
      location: "מרכז העיר",
      tag: "בלעדי",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90",
      details: ["קומה גבוהה", "אור טבעי", "חלל פתוח"],
    },
  ],

  gallery: {
    eyebrow: "אדריכלות",
    title: "מראה נקי שמבליט את הנכס",
    text: "תמונות גדולות, קומפוזיציה מאוזנת ומעברים עדינים שמייצרים תחושת פרימיום.",
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=90",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=90",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=90",
    ],
  },

  articlesSection: {
    eyebrow: "מאמרים",
    title: "תוכן שמחזק אמון",
    text: "מקום למדריכים, עדכוני שוק, טיפים לקונים ומוכרים ותוכן מקצועי.",
  },

  articles: [
    {
      title: "איך לבחור נכס שמתאים לאורח החיים שלך",
      category: "מדריך קונים",
      date: "יוני 2026",
      image:
        "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "מה חשוב לבדוק לפני שמפרסמים נכס",
      category: "מוכרים",
      date: "מאי 2026",
      image:
        "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=90",
    },
    {
      title: "למה חוויית מותג משנה בנדל״ן יוקרתי",
      category: "אסטרטגיה",
      date: "אפריל 2026",
      image:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=90",
    },
  ],

  testimonialsSection: {
    eyebrow: "המלצות",
    title: "לקוחות שמרגישים בטוחים בדרך",
    text: "המלצות קצרות עם תחושה נקייה, אמינה ולא עמוסה.",
  },

  testimonials: [
    {
      name: "הילה מור",
      handle: "@hila",
      quote:
        "האתר גרם לנו להבין מיד שיש כאן מישהו רציני. הכול מרגיש נקי, יוקרתי וברור.",
      rating: "★★★★★",
    },
    {
      name: "אורי לוי",
      handle: "@uri",
      quote:
        "הצגת הנכסים הייתה מדויקת, בלי עומס ובלי תחושה מכירתית מדי.",
      rating: "★★★★★",
    },
    {
      name: "נועה שקד",
      handle: "@noa",
      quote:
        "העיצוב יצר רושם מקצועי וגרם לנו להשאיר פרטים כבר בעמוד הראשון.",
      rating: "★★★★★",
    },
  ],

  faqSection: {
    eyebrow: "שאלות",
    title: "שאלות נפוצות לפני שמתחילים",
    text: "אזור שאלות שמוריד התנגדויות ומוביל את הלקוח לפנייה.",
  },

  faq: [
    {
      q: "האם אפשר להציג נכסים בלי מחיר?",
      a:
        "כן. אפשר להציג תמונות, אזור, מאפיינים וקריאה לפעולה — בלי לפרסם מחיר פומבי.",
    },
    {
      q: "האם התבנית מתאימה לסוכן נדל״ן יחיד?",
      a:
        "כן. היא מתאימה לסוכן, משרד תיווך, יזם או פרויקט נדל״ן שרוצה מראה יוקרתי.",
    },
    {
      q: "אפשר לערוך תמונות וטקסטים?",
      a: "כן. כל התוכן מגיע מ־defaultData ומוכן לחיבור לעורך שלך.",
    },
  ],

  cta: {
    eyebrow: "יצירת קשר",
    title: "בואו נבנה נוכחות נדל״נית שמרגישה יוקרתית",
    text:
      "עמוד שמוביל לפניות איכותיות ומציג את הנכסים בצורה נקייה, מודרנית ומשכנעת.",
    button: "לקביעת שיחה",
    image:
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=90",
  },

  contact: {
    eyebrow: "יצירת קשר",
    title: "מתחילים בשיחה קצרה",
    text:
      "השאירו פרטים ונחזור עם הצעד הבא — קנייה, מכירה, שיווק נכס או ייעוץ ראשוני.",
    button: "שליחת הודעה",
  },

  footer: {
    text: "Domora — תבנית נדל״ן יוקרתית, מודרנית ונקייה.",
    rights: "כל הזכויות שמורות © 2026",
  },
};

export type DomoraDefaultData = typeof domoraDefaultData;

export default domoraDefaultData;