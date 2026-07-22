export type ChanelPageId = "home" | "products" | "product" | "cart";

export type ChanelMediaValue =
  | string
  | {
      url?: string;
      src?: string;
      secureUrl?: string;
      secure_url?: string;
      originalUrl?: string;
      type?: "image" | "video" | string;
    };

export type ChanelNavItem = {
  label: string;
  href: string;
};

export type ChanelCategory = {
  name: string;
  description: string;
  image: ChanelMediaValue;
  href: string;
};

export type ChanelProduct = {
  name: string;
  price: string;
  tag?: string;
  image: ChanelMediaValue;
  href: string;
};

export type ChanelValue = {
  title: string;
  description: string;
  icon: string;
};

export type ChanelCommunityItem = {
  image: ChanelMediaValue;
  caption: string;
};

export type ChanelTestimonial = {
  quote: string;
  name: string;
  location: string;
  avatar: ChanelMediaValue;
};

export type ChanelJournalPost = {
  title: string;
  excerpt: string;
  date: string;
  image: ChanelMediaValue;
  href: string;
};

export type ChanelCartItem = {
  name: string;
  price: string;
  quantity: string;
  image: ChanelMediaValue;
};

export type ChanelData = {
  brand: {
    name: string;
    tagline: string;
    email: string;
    phone: string;
  };
  promo: {
    text: string;
    link: string;
    linkLabel: string;
  };
  nav: ChanelNavItem[];
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    image: ChanelMediaValue;
  };
  categoriesHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  categories: ChanelCategory[];
  productsHeading: {
    eyebrow: string;
    title: string;
    accent: string;
    button: string;
  };
  products: ChanelProduct[];
  valuesHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  values: ChanelValue[];
  communityHeading: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
  };
  community: ChanelCommunityItem[];
  testimonialHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  testimonials: ChanelTestimonial[];
  craft: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
    stat1: string;
    stat1Label: string;
    stat2: string;
    stat2Label: string;
    image: ChanelMediaValue;
    button: string;
  };
  journalHeading: {
    eyebrow: string;
    title: string;
    accent: string;
  };
  journal: ChanelJournalPost[];
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    button: string;
    disclaimer: string;
  };
  footer: {
    description: string;
    copyright: string;
    links: ChanelNavItem[];
  };
  productsPage: {
    eyebrow: string;
    title: string;
    accent: string;
    description: string;
  };
  productPage: {
    name: string;
    price: string;
    comparePrice: string;
    tag: string;
    description: string;
    details: string[];
    primaryButton: string;
    secondaryButton: string;
    image: ChanelMediaValue;
    gallery: ChanelMediaValue[];
  };
  cartPage: {
    eyebrow: string;
    title: string;
    accent: string;
    emptyText: string;
    subtotalLabel: string;
    subtotal: string;
    shippingLabel: string;
    shipping: string;
    totalLabel: string;
    total: string;
    checkoutButton: string;
    continueButton: string;
    items: ChanelCartItem[];
  };
};

export const chanelPages = [
  {
    id: "home" as ChanelPageId,
    name: "בית",
    slug: "/",
  },
  {
    id: "products" as ChanelPageId,
    name: "מוצרים",
    slug: "/products",
  },
  {
    id: "product" as ChanelPageId,
    name: "מוצר",
    slug: "/product",
  },
  {
    id: "cart" as ChanelPageId,
    name: "עגלה",
    slug: "/cart",
  },
];

const media = {
  hero: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1800&q=90",
  categories: [
    "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",
  ],
  products: [
    "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1564422170194-896b89110ef8?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=900&q=85",
  ],
  community: [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85",
  ],
  craft: "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=1800&q=90",
  journal: [
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=900&q=85",
  ],
};

