/**
 * Mega Hebrew section catalog — 15+ visually distinct layouts per category
 * for Wix-like site builder library previews and AI section picking.
 */
import {
  absoluteLayout,
  boxNode,
  buttonNode,
  iconNode,
  imageNode,
  textNode,
} from "./libraryFactories";
import { VISUAL_LIBRARY_IMAGES } from "./libraryAssets";
import type {
  VisualLibraryCategory,
  VisualLibraryNodeTemplate,
  VisualLibrarySectionTemplate,
} from "./visualLibraryTypes";
import {
  aboutSplit,
  blogBlock,
  ctaBlock,
  eventsBlock,
  faqBlock,
  featuresGrid,
  featuresSplit,
  heroCentered,
  heroSplit,
  portfolioGrid,
  pricingBlock,
  productSpotlight,
  productsGrid,
  promoteBlock,
  resumeBlock,
  servicesCards,
  servicesList,
  statsBlock,
  teamBlock,
  testimonialsBlock,
} from "./sectionCatalogBuilders";

type ImgKey = keyof typeof VISUAL_LIBRARY_IMAGES;

const copy = {
  color: "#475569",
  fontSize: "17px",
  fontWeight: "500",
  lineHeight: "1.7",
} as const;

const btnPrimary = {
  color: "#ffffff",
  backgroundColor: "#0f172a",
  borderRadius: "999px",
  padding: "14px 26px",
  fontSize: "16px",
  fontWeight: "900",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

const btnSoft = {
  color: "#0f172a",
  backgroundColor: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "999px",
  padding: "14px 26px",
  fontSize: "16px",
  fontWeight: "900",
  textDecoration: "none",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
} as const;

const serviceItems = [
  { title: "ייעוץ אישי", copy: "ליווי מקצועי מותאם למטרות העסק שלכם.", cta: "לפרטים" },
  { title: "עיצוב וחוויה", copy: "ממשק נקי, ברור ומדויק למותג שלכם.", cta: "לפרטים" },
  { title: "צמיחה ושיווק", copy: "אסטרטגיה שמביאה לידים איכותיים.", cta: "לפרטים" },
  { title: "תמיכה שוטפת", copy: "זמינות גבוהה וליווי לאורך כל הדרך.", cta: "לפרטים" },
];

const featureItems = [
  { title: "מהיר להתחלה", copy: "מעלים אתר מקצועי תוך זמן קצר." },
  { title: "מותאם לנייד", copy: "כל סקשן נראה מעולה גם במובייל." },
  { title: "שליטה מלאה", copy: "עורכים טקסטים, תמונות וצבעים בקלות." },
  { title: "מוכן לקידום", copy: "מבנה נקי שעוזר להופיע בגוגל." },
  { title: "עיצוב ממותג", copy: "צבעים וטיפוגרפיה שמייצגים אתכם." },
  { title: "תמיכה בעברית", copy: "RTL מלא ותוכן בעברית מההתחלה." },
];

const plans = [
  { name: "התחלה", price: "₪149", features: "עמוד בסיס\nעריכה מלאה\nתמיכה במייל" },
  { name: "צמיחה", price: "₪299", features: "עד 5 עמודים\nספריית סקשנים\nAI מובנה", popular: true },
  { name: "מקצועי", price: "₪499", features: "ללא הגבלה\nדומיין מותאם\nעדיפות בתמיכה" },
];

const testimonials = [
  { quote: "שירות מקצועי, זמין ומדויק. הרגשנו שיש על מי לסמוך.", name: "נועה כהן", role: "בעלת עסק" },
  { quote: "האתר יצא בדיוק כמו שחלמנו – ואפילו יותר.", name: "יואב לוי", role: "מנהל שיווק" },
  { quote: "תהליך חלק, תקשורת מעולה ותוצאה מרשימה.", name: "דנה אברהם", role: "יזמית" },
];

const events = [
  { title: "סדנת פתיחה", date: "12.08", place: "תל אביב" },
  { title: "מפגש קהילה", date: "19.08", place: "אונליין" },
  { title: "יום פתוח", date: "26.08", place: "חיפה" },
  { title: "הרצאה פתוחה", date: "01.09", place: "ירושלים" },
];

const blogPosts = [
  { title: "איך לבחור מסר מנצח לדף הבית", excerpt: "טיפים פרקטיים לכותרת שמביאה פעולה.", date: "מרץ 2026" },
  { title: "5 טעויות נפוצות באתרי עסקים", excerpt: "ומה אפשר לתקן תוך שעה.", date: "פבר׳ 2026" },
  { title: "עיצוב בעברית: מה חשוב לדעת", excerpt: "RTL, קריאות וחוויית משתמש.", date: "ינו׳ 2026" },
];

const faqItems = [
  { q: "כמה זמן לוקח להקים אתר?", a: "בדרך כלל בין כמה ימים לשבועיים, תלוי בהיקף התוכן." },
  { q: "אפשר לערוך לבד אחרי העלייה לאוויר?", a: "בוודאי. העורך מאפשר שינוי טקסטים, תמונות וסקשנים בקלות." },
  { q: "האם יש תמיכה בעברית?", a: "כן – כולל ממשק RTL ותוכן בעברית מהיסוד." },
  { q: "אפשר להחליף סקשנים בהמשך?", a: "כן. אפשר להוסיף מהספרייה או לבקש מה־AI וריאציה חדשה." },
];

const statsItems = [
  { value: "120+", label: "פרויקטים" },
  { value: "98%", label: "שביעות רצון" },
  { value: "8 ש׳", label: "זמן תגובה" },
  { value: "5★", label: "דירוג ממוצע" },
];

const teamMembers = [
  { name: "עדי כהן", role: "מייסדת" },
  { name: "יונתן לוי", role: "עיצוב" },
  { name: "מאיה רוזן", role: "שיווק" },
  { name: "איתי שמש", role: "פיתוח" },
];

const resumeItems = [
  { role: "מעצבת בכירה", place: "סטודיו אלפא", dates: "2022–היום" },
  { role: "מנהלת פרויקטים", place: "חברת בטא", dates: "2019–2022" },
  { role: "פרילנסרית", place: "עצמאית", dates: "2016–2019" },
  { role: "בוגרת תקשורת חזותית", place: "מכללה למדיה", dates: "2012–2016" },
];

const IMG_KEYS: ImgKey[] = [
  "office", "beauty", "food", "realestate", "tech", "wellness", "team",
  "product", "finance", "travel", "construction", "fashion", "abstract",
];

const BGS = [
  "#ffffff", "#f8fafc", "#fff7ed", "#fffbeb", "#ecfdf5", "#eef2ff",
  "#faf5ff", "#fdf2f8", "#f0fdfa", "#fef2f2", "#f1f5f9", "#fafaf9",
  "#0f172a", "#1e1b4b", "#134e4a",
];

function img(key: ImgKey = "office") {
  return VISUAL_LIBRARY_IMAGES[key];
}

function section(
  id: string,
  category: VisualLibraryCategory,
  title: string,
  description: string,
  opts: {
    keywords?: string[];
    thumbnail?: string;
    minHeight?: string;
    backgroundColor?: string;
    previewLayout: string;
    nodes: VisualLibraryNodeTemplate[];
  },
): VisualLibrarySectionTemplate {
  return {
    id,
    kind: "section",
    tab: "sections",
    category,
    title,
    description,
    keywords: opts.keywords || [title, category],
    thumbnail: opts.thumbnail,
    minHeight: opts.minHeight || "520px",
    backgroundColor: opts.backgroundColor || "#ffffff",
    previewLayout: opts.previewLayout,
    nodes: opts.nodes,
  };
}

function withPreviewLayout(
  template: VisualLibrarySectionTemplate,
  previewLayout: string,
): VisualLibrarySectionTemplate {
  return { ...template, previewLayout };
}

type FormChrome = "square" | "soft" | "pill" | "sharp-shadow" | "outlined";

function contactFormFields(
  x: number,
  y: number,
  accent = "#7c3aed",
  chrome: FormChrome = "soft",
) {
  const chromeMap = {
    square: { borderRadius: "0px", border: "2px solid #0f172a", backgroundColor: "#ffffff", boxShadow: "none" },
    soft: { borderRadius: "16px", border: "1px solid #e2e8f0", backgroundColor: "#ffffff" },
    pill: { borderRadius: "32px", border: "none", backgroundColor: "#f8fafc", boxShadow: "0 20px 50px rgba(15,23,42,0.12)" },
    "sharp-shadow": { borderRadius: "4px", border: "none", backgroundColor: "#ffffff", boxShadow: "12px 12px 0 #0f172a" },
    outlined: { borderRadius: "0px", border: "1px solid #94a3b8", backgroundColor: "transparent" },
  };
  const box = chromeMap[chrome];
  const btnRadius =
    chrome === "square" || chrome === "outlined" || chrome === "sharp-shadow"
      ? "0px"
      : chrome === "pill"
        ? "999px"
        : "12px";
  return [
    boxNode("form", box, absoluteLayout(x, y, "420px", "240px", 8), "טופס"),
    textNode("field1", "שם מלא", { color: "#94a3b8", fontSize: "14px", fontWeight: "700" }, absoluteLayout(x + 30, y + 25, "160px", "28px", 20)),
    textNode("field2", "אימייל", { color: "#94a3b8", fontSize: "14px", fontWeight: "700" }, absoluteLayout(x + 30, y + 70, "160px", "28px", 20)),
    textNode("field3", "הודעה", { color: "#94a3b8", fontSize: "14px", fontWeight: "700" }, absoluteLayout(x + 30, y + 115, "160px", "28px", 20)),
    buttonNode("primary", "שליחה", { ...btnPrimary, backgroundColor: accent, borderRadius: btnRadius }, absoluteLayout(x + 30, y + 170, "140px", "48px", 22)),
  ];
}

// —— Contact layout builders (15 distinct) ——

function contactFormLeftImageRight(opts: {
  id: string; title: string; headline: string; copy: string;
  image?: ImgKey; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "office");
  return section(opts.id, "contact", opts.title, "טופס משמאל ותמונה מימין", {
    thumbnail: image, backgroundColor: opts.bg || "#f8fafc", previewLayout: opts.previewLayout,
    nodes: [
      textNode("title", opts.headline, { color: "#0f172a", fontSize: "40px", fontWeight: "900" }, absoluteLayout(60, 50, "420px", "70px", 20)),
      textNode("copy", opts.copy, copy, absoluteLayout(60, 140, "400px", "80px", 20)),
      ...contactFormFields(60, 240, "#7c3aed", "soft"),
      imageNode("image", image, { borderRadius: "0px", objectFit: "cover" }, absoluteLayout(540, 50, "460px", "430px", 10), "תמונת קשר"),
    ],
  });
}

function contactFormRightImageLeft(opts: {
  id: string; title: string; headline: string; copy: string;
  image?: ImgKey; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "fashion");
  return section(opts.id, "contact", opts.title, "טופס מימין ותמונה משמאל", {
    thumbnail: image, backgroundColor: opts.bg || "#ffffff", previewLayout: opts.previewLayout,
    nodes: [
      imageNode("image", image, { borderRadius: "40px", objectFit: "cover" }, absoluteLayout(60, 50, "460px", "430px", 10), "תמונת קשר"),
      textNode("title", opts.headline, { color: "#0f172a", fontSize: "40px", fontWeight: "900" }, absoluteLayout(560, 50, "420px", "70px", 20)),
      textNode("copy", opts.copy, copy, absoluteLayout(560, 140, "400px", "80px", 20)),
      ...contactFormFields(560, 240, "#0f172a", "sharp-shadow"),
    ],
  });
}

function contactDetailsIconsGrid(opts: {
  id: string; title: string; headline: string; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  const details = [
    { icon: "📍", title: "כתובת", value: "רחוב הדוגמה 12, תל אביב", x: 60, y: 130 },
    { icon: "📞", title: "טלפון", value: "03-555-5555", x: 300, y: 130 },
    { icon: "✉️", title: "אימייל", value: "hello@example.com", x: 540, y: 130 },
    { icon: "🕐", title: "שעות פעילות", value: "א׳–ה׳ 09:00–18:00", x: 60, y: 280 },
  ];
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode("title", opts.headline, { color: "#0f172a", fontSize: "40px", fontWeight: "900" }, absoluteLayout(60, 50, "500px", "60px", 20)),
  ];
  details.forEach((d, i) => {
    nodes.push(
      boxNode(`box${i + 1}`, { backgroundColor: "#f8fafc", borderRadius: "0px", border: "2px solid #0f172a" }, absoluteLayout(d.x, d.y, "220px", "120px", 8), d.title),
      iconNode(`icon${i + 1}`, d.icon, { fontSize: "28px" }, absoluteLayout(d.x + 16, d.y + 16, "40px", "40px", 20)),
      textNode(`label${i + 1}`, d.title, { color: "#94a3b8", fontSize: "13px", fontWeight: "900" }, absoluteLayout(d.x + 16, d.y + 58, "180px", "24px", 20)),
      textNode(`value${i + 1}`, d.value, { color: "#0f172a", fontSize: "17px", fontWeight: "700" }, absoluteLayout(d.x + 16, d.y + 82, "190px", "30px", 20)),
    );
  });
  return section(opts.id, "contact", opts.title, "רשת פרטי קשר בלבד", {
    minHeight: "420px", backgroundColor: opts.bg || "#ffffff", previewLayout: opts.previewLayout, nodes,
  });
}

function contactMapStrip(opts: {
  id: string; title: string; headline: string; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  return section(opts.id, "contact", opts.title, "פס מפה וכתובת", {
    minHeight: "480px", backgroundColor: opts.bg || "#f1f5f9", previewLayout: opts.previewLayout,
    nodes: [
      textNode("title", opts.headline, { color: "#0f172a", fontSize: "36px", fontWeight: "900" }, absoluteLayout(60, 40, "500px", "55px", 20)),
      boxNode("map", { backgroundColor: "#cbd5e1", borderRadius: "0px" }, absoluteLayout(60, 110, "960px", "200px", 8), "מפה"),
      textNode("map-label", "📍 רחוב הדוגמה 12, תל אביב", { color: "#334155", fontSize: "18px", fontWeight: "900" }, absoluteLayout(60, 330, "500px", "40px", 20)),
      textNode("phone", "טלפון: 03-555-5555", { color: "#64748b", fontSize: "16px", fontWeight: "700" }, absoluteLayout(60, 380, "300px", "30px", 20)),
    ],
  });
}

function contactBigTitlePortrait(opts: {
  id: string; title: string; image?: ImgKey; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "beauty");
  return section(opts.id, "contact", opts.title, "כותרת ענקית ודיוקן", {
    thumbnail: image, backgroundColor: opts.bg || "#fdf2f8", previewLayout: opts.previewLayout,
    nodes: [
      textNode("title", "צור קשר", { color: "#0f172a", fontSize: "72px", fontWeight: "900", lineHeight: "1" }, absoluteLayout(60, 40, "500px", "90px", 20)),
      imageNode("image", image, { borderRadius: "999px", objectFit: "cover" }, absoluteLayout(60, 150, "280px", "280px", 10), "דיוקן"),
      ...contactFormFields(400, 150, "#db2777", "pill"),
    ],
  });
}

function contactCenteredMinimal(opts: {
  id: string; title: string; headline: string; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  return section(opts.id, "contact", opts.title, "טופס מינימלי ממורכז", {
    minHeight: "460px", backgroundColor: opts.bg || "#ffffff", previewLayout: opts.previewLayout,
    nodes: [
      textNode("title", opts.headline, { color: "#0f172a", fontSize: "36px", fontWeight: "900", textAlign: "center" }, absoluteLayout(260, 50, "520px", "55px", 20)),
      ...contactFormFields(300, 130, "#0f172a", "square"),
    ],
  });
}

function contactDarkOverlay(opts: {
  id: string; title: string; headline: string; copy: string;
  image?: ImgKey; previewLayout: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "abstract");
  return section(opts.id, "contact", opts.title, "טופס על רקע כהה", {
    thumbnail: image, backgroundColor: "#0f172a", previewLayout: opts.previewLayout,
    nodes: [
      imageNode("image", image, { borderRadius: "0", objectFit: "cover", opacity: "0.4" }, absoluteLayout(0, 0, "1080px", "540px", 5), "רקע"),
      boxNode("overlay", { backgroundColor: "rgba(15,23,42,0.55)" }, absoluteLayout(0, 0, "1080px", "540px", 6), "שכבה"),
      textNode("title", opts.headline, { color: "#ffffff", fontSize: "42px", fontWeight: "900" }, absoluteLayout(60, 80, "420px", "70px", 20)),
      textNode("copy", opts.copy, { ...copy, color: "#cbd5e1" }, absoluteLayout(60, 170, "400px", "80px", 20)),
      ...contactFormFields(560, 80, "#8b5cf6", "pill"),
    ],
  });
}

function contactThreeCards(opts: {
  id: string; title: string; headline: string; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  const cards = [
    { icon: "📞", label: "טלפון", value: "03-555-5555" },
    { icon: "✉️", label: "אימייל", value: "hello@example.com" },
    { icon: "📍", label: "כתובת", value: "רחוב הדוגמה 12" },
  ];
  const nodes: VisualLibraryNodeTemplate[] = [
    textNode("title", opts.headline, { color: "#0f172a", fontSize: "40px", fontWeight: "900", textAlign: "center" }, absoluteLayout(200, 40, "680px", "60px", 20)),
  ];
  const cardRadii = ["0px", "8px", "999px"];
  cards.forEach((c, i) => {
    const x = 80 + i * 320;
    nodes.push(
      boxNode(`card${i + 1}`, { backgroundColor: "#ffffff", borderRadius: cardRadii[i], border: "1px solid #e2e8f0" }, absoluteLayout(x, 130, "280px", "280px", 8), c.label),
      iconNode(`icon${i + 1}`, c.icon, { fontSize: "32px" }, absoluteLayout(x + 24, 160, "48px", "48px", 12)),
      textNode(`label${i + 1}`, c.label, { color: "#94a3b8", fontSize: "13px", fontWeight: "900" }, absoluteLayout(x + 24, 220, "200px", "24px", 20)),
      textNode(`value${i + 1}`, c.value, { color: "#0f172a", fontSize: "18px", fontWeight: "900" }, absoluteLayout(x + 24, 250, "230px", "50px", 20)),
    );
  });
  return section(opts.id, "contact", opts.title, "שלוש כרטיסיות קשר", {
    backgroundColor: opts.bg || "#f8fafc", previewLayout: opts.previewLayout, nodes,
  });
}

function contactImageTopFormBottom(opts: {
  id: string; title: string; headline: string; copy: string;
  image?: ImgKey; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "travel");
  return section(opts.id, "contact", opts.title, "תמונה למעלה וטופס למטה", {
    thumbnail: image, minHeight: "580px", backgroundColor: opts.bg || "#ffffff", previewLayout: opts.previewLayout,
    nodes: [
      imageNode("image", image, { borderRadius: "0", objectFit: "cover" }, absoluteLayout(0, 0, "1080px", "240px", 10), "תמונת רוחב"),
      textNode("title", opts.headline, { color: "#0f172a", fontSize: "36px", fontWeight: "900", textAlign: "center" }, absoluteLayout(260, 270, "560px", "55px", 20)),
      textNode("copy", opts.copy, { ...copy, textAlign: "center" }, absoluteLayout(280, 340, "520px", "60px", 20)),
      ...contactFormFields(300, 400, "#0d9488", "soft"),
    ],
  });
}

function contactSocialHeavy(opts: {
  id: string; title: string; headline: string; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  return section(opts.id, "contact", opts.title, "רשתות חברתיות בולטות", {
    backgroundColor: opts.bg || "#eef2ff", previewLayout: opts.previewLayout,
    nodes: [
      textNode("title", opts.headline, { color: "#0f172a", fontSize: "40px", fontWeight: "900" }, absoluteLayout(60, 50, "500px", "60px", 20)),
      textNode("social1", "Instagram", { color: "#4f46e5", fontSize: "22px", fontWeight: "900" }, absoluteLayout(60, 150, "200px", "36px", 20)),
      textNode("social2", "Facebook", { color: "#4f46e5", fontSize: "22px", fontWeight: "900" }, absoluteLayout(60, 200, "200px", "36px", 20)),
      textNode("social3", "WhatsApp", { color: "#4f46e5", fontSize: "22px", fontWeight: "900" }, absoluteLayout(60, 250, "200px", "36px", 20)),
      textNode("social4", "LinkedIn", { color: "#4f46e5", fontSize: "22px", fontWeight: "900" }, absoluteLayout(60, 300, "200px", "36px", 20)),
      textNode("copy", "עקבו אחרינו או שלחו הודעה קצרה", { ...copy }, absoluteLayout(60, 360, "360px", "50px", 20)),
      ...contactFormFields(520, 120, "#4f46e5", "outlined"),
    ],
  });
}

function contactHoursFeatured(opts: {
  id: string; title: string; headline: string; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  return section(opts.id, "contact", opts.title, "שעות פעילות בולטות", {
    backgroundColor: opts.bg || "#fffbeb", previewLayout: opts.previewLayout,
    nodes: [
      textNode("title", opts.headline, { color: "#0f172a", fontSize: "36px", fontWeight: "900" }, absoluteLayout(60, 50, "400px", "55px", 20)),
      boxNode("hours-box", { backgroundColor: "#7c3aed", borderRadius: "0px", border: "none", boxShadow: "10px 10px 0 #4c1d95" }, absoluteLayout(60, 130, "400px", "280px", 8), "שעות"),
      textNode("hours-title", "שעות פעילות", { color: "#ffffff", fontSize: "28px", fontWeight: "900" }, absoluteLayout(90, 160, "300px", "40px", 20)),
      textNode("hours", "א׳–ה׳ 09:00–18:00\nו׳ 09:00–13:00", { color: "#ede9fe", fontSize: "20px", fontWeight: "700", lineHeight: "1.8" }, absoluteLayout(90, 220, "320px", "120px", 20)),
      textNode("addr", "רחוב הדוגמה 12, תל אביב", { color: "#64748b", fontSize: "16px", fontWeight: "700" }, absoluteLayout(520, 150, "400px", "40px", 20)),
      textNode("phone", "03-555-5555", { color: "#64748b", fontSize: "16px", fontWeight: "700" }, absoluteLayout(520, 200, "300px", "30px", 20)),
      textNode("mail", "hello@example.com", { color: "#64748b", fontSize: "16px", fontWeight: "700" }, absoluteLayout(520, 250, "300px", "30px", 20)),
    ],
  });
}

function contactSplitMapForm(opts: {
  id: string; title: string; headline: string; copy: string; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  return section(opts.id, "contact", opts.title, "מפה משמאל וטופס מימין", {
    backgroundColor: opts.bg || "#f8fafc", previewLayout: opts.previewLayout,
    nodes: [
      textNode("title", opts.headline, { color: "#0f172a", fontSize: "36px", fontWeight: "900" }, absoluteLayout(60, 40, "500px", "55px", 20)),
      boxNode("map", { backgroundColor: "#94a3b8", borderRadius: "0px" }, absoluteLayout(60, 110, "460px", "380px", 8), "מפה"),
      textNode("addr", "📍 רחוב הדוגמה 12", { color: "#ffffff", fontSize: "16px", fontWeight: "900" }, absoluteLayout(90, 440, "300px", "30px", 20)),
      textNode("copy", opts.copy, copy, absoluteLayout(560, 110, "400px", "70px", 20)),
      ...contactFormFields(560, 200, "#059669", "soft"),
    ],
  });
}

function contactNewsletterStyle(opts: {
  id: string; title: string; headline: string; copy: string;
  image?: ImgKey; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "food");
  return section(opts.id, "contact", opts.title, "סגנון ניוזלטר ליצירת קשר", {
    thumbnail: image, minHeight: "420px", backgroundColor: opts.bg || "#faf5ff", previewLayout: opts.previewLayout,
    nodes: [
      imageNode("image", image, { borderRadius: "24px", objectFit: "cover" }, absoluteLayout(60, 50, "380px", "300px", 10), "ניוזלטר"),
      textNode("title", opts.headline, { color: "#0f172a", fontSize: "38px", fontWeight: "900" }, absoluteLayout(480, 70, "480px", "90px", 20)),
      textNode("copy", opts.copy, copy, absoluteLayout(480, 170, "420px", "70px", 20)),
      boxNode("input", { backgroundColor: "#ffffff", borderRadius: "999px", border: "1px solid #e2e8f0" }, absoluteLayout(480, 260, "300px", "50px", 8), "שדה"),
      textNode("placeholder", "האימייל שלכם", { color: "#94a3b8", fontSize: "14px", fontWeight: "700" }, absoluteLayout(505, 272, "160px", "28px", 20)),
      buttonNode("primary", "שליחה", { ...btnPrimary, backgroundColor: "#7c3aed" }, absoluteLayout(480, 330, "160px", "48px", 22)),
    ],
  });
}

function contactBoutiqueWarm(opts: {
  id: string; title: string; headline: string; copy: string;
  image?: ImgKey; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "beauty");
  return section(opts.id, "contact", opts.title, "בוטיק יופי חם", {
    thumbnail: image, backgroundColor: opts.bg || "#fff7ed", previewLayout: opts.previewLayout,
    nodes: [
      imageNode("image", image, { borderRadius: "999px", objectFit: "cover" }, absoluteLayout(60, 50, "420px", "420px", 10), "יופי"),
      textNode("eyebrow", "בוטיק יופי", { color: "#c2410c", fontSize: "14px", fontWeight: "900" }, absoluteLayout(520, 70, "200px", "28px", 20)),
      textNode("title", opts.headline, { color: "#0f172a", fontSize: "40px", fontWeight: "900" }, absoluteLayout(520, 110, "440px", "80px", 20)),
      textNode("copy", opts.copy, { ...copy, color: "#9a3412" }, absoluteLayout(520, 210, "400px", "80px", 20)),
      ...contactFormFields(520, 310, "#ea580c", "soft"),
    ],
  });
}

function contactCorporateOffice(opts: {
  id: string; title: string; headline: string; copy: string;
  image?: ImgKey; bg?: string; previewLayout: string;
}): VisualLibrarySectionTemplate {
  const image = img(opts.image || "office");
  return section(opts.id, "contact", opts.title, "משרד תאגידי מקצועי", {
    thumbnail: image, backgroundColor: opts.bg || "#f1f5f9", previewLayout: opts.previewLayout,
    nodes: [
      textNode("title", opts.headline, { color: "#0f172a", fontSize: "40px", fontWeight: "900" }, absoluteLayout(60, 50, "480px", "70px", 20)),
      textNode("copy", opts.copy, copy, absoluteLayout(60, 140, "440px", "80px", 20)),
      textNode("addr", "כתובת: רחוב העסקים 45, רמת גן", { color: "#334155", fontSize: "16px", fontWeight: "700" }, absoluteLayout(60, 240, "400px", "30px", 20)),
      textNode("phone", "טלפון: 03-777-7777", { color: "#334155", fontSize: "16px", fontWeight: "700" }, absoluteLayout(60, 280, "300px", "30px", 20)),
      ...contactFormFields(60, 330, "#0f172a", "outlined"),
      imageNode("image", image, { borderRadius: "0px", objectFit: "cover" }, absoluteLayout(560, 50, "460px", "430px", 10), "משרד"),
    ],
  });
}

// —— Footer layout builders (15 distinct) ——

type FooterOpts = { id: string; title: string; bg?: string; previewLayout: string };

function footerBrandNavContact(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "מותג, ניווט ופרטי קשר", {
    minHeight: "360px", backgroundColor: opts.bg || "#0f172a", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "המותג שלי", { color: "#ffffff", fontSize: "30px", fontWeight: "900" }, absoluteLayout(70, 65, "260px", "50px", 20)),
      textNode("copy", "יוצרים חוויות דיגיטליות שעוזרות לעסקים לצמוח.", { color: "#94a3b8", fontSize: "16px", fontWeight: "600", lineHeight: "1.65" }, absoluteLayout(70, 135, "330px", "90px", 20)),
      textNode("nav-title", "ניווט", { color: "#ffffff", fontSize: "17px", fontWeight: "900" }, absoluteLayout(500, 65, "150px", "35px", 20)),
      textNode("nav", "ראשי\nאודות\nשירותים\nצור קשר", { color: "#94a3b8", fontSize: "15px", fontWeight: "700", lineHeight: "1.9" }, absoluteLayout(500, 110, "150px", "120px", 20)),
      textNode("contact-title", "יצירת קשר", { color: "#ffffff", fontSize: "17px", fontWeight: "900" }, absoluteLayout(720, 65, "180px", "35px", 20)),
      textNode("contact", "hello@example.com\n03-555-5555", { color: "#94a3b8", fontSize: "15px", fontWeight: "700", lineHeight: "1.9" }, absoluteLayout(720, 110, "220px", "80px", 20)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#64748b", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 300, "260px", "30px", 20)),
    ],
  });
}

function footerMinimalCentered(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר מינימלי ממורכז", {
    minHeight: "200px", backgroundColor: opts.bg || "#ffffff", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "המותג שלי", { color: "#0f172a", fontSize: "24px", fontWeight: "900", textAlign: "center" }, absoluteLayout(340, 50, "400px", "40px", 20)),
      textNode("legal", "© 2026 כל הזכויות שמורות", { color: "#94a3b8", fontSize: "13px", fontWeight: "700", textAlign: "center" }, absoluteLayout(340, 110, "400px", "30px", 20)),
    ],
  });
}

function footerDarkColumns(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר כהה עם עמודות", {
    minHeight: "320px", backgroundColor: opts.bg || "#0f172a", previewLayout: opts.previewLayout,
    nodes: [
      textNode("col1-title", "המותג", { color: "#ffffff", fontSize: "16px", fontWeight: "900" }, absoluteLayout(70, 60, "200px", "30px", 20)),
      textNode("col1", "אודות\nצוות\nקריירה", { color: "#94a3b8", fontSize: "14px", fontWeight: "700", lineHeight: "2" }, absoluteLayout(70, 100, "180px", "100px", 20)),
      textNode("col2-title", "שירותים", { color: "#ffffff", fontSize: "16px", fontWeight: "900" }, absoluteLayout(320, 60, "200px", "30px", 20)),
      textNode("col2", "ייעוץ\nעיצוב\nתמיכה", { color: "#94a3b8", fontSize: "14px", fontWeight: "700", lineHeight: "2" }, absoluteLayout(320, 100, "180px", "100px", 20)),
      textNode("col3-title", "קשר", { color: "#ffffff", fontSize: "16px", fontWeight: "900" }, absoluteLayout(570, 60, "200px", "30px", 20)),
      textNode("col3", "hello@example.com\n03-555-5555", { color: "#94a3b8", fontSize: "14px", fontWeight: "700", lineHeight: "2" }, absoluteLayout(570, 100, "220px", "80px", 20)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#64748b", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 260, "300px", "30px", 20)),
    ],
  });
}

