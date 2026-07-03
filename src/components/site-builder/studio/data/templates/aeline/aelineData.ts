import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";

export const aelineImages = {
  hero:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1400&q=90",
  team:
    "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=90",
  dashboard:
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=90",
  meeting:
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=90",
  abstract:
    "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1200&q=90",
};

export const aelineServices = [
  {
    title: "מערכת לידים ומכירות",
    text: "בניית מסע לקוח ברור שמחבר בין טפסים, הודעות, פולואפים, אנשי מכירות ודשבורד אחד שמרכז את כל התמונה.",
    number: "01",
  },
  {
    title: "אוטומציות שירות",
    text: "תהליכים חכמים שמטפלים בפניות, תזכורות, עדכונים ופעולות חוזרות כדי שהצוות יתעסק במה שבאמת חשוב.",
    number: "02",
  },
  {
    title: "חוויית לקוח דיגיטלית",
    text: "עיצוב חוויה שמרגישה מהירה, יוקרתית וברורה — מהכניסה הראשונה ועד השארת פרטים או רכישה.",
    number: "03",
  },
];

export const aelinePlans = [
  {
    name: "חבילת Launch",
    price: "₪6,500",
    text: "לעסק שרוצה להרים תשתית דיגיטלית חכמה ולהתחיל לנהל פניות בצורה מסודרת.",
    items: [
      "אפיון מסע לקוח",
      "עמוד נחיתה ממיר",
      "חיבור טופס לידים",
      "אוטומציית הודעת פתיחה",
    ],
  },
  {
    name: "חבילת Scale",
    price: "₪18,900",
    text: "לעסק שרוצה לחבר מכירות, שירות, תזכורות ודוחות למערכת אחת שעובדת ברקע.",
    items: [
      "בניית CRM תפעולי",
      "אוטומציות פולואפ",
      "דשבורד ביצועים",
      "תהליך עבודה לצוות",
    ],
  },
  {
    name: "חבילת Flow",
    price: "מותאם אישית",
    text: "לעסקים עם כמה מחלקות, מספר ערוצי פנייה ותהליכים מורכבים שדורשים מערכת מותאמת.",
    items: [
      "מיפוי תהליכים מלא",
      "חיבור מערכות קיימות",
      "אוטומציות מתקדמות",
      "ליווי והטמעה לצוות",
    ],
  },
];

export const aelinePalette = {
  primary: "#160F2E",
  secondary: "#3C1D6E",
  accent: "#7FFFD4",
  background: "#FFF8F2",
  surface: "#FFFFFF",
  text: "#160F2E",
  muted: "#7A7194",
  dark: "#0F0A20",
};

export const aelineCss = `
[data-template-id="aeline"],
[data-template-id="aeline"] * {
  box-sizing: border-box;
}

[data-template-id="aeline"] {
  background: #fff8f2;
  color: #160f2e;
  font-family: Inter, Arial, sans-serif;
}

[data-template-id="aeline"] img {
  display: block;
  max-width: 100%;
}

[data-template-id="aeline"] button,
[data-template-id="aeline"] a {
  cursor: pointer;
}

[data-template-id="aeline"] .aeline-orb {
  animation: aelineFloat 5.5s ease-in-out infinite;
}

[data-template-id="aeline"] .aeline-orb-delay {
  animation: aelineFloat 6.5s ease-in-out infinite;
  animation-delay: 0.8s;
}

[data-template-id="aeline"] .aeline-marquee-track {
  animation: aelineMarquee 34s linear infinite;
}

[data-template-id="aeline"] [data-section-kind] {
  scroll-margin-top: 120px;
}

@keyframes aelineFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }

  50% {
    transform: translateY(-18px) rotate(-1deg);
  }
}

@keyframes aelineMarquee {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}
`;

export const aelineSeed: ReadyWebsiteTemplateSeed = {
  id: "aeline",
  name: "Nova Flow",
  category: "business",
  niche: "Digital Growth Studio",
  layout: "premium-digital-growth-flow",
  description:
    "תבנית פרימיום לעסקי שירות, אוטומציות, CRM, מכירות וחוויית לקוח דיגיטלית.",
  heroTitle: "הופכים פניות ללקוחות משלמים",
  heroSubtitle:
    "תבנית דיגיטלית לעסקים שרוצים לחבר בין עיצוב, אוטומציות, CRM ותהליך מכירה מסודר.",
  image: aelineImages.hero,
  palette: aelinePalette,
  blocks: [],
};