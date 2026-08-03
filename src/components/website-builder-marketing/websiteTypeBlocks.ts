export type WebsiteTypeBlock = {
  id: string;
  label: string;
  /** Short teaser under the block title */
  teaser: string;
  /** Concrete capabilities this website type gets in Bizuply */
  points: string[];
  templateId: string;
  templateTitle: string;
  accent: string;
  accentSoft: string;
};

export const websiteTypeBlocks: WebsiteTypeBlock[] = [
  {
    id: "branding",
    label: "אתר תדמית",
    teaser: "נוכחות מקצועית שמספרת את הסיפור של העסק ובונה אמון מהמבט הראשון.",
    points: [
      "עמודי בית, אודות, שירותים וצור קשר מוכנים",
      "טופס פנייה שנכנס ישר ל־CRM",
      "SEO וכרטיס שיתוף לכל עמוד",
    ],
    templateId: "brandforge",
    templateTitle: "Brandforge",
    accent: "#111827",
    accentSoft: "#F59E0B",
  },
  {
    id: "store",
    label: "אתר חנות",
    teaser: "חנות אונליין עם קטלוג, עמוד מוצר וסל קניות — מוכנה למכור.",
    points: [
      "ניהול מוצרים מפאנל האתר",
      "סל קניות ומסך תשלום למבקרים",
      "חיבור Stripe, PayPal, Tranzila ועוד",
    ],
    templateId: "novastra",
    templateTitle: "Novastra",
    accent: "#9A6F3B",
    accentSoft: "#E7C9A0",
  },
  {
    id: "booking",
    label: "אתר זימון פגישות",
    teaser: "תורים, שירותים ומחירים במקום אחד — הלקוח קובע לבד.",
    points: [
      "קטלוג שירותים עם משך ומחיר",
      "שעות פעילות שמגדירות את החלונות הפנויים",
      "התור נשמר ביומן ה־CRM עם אישור במייל",
    ],
    templateId: "pulsecore",
    templateTitle: "PulseCore",
    accent: "#FF4D1D",
    accentSoft: "#FFD5C8",
  },
  {
    id: "real-estate",
    label: "אתר נדל״ן",
    teaser: "נכסים, סוכנים ופניות — תצוגה פרימיום שמובילה ללידים.",
    points: [
      "עמודי נכס עם גלריות ומפרט",
      "טפסים מותאמים לכל נכס",
      "Schema.org לתוצאות עשירות בגוגל",
    ],
    templateId: "brokeria",
    templateTitle: "Brokeria",
    accent: "#C9A962",
    accentSoft: "#E8D5A3",
  },
  {
    id: "restaurant",
    label: "אתר מסעדה",
    teaser: "תפריט, אווירה והזמנת שולחן — חוויה שמזמינה להגיע.",
    points: [
      "תפריט דיגיטלי וגלריית מנות",
      "כפתור וואטסאפ צף ותוסף ביקורות",
      "עדכון תוכן ומחירים בלי מפתח",
    ],
    templateId: "aurelia",
    templateTitle: "Aurelia",
    accent: "#8B1E3F",
    accentSoft: "#E8B4B8",
  },
  {
    id: "courses",
    label: "אתר קורסים",
    teaser: "קורסים, סילבוס ומרצים — פלטפורמה שמוכרת למידה.",
    points: [
      "עמוד קורס, סילבוס ועמודי מרצים",
      "הרשמה שמייצרת ליד או מכירה בחנות",
      "מועדון לקוחות והטבות למשתתפים",
    ],
    templateId: "lectora",
    templateTitle: "Lectora",
    accent: "#1D4ED8",
    accentSoft: "#93C5FD",
  },
];