function footerLightSimple(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר בהיר פשוט", {
    minHeight: "240px", backgroundColor: opts.bg || "#f8fafc", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "המותג שלי", { color: "#0f172a", fontSize: "26px", fontWeight: "900" }, absoluteLayout(70, 50, "260px", "45px", 20)),
      textNode("nav", "ראשי | אודות | שירותים | צור קשר", { color: "#64748b", fontSize: "14px", fontWeight: "700" }, absoluteLayout(70, 120, "500px", "30px", 20)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#94a3b8", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 170, "300px", "30px", 20)),
    ],
  });
}

function footerSocialBar(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר עם רשתות חברתיות", {
    minHeight: "280px", backgroundColor: opts.bg || "#1e1b4b", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "המותג שלי", { color: "#ffffff", fontSize: "28px", fontWeight: "900" }, absoluteLayout(70, 60, "260px", "45px", 20)),
      textNode("social", "Instagram  ·  Facebook  ·  WhatsApp", { color: "#a5b4fc", fontSize: "16px", fontWeight: "900" }, absoluteLayout(70, 140, "500px", "30px", 20)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#6366f1", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 210, "300px", "30px", 20)),
    ],
  });
}

function footerNewsletterFooter(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר עם ניוזלטר", {
    minHeight: "300px", backgroundColor: opts.bg || "#faf5ff", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "המותג שלי", { color: "#0f172a", fontSize: "26px", fontWeight: "900" }, absoluteLayout(70, 50, "260px", "45px", 20)),
      textNode("newsletter-title", "הרשמה לעדכונים", { color: "#0f172a", fontSize: "18px", fontWeight: "900" }, absoluteLayout(520, 50, "300px", "30px", 20)),
      boxNode("input", { backgroundColor: "#ffffff", borderRadius: "999px", border: "1px solid #e2e8f0" }, absoluteLayout(520, 90, "280px", "46px", 8), "אימייל"),
      buttonNode("primary", "הרשמה", { ...btnPrimary, backgroundColor: "#7c3aed" }, absoluteLayout(520, 150, "140px", "44px", 22)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#94a3b8", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 220, "300px", "30px", 20)),
    ],
  });
}