export const chanelDefaultData: ChanelData = {
  brand: {
    name: "שאנל",
    tagline: "אקססוריז יוקרה בעיצוב נצחי",
    email: "hello@chanel-luxury.co.il",
    phone: "+972-3-555-0188",
  },

  promo: {
    text: "משלוח חינם לכל הארץ · קולקציית אביב 2026 כאן",
    link: "#products",
    linkLabel: "גלו עכשיו",
  },

  nav: [
    { label: "בית", href: "/" },
    { label: "קולקציות", href: "/#categories" },
    { label: "מוצרים", href: "/products" },
    { label: "אודות", href: "/#craft" },
    { label: "יומן", href: "/#journal" },
    { label: "יצירת קשר", href: "/#newsletter" },
  ],

  hero: {
    eyebrow: "קולקציית אביב 2026",
    title: "אלגנטיות",
    accent: "שעוצבת לנצח",
    description:
      "תיקים, תכשיטים ואקססוריז מעור יוקרתי — מיוצרים בקפידה באיטליה ומגיעים אליכם עם חוויית רכישה פרימיום.",
    primaryButton: "לקולקציה החדשה",
    secondaryButton: "הסיפור שלנו",
    image: media.hero,
  },

  categoriesHeading: {
    eyebrow: "קטגוריות",
    title: "גלו את",
    accent: "העולם שלנו",
  },

  categories: [
    {
      name: "תיקי עור",
      description: "עיצוב מינימליסטי עם גימור ידני מושלם",
      image: media.categories[0],
      href: "/products",
    },
    {
      name: "תכשיטים",
      description: "זהב מבריק ופנינים נבחרות לכל אירוע",
      image: media.categories[1],
      href: "/products",
    },
    {
      name: "שעונים",
      description: "מנגנון שוויצרי ועיצוב קלאסי לדור הבא",
      image: media.categories[2],
      href: "/products",
    },
    {
      name: "אקססוריז",
      description: "חגורות, צעיפים ופריטים משלימים ללוק מושלם",
      image: media.categories[3],
      href: "/products",
    },
  ],

  productsHeading: {
    eyebrow: "נבחרים",
    title: "מוצרים",
    accent: "מומלצים",
    button: "לכל המוצרים",
  },

  products: [
    {
      name: "תיק קלאסיקה קטן",
      price: "₪2,890",
      tag: "חדש",
      image: media.products[0],
      href: "/product",
    },
    {
      name: "שרשרת פנינה מעוצבת",
      price: "₪1,450",
      image: media.products[1],
      href: "/product",
    },
    {
      name: "שעון אובל דה-לוקס",
      price: "₪4,200",
      tag: "מומלץ",
      image: media.products[2],
      href: "/product",
    },
    {
      name: "ארנק עור מרובע",
      price: "₪980",
      image: media.products[3],
      href: "/product",
    },
    {
      name: "עגילי זהב מעוטרים",
      price: "₪1,780",
      image: media.products[4],
      href: "/product",
    },
    {
      name: "צעיף משי פרימיום",
      price: "₪690",
      tag: "מבצע",
      image: media.products[5],
      href: "/product",
    },
  ],

  valuesHeading: {
    eyebrow: "הערכים שלנו",
    title: "יוקרה",
    accent: "בלי פשרות",
  },

  values: [
    {
      title: "איכות ללא פשרות",
      description: "חומרי גלם נבחרים ותהליכי ייצור מוקפדים בכל שלב.",
      icon: "◆",
    },
    {
      title: "ייצור אחראי",
      description: "שקיפות מלאה בשרשרת האספקה ומחויבות לקיימות.",
      icon: "◇",
    },
    {
      title: "עיצוב נצחי",
      description: "קווים נקיים שעוברים מעונות ונשארים רלוונטיים.",
      icon: "○",
    },
    {
      title: "שירות אישי",
      description: "ייעוץ סטיילינג, אריזת מתנה ומשלוח מהיר לכל הארץ.",
      icon: "□",
    },
  ],

  communityHeading: {
    eyebrow: "הקהילה שלנו",
    title: "סגנון",
    accent: "שמעורר השראה",
    description: "לקוחותינו משתפים את הרגעים שבהם האקססוריז של שאנל הופכים לחלק מהסיפור האישי שלהם.",
  },

  community: [
    { image: media.community[0], caption: "לוק ערב אלגנטי" },
    { image: media.community[1], caption: "יום עבודה מושלם" },
    { image: media.community[2], caption: "קולקציית אביב" },
    { image: media.community[3], caption: "אקססוריז יומיומיים" },
    { image: media.community[4], caption: "מתנה מיוחדת" },
    { image: media.community[5], caption: "סטיילינג אישי" },
  ],

  testimonialHeading: {
    eyebrow: "מה הלקוחות אומרים",
    title: "חוויות",
    accent: "אמיתיות",
  },

  testimonials: [
    {
      quote:
        "התיק שקניתי מחזיק מעמד שנים — האיכות מורגשת בכל תפר. שירות מדהים מההזמנה ועד המשלוח.",
      name: "מיכל אברהם",
      location: "תל אביב",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=240&q=85",
    },
    {
      quote:
        "התכשיטים נראים עוד יותר יפים בחיים. האריזה הייתה מושלמת — מתנה שממש הרשימה.",
      name: "דנה כהן",
      location: "ירושלים",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=85",
    },
    {
      quote:
        "סוף סוף מצאתי מותג שמשלב יוקרה עם שירות אישי. הצעיף הוא הפריט האהוב עליי בכל ארון.",
      name: "יעל לוי",
      location: "חיפה",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=85",
    },
    {
      quote:
        "השעון שקניתי לבעלי הפך לפריט קבוע בכל אירוע. מומלץ בחום לכל מי שמחפש איכות אמיתית.",
      name: "רונית שפירא",
      location: "רמת גן",
      avatar:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=240&q=85",
    },
  ],

  craft: {
    eyebrow: "אומנות הייצור",
    title: "מסורת",
    accent: "שפוגשת חדשנות",
    description:
      "כל פריט עובר תהליך ייצור מוקפד — מבחירת העור ועד הגימור הסופי. אנו עובדים עם אומנים מנוסים באיטליה וצרפת כדי להבטיח שכל מוצר יישאר יפה לאורך שנים.",
    stat1: "40+",
    stat1Label: "שנות מסורת",
    stat2: "100%",
    stat2Label: "עור איטלקי",
    image: media.craft,
    button: "קראו את הסיפור",
  },

  journalHeading: {
    eyebrow: "היומן",
    title: "השראה",
    accent: "וסטייל",
  },

  journal: [
    {
      title: "איך לבחור תיק עור מושלם",
      excerpt: "מדריך לבחירת התיק שמתאים לסגנון החיים שלכם — מגודל ועד גימור.",
      date: "מרץ 2026",
      image: media.journal[0],
      href: "#journal",
    },
    {
      title: "טרנדים באקססוריז לאביב 2026",
      excerpt: "הצבעים, החומרים והצורות שמגדירים את העונה הקרובה.",
      date: "פברואר 2026",
      image: media.journal[1],
      href: "#journal",
    },
    {
      title: "מאחורי הקלעים: בית הייצור שלנו",
      excerpt: "מסע אל האומנים שיוצרים כל פריט ביד — מעור גולמי למוצר מוגמר.",
      date: "ינואר 2026",
      image: media.journal[2],
      href: "#journal",
    },
  ],

  newsletter: {
    title: "הצטרפו לעולם שאנל",
    description:
      "קבלו גישה מוקדמת לקולקציות חדשות, טיפים לסטיילינג והטבות בלעדיות.",
    placeholder: "כתובת האימייל שלכם",
    button: "הרשמה",
    disclaimer: "בהרשמה אתם מסכימים לקבל עדכונים. ניתן לבטל בכל עת.",
  },

  footer: {
    description: "אקססוריז יוקרה בעיצוב נצחי — מיוצרים באהבה, נשלחים אליכם בקפידה.",
    copyright: "© 2026 שאנל. כל הזכויות שמורות.",
    links: [
      { label: "בית", href: "/" },
      { label: "מוצרים", href: "/products" },
      { label: "מוצר", href: "/product" },
      { label: "עגלה", href: "/cart" },
      { label: "קולקציות", href: "/#categories" },
      { label: "יצירת קשר", href: "/#newsletter" },
    ],
  },

  productsPage: {
    eyebrow: "הקולקציה המלאה",
    title: "כל",
    accent: "המוצרים",
    description:
      "גלו את כל פריטי היוקרה של שאנל — מעור איטלקי, תכשיטים נבחרים ואקססוריז מעוצבים.",
  },

  productPage: {
    name: "תיק קלאסיקה קטן",
    price: "₪2,890",
    comparePrice: "₪3,290",
    tag: "חדש",
    description:
      "תיק עור איטלקי מלאכת יד עם גימור פנימי מוקפד, רצועת כתף מתכווננת וסגירה מגנטית. פריט יומיומי שנראה כמו יצירת אומנות.",
    details: [
      "עור עגל איטלקי מלאכת יד",
      "ריפוד פנימי מבד פרימיום",
      "משלוח חינם מעל ₪500",
      "אחריות לשנה על תפרים וגימור",
    ],
    primaryButton: "הוספה לעגלה",
    secondaryButton: "המשך קניות",
    image: media.products[0],
    gallery: [media.products[0], media.products[3], media.products[5]],
  },

  cartPage: {
    eyebrow: "העגלה שלכם",
    title: "סיכום",
    accent: "הזמנה",
    emptyText: "העגלה ריקה כרגע — גלו את הקולקציה ומצאו את הפריט המושלם.",
    subtotalLabel: "סכום ביניים",
    subtotal: "₪4,340",
    shippingLabel: "משלוח",
    shipping: "חינם",
    totalLabel: "סה״כ",
    total: "₪4,340",
    checkoutButton: "לתשלום מאובטח",
    continueButton: "המשך קניות",
    items: [
      {
        name: "תיק קלאסיקה קטן",
        price: "₪2,890",
        quantity: "1",
        image: media.products[0],
      },
      {
        name: "שרשרת פנינה מעוצבת",
        price: "₪1,450",
        quantity: "1",
        image: media.products[1],
      },
    ],
  },
};