function footerLogoHeavy(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר עם לוגו בולט", {
    minHeight: "260px", backgroundColor: opts.bg || "#0f172a", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "המותג", { color: "#ffffff", fontSize: "48px", fontWeight: "900" }, absoluteLayout(70, 70, "400px", "60px", 20)),
      textNode("tagline", "עסק שמצליח בדיגיטל", { color: "#94a3b8", fontSize: "16px", fontWeight: "700" }, absoluteLayout(70, 150, "400px", "30px", 20)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#64748b", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 200, "300px", "30px", 20)),
    ],
  });
}

function footerLegalLinks(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר עם קישורים משפטיים", {
    minHeight: "220px", backgroundColor: opts.bg || "#ffffff", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "המותג שלי", { color: "#0f172a", fontSize: "22px", fontWeight: "900" }, absoluteLayout(70, 50, "200px", "35px", 20)),
      textNode("legal-links", "מדיניות פרטיות  ·  תנאי שימוש  ·  נגישות", { color: "#64748b", fontSize: "14px", fontWeight: "700" }, absoluteLayout(70, 110, "600px", "30px", 20)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#94a3b8", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 160, "300px", "30px", 20)),
    ],
  });
}

function footerMapContact(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר עם מפה וקשר", {
    minHeight: "340px", backgroundColor: opts.bg || "#f1f5f9", previewLayout: opts.previewLayout,
    nodes: [
      boxNode("map", { backgroundColor: "#cbd5e1", borderRadius: "16px" }, absoluteLayout(70, 50, "400px", "180px", 8), "מפה"),
      textNode("brand", "המותג שלי", { color: "#0f172a", fontSize: "24px", fontWeight: "900" }, absoluteLayout(520, 50, "260px", "40px", 20)),
      textNode("addr", "רחוב הדוגמה 12, תל אביב", { color: "#64748b", fontSize: "15px", fontWeight: "700" }, absoluteLayout(520, 110, "350px", "30px", 20)),
      textNode("phone", "03-555-5555", { color: "#64748b", fontSize: "15px", fontWeight: "700" }, absoluteLayout(520, 150, "200px", "30px", 20)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#94a3b8", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 280, "300px", "30px", 20)),
    ],
  });
}

function footerGradientDark(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר כהה עם גרדיאנט", {
    minHeight: "280px", backgroundColor: opts.bg || "#0f172a", previewLayout: opts.previewLayout,
    nodes: [
      boxNode("gradient", { backgroundImage: "linear-gradient(135deg,#1e1b4b,#0f172a)", borderRadius: "0" }, absoluteLayout(0, 0, "1080px", "280px", 5), "רקע"),
      textNode("brand", "המותג שלי", { color: "#ffffff", fontSize: "30px", fontWeight: "900" }, absoluteLayout(70, 80, "300px", "50px", 20)),
      textNode("copy", "בונים את העתיד הדיגיטלי שלכם", { color: "#a5b4fc", fontSize: "16px", fontWeight: "700" }, absoluteLayout(70, 150, "400px", "30px", 20)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#6366f1", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 210, "300px", "30px", 20)),
    ],
  });
}

function footerWarmBeige(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר חם בגוון בז׳", {
    minHeight: "260px", backgroundColor: opts.bg || "#fff7ed", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "המותג שלי", { color: "#9a3412", fontSize: "28px", fontWeight: "900" }, absoluteLayout(70, 60, "280px", "45px", 20)),
      textNode("copy", "חוויה חמה ואישית לכל לקוח", { color: "#c2410c", fontSize: "15px", fontWeight: "700" }, absoluteLayout(70, 120, "350px", "30px", 20)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#fdba74", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 180, "300px", "30px", 20)),
    ],
  });
}

function footerSplitBrandCta(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר עם מותג וקריאה לפעולה", {
    minHeight: "280px", backgroundColor: opts.bg || "#ecfdf5", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "המותג שלי", { color: "#0f172a", fontSize: "28px", fontWeight: "900" }, absoluteLayout(70, 70, "300px", "45px", 20)),
      textNode("cta-text", "מוכנים להתחיל?", { color: "#0f172a", fontSize: "22px", fontWeight: "900" }, absoluteLayout(560, 70, "300px", "35px", 20)),
      buttonNode("primary", "צרו קשר", { ...btnPrimary, backgroundColor: "#059669" }, absoluteLayout(560, 120, "150px", "48px", 22)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#94a3b8", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 210, "300px", "30px", 20)),
    ],
  });
}

function footerCompactMobile(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר קומפקטי", {
    minHeight: "160px", backgroundColor: opts.bg || "#0f172a", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "המותג", { color: "#ffffff", fontSize: "20px", fontWeight: "900", textAlign: "center" }, absoluteLayout(340, 40, "400px", "35px", 20)),
      textNode("nav", "ראשי · אודות · קשר", { color: "#94a3b8", fontSize: "13px", fontWeight: "700", textAlign: "center" }, absoluteLayout(340, 85, "400px", "25px", 20)),
      textNode("legal", "© 2026", { color: "#64748b", fontSize: "12px", fontWeight: "700", textAlign: "center" }, absoluteLayout(340, 120, "400px", "25px", 20)),
    ],
  });
}

function footerPortfolioFooter(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר לפורטפוליו", {
    minHeight: "300px", backgroundColor: opts.bg || "#fafaf9", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "סטודיו יצירה", { color: "#0f172a", fontSize: "32px", fontWeight: "900" }, absoluteLayout(70, 60, "300px", "50px", 20)),
      textNode("portfolio-links", "עבודות\nאודות\nבלוג\nצור קשר", { color: "#64748b", fontSize: "15px", fontWeight: "700", lineHeight: "2" }, absoluteLayout(70, 130, "200px", "120px", 20)),
      textNode("social", "@studio · Behance · Dribbble", { color: "#94a3b8", fontSize: "14px", fontWeight: "700" }, absoluteLayout(520, 130, "400px", "30px", 20)),
      textNode("legal", "© כל הזכויות שמורות", { color: "#cbd5e1", fontSize: "13px", fontWeight: "700" }, absoluteLayout(70, 250, "300px", "30px", 20)),
    ],
  });
}

function footerCorporateFull(opts: FooterOpts): VisualLibrarySectionTemplate {
  return section(opts.id, "footer", opts.title, "פוטר תאגידי מלא", {
    minHeight: "380px", backgroundColor: opts.bg || "#0f172a", previewLayout: opts.previewLayout,
    nodes: [
      textNode("brand", "חברת אלפא בע״מ", { color: "#ffffff", fontSize: "28px", fontWeight: "900" }, absoluteLayout(70, 50, "350px", "45px", 20)),
      textNode("col1", "אודות החברה\nהנהלה\nמשקיעים", { color: "#94a3b8", fontSize: "14px", fontWeight: "700", lineHeight: "2" }, absoluteLayout(70, 120, "200px", "100px", 20)),
      textNode("col2", "פתרונות\nתעשיות\nשותפים", { color: "#94a3b8", fontSize: "14px", fontWeight: "700", lineHeight: "2" }, absoluteLayout(320, 120, "200px", "100px", 20)),
      textNode("col3", "קריירה\nעיתונות\nצור קשר", { color: "#94a3b8", fontSize: "14px", fontWeight: "700", lineHeight: "2" }, absoluteLayout(570, 120, "200px", "100px", 20)),
      textNode("contact", "hello@corp.com | 03-777-7777", { color: "#64748b", fontSize: "14px", fontWeight: "700" }, absoluteLayout(70, 280, "500px", "30px", 20)),
      textNode("legal", "© כל הזכויות שמורות · מדיניות פרטיות", { color: "#475569", fontSize: "12px", fontWeight: "700" }, absoluteLayout(70, 320, "500px", "30px", 20)),
    ],
  });
}

// —— Category mega builders ——

const heroNiches = [
  { niche: "beauty" as ImgKey, badge: "יופי וטיפוח", headline: "היופי מתחיל בביטחון", copy: "טיפולים מותאמים אישית באווירה רגועה ומפנקת.", primary: "קביעת תור", secondary: "השירותים" },
  { niche: "food" as ImgKey, badge: "קולינריה", headline: "טעמים שמספרים סיפור", copy: "חומרי גלם איכותיים, מנות מעוצבות וחוויה בלתי נשכחת.", primary: "הזמנה", secondary: "תפריט" },
  { niche: "wellness" as ImgKey, badge: "כושר ובריאות", headline: "הגוף והנפש ביחד", copy: "אימונים מותאמים, מאמנים מקצועיים ותוצאות מדידות.", primary: "הצטרפו", secondary: "שיעור ניסיון" },
  { niche: "tech" as ImgKey, badge: "טכנולוגיה", headline: "חדשנות שמניעה עסקים", copy: "פתרונות דיגיטליים חכמים שמביאים צמיחה אמיתית.", primary: "הדגמה", secondary: "למדו עוד" },
  { niche: "realestate" as ImgKey, badge: "נדל״ן", headline: "הבית הבא שלכם מחכה", copy: "נכסים נבחרים, ליווי אישי ושקיפות מלאה.", primary: "לנכסים", secondary: "ייעוץ" },
  { niche: "fashion" as ImgKey, badge: "אופנה", headline: "סטייל שמדבר בשבילכם", copy: "קולקציות עדכניות, חומרים איכותיים ושירות VIP.", primary: "לקולקציה", secondary: "החנות" },
  { niche: "travel" as ImgKey, badge: "טיולים", headline: "העולם בידיים שלכם", copy: "חבילות מותאמות, חוויות ייחודיות וזיכרונות לכל החיים.", primary: "לחבילות", secondary: "השראה" },
  { niche: "finance" as ImgKey, badge: "פיננסים", headline: "שקט כלכלי מתחיל כאן", copy: "ייעוץ מקצועי, תכנון חכם ופתרונות לעסק ולמשפחה.", primary: "פגישה", secondary: "שירותים" },
  { niche: "construction" as ImgKey, badge: "בנייה", headline: "בונים חלומות למציאות", copy: "איכות ביצוע, עמידה בזמנים ושקיפות בכל שלב.", primary: "הצעת מחיר", secondary: "פרויקטים" },
  { niche: "office" as ImgKey, badge: "עסקים", headline: "נוכחות דיגיטלית שמביאה לקוחות", copy: "אתר מקצועי בעברית עם סקשנים מוכנים לעסק שלכם.", primary: "התחילו", secondary: "דוגמאות" },
  { niche: "wellness" as ImgKey, badge: "רווחה", headline: "רגע של שקט ביום עמוס", copy: "מרחב בטוח לשחרור מתחים והתחדשות אנרגטית.", primary: "הזמינו", secondary: undefined },
  { niche: "beauty" as ImgKey, badge: "ספא", headline: "פינוק שמגיע מגיע", copy: "חבילות טיפול מלאות לגוף ולנפש באווירה יוקרתית.", primary: "חבילות", secondary: "מתנות" },
  { niche: "food" as ImgKey, badge: "מסעדה", headline: "שולחן חם, לב פתוח", copy: "מטבח עונתי, שירות חם והזמנה בקליק.", primary: "שולחן", secondary: "תפריט" },
  { niche: "abstract" as ImgKey, badge: "סטארטאפ", headline: "מהרעיון למוצר חי", copy: "צוות מנוסה, תהליך מהיר ותוצאות שמרגישים מהיום הראשון.", primary: "בואו נדבר", secondary: undefined },
  { niche: "realestate" as ImgKey, badge: "יוקרה", headline: "נכסים יוצאי דופן", copy: "מבחר בלעדי של דירות ווילות במיקומים מבוקשים.", primary: "לצפייה", secondary: "סוכן" },
];

const aboutTitles = ["הסיפור שלנו", "המשימה", "הערכים", "המקום", "המלאכה", "החזון", "המסע", "השורשים", "הצוות", "האמונה", "הייחודיות", "המחויבות", "החלום", "המורשת", "ההבטחה"];

const portfolioHeadlines = ["עבודות נבחרות", "פרויקטים אחרונים", "מבחר יצירות", "תיק עבודות", "השראה ויזואלית", "מה שעשינו", "גלריית פרויקטים", "יצירות מובילות", "תוצאות", "מראה ותחושה", "עיצובים", "קייס סטאדיז", "מוצרים חיים", "חוויות דיגיטליות", "אוסף מיוחד"];

const serviceListItems = [
  { title: "ייעוץ ראשוני", copy: "אבחון צרכים והמלצות ברורות.", meta: "45 דק׳" },
  { title: "ליווי חודשי", copy: "פגישות קבועות ומדידה שוטפת.", meta: "חודשי" },
  { title: "הקמת אתר", copy: "בנייה מלאה כולל תוכן ועיצוב.", meta: "פרויקט" },
  { title: "תחזוקה", copy: "עדכונים, גיבויים ושיפורים.", meta: "שוטף" },
];

const contactLayoutDefs = [
  { fn: contactFormLeftImageRight, key: "form-left-image-right", title: "טופס רך + תמונה מרובעת" },
  { fn: contactFormRightImageLeft, key: "form-right-image-left", title: "צל חד + תמונה מעוגלת" },
  { fn: contactDetailsIconsGrid, key: "details-icons-grid", title: "רשת פרטים מרובעת" },
  { fn: contactMapStrip, key: "map-strip", title: "פס מפה חד" },
  { fn: contactBigTitlePortrait, key: "big-title-portrait", title: "דיוקן עגול וטופס כדור" },
  { fn: contactCenteredMinimal, key: "centered-minimal-form", title: "טופס מרובע ממורכז" },
  { fn: contactDarkOverlay, key: "dark-overlay-form", title: "טופס כדור על רקע כהה" },
  { fn: contactThreeCards, key: "three-contact-cards", title: "שלוש כרטיסיות – מעורב" },
  { fn: contactImageTopFormBottom, key: "image-top-form-bottom", title: "תמונה מלאה וטופס רך" },
  { fn: contactSocialHeavy, key: "social-heavy", title: "רשתות + טופס מתאר" },
  { fn: contactHoursFeatured, key: "hours-featured", title: "שעות בקופסה סגולה חדה" },
  { fn: contactSplitMapForm, key: "split-map-form", title: "מפה חדה וטופס רך" },
  { fn: contactNewsletterStyle, key: "newsletter-style-contact", title: "ניוזלטר עם שדות כדור" },
  { fn: contactBoutiqueWarm, key: "boutique-warm-split", title: "בוטיק – תמונה אליפסה" },
  { fn: contactCorporateOffice, key: "corporate-office-split", title: "תאגידי – מתאר ותמונה חדה" },
] as const;

const footerLayoutDefs = [
  { fn: footerBrandNavContact, key: "brand-nav-contact" },
  { fn: footerMinimalCentered, key: "minimal-centered" },
  { fn: footerDarkColumns, key: "dark-columns" },
  { fn: footerLightSimple, key: "light-simple" },
  { fn: footerSocialBar, key: "social-bar" },
  { fn: footerNewsletterFooter, key: "newsletter-footer" },
  { fn: footerLogoHeavy, key: "logo-heavy" },
  { fn: footerLegalLinks, key: "legal-links" },
  { fn: footerMapContact, key: "map-contact" },
  { fn: footerGradientDark, key: "gradient-dark" },
  { fn: footerWarmBeige, key: "warm-beige" },
  { fn: footerSplitBrandCta, key: "split-brand-cta" },
  { fn: footerCompactMobile, key: "compact-mobile" },
  { fn: footerPortfolioFooter, key: "portfolio-footer" },
  { fn: footerCorporateFull, key: "corporate-full" },
] as const;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function buildHeroMega(): VisualLibrarySectionTemplate[] {
  return heroNiches.map((h, i) => {
    const n = pad2(i + 1);
    const bg = BGS[i % BGS.length];
    const type = i % 3;
    if (type === 0) {
      return withPreviewLayout(
        heroSplit({
          id: `section-hero-${n}-split-${h.niche}`,
          title: `גיבור ${i + 1} – פיצול ${h.niche}`,
          badge: h.badge,
          headline: h.headline,
          copy: h.copy,
          primary: h.primary,
          secondary: h.secondary,
          image: h.niche,
          bg: bg === "#0f172a" ? "#f8fafc" : bg,
        }),
        `hero-split-${h.niche}-${n}`,
      );
    }
    if (type === 1) {
      return withPreviewLayout(
        heroCentered({
          id: `section-hero-${n}-center-${h.niche}`,
          title: `גיבור ${i + 1} – ממורכז כהה ${h.niche}`,
          badge: h.badge,
          headline: h.headline,
          copy: h.copy,
          primary: h.primary,
          image: h.niche,
          bg: ["#0f172a", "#1e1b4b", "#134e4a"][i % 3],
        }),
        `hero-center-dark-${h.niche}-${n}`,
      );
    }
    return withPreviewLayout(
      heroCentered({
        id: `section-hero-${n}-light-${h.niche}`,
        title: `גיבור ${i + 1} – ממורכז בהיר ${h.niche}`,
        badge: h.badge,
        headline: h.headline,
        copy: h.copy,
        primary: h.primary,
        image: h.niche,
        bg: bg === "#0f172a" ? "#fff7ed" : bg,
        light: true,
      }),
      `hero-center-light-${h.niche}-${n}`,
    );
  });
}

function buildAboutMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const imageKey = IMG_KEYS[i % IMG_KEYS.length];
    return withPreviewLayout(
      aboutSplit({
        id: `section-about-${n}-${imageKey}`,
        title: `אודות ${i + 1} – ${aboutTitles[i]}`,
        eyebrow: aboutTitles[i],
        headline: `אנחנו כאן בשבילכם – ${aboutTitles[i]}`,
        copy: "עסק משפחתי עם ניסיון עשיר, שירות אישי ותשומת לב לכל פרט.",
        cta: "גלו עוד",
        image: imageKey,
        imageRight: i % 2 === 0,
        bg: BGS[(i + 2) % BGS.length],
      }),
      `about-split-${i % 2 === 0 ? "img-right" : "img-left"}-${n}`,
    );
  });
}

function buildPortfolioMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const count = ([3, 4, 6] as const)[i % 3];
    const radiusStyle =
      i % 3 === 0
        ? ["0px", "0px", "0px", "0px", "0px", "0px"]
        : i % 3 === 1
          ? ["0px", "16px", "28px", "0px", "16px", "28px"]
          : ["28px", "28px", "28px", "28px", "28px", "28px"];
    return withPreviewLayout(
      portfolioGrid({
        id: `section-portfolio-${n}-grid-${count}`,
        title: `פורטפוליו ${i + 1} – ${count} · ${i % 3 === 0 ? "מרובע" : i % 3 === 1 ? "מעורב" : "מעוגל"}`,
        headline: portfolioHeadlines[i],
        count,
        bg: BGS[(i + 4) % BGS.length],
        imageRadius: radiusStyle,
      }),
      `portfolio-grid-${count}-${i % 3 === 0 ? "square" : i % 3 === 1 ? "mix" : "round"}-${n}`,
    );
  });
}

function buildServicesMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const bg = BGS[(i + 1) % BGS.length];
    if (i % 3 !== 0) {
      return withPreviewLayout(
        servicesList({
          id: `section-services-${n}-list`,
          title: `שירותים ${i + 1} – רשימה`,
          headline: "השירותים שלנו",
          items: serviceListItems,
          bg,
        }),
        `services-list-${n}`,
      );
    }
    const withImages = i % 6 === 0;
    const mixedCardR = ["0px", "12px", "28px", "999px"];
    const mixedImgR = ["0px", "8px", "24px", "40px"];
    return withPreviewLayout(
      servicesCards({
        id: `section-services-${n}-cards`,
        title: `שירותים ${i + 1} – כרטיסים ${withImages ? "מרובעים/מעוגלים" : "מעורבים"}`,
        headline: "מה אנחנו מציעים",
        items: serviceItems.slice(0, i % 2 === 0 ? 3 : 4),
        bg,
        withImages,
        imageKeys: withImages ? IMG_KEYS.slice(i % IMG_KEYS.length, (i % IMG_KEYS.length) + 4) : undefined,
        cardRadius: withImages ? undefined : mixedCardR,
        imageRadius: withImages ? mixedImgR : undefined,
      }),
      `services-cards-${withImages ? "img-mix" : "icon-mix"}-${n}`,
    );
  });
}

function buildContactMega(): VisualLibrarySectionTemplate[] {
  return contactLayoutDefs.map((def, i) => {
    const n = pad2(i + 1);
    const bg = BGS[i % BGS.length];
    const image = IMG_KEYS[i % IMG_KEYS.length];
    const copyText = "נשמח לשמוע מכם – השאירו פרטים ונחזור בהקדם.";
    const base = {
      id: `section-contact-${n}-${def.key}`,
      title: `יצירת קשר – ${def.title}`,
      headline: def.title,
      copy: copyText,
      image,
      bg: def.key === "dark-overlay-form" ? "#0f172a" : def.key === "boutique-warm-split" ? "#fff7ed" : bg,
      previewLayout: `contact-${def.key}`,
    };
    if (def.key === "big-title-portrait") {
      return def.fn({ id: base.id, title: base.title, image: "beauty", bg: base.bg, previewLayout: base.previewLayout });
    }
    if (def.key === "details-icons-grid" || def.key === "map-strip" || def.key === "centered-minimal-form" || def.key === "three-contact-cards" || def.key === "social-heavy" || def.key === "hours-featured") {
      return def.fn({ id: base.id, title: base.title, headline: base.headline, bg: base.bg, previewLayout: base.previewLayout });
    }
    if (def.key === "boutique-warm-split") {
      return def.fn({ id: base.id, title: base.title, headline: "בואו לפנק את עצמכם", copy: "נשמח לקבוע לכם טיפול מותאם אישית.", image: "beauty", bg: base.bg, previewLayout: base.previewLayout });
    }
    if (def.key === "corporate-office-split") {
      return def.fn({ id: base.id, title: base.title, headline: "משרדים ושירות לקוחות", copy: "צוות מקצועי זמין לכל שאלה עסקית.", image: "office", bg: base.bg, previewLayout: base.previewLayout });
    }
    return def.fn(base);
  });
}

function buildCommerceMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const bg = BGS[(i + 3) % BGS.length];
    if (i % 3 !== 0) {
      const imgKey = IMG_KEYS[i % IMG_KEYS.length];
      return withPreviewLayout(
        productSpotlight({
          id: `section-commerce-${n}-spotlight`,
          title: `מוצרים ${i + 1} – זרקור`,
          headline: "הפריט שכולם מדברים עליו",
          copy: "איכות גבוהה, עיצוב מדויק ומחיר הוגן.",
          price: `₪${149 + i * 20}`,
          cta: "לרכישה",
          image: imgKey,
          bg,
        }),
        `commerce-spotlight-${n}`,
      );
    }
    const items = [
      { title: "מוצר נבחר", price: "₪120", image: IMG_KEYS[i % IMG_KEYS.length] },
      { title: "קולקציית קיץ", price: "₪89", image: IMG_KEYS[(i + 1) % IMG_KEYS.length] },
      { title: "ערכה מיוחדת", price: "₪159", image: IMG_KEYS[(i + 2) % IMG_KEYS.length] },
      { title: "מארז מתנה", price: "₪199", image: IMG_KEYS[(i + 3) % IMG_KEYS.length] },
    ];
    return withPreviewLayout(
      productsGrid({
        id: `section-commerce-${n}-grid`,
        title: `מוצרים ${i + 1} – רשת`,
        headline: "המוצרים שלנו",
        items,
        bg,
      }),
      `commerce-grid-${n}`,
    );
  });
}

function buildFeaturesMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const bg = BGS[(i + 5) % BGS.length];
    if (i % 2 === 0) {
      const cols = i % 4 === 0 ? 4 : 3;
      const numbered = i % 4 === 0;
      return withPreviewLayout(
        featuresGrid({
          id: `section-features-${n}-grid`,
          title: `יתרונות ${i + 1} – רשת`,
          headline: "למה לבחור בנו",
          items: featureItems.slice(0, cols === 4 ? 4 : 3),
          cols,
          bg,
          numbered,
        }),
        `features-grid-${cols}${numbered ? "-num" : ""}-${n}`,
      );
    }
    return withPreviewLayout(
      featuresSplit({
        id: `section-features-${n}-split`,
        title: `יתרונות ${i + 1} – פיצול`,
        headline: "היתרונות שלנו",
        items: featureItems.slice(0, 4),
        image: IMG_KEYS[i % IMG_KEYS.length],
        bg,
      }),
      `features-split-${n}`,
    );
  });
}

function buildPromoteMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const variant = (["newsletter", "banner", "newsletter"] as const)[i % 3];
    return withPreviewLayout(
      promoteBlock({
        id: `section-promote-${n}-${variant}`,
        title: `קידום ${i + 1} – ${variant === "banner" ? "באנר" : "ניוזלטר"}`,
        headline: "היו הראשונים לדעת",
        copy: "עדכונים, טיפים ומבצעים ישירות אליכם.",
        cta: "הרשמה",
        variant,
        image: IMG_KEYS[i % IMG_KEYS.length],
        bg: BGS[(i + 6) % BGS.length],
      }),
      `promote-${variant}-${n}`,
    );
  });
}

function buildCtaMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const dark = i % 2 === 0;
    return withPreviewLayout(
      ctaBlock({
        id: `section-cta-${n}-${dark ? "dark" : "light"}`,
        title: `CTA ${i + 1} – ${dark ? "כהה" : "בהיר"}`,
        headline: "מוכנים להתחיל?",
        copy: "שיחה קצרה ותוכנית ברורה להמשך.",
        primary: "צרו קשר",
        secondary: i % 3 !== 2 ? "מידע נוסף" : undefined,
        dark,
        bg: dark ? ["#0f172a", "#1e1b4b", "#134e4a"][i % 3] : BGS[(i + 7) % BGS.length],
      }),
      `cta-${dark ? "dark" : "light"}-${n}`,
    );
  });
}

function buildTestimonialsMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const bg = BGS[(i + 8) % BGS.length];
    if (i % 5 === 4) {
      return withPreviewLayout(
        testimonialsBlock({
          id: `section-testimonials-${n}-logos`,
          title: `ביקורות ${i + 1} – לוגואים`,
          headline: "סומכים עלינו",
          items: [],
          variant: "logos",
          bg,
        }),
        `testimonials-logos-${n}`,
      );
    }
    return withPreviewLayout(
      testimonialsBlock({
        id: `section-testimonials-${n}-grid`,
        title: `ביקורות ${i + 1} – רשת`,
        headline: "מה אומרים עלינו",
        items: testimonials,
        bg,
      }),
      `testimonials-grid-${n}`,
    );
  });
}

function buildEventsMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const variant = i % 2 === 0 ? "cards" : "list";
    return withPreviewLayout(
      eventsBlock({
        id: `section-events-${n}-${variant}`,
        title: `אירועים ${i + 1} – ${variant === "cards" ? "כרטיסים" : "רשימה"}`,
        headline: "אירועים קרובים",
        items: events,
        variant,
        bg: BGS[(i + 9) % BGS.length],
      }),
      `events-${variant}-${n}`,
    );
  });
}

function buildBlogMega(): VisualLibrarySectionTemplate[] {
  const blogVariants = ["cards", "featured", "list", "magazine", "overlay", "square-grid"] as const;
  const blogVariantLabels: Record<(typeof blogVariants)[number], string> = {
    cards: "כרטיסים",
    featured: "מומלץ",
    list: "רשימה",
    magazine: "מגזין",
    overlay: "שכבת טקסט",
    "square-grid": "רשת מרובעת",
  };
  const blogHeadlines = [
    "מהבלוג שלנו",
    "כתבה מומלצת",
    "מאמרים אחרונים",
    "מהעיתון שלנו",
    "סיפורים מהשטח",
    "תובנות וחדשות",
  ];
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const bg = BGS[(i + 10) % BGS.length];
    const variant = blogVariants[i % 6];
    const layoutKey = variant === "square-grid" ? "square" : variant;
    return withPreviewLayout(
      blogBlock({
        id: `section-blog-${n}-${layoutKey}`,
        title: `בלוג ${i + 1} – ${blogVariantLabels[variant]}`,
        headline: blogHeadlines[i % blogHeadlines.length],
        variant,
        items:
          variant === "featured"
            ? [{ title: "המדריך המלא לבניית אתר שעובד", excerpt: "מעמוד ראשון ועד יצירת קשר – איך בונים מבנה שממיר." }]
            : variant === "square-grid"
              ? [
                  ...blogPosts,
                  { title: "טיפים לקידום אורגני", excerpt: "איך להופיע בגוגל.", date: "אפר׳ 2026" },
                ]
              : blogPosts,
        cardRadius: variant === "cards" && i % 2 === 0 ? "0px" : undefined,
        bg,
      }),
      `blog-${layoutKey}-${n}`,
    );
  });
}

function buildPricingMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const variant = i % 2 === 0 ? "cards" : "rows";
    return withPreviewLayout(
      pricingBlock({
        id: `section-pricing-${n}-${variant}`,
        title: `תמחור ${i + 1} – ${variant === "cards" ? "כרטיסים" : "שורות"}`,
        headline: "בחרו את החבילה",
        plans,
        variant,
        bg: BGS[(i + 11) % BGS.length],
      }),
      `pricing-${variant}-${n}`,
    );
  });
}

function buildResumeMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) => {
    const n = pad2(i + 1);
    const bg = BGS[(i + 12) % BGS.length];
    if (i % 2 !== 0) {
      const skills = resumeItems.map((r) => ({ role: r.role, place: "", dates: "" }));
      return withPreviewLayout(
        resumeBlock({
          id: `section-resume-${n}-skills`,
          title: `קורות חיים ${i + 1} – מיומנויות`,
          headline: "הכישורים שלי",
          variant: "skills",
          items: skills,
          bg,
        }),
        `resume-skills-${n}`,
      );
    }
    return withPreviewLayout(
      resumeBlock({
        id: `section-resume-${n}-exp`,
        title: `קורות חיים ${i + 1} – ניסיון`,
        headline: "ניסיון מקצועי",
        items: resumeItems,
        bg,
      }),
      `resume-experience-${n}`,
    );
  });
}

function buildTeamMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) =>
    withPreviewLayout(
      teamBlock({
        id: `section-team-${pad2(i + 1)}-four`,
        title: `צוות ${i + 1} – ארבעה`,
        headline: "האנשים מאחורי המותג",
        members: teamMembers,
        bg: BGS[(i + 13) % BGS.length],
      }),
      `team-grid-${pad2(i + 1)}`,
    ),
  );
}

function buildFaqMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) =>
    withPreviewLayout(
      faqBlock({
        id: `section-faq-${pad2(i + 1)}-list`,
        title: `שאלות ${i + 1} – רשימה`,
        headline: "שאלות שחשוב לשאול",
        items: faqItems,
        bg: BGS[(i + 14) % BGS.length],
      }),
      `faq-list-${pad2(i + 1)}`,
    ),
  );
}

function buildStatsMega(): VisualLibrarySectionTemplate[] {
  return Array.from({ length: 15 }, (_, i) =>
    withPreviewLayout(
      statsBlock({
        id: `section-stats-${pad2(i + 1)}-strip`,
        title: `מספרים ${i + 1} – פס`,
        items: statsItems,
        bg: i % 3 === 0 ? "#0f172a" : BGS[i % BGS.length],
      }),
      `stats-strip-${pad2(i + 1)}`,
    ),
  );
}

function buildFooterMega(): VisualLibrarySectionTemplate[] {
  return footerLayoutDefs.map((def, i) => {
    const n = pad2(i + 1);
    const dark = i % 3 === 0;
    return def.fn({
      id: `section-footer-${n}-${def.key}`,
      title: `פוטר ${i + 1} – ${def.key}`,
      bg: dark ? "#0f172a" : BGS[i % BGS.length],
      previewLayout: `footer-${def.key}`,
    });
  });
}

export const SECTION_LIBRARY_MEGA: VisualLibrarySectionTemplate[] = [
  ...buildHeroMega(),
  ...buildAboutMega(),
  ...buildPortfolioMega(),
  ...buildServicesMega(),
  ...buildContactMega(),
  ...buildCommerceMega(),
  ...buildFeaturesMega(),
  ...buildPromoteMega(),
  ...buildCtaMega(),
  ...buildTestimonialsMega(),
  ...buildEventsMega(),
  ...buildBlogMega(),
  ...buildPricingMega(),
  ...buildResumeMega(),
  ...buildTeamMega(),
  ...buildFaqMega(),
  ...buildStatsMega(),
  ...buildFooterMega(),
];

export function listMegaSectionIds(): string[] {
  return SECTION_LIBRARY_MEGA.map((item) => item.id);
}
