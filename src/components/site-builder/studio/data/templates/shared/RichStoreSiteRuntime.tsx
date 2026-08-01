import React, { useEffect, useMemo, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
import { Reveal } from "./Reveal";
import {
  resolveRichStoreLayout,
  type RichStoreLayoutId,
} from "./richStoreLayouts";
import { useTemplatePageNavigation } from "./useTemplatePageNavigation";
import {
  formatStorePrice,
  useStorePluginCatalog,
  type DemoStoreProductSeed,
  type StoreCatalogCategory,
  type StoreCatalogProduct,
} from "./useStorePluginCatalog";

export type RichStoreSitePageId =
  | "home"
  | "shop"
  | "collections"
  | "product"
  | "cart"
  | "lookbook"
  | "about"
  | "journal"
  | "contact"
  | "faq"
  | "shipping";

type StorePage = { id: string; label: string; slug: string };

export type RichStoreCartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
  variantId?: string;
  variantLabel?: string;
  sku?: string;
};

export type RichStoreSiteRuntimeProps = {
  templateId: string;
  layout?: RichStoreLayoutId;
  defaultData: Record<string, any>;
  editorCss: string;
  demoProducts: DemoStoreProductSeed[];
  pages: StorePage[];
  businessId?: string;
  initialPage?: string;
  initialPageId?: string;
  page?: string;
  pageId?: string;
  activePageId?: string;
  currentPageId?: string;
  mode?: string;
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
  isStudioStatic?: boolean;
};

type RichSort = "featured" | "price-asc" | "price-desc" | "name";

type RichSkin = {
  page: string;
  section: string;
  alt: string;
  dark: string;
  card: string;
  softCard: string;
  media: string;
  radius: string;
  grid: string;
  title: string;
  button: string;
  outlineButton: string;
  band: string;
  input: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function getValue(
  data: Record<string, any>,
  fallback: Record<string, any>,
  key: string,
) {
  const value = data?.[key];
  if (value === undefined || value === null || value === "") {
    return fallback?.[key] ?? "";
  }
  return value;
}

function sectionProps(id: string, kind: string, label: string) {
  return {
    "data-template-section-id": id,
    "data-template-section-type": kind,
    "data-section-kind": kind,
    "data-section-title": label,
    "data-bizuply-block":
      kind === "products" || kind === "store" ? "products" : "section",
    "data-bizuply-block-products":
      kind === "products" || kind === "store" ? "true" : undefined,
    "data-visual-edit-id": id,
    "data-visual-edit-type": "section",
    "data-visual-editable": "true",
  } as Record<string, string | undefined>;
}

/** Guaranteed image used when a remote asset fails — never show letter placeholders. */
const SAFE_IMAGE_FALLBACK =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";

const DEFAULT_PAGES: StorePage[] = [
  { id: "home", label: "בית", slug: "/" },
  { id: "shop", label: "חנות", slug: "/shop" },
  { id: "collections", label: "קולקציות", slug: "/collections" },
  { id: "product", label: "מוצר", slug: "/product" },
  { id: "cart", label: "סל", slug: "/cart" },
  { id: "lookbook", label: "לוקבוק", slug: "/lookbook" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "journal", label: "מגזין", slug: "/journal" },
  { id: "contact", label: "קשר", slug: "/contact" },
  { id: "faq", label: "שאלות", slug: "/faq" },
  { id: "shipping", label: "משלוחים", slug: "/shipping" },
];

const RICH_DEFAULTS: Record<string, string> = {
  brandName: "סטודיו מסחר עשיר",
  logoText: "R",
  tagline: "חנות חווייתית שנבנתה לעריכה מלאה",
  heroEyebrow: "קולקציה חדשה",
  heroTitle: "מרחב קניות עם סיפור, קצב ומוצרים שנראים נהדר",
  heroSubtitle:
    "תבנית חנות עשירה עם ניווט מלא, קטלוג חי, עגלת קניות ועיצוב משתנה לכל נישה.",
  heroPrimaryButton: "לגלות מוצרים",
  navShop: "חנות",
  navCart: "סל",
  navCollections: "קולקציות",
  promoText: "משלוח מהיר · מלאי מוגבל · קולקציה חדשה באתר",
  productsEyebrow: "בחירות החנות",
  productsTitle: "מוצרים שמובילים את הסיפור",
  productsText: "הקטלוג נטען מתוסף החנות או מנתוני הדמו של התבנית.",
  categoriesEyebrow: "קטגוריות",
  categoriesTitle: "אוספים לפי מצב רוח",
  categoriesText: "כל קטגוריה מובילה לעמוד החנות עם סינון פעיל.",
  catOne: "מהדורות חדשות",
  catTwo: "קלאסיקות",
  catThree: "מתנות",
  catFour: "אביזרים",
  aboutEyebrow: "מאחורי המותג",
  aboutTitle: "סטודיו שמחבר מוצר, שירות ואווירה",
  aboutText:
    "אנחנו בונים חוויית קנייה שמרגישה אישית: בחירה מדויקת, שפה חזותית ברורה ושירות שממשיך אחרי ההזמנה.",
  aboutTextTwo:
    "כל מוצר נבחר סביב שימוש אמיתי, חומרים טובים והבטחה ברורה ללקוח.",
  valueOneTitle: "אוצרות מדויקת",
  valueOneText: "מבחר קטן וחכם שמקל על קבלת החלטה.",
  valueTwoTitle: "שירות אנושי",
  valueTwoText: "מענה מהיר לפני ההזמנה ואחריה.",
  valueThreeTitle: "משלוח מוקפד",
  valueThreeText: "אריזה יפה, מעקב ברור והחלפות פשוטות.",
  journalEyebrow: "מגזין",
  journalTitle: "רעיונות, מדריכים וסיפורי מוצר",
  journalText: "תוכן קצר שמסביר איך לבחור, להשתמש ולשלב.",
  journalOneTitle: "איך בוחרים את הפריט הבא",
  journalOneText: "מדריך קצר לבחירה לפי שימוש, תקציב וסגנון אישי.",
  journalTwoTitle: "מאחורי הקולקציה",
  journalTwoText: "החומרים, הצבעים והבדיקות שהובילו לקו הנוכחי.",
  journalThreeTitle: "שלוש דרכים לשדרג את היום",
  journalThreeText: "רעיונות מהירים שמחברים מוצר להרגל יומיומי.",
  newsletterEyebrow: "מועדון",
  newsletterTitle: "עדכונים לפני כולם",
  newsletterText: "מבצעים, מהדורות מוגבלות ותוכן שימושי ישירות למייל.",
  newsletterButton: "להצטרפות",
  testimonialsEyebrow: "לקוחות",
  testimonialsTitle: "מה אומרים אחרי הרכישה",
  reviewOneName: "נועה",
  reviewOneText: "האתר ברור, המשלוח הגיע מהר והמוצר נראה בדיוק כמו בתמונה.",
  reviewTwoName: "דניאל",
  reviewTwoText: "הצלחתי להשוות, לשאול ולקבל המלצה מדויקת תוך כמה דקות.",
  reviewThreeName: "מיכל",
  reviewThreeText: "האריזה הייתה מוקפדת והחוויה הרגישה כמו בוטיק אמיתי.",
  productDetailOne: "חומרים שנבחרו לעמידות ושימוש יומיומי.",
  productDetailTwo: "בדיקות איכות לפני אריזה ומשלוח.",
  productDetailThree: "החלפה פשוטה ותמיכה אנושית בכל שאלה.",
  productFallbackText:
    "פריט נבחר מהקטלוג עם תיאור קצר, מחיר וכפתורי פעולה מלאים.",
  shopEyebrow: "קטלוג חי",
  shopTitle: "כל המוצרים במקום אחד",
  shopText:
    "חיפוש, סינון ומיון עובדים בזמן אמת ומחוברים למוצרי תוסף החנות.",
  collectionsEyebrow: "אוספים",
  collectionsTitle: "מסלולי קנייה מוכנים",
  collectionsText: "כל אוסף מציג מוצרים רלוונטיים, סיפור קצר וכניסה לחנות.",
  lookbookEyebrow: "לוקבוק",
  lookbookTitle: "רגעים מתוך העולם של המותג",
  lookbookText: "תמונות, סצנות ומוצרים שמראים איך הכל מתחבר.",
  contactEyebrow: "נשמח לעזור",
  contactTitle: "יצירת קשר עם החנות",
  contactText: "שאלות על מוצרים, משלוחים, התאמה אישית או הזמנה מיוחדת.",
  contactButton: "שליחת הודעה",
  phone: "03-555-0199",
  email: "hello@example.co.il",
  address: "רחוב הרצל 12, תל אביב",
  faqTitle: "שאלות נפוצות",
  faqText: "כל מה שכדאי לדעת לפני ואחרי ההזמנה.",
  faqOneQ: "איך יודעים שהמוצר במלאי?",
  faqOneA: "המלאי מתעדכן דרך תוסף החנות ובתצוגת הדמו מוצגים מוצרי דוגמה.",
  faqTwoQ: "אפשר להחליף מוצר?",
  faqTwoA: "כן, ניתן לתאם החלפה בהתאם למדיניות המשלוחים וההחזרות.",
  faqThreeQ: "כמה זמן לוקח משלוח?",
  faqThreeA: "רוב המשלוחים מגיעים בתוך כמה ימי עסקים, לפי אזור היעד.",
  faqFourQ: "אפשר לקבל עזרה בבחירה?",
  faqFourA: "כן, אפשר לפנות אלינו ונמליץ לפי צורך, תקציב וסגנון.",
  faqFiveQ: "האם המחירים כוללים מעמ?",
  faqFiveA: "כן, המחירים מוצגים בשקלים וכוללים מעמ אלא אם צוין אחרת.",
  shippingTitle: "משלוחים והחזרות",
  shippingText: "תהליך ברור מהסל ועד הדלת, עם עדכון בכל שלב.",
  shipOneTitle: "אריזה",
  shipOneText: "כל הזמנה נארזת בצורה בטוחה ויפה.",
  shipTwoTitle: "שילוח",
  shipTwoText: "מספר מעקב נשלח לאחר יציאת ההזמנה.",
  shipThreeTitle: "החלפות",
  shipThreeText: "אפשר לתאם החלפה קלה דרך שירות הלקוחות.",
  shipFourTitle: "איסוף",
  shipFourText: "בחלק מהאזורים ניתן לתאם איסוף עצמי.",
  shipBenefit: "משלוח מהיר",
  returnBenefit: "החלפה פשוטה",
  supportBenefit: "שירות אנושי",
  secureBenefit: "תשלום מאובטח",
  cartTitle: "סל הקניות",
  cartText: "עדכנו כמויות, הסירו מוצרים או המשיכו לתיאום הזמנה.",
  ctaTitle: "מוכנים לבחור?",
  ctaText: "עברו לחנות, סננו לפי קטגוריה והוסיפו פריטים לסל.",
  ctaButton: "פתיחת החנות",
  lookOne: "",
  lookTwo: "",
  lookThree: "",
  heroImage: "",
  aboutImage: "",
  catOneImage: "",
  catTwoImage: "",
  catThreeImage: "",
  catFourImage: "",
};

const FALLBACK_DEMO_PRODUCTS: DemoStoreProductSeed[] = [
  {
    name: "מהדורת חתימה",
    price: 189,
    compareAtPrice: 229,
    image: "",
    category: "מהדורות חדשות",
    badge: "חדש",
    featured: true,
    shortDescription: "הפריט שמוביל את הקולקציה הנוכחית.",
  },
  {
    name: "ערכת מתנה",
    price: 249,
    image: "",
    category: "מתנות",
    badge: "מומלץ",
    featured: true,
    shortDescription: "אריזה מוכנה למתנה עם שילוב פריטים מדויק.",
  },
  {
    name: "קלאסיקה יומית",
    price: 129,
    image: "",
    category: "קלאסיקות",
    shortDescription: "מוצר בסיס איכותי שחוזרים אליו שוב ושוב.",
  },
  {
    name: "אביזר משלים",
    price: 79,
    image: "",
    category: "אביזרים",
    shortDescription: "תוספת קטנה שמסדרת את כל החוויה.",
  },
  {
    name: "סט פרימיום",
    price: 349,
    compareAtPrice: 399,
    image: "",
    category: "מהדורות חדשות",
    badge: "מלאי מוגבל",
    featured: true,
    shortDescription: "סט עשיר ללקוחות שרוצים את כל הסיפור.",
  },
  {
    name: "בחירת הצוות",
    price: 159,
    image: "",
    category: "קלאסיקות",
    badge: "נבחר",
    shortDescription: "הפריט שהצוות ממליץ עליו לכניסה ראשונה למותג.",
  },
];

const SKINS: Record<RichStoreLayoutId, RichSkin> = {
  roastBar: {
    page: "bg-[#fff7ed] text-[#2a160b]",
    section: "bg-[#fff7ed]",
    alt: "bg-[#f7e5d1]",
    dark: "bg-[#2a160b] text-[#fff7ed]",
    card:
      "rounded-[1.5rem] border-amber-900/15 bg-[#fffaf4] shadow-[0_18px_45px_rgba(120,53,15,0.14)]",
    softCard: "rounded-[2rem] border-amber-900/10 bg-white/70",
    media: "aspect-[4/3] rounded-[1rem]",
    radius: "rounded-[1.5rem]",
    grid: "lg:grid-cols-4",
    title: "tracking-[-0.04em]",
    button: "rounded-full bg-[var(--p)] px-6 py-3 text-[var(--on-p)]",
    outlineButton:
      "rounded-full border border-amber-900/20 px-6 py-3 text-[#2a160b]",
    band: "bg-[#7c2d12] text-[#fff7ed]",
    input: "rounded-full border-amber-900/20 bg-white",
  },
  cellarVault: {
    page: "bg-[#f6efe6] text-[#241812]",
    section: "bg-[#f6efe6]",
    alt: "bg-[#eadcc8]",
    dark: "bg-[#1c1110] text-[#f6efe6]",
    card: "rounded-none border-[#5b211d]/25 bg-[#fffaf1] shadow-none",
    softCard: "rounded-t-full border-[#5b211d]/20 bg-white/60",
    media: "aspect-[3/4]",
    radius: "rounded-t-full",
    grid: "lg:grid-cols-3",
    title: "font-serif tracking-[-0.05em]",
    button: "bg-[#5b211d] px-6 py-3 text-[#fffaf1]",
    outlineButton: "border border-[#5b211d]/30 px-6 py-3",
    band: "bg-[#5b211d] text-[#fffaf1]",
    input: "border-[#5b211d]/25 bg-[#fffaf1]",
  },
  ridgeTrail: {
    page: "bg-[#f4f0e6] text-[#182117]",
    section: "bg-[#f4f0e6]",
    alt: "bg-[#dfe6d2]",
    dark: "bg-[#172013] text-[#f4f0e6]",
    card:
      "rounded-none border-[#172013]/25 bg-[#fffdf5] shadow-[8px_8px_0_rgba(23,32,19,0.14)]",
    softCard: "rounded-[0.75rem] border-[#172013]/20 bg-white/65",
    media: "aspect-[16/10]",
    radius: "rounded-[0.75rem]",
    grid: "lg:grid-cols-3",
    title: "uppercase tracking-[-0.04em]",
    button: "bg-[#314d2c] px-6 py-3 text-white",
    outlineButton: "border border-[#314d2c]/35 px-6 py-3",
    band: "bg-[#314d2c] text-white",
    input: "border-[#314d2c]/25 bg-white",
  },
  soundStage: {
    page: "bg-black text-white",
    section: "bg-black",
    alt: "bg-[#050915]",
    dark: "bg-[#03040a] text-white",
    card:
      "rounded-none border-cyan-300/25 bg-white/5 text-white shadow-[0_0_55px_rgba(34,211,238,0.16)] backdrop-blur",
    softCard: "rounded-[1rem] border-fuchsia-300/20 bg-white/10",
    media: "aspect-[16/9]",
    radius: "rounded-none",
    grid: "lg:grid-cols-4",
    title: "uppercase tracking-[-0.06em]",
    button: "bg-cyan-300 px-6 py-3 text-black shadow-[0_0_24px_rgba(34,211,238,0.45)]",
    outlineButton: "border border-cyan-300/40 px-6 py-3 text-cyan-100",
    band: "bg-cyan-300 text-black",
    input: "border-cyan-300/30 bg-white/10 text-white placeholder:text-white/50",
  },
  veloTrack: {
    page: "bg-[#f8fafc] text-[#111827]",
    section: "bg-[#f8fafc]",
    alt: "bg-[#e2e8f0]",
    dark: "bg-[#0f172a] text-white",
    card:
      "rounded-[0.5rem] border-slate-900/20 bg-white shadow-[12px_12px_0_rgba(15,23,42,0.10)]",
    softCard: "rounded-[1rem] border-slate-900/15 bg-white",
    media: "aspect-[5/3]",
    radius: "rounded-[0.5rem]",
    grid: "lg:grid-cols-4",
    title: "italic tracking-[-0.06em]",
    button: "skew-x-[-10deg] bg-[var(--p)] px-6 py-3 text-[var(--on-p)]",
    outlineButton: "skew-x-[-10deg] border border-slate-900/20 px-6 py-3",
    band: "bg-[#ef4444] text-white",
    input: "rounded-none border-slate-900/20 bg-white",
  },
  greenhouseGrid: {
    page: "bg-[#f0f8ea] text-[#15371f]",
    section: "bg-[#f0f8ea]",
    alt: "bg-[#dcefd2]",
    dark: "bg-[#15371f] text-[#f0f8ea]",
    card:
      "rounded-[2rem] border-emerald-900/15 bg-white/75 shadow-[0_22px_60px_rgba(21,128,61,0.13)]",
    softCard: "rounded-[2.5rem] border-emerald-900/10 bg-white/60",
    media: "aspect-square rounded-[2rem]",
    radius: "rounded-[2rem]",
    grid: "lg:grid-cols-3",
    title: "tracking-[-0.05em]",
    button: "rounded-full bg-[#2f6f3e] px-6 py-3 text-white",
    outlineButton: "rounded-full border border-emerald-900/20 px-6 py-3",
    band: "bg-[#2f6f3e] text-white",
    input: "rounded-full border-emerald-900/20 bg-white",
  },
  toyArcade: {
    page: "bg-[#fff7fb] text-[#27122d]",
    section: "bg-[#fff7fb]",
    alt: "bg-[#ffe86b]",
    dark: "bg-[#27122d] text-white",
    card:
      "rounded-[2rem] border-[#27122d] bg-white shadow-[8px_8px_0_rgba(236,72,153,0.35)]",
    softCard: "rounded-[2rem] border-[#27122d]/20 bg-white",
    media: "aspect-square rounded-[1.5rem]",
    radius: "rounded-[2rem]",
    grid: "lg:grid-cols-4",
    title: "tracking-[-0.05em]",
    button: "rounded-full bg-[#ff3ea5] px-6 py-3 text-white",
    outlineButton: "rounded-full border-2 border-[#27122d] px-6 py-3",
    band: "bg-[#ffe86b] text-[#27122d]",
    input: "rounded-full border-[#27122d]/25 bg-white",
  },
  chefAtelier: {
    page: "bg-[#fbf3e6] text-[#21150f]",
    section: "bg-[#fbf3e6]",
    alt: "bg-[#efe0c9]",
    dark: "bg-[#21150f] text-[#fbf3e6]",
    card: "rounded-none border-[#21150f]/20 bg-[#fffaf2] shadow-none",
    softCard: "rounded-[0.75rem] border-[#21150f]/15 bg-white/70",
    media: "aspect-[4/5]",
    radius: "rounded-none",
    grid: "lg:grid-cols-3",
    title: "font-serif tracking-[-0.05em]",
    button: "bg-[#b45309] px-6 py-3 text-white",
    outlineButton: "border border-[#21150f]/25 px-6 py-3",
    band: "bg-[#b45309] text-white",
    input: "border-[#21150f]/20 bg-[#fffaf2]",
  },
  streetDrop: {
    page: "bg-[#f5f5f4] text-[#09090b]",
    section: "bg-[#f5f5f4]",
    alt: "bg-[#e7e5e4]",
    dark: "bg-[#09090b] text-white",
    card:
      "rounded-none border-black bg-white shadow-[10px_10px_0_rgba(0,0,0,0.18)]",
    softCard: "rounded-none border-black bg-white",
    media: "aspect-[4/3]",
    radius: "rounded-none",
    grid: "lg:grid-cols-4",
    title: "uppercase tracking-[-0.08em]",
    button: "bg-[#09090b] px-6 py-3 text-white",
    outlineButton: "border-2 border-black px-6 py-3",
    band: "bg-[#09090b] text-white",
    input: "rounded-none border-black bg-white",
  },
  aromaSalon: {
    page: "bg-[#fbf5f7] text-[#2f1723]",
    section: "bg-[#fbf5f7]",
    alt: "bg-[#f2e3e8]",
    dark: "bg-[#2f1723] text-[#fbf5f7]",
    card:
      "rounded-[2.5rem] border-rose-900/10 bg-white/75 shadow-[0_30px_80px_rgba(190,24,93,0.10)]",
    softCard: "rounded-[3rem] border-rose-900/10 bg-white/55",
    media: "aspect-[3/4] rounded-[2rem]",
    radius: "rounded-[2.5rem]",
    grid: "lg:grid-cols-3",
    title: "font-serif tracking-[-0.06em]",
    button: "rounded-full bg-[#9f4668] px-6 py-3 text-white",
    outlineButton: "rounded-full border border-rose-900/20 px-6 py-3",
    band: "bg-[#9f4668] text-white",
    input: "rounded-full border-rose-900/20 bg-white",
  },
  runwayRail: {
    page: "bg-[#fafaf9] text-[#111827]",
    section: "bg-[#fafaf9]",
    alt: "bg-[#f5f5f4]",
    dark: "bg-[#0c0a09] text-white",
    card: "rounded-none border-stone-900/15 bg-white shadow-none",
    softCard: "rounded-none border-stone-900/10 bg-white",
    media: "aspect-[3/4]",
    radius: "rounded-none",
    grid: "lg:grid-cols-4",
    title: "font-serif tracking-[-0.06em]",
    button: "bg-[#111827] px-6 py-3 text-white",
    outlineButton: "border border-stone-900/25 px-6 py-3",
    band: "bg-[#111827] text-white",
    input: "border-stone-900/20 bg-white",
  },
  indigoStack: {
    page: "bg-[#f8fafc] text-[#0f172a]",
    section: "bg-[#f8fafc]",
    alt: "bg-[#e2e8f0]",
    dark: "bg-[#1e3a8a] text-white",
    card: "rounded-[0.25rem] border-blue-900/20 bg-white shadow-[6px_6px_0_rgba(30,58,138,0.18)]",
    softCard: "rounded-[0.5rem] border-blue-900/15 bg-white",
    media: "aspect-[4/5]",
    radius: "rounded-[0.25rem]",
    grid: "lg:grid-cols-3",
    title: "uppercase tracking-[-0.05em]",
    button: "bg-[#1e3a8a] px-6 py-3 text-white",
    outlineButton: "border border-blue-900/30 px-6 py-3",
    band: "bg-[#f59e0b] text-[#0f172a]",
    input: "border-blue-900/20 bg-white",
  },
  lastBench: {
    page: "bg-[#fffbeb] text-[#451a03]",
    section: "bg-[#fffbeb]",
    alt: "bg-[#fef3c7]",
    dark: "bg-[#1c1917] text-[#fffbeb]",
    card: "rounded-[1rem] border-amber-900/15 bg-[#fffdf5] shadow-[0_16px_40px_rgba(120,53,15,0.12)]",
    softCard: "rounded-[1.25rem] border-amber-900/10 bg-white/80",
    media: "aspect-[5/4]",
    radius: "rounded-[1rem]",
    grid: "lg:grid-cols-4",
    title: "font-serif tracking-[-0.04em]",
    button: "rounded-full bg-[#78350f] px-6 py-3 text-[#fffbeb]",
    outlineButton: "rounded-full border border-amber-900/25 px-6 py-3",
    band: "bg-[#78350f] text-[#fffbeb]",
    input: "rounded-full border-amber-900/20 bg-white",
  },
  courtDrop: {
    page: "bg-[#fafafa] text-[#09090b]",
    section: "bg-[#fafafa]",
    alt: "bg-[#e4e4e7]",
    dark: "bg-[#09090b] text-white",
    card: "rounded-none border-2 border-black bg-white shadow-[8px_8px_0_#22d3ee]",
    softCard: "rounded-none border-2 border-black bg-white",
    media: "aspect-square",
    radius: "rounded-none",
    grid: "lg:grid-cols-4",
    title: "uppercase tracking-[-0.08em]",
    button: "bg-[#09090b] px-6 py-3 text-white",
    outlineButton: "border-2 border-black px-6 py-3",
    band: "bg-[#22d3ee] text-black",
    input: "rounded-none border-2 border-black bg-white",
  },
  luxeVitrine: {
    page: "bg-[#fffbeb] text-[#1c1917]",
    section: "bg-[#fffbeb]",
    alt: "bg-[#fef3c7]",
    dark: "bg-[#0c0a09] text-[#fde68a]",
    card: "rounded-[2rem] border-amber-700/20 bg-white/80 shadow-[0_28px_70px_rgba(161,98,7,0.12)]",
    softCard: "rounded-[2.5rem] border-amber-700/15 bg-white/60",
    media: "aspect-[3/4] rounded-[1.5rem]",
    radius: "rounded-[2rem]",
    grid: "lg:grid-cols-3",
    title: "font-serif tracking-[-0.05em]",
    button: "rounded-full bg-[#a16207] px-6 py-3 text-white",
    outlineButton: "rounded-full border border-amber-700/30 px-6 py-3",
    band: "bg-[#a16207] text-[#fffbeb]",
    input: "rounded-full border-amber-700/20 bg-white",
  },
  roomShelf: {
    page: "bg-[#f0fdfa] text-[#134e4a]",
    section: "bg-[#f0fdfa]",
    alt: "bg-[#ccfbf1]",
    dark: "bg-[#042f2e] text-[#f0fdfa]",
    card: "rounded-[1.25rem] border-teal-900/15 bg-white shadow-[0_18px_44px_rgba(15,118,110,0.12)]",
    softCard: "rounded-[1.5rem] border-teal-900/10 bg-white/70",
    media: "aspect-[4/3] rounded-[1rem]",
    radius: "rounded-[1.25rem]",
    grid: "lg:grid-cols-4",
    title: "tracking-[-0.04em]",
    button: "rounded-[0.75rem] bg-[#0f766e] px-6 py-3 text-white",
    outlineButton: "rounded-[0.75rem] border border-teal-900/25 px-6 py-3",
    band: "bg-[#0f766e] text-white",
    input: "rounded-[0.75rem] border-teal-900/20 bg-white",
  },
  softFold: {
    page: "bg-[#fff7ed] text-[#7c2d12]",
    section: "bg-[#fff7ed]",
    alt: "bg-[#ffedd5]",
    dark: "bg-[#431407] text-[#fff7ed]",
    card: "rounded-[2.5rem] border-orange-900/10 bg-white/75 shadow-[0_24px_60px_rgba(154,52,18,0.10)]",
    softCard: "rounded-[3rem] border-orange-900/10 bg-white/55",
    media: "aspect-[4/5] rounded-[2rem]",
    radius: "rounded-[2.5rem]",
    grid: "lg:grid-cols-3",
    title: "font-serif tracking-[-0.05em]",
    button: "rounded-full bg-[#9a3412] px-6 py-3 text-white",
    outlineButton: "rounded-full border border-orange-900/20 px-6 py-3",
    band: "bg-[#9a3412] text-white",
    input: "rounded-full border-orange-900/20 bg-white",
  },
  cleanCabinet: {
    page: "bg-[#f0f9ff] text-[#0c4a6e]",
    section: "bg-[#f0f9ff]",
    alt: "bg-[#e0f2fe]",
    dark: "bg-[#082f49] text-[#f0f9ff]",
    card: "rounded-[1rem] border-sky-900/15 bg-white shadow-[0_14px_36px_rgba(3,105,161,0.10)]",
    softCard: "rounded-[1.25rem] border-sky-900/10 bg-white",
    media: "aspect-square rounded-[1rem]",
    radius: "rounded-[1rem]",
    grid: "lg:grid-cols-4",
    title: "tracking-[-0.03em]",
    button: "rounded-[0.5rem] bg-[#0369a1] px-6 py-3 text-white",
    outlineButton: "rounded-[0.5rem] border border-sky-900/25 px-6 py-3",
    band: "bg-[#34d399] text-[#082f49]",
    input: "rounded-[0.5rem] border-sky-900/20 bg-white",
  },
  doseGrid: {
    page: "bg-[#f7fee7] text-[#14532d]",
    section: "bg-[#f7fee7]",
    alt: "bg-[#ecfccb]",
    dark: "bg-[#052e16] text-[#f7fee7]",
    card: "rounded-[0.75rem] border-lime-900/15 bg-white shadow-[4px_4px_0_rgba(21,128,61,0.18)]",
    softCard: "rounded-[1rem] border-lime-900/10 bg-white",
    media: "aspect-[4/3]",
    radius: "rounded-[0.75rem]",
    grid: "lg:grid-cols-4",
    title: "tracking-[-0.04em]",
    button: "bg-[#15803d] px-6 py-3 text-white",
    outlineButton: "border border-lime-900/25 px-6 py-3",
    band: "bg-[#a3e635] text-[#14532d]",
    input: "border-lime-900/20 bg-white",
  },
  strapStudio: {
    page: "bg-[#fff7ed] text-[#431407]",
    section: "bg-[#fff7ed]",
    alt: "bg-[#ffedd5]",
    dark: "bg-[#1c1917] text-[#fff7ed]",
    card: "rounded-none border-[#7c2d12]/25 bg-[#fffaf2] shadow-none",
    softCard: "rounded-t-[2rem] border-[#7c2d12]/15 bg-white/70",
    media: "aspect-[3/4]",
    radius: "rounded-t-[2rem]",
    grid: "lg:grid-cols-3",
    title: "font-serif tracking-[-0.05em]",
    button: "bg-[#7c2d12] px-6 py-3 text-white",
    outlineButton: "border border-[#7c2d12]/30 px-6 py-3",
    band: "bg-[#fb923c] text-[#431407]",
    input: "border-[#7c2d12]/20 bg-[#fffaf2]",
  },
  dialAtelier: {
    page: "bg-[#f3f4f6] text-[#111827]",
    section: "bg-[#f3f4f6]",
    alt: "bg-[#e5e7eb]",
    dark: "bg-[#030712] text-[#d4af37]",
    card: "rounded-full border-stone-900/15 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.10)]",
    softCard: "rounded-[2rem] border-stone-900/10 bg-white/80",
    media: "aspect-square rounded-full",
    radius: "rounded-full",
    grid: "lg:grid-cols-3",
    title: "font-serif tracking-[-0.06em]",
    button: "rounded-full bg-[#1f2937] px-6 py-3 text-[#d4af37]",
    outlineButton: "rounded-full border border-stone-900/25 px-6 py-3",
    band: "bg-[#1f2937] text-[#d4af37]",
    input: "rounded-full border-stone-900/20 bg-white",
  },
  quietLounge: {
    page: "bg-[#faf5ff] text-[#4c1d95]",
    section: "bg-[#faf5ff]",
    alt: "bg-[#ede9fe]",
    dark: "bg-[#2e1065] text-[#faf5ff]",
    card: "rounded-[2rem] border-violet-900/10 bg-white/80 shadow-[0_26px_70px_rgba(91,33,182,0.12)]",
    softCard: "rounded-[2.5rem] border-violet-900/10 bg-white/60",
    media: "aspect-[4/5] rounded-[2rem]",
    radius: "rounded-[2rem]",
    grid: "lg:grid-cols-3",
    title: "font-serif tracking-[-0.05em]",
    button: "rounded-full bg-[#5b21b6] px-6 py-3 text-white",
    outlineButton: "rounded-full border border-violet-900/20 px-6 py-3",
    band: "bg-[#5b21b6] text-white",
    input: "rounded-full border-violet-900/20 bg-white",
  },
};

function StoreImage({
  src,
  alt,
  className,
  fallbackLabel: _fallbackLabel,
  fallbackClassName: _fallbackClassName,
}: {
  src?: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
  fallbackClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  const resolved = String(src || "").trim();

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <img
      src={!resolved || failed ? SAFE_IMAGE_FALLBACK : resolved}
      alt={alt}
      className={className}
      onError={(event) => {
        const el = event.currentTarget;
        if (el.dataset.fallback === "1") return;
        el.dataset.fallback = "1";
        setFailed(true);
        el.src = SAFE_IMAGE_FALLBACK;
      }}
    />
  );
}

function SectionHeading({
  eyebrow,
  title,
  text,
  skin,
  align = "right",
  giant = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  skin: RichSkin;
  align?: "right" | "center";
  giant?: boolean;
  className?: string;
}) {
  return (
    <Reveal
      className={cx(
        align === "center"
          ? "mx-auto max-w-3xl text-center"
          : "max-w-3xl text-right",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={cx(
          "store-display mt-3 font-black leading-tight",
          giant ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl",
          skin.title,
        )}
      >
        {title}
      </h2>
      {text ? (
        <p className="mt-4 text-base leading-8 text-[var(--muted)]">{text}</p>
      ) : null}
    </Reveal>
  );
}

function ProductCard({
  product,
  currency,
  skin,
  onOpen,
  onAdd,
  index = 0,
  className,
}: {
  product: StoreCatalogProduct;
  currency: string;
  skin: RichSkin;
  onOpen: () => void;
  onAdd: () => void;
  index?: number;
  className?: string;
}) {
  return (
    <Reveal
      delayMs={(index % 6) * 70}
      variant={index % 2 === 0 ? "up" : "scale"}
      className="h-full"
    >
      <article
        className={cx(
          "store-card group flex h-full flex-col overflow-hidden border p-2 text-right transition duration-300 hover:-translate-y-1",
          skin.card,
          className,
        )}
      >
        <button type="button" onClick={onOpen} className="relative block text-start">
          <div className={cx("store-media relative w-full overflow-hidden", skin.media)}>
            <StoreImage
              src={product.image}
              alt={product.name}
              fallbackLabel={product.name}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          {product.badge ? (
            <span className="absolute start-4 top-4 bg-[var(--p)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--on-p)]">
              {product.badge}
            </span>
          ) : null}
        </button>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
            {product.category}
          </p>
          <button
            type="button"
            onClick={onOpen}
            className="store-display text-start text-xl font-black leading-tight"
          >
            {product.name}
          </button>
          <p className="line-clamp-2 text-sm leading-6 text-[var(--muted)]">
            {product.shortDescription}
          </p>
          <div className="mt-auto flex items-end justify-between gap-3">
            <div>
              <p className="text-lg font-black text-[var(--p)]">
                {formatStorePrice(product.price, currency)}
              </p>
              {product.compareAtPrice ? (
                <p className="text-xs text-[var(--muted)] line-through">
                  {formatStorePrice(product.compareAtPrice, currency)}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onAdd}
              className={cx(
                "text-xs font-black uppercase tracking-[0.14em]",
                skin.button,
              )}
            >
              הוסף
            </button>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function StatPill({
  value,
  label,
  skin,
  className,
}: {
  value: string;
  label: string;
  skin: RichSkin;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "border border-[var(--line)] bg-[var(--surface)]/75 p-5 text-right",
        skin.softCard,
        className,
      )}
    >
      <p className={cx("store-display text-3xl font-black text-[var(--p)]", skin.title)}>
        {value}
      </p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </p>
    </div>
  );
}

export default function RichStoreSiteRuntime({
  templateId,
  layout,
  defaultData,
  editorCss,
  demoProducts,
  pages,
  businessId,
  data,
  isStudioStatic = false,
  ...navProps
}: RichStoreSiteRuntimeProps) {
  const layoutId = resolveRichStoreLayout(templateId, layout);
  const skin = SKINS[layoutId];
  const pageItems = pages?.length ? pages : DEFAULT_PAGES;
  const mergedData = useMemo(
    () => ({ ...RICH_DEFAULTS, ...defaultData, ...(data || {}) }),
    [data, defaultData],
  );
  const g = (key: string) =>
    String(getValue(mergedData, RICH_DEFAULTS, key) || "");

  const allowedPages = pageItems.map((p) => p.id);
  const { currentPage, goTo: navigatePage } = useTemplatePageNavigation(navProps, {
    allowedPages,
    fallbackPage: "home",
  });

  const { products, categories, loading, fromPlugin, currency } =
    useStorePluginCatalog({
      businessId,
      demoProducts: demoProducts?.length ? demoProducts : FALLBACK_DEMO_PRODUCTS,
      enabled: !isStudioStatic,
    });

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<RichSort>("featured");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [cart, setCart] = useState<RichStoreCartItem[]>([]);
  const [qty, setQty] = useState(1);
  const [stockMessage, setStockMessage] = useState("");
  const [navOpen, setNavOpen] = useState(false);

  const goToPage = (pageId: string) => {
    setNavOpen(false);
    navigatePage(pageId);
  };

  useEffect(() => {
    if (!selectedProductId && products[0]) {
      setSelectedProductId(products[0].id);
    }
  }, [products, selectedProductId]);

  useEffect(() => {
    const product =
      products.find((entry) => entry.id === selectedProductId) || null;
    if (!product) {
      setSelectedVariantId("");
      return;
    }
    const firstAvailable =
      product.variants.find(
        (variant) =>
          !product.trackStock ||
          product.allowBackorder ||
          variant.stock > 0
      ) || product.variants[0];
    setSelectedVariantId(firstAvailable?.id || "");
    setStockMessage("");
  }, [selectedProductId, products]);

  const fallbackCategoryImages = [
    g("catOneImage"),
    g("catTwoImage"),
    g("catThreeImage"),
    g("catFourImage"),
  ];

  const categoryTiles: StoreCatalogCategory[] = (
    categories.length
      ? categories.map((cat, index) => ({
          ...cat,
          image:
            cat.image ||
            fallbackCategoryImages[index % fallbackCategoryImages.length] ||
            g("heroImage") ||
            SAFE_IMAGE_FALLBACK,
        }))
      : [
          { id: "cat-one", name: g("catOne"), slug: "new", image: g("catOneImage") || SAFE_IMAGE_FALLBACK },
          { id: "cat-two", name: g("catTwo"), slug: "classic", image: g("catTwoImage") || SAFE_IMAGE_FALLBACK },
          { id: "cat-three", name: g("catThree"), slug: "gifts", image: g("catThreeImage") || SAFE_IMAGE_FALLBACK },
          { id: "cat-four", name: g("catFour"), slug: "accessories", image: g("catFourImage") || SAFE_IMAGE_FALLBACK },
        ]
  ).slice(0, 6);

  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (activeCategory !== "all") {
      list = list.filter(
        (p) => p.categorySlug === activeCategory || p.category === activeCategory,
      );
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((tag) => tag.toLowerCase().includes(q)),
      );
    }
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "he"));
    if (sort === "featured") {
      list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [activeCategory, products, search, sort]);

  const featured = useMemo(
    () => products.filter((p) => p.featured).slice(0, 8),
    [products],
  );
  const showcase = featured.length ? featured : products.slice(0, 8);
  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || products[0] || null;
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const pickProduct = (index: number) => {
    if (!products.length) return null;
    return products[index % products.length];
  };

  const openProduct = (product: StoreCatalogProduct) => {
    setSelectedProductId(product.id);
    setQty(1);
    goToPage("product");
  };

  const addToCart = (
    product: StoreCatalogProduct,
    amount = 1,
    variantId?: string
  ) => {
    if (product.variants.length > 0 && !variantId && product.id !== selectedProductId) {
      openProduct(product);
      setStockMessage("בחרו וריאציה לפני הוספה לסל");
      return;
    }

    const resolvedVariantId =
      variantId ||
      (product.id === selectedProductId ? selectedVariantId : "") ||
      product.variants.find(
        (entry) =>
          !product.trackStock || product.allowBackorder || entry.stock > 0
      )?.id ||
      "";

    const variant =
      product.variants.find((entry) => entry.id === resolvedVariantId) || null;

    if (product.variants.length > 0 && !variant) {
      setStockMessage("בחרו וריאציה לפני הוספה לסל");
      return;
    }

    const available = variant
      ? variant.stock
      : product.stock;
    const unitPrice =
      variant?.price !== undefined ? variant.price : product.price;
    const cartKey = variant
      ? `${product.id}:${variant.id}`
      : product.id;

    if (
      product.trackStock &&
      !product.allowBackorder &&
      (!product.inStock || available < amount)
    ) {
      setStockMessage(
        available <= 0
          ? `"${product.name}" אזל מהמלאי`
          : `מלאי לא מספיק. זמין: ${available}`
      );
      return;
    }

    setStockMessage("");
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartKey);
      if (existing) {
        const nextQty = existing.qty + amount;
        if (
          product.trackStock &&
          !product.allowBackorder &&
          nextQty > available
        ) {
          setStockMessage(`מלאי לא מספיק. זמין: ${available}`);
          return prev;
        }
        return prev.map((item) =>
          item.id === cartKey ? { ...item, qty: nextQty } : item
        );
      }
      return [
        ...prev,
        {
          id: cartKey,
          productId: product.id,
          name: product.name,
          price: unitPrice,
          image: product.image,
          qty: amount,
          variantId: variant?.id,
          variantLabel: variant?.label,
          sku: variant?.sku || product.sku,
        },
      ];
    });
  };

  const openCheckout = () => {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent("bizuply:open-checkout", {
        detail: {
          items: cart.map((item) => ({
            productId: item.productId || item.id,
            name: item.name,
            price: item.price,
            quantity: item.qty,
            image: item.image,
            variantId: item.variantId,
            variantLabel: item.variantLabel,
            sku: item.sku,
            custom: !/^[a-f\d]{24}$/i.test(item.productId || item.id),
          })),
        },
      })
    );
  };

  const navigateCategory = (cat: StoreCatalogCategory) => {
    setActiveCategory(cat.slug || "all");
    goToPage("shop");
  };

  const pageLabel = (id: string) =>
    pageItems.find((page) => page.id === id)?.label ||
    DEFAULT_PAGES.find((page) => page.id === id)?.label ||
    id;

  const navItems = pageItems
    .filter((item) => item.id !== "product" && item.id !== "cart")
    .slice(0, 8);

  const Header = (
    <header
      {...sectionProps("header", "header", "כותרת")}
      className="store-header sticky top-0 z-50 border-b border-[var(--line)] bg-[var(--surface)]/90 backdrop-blur-xl"
      data-visual-flow-lock="true"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
        <button type="button" onClick={() => goToPage("home")} className="text-right">
          <div className="flex items-center gap-3">
            <span className="store-logo grid h-11 w-11 place-items-center bg-[var(--p)] text-sm font-black text-[var(--on-p)]">
              {g("logoText")}
            </span>
            <div>
              <p className={cx("store-display text-xl font-black leading-none", skin.title)}>
                {g("brandName")}
              </p>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--muted)]">
                {g("tagline")}
              </p>
            </div>
          </div>
        </button>
        <nav className="hidden items-center gap-4 xl:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToPage(item.id)}
              className={cx(
                "text-[11px] font-black uppercase tracking-[0.16em] transition",
                currentPage === item.id
                  ? "text-[var(--p)]"
                  : "opacity-70 hover:opacity-100",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => goToPage("shop")}
            className={cx(
              "hidden text-[11px] font-black uppercase tracking-[0.14em] md:inline-flex",
              skin.outlineButton,
            )}
          >
            {g("navShop")}
          </button>
          <button
            type="button"
            onClick={() => goToPage("cart")}
            className="relative bg-[var(--dark)] px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.14em] text-white"
          >
            {g("navCart")}
            {cartCount > 0 ? (
              <span className="absolute -start-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--p)] px-1 text-[10px] text-[var(--on-p)]">
                {cartCount}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            aria-expanded={navOpen}
            aria-label={navOpen ? "סגור תפריט" : "פתח תפריט"}
            onClick={() => setNavOpen((open) => !open)}
            className={cx("inline-flex h-10 w-10 items-center justify-center xl:hidden", skin.outlineButton)}
          >
            <span className="flex w-4 flex-col gap-1">
              <span className={cx("h-0.5 bg-current transition", navOpen && "translate-y-1.5 rotate-45")} />
              <span className={cx("h-0.5 bg-current transition", navOpen && "opacity-0")} />
              <span className={cx("h-0.5 bg-current transition", navOpen && "-translate-y-1.5 -rotate-45")} />
            </span>
          </button>
        </div>
      </div>
      {navOpen ? (
        <nav className="border-t border-[var(--line)] bg-[var(--surface)] px-5 py-4 xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {navItems.map((item) => (
              <button
                key={`mobile-${item.id}`}
                type="button"
                onClick={() => goToPage(item.id)}
                className={cx(
                  "rounded-lg px-4 py-3 text-right text-sm font-black transition",
                  currentPage === item.id
                    ? "bg-[var(--p)] text-[var(--on-p)]"
                    : "bg-[var(--bg-soft)]",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );

  const Footer = (
    <footer
      {...sectionProps("footer", "footer", "פוטר")}
      className="border-t border-[var(--line)] bg-[var(--dark)] px-5 py-14 text-white lg:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
        <div className="text-right md:col-span-2">
          <p className={cx("store-display text-3xl font-black", skin.title)}>
            {g("brandName")}
          </p>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
            {g("aboutText")}
          </p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent)]">
            {fromPlugin
              ? "מציג את המוצרים מניהול החנות שלך"
              : "מצב דמו — הוסיפו מוצרים בפאנל חנות בעורך כדי להחליף את הדוגמאות"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
            ניווט
          </p>
          <div className="mt-4 grid gap-2">
            {pageItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToPage(item.id)}
                className="text-start text-sm opacity-80 hover:opacity-100"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
            יצירת קשר
          </p>
          <p className="mt-4 text-sm">{g("phone")}</p>
          <p className="mt-2 text-sm">{g("email")}</p>
          <p className="mt-2 text-sm text-white/70">{g("address")}</p>
        </div>
      </div>
    </footer>
  );

  const CategoryTile = ({
    cat,
    index,
    className,
  }: {
    cat: StoreCatalogCategory;
    index: number;
    className?: string;
  }) => (
    <Reveal delayMs={index * 70} variant={index % 2 ? "left" : "right"}>
      <button
        type="button"
        onClick={() => navigateCategory(cat)}
        className={cx(
          "store-card group relative w-full overflow-hidden border border-[var(--line)] text-right",
          skin.radius,
          className,
        )}
      >
        <StoreImage
          src={
            cat.image ||
            fallbackCategoryImages[index % fallbackCategoryImages.length] ||
            g("heroImage")
          }
          alt={cat.name}
          fallbackLabel={cat.name}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className={cx("store-display text-2xl font-black", skin.title)}>
            {cat.name}
          </p>
          <p className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-white/70">
            לצפייה בקטגוריה
          </p>
        </div>
      </button>
    </Reveal>
  );

  const ProductRail = ({
    id,
    label,
    title,
    text,
    productsToShow = showcase,
    className,
    railClassName,
  }: {
    id: string;
    label: string;
    title: string;
    text?: string;
    productsToShow?: StoreCatalogProduct[];
    className?: string;
    railClassName?: string;
  }) => (
    <section
      {...sectionProps(id, "products", label)}
      className={cx("px-5 py-20 lg:px-8", className)}
      data-bizuply-widget="products"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow={g("productsEyebrow")}
            title={title}
            text={text}
            skin={skin}
          />
          <button
            type="button"
            onClick={() => goToPage("shop")}
            className={cx("text-xs font-black uppercase tracking-[0.16em]", skin.outlineButton)}
          >
            לכל המוצרים
          </button>
        </div>
        {loading ? (
          <p className="mt-10 text-sm text-[var(--muted)]">
            טוען מוצרים מתוסף החנות...
          </p>
        ) : (
          <div
            className={cx(
              "mt-12 grid gap-5 sm:grid-cols-2",
              skin.grid,
              railClassName,
            )}
          >
            {productsToShow.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                currency={currency}
                skin={skin}
                index={index}
                onOpen={() => openProduct(product)}
                onAdd={() => addToCart(product)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );

  const ValuesSection = ({
    id,
    className,
  }: {
    id: string;
    className?: string;
  }) => (
    <section
      {...sectionProps(id, "values", "ערכי מותג")}
      className={cx("px-5 py-20 lg:px-8", className)}
    >
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">
        {[
          [g("valueOneTitle"), g("valueOneText")],
          [g("valueTwoTitle"), g("valueTwoText")],
          [g("valueThreeTitle"), g("valueThreeText")],
        ].map(([title, text], index) => (
          <Reveal key={title} delayMs={index * 80}>
            <article className={cx("h-full border p-7 text-right", skin.card)}>
              <p className="text-sm font-black text-[var(--p)]">0{index + 1}</p>
              <h3 className={cx("store-display mt-4 text-2xl font-black", skin.title)}>
                {title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );

  const TestimonialsSection = ({
    id,
    className,
  }: {
    id: string;
    className?: string;
  }) => (
    <section
      {...sectionProps(id, "testimonials", "המלצות")}
      className={cx("px-5 py-20 lg:px-8", skin.dark, className)}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow={g("testimonialsEyebrow")}
          title={g("testimonialsTitle")}
          skin={skin}
          align="center"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            [g("reviewOneName"), g("reviewOneText")],
            [g("reviewTwoName"), g("reviewTwoText")],
            [g("reviewThreeName"), g("reviewThreeText")],
          ].map(([name, text], index) => (
            <Reveal key={name} delayMs={index * 90} variant="scale">
              <blockquote className="h-full border border-white/15 bg-white/5 p-7 text-right backdrop-blur">
                <p className="text-sm leading-7 text-white/80">"{text}"</p>
                <footer className="mt-6 text-sm font-black text-[var(--accent)]">
                  {name}
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );

  const journalPosts = [
    { title: g("journalOneTitle"), text: g("journalOneText"), image: g("lookOne"), tag: "מדריך" },
    { title: g("journalTwoTitle"), text: g("journalTwoText"), image: g("lookTwo"), tag: "סיפור" },
    { title: g("journalThreeTitle"), text: g("journalThreeText"), image: g("lookThree"), tag: "טיפים" },
  ];

  const JournalSection = ({
    id,
    className,
    showHeading = true,
  }: {
    id: string;
    className?: string;
    showHeading?: boolean;
  }) => (
    <section
      {...sectionProps(id, "journal", "מגזין")}
      className={cx("px-5 py-20 lg:px-8", className)}
    >
      <div className="mx-auto max-w-7xl">
        {showHeading ? (
          <SectionHeading
            eyebrow={g("journalEyebrow")}
            title={g("journalTitle")}
            text={g("journalText")}
            skin={skin}
          />
        ) : null}
        <div className={cx("grid gap-5 lg:grid-cols-12", showHeading ? "mt-12" : "mt-0")}>
          {journalPosts.map((post, index) => {
            const featured = index === 0;
            return (
              <Reveal
                key={`${id}-${post.title}`}
                delayMs={index * 80}
                className={featured ? "lg:col-span-12" : "lg:col-span-6"}
              >
                <article
                  className={cx(
                    "group overflow-hidden border",
                    skin.card,
                    featured && "lg:grid lg:grid-cols-2",
                  )}
                >
                  <div
                    className={cx(
                      "journal-card-media relative overflow-hidden bg-[var(--bg-soft)]",
                      featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]" : "aspect-[16/10]",
                    )}
                  >
                    <StoreImage
                      src={post.image}
                      alt={post.title}
                      fallbackLabel={post.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className={cx("flex flex-col justify-center text-right", featured ? "p-6 sm:p-8 lg:p-10" : "p-5 sm:p-6")}>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[var(--p)]">
                      {post.tag}
                    </p>
                    <h3
                      className={cx(
                        "store-display mt-3 font-black leading-tight",
                        featured ? "text-2xl sm:text-3xl md:text-4xl" : "text-xl sm:text-2xl",
                        skin.title,
                      )}
                    >
                      {post.title}
                    </h3>
                    <p className={cx("mt-3 leading-7 text-[var(--muted)]", featured ? "text-base" : "text-sm")}>
                      {post.text}
                    </p>
                    <button
                      type="button"
                      onClick={() => goToPage("journal")}
                      className="mt-5 inline-flex w-fit items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--p)] transition group-hover:gap-3"
                    >
                      להמשך קריאה
                      <span aria-hidden="true">←</span>
                    </button>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );

  const NewsletterSection = ({
    id,
    className,
  }: {
    id: string;
    className?: string;
  }) => (
    <section
      {...sectionProps(id, "newsletter", "ניוזלטר")}
      className={cx("px-5 py-20 lg:px-8", className)}
    >
      <Reveal>
        <div className={cx("mx-auto grid max-w-7xl items-center gap-8 border p-8 md:grid-cols-2 lg:p-12", skin.softCard)}>
          <div className="text-right">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">
              {g("newsletterEyebrow")}
            </p>
            <h2 className={cx("store-display mt-3 text-3xl font-black md:text-4xl", skin.title)}>
              {g("newsletterTitle")}
            </h2>
            <p className="mt-3 text-[var(--muted)]">{g("newsletterText")}</p>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              placeholder="האימייל שלך"
              className={cx("min-w-0 flex-1 border px-4 py-4 text-sm outline-none focus:border-[var(--p)]", skin.input)}
            />
            <button type="submit" className={cx("text-sm font-black", skin.button)}>
              {g("newsletterButton")}
            </button>
          </form>
        </div>
      </Reveal>
    </section>
  );

  const ShippingPills = ({ id, className }: { id: string; className?: string }) => (
    <section
      {...sectionProps(id, "shipping", "יתרונות משלוח")}
      className={cx("px-5 py-14 lg:px-8", className)}
    >
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">
        {[g("shipBenefit"), g("returnBenefit"), g("supportBenefit"), g("secureBenefit")].map(
          (text, index) => (
            <Reveal key={text} delayMs={index * 70}>
              <div className={cx("border p-5 text-center text-sm font-black", skin.softCard)}>
                {text}
              </div>
            </Reveal>
          ),
        )}
      </div>
    </section>
  );

  const GalleryTriptych = ({
    id,
    label,
    className,
  }: {
    id: string;
    label: string;
    className?: string;
  }) => (
    <section
      {...sectionProps(id, "gallery", label)}
      className={cx("px-5 py-20 lg:px-8", className)}
    >
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-12">
        <StoreImage
          src={g("lookOne")}
          alt=""
          fallbackLabel={g("lookbookTitle")}
          className={cx("w-full object-cover md:col-span-7", skin.media)}
        />
        <StoreImage
          src={g("lookTwo")}
          alt=""
          fallbackLabel={g("lookbookTitle")}
          className="aspect-square w-full object-cover md:col-span-5"
        />
        <StoreImage
          src={g("lookThree")}
          alt=""
          fallbackLabel={g("lookbookTitle")}
          className="aspect-[16/7] w-full object-cover md:col-span-12"
        />
      </div>
    </section>
  );

  const SimpleInfoSection = ({
    id,
    kind,
    label,
    title,
    text,
    className,
  }: {
    id: string;
    kind: string;
    label: string;
    title: string;
    text: string;
    className?: string;
  }) => (
    <section
      {...sectionProps(id, kind, label)}
      className={cx("px-5 py-16 lg:px-8", className)}
    >
      <div className={cx("mx-auto max-w-7xl border p-8 text-right", skin.softCard)}>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--p)]">
          {label}
        </p>
        <h2 className={cx("store-display mt-3 text-4xl font-black", skin.title)}>
          {title}
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
          {text}
        </p>
      </div>
    </section>
  );

  const renderHome = () => {
    const p0 = pickProduct(0);
    const p1 = pickProduct(1);
    const p2 = pickProduct(2);
    const homeProducts = [p0, p1, p2].filter(Boolean) as StoreCatalogProduct[];

    if (layoutId === "roastBar") {
      return (
        <div>
          {Header}
          <section {...sectionProps("roast-warm-bar", "promo", "בר קלייה חם")} className="overflow-hidden bg-[#6b2f14] text-[#fff7ed]">
            <div className="store-marquee whitespace-nowrap py-3 text-xs font-black uppercase tracking-[0.35em]">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={i} className="mx-8">{g("promoText")}</span>
              ))}
            </div>
          </section>
          <section {...sectionProps("roast-counter-hero", "hero", "דלפק קפה")} className="px-5 py-16 lg:px-8 lg:py-24">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <Reveal className="flex flex-col justify-end rounded-[2rem] bg-[#2a160b] p-8 text-right text-[#fff7ed] lg:p-12">
                <p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--accent)]">{g("heroEyebrow")}</p>
                <h1 className="store-display mt-5 text-6xl font-black leading-none md:text-8xl">{g("heroTitle")}</h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">{g("heroSubtitle")}</p>
                <button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 w-fit text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button>
              </Reveal>
              <div className="grid gap-4">
                <StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="aspect-[16/7] rounded-[2rem] object-cover" />
                <div className="grid gap-4 md:grid-cols-3">
                  {homeProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} currency={currency} skin={skin} index={index} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} />
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section {...sectionProps("roast-stacked-trays", "products", "מגשי מוצרים")} className="px-5 py-16 lg:px-8" data-bizuply-widget="products"><div className="mx-auto grid max-w-7xl gap-4">{showcase.slice(0, 4).map((product, index) => <ProductCard key={product.id} product={product} currency={currency} skin={skin} index={index} className={index % 2 ? "ms-8" : "me-8"} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} />)}</div></section>
          <section {...sectionProps("roast-bean-stats", "features", "מדדי קלייה")} className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["08:00", "3", "24h", "100%"].map((value, i) => <StatPill key={value} value={value} label={`קלייה 0${i + 1}`} skin={skin} />)}</div></section>
          <section {...sectionProps("roast-categories", "categories", "מדפי קפה")} className={cx("px-5 py-20 lg:px-8", skin.alt)}><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[4/5]" />)}</div></section>
          <SimpleInfoSection id="roast-origin-story" kind="about" label="מקור" title={g("aboutTitle")} text={g("aboutText")} />
          <ValuesSection id="roast-tasting-notes" className={skin.alt} />
          <GalleryTriptych id="roast-cafe-scenes" label="סצנות בית קפה" />
          <TestimonialsSection id="roast-regulars" />
          <JournalSection id="roast-journal" />
          <NewsletterSection id="roast-club" className={skin.alt} />
          {Footer}
        </div>
      );
    }

    if (layoutId === "cellarVault") {
      return (
        <div>
          {Header}
          <section {...sectionProps("cellar-cover", "hero", "שער מרתף")} className="px-5 py-20 lg:px-8 lg:py-28">
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.75fr_1.25fr]">
              <Reveal className="text-right"><p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 font-serif text-6xl font-black leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mt-6 border-y border-[var(--line)] py-6 leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p></Reveal>
              <div className="grid grid-cols-3 gap-3">{[g("heroImage"), g("lookOne"), g("lookTwo")].map((image, index) => <StoreImage key={index} src={image} alt="" fallbackLabel={g("brandName")} className="aspect-[2/5] rounded-t-full object-cover" />)}</div>
            </div>
          </section>
          <section {...sectionProps("cellar-vault-columns", "categories", "עמודי קמרון")} className={cx("px-5 py-20 lg:px-8", skin.dark)}><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[2/5] rounded-t-full border-white/20" />)}</div></section>
          <ProductRail id="cellar-vintages" label="בקבוקי וינטג'" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-3" />
          <SimpleInfoSection id="cellar-tasting-notes" kind="features" label="טעימות" title={g("productDetailOne")} text={g("productDetailTwo")} className={skin.alt} />
          <ValuesSection id="cellar-sommelier-values" />
          <GalleryTriptych id="cellar-archive" label="ארכיון מרתף" className={skin.dark} />
          <section {...sectionProps("cellar-table", "features", "שולחן טעימות")} className="px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl divide-y divide-[var(--line)] border-y border-[var(--line)]">{[g("valueOneTitle"), g("valueTwoTitle"), g("valueThreeTitle")].map((title, i) => <div key={title} className="grid gap-4 py-7 md:grid-cols-[160px_1fr]"><strong className="font-serif text-3xl">0{i + 1}</strong><p className="text-sm leading-7 text-[var(--muted)]">{title} — {[g("valueOneText"), g("valueTwoText"), g("valueThreeText")][i]}</p></div>)}</div></section>
          <TestimonialsSection id="cellar-tasters" />
          <JournalSection id="cellar-notebook" />
          <NewsletterSection id="cellar-membership" className={skin.alt} />
          {Footer}
        </div>
      );
    }

    if (layoutId === "ridgeTrail") {
      return (
        <div>
          {Header}
          <section {...sectionProps("ridge-full-bleed-trail", "hero", "שביל מלא")} className="relative min-h-[88vh] overflow-hidden bg-[#172013] text-white"><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="absolute inset-0 h-full w-full object-cover opacity-60" /><div className="absolute inset-0 bg-gradient-to-l from-[#172013] via-[#172013]/80 to-transparent" /><Reveal className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-5 py-20 text-right lg:px-8"><p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--accent)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 max-w-4xl text-6xl font-black uppercase leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 w-fit text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button></Reveal></section>
          <section {...sectionProps("ridge-trail-bands", "features", "רצועות שביל")} className="px-5 py-0 lg:px-8"><div className="mx-auto grid max-w-7xl gap-3">{["BASE CAMP", "RIDGE LINE", "SUMMIT", "HOME TRAIL"].map((label, index) => <div key={label} className={cx("border border-[var(--line)] p-6 text-right", index % 2 ? "ms-10 bg-[var(--dark)] text-white" : "me-10 bg-[var(--surface)]")}><span className="store-display text-4xl font-black">{label}</span></div>)}</div></section>
          <ProductRail id="ridge-gear-splits" label="פיצולי ציוד" title={g("productsTitle")} text={g("productsText")} />
          <section {...sectionProps("ridge-rugged-categories", "categories", "שבילי קטגוריה")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[16/7]" />)}</div></section>
          <ValuesSection id="ridge-field-values" />
          <SimpleInfoSection id="ridge-field-note" kind="about" label="שטח" title={g("aboutTitle")} text={g("aboutText")} className={skin.dark} />
          <GalleryTriptych id="ridge-expedition-gallery" label="גלריית מסע" />
          <ShippingPills id="ridge-pack-promises" className={skin.alt} />
          <TestimonialsSection id="ridge-trail-reviews" />
          <JournalSection id="ridge-logbook" />
          <NewsletterSection id="ridge-summit-club" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "soundStage") {
      return (
        <div>
          {Header}
          <section {...sectionProps("stage-neon-marquee", "promo", "מסילת ניאון")} className="overflow-hidden bg-cyan-300 text-black"><div className="store-marquee whitespace-nowrap py-3 text-xs font-black uppercase tracking-[0.35em]">{Array.from({ length: 10 }).map((_, i) => <span key={i} className="mx-8">{g("promoText")}</span>)}</div></section>
          <section {...sectionProps("stage-cinema-hero", "hero", "במת קולנוע")} className="relative min-h-[92vh] overflow-hidden bg-black"><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="absolute inset-0 h-full w-full object-cover opacity-45" /><div className="absolute inset-x-0 top-1/2 h-px bg-cyan-300 shadow-[0_0_55px_#22d3ee]" /><div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-end gap-8 px-5 py-20 lg:grid-cols-[1fr_360px] lg:px-8"><Reveal className="text-right text-white"><p className="inline-flex border border-cyan-300/50 bg-cyan-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.32em] text-cyan-100">{g("heroEyebrow")}</p><h1 className="store-display mt-6 text-6xl font-black uppercase leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">{g("heroSubtitle")}</p></Reveal>{p0 ? <ProductCard product={p0} currency={currency} skin={skin} onOpen={() => openProduct(p0)} onAdd={() => addToCart(p0)} /> : null}</div></section>
          <section {...sectionProps("stage-spotlights", "products", "ספוטלייט מוצרים")} className="bg-[#050915] px-5 py-20 text-white lg:px-8" data-bizuply-widget="products"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">{homeProducts.map((product, index) => <ProductCard key={product.id} product={product} currency={currency} skin={skin} index={index} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} />)}</div></section>
          <section {...sectionProps("stage-neon-rails", "features", "מסילות במה")} className="bg-black px-5 py-12 text-white lg:px-8"><div className="mx-auto grid max-w-7xl gap-3 md:grid-cols-4">{["SYNC", "BASS", "LIGHT", "ROOM"].map((v, i) => <StatPill key={v} value={v} label={`ערוץ 0${i + 1}`} skin={skin} />)}</div></section>
          <ProductRail id="stage-product-rail" label="מסילת מוצרים" title={g("productsTitle")} text={g("productsText")} className="bg-black text-white" railClassName="flex snap-x overflow-x-auto pb-4 sm:grid-cols-none lg:grid-cols-none [&>*]:min-w-[280px]" />
          <section {...sectionProps("stage-category-screens", "categories", "מסכי קטגוריה")} className="bg-[#050915] px-5 py-20 text-white lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/5] border-cyan-300/30" />)}</div></section>
          <GalleryTriptych id="stage-listening-room" label="חדר האזנה" className="bg-black text-white" />
          <ValuesSection id="stage-sound-values" className="bg-[#050915] text-white" />
          <TestimonialsSection id="stage-audience" />
          <JournalSection id="stage-backstage" className="bg-black text-white" />
          <NewsletterSection id="stage-vip" className="bg-[#050915] text-white" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "veloTrack") {
      return (
        <div>
          {Header}
          <section {...sectionProps("velo-track-hero", "hero", "מסלול אופניים")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-5"><Reveal className="-skew-x-6 bg-[var(--dark)] p-8 text-right text-white"><div className="skew-x-6"><p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--accent)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 text-6xl font-black italic leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-white/70">{g("heroSubtitle")}</p></div></Reveal><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="aspect-[16/6] w-full object-cover" /></div></section>
          <section {...sectionProps("velo-diagonal-stats", "features", "סטטיסטיקות אלכסוניות")} className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["+18%", "7kg", "90rpm", "24h"].map((v, i) => <StatPill key={v} value={v} label={`מסלול 0${i + 1}`} skin={skin} className={i % 2 ? "translate-y-6" : ""} />)}</div></section>
          <ProductRail id="velo-track-panels" label="פאנלי מסלול" title={g("productsTitle")} text={g("productsText")} />
          <section {...sectionProps("velo-offset-products", "products", "מוצרים מוזחים")} className="px-5 py-20 lg:px-8" data-bizuply-widget="products"><div className="mx-auto grid max-w-7xl gap-7 md:grid-cols-3">{homeProducts.map((product, index) => <ProductCard key={product.id} product={product} currency={currency} skin={skin} index={index} className={index === 1 ? "md:translate-y-12" : ""} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} />)}</div></section>
          <section {...sectionProps("velo-lane-categories", "categories", "נתיבי קטגוריה")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-3">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className={cx("aspect-[16/4]", index % 2 ? "ms-12" : "me-12")} />)}</div></section>
          <SimpleInfoSection id="velo-fit-guide" kind="features" label="התאמה" title={g("productDetailOne")} text={g("productDetailTwo")} />
          <ValuesSection id="velo-performance-values" className={skin.dark} />
          <GalleryTriptych id="velo-road-gallery" label="גלריית כביש" />
          <TestimonialsSection id="velo-rider-reviews" />
          <JournalSection id="velo-race-notes" />
          <NewsletterSection id="velo-club" className={skin.alt} />
          {Footer}
        </div>
      );
    }

    if (layoutId === "greenhouseGrid") {
      return (
        <div>
          {Header}
          <section {...sectionProps("greenhouse-bento-hero", "hero", "בנטו חממה")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-12"><Reveal className="rounded-[3rem] bg-white/70 p-8 text-right md:col-span-5 lg:p-12"><p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 text-5xl font-black leading-tight md:text-7xl">{g("heroTitle")}</h1><p className="mt-5 leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button></Reveal><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="h-full min-h-[360px] rounded-[45%_55%_50%_50%] object-cover md:col-span-4" /><div className="grid gap-5 md:col-span-3">{categoryTiles.slice(0, 2).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-square rounded-[2.5rem]" />)}</div></div></section>
          <section {...sectionProps("greenhouse-organic-grid", "categories", "גריד אורגני")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-6">{categoryTiles.slice(0, 6).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className={cx(index % 3 === 0 ? "aspect-[4/5] md:col-span-2" : "aspect-square md:col-span-2", "rounded-[2.5rem]")} />)}</div></section>
          <ProductRail id="greenhouse-plant-benches" label="שולחנות צמחים" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-3" />
          <ValuesSection id="greenhouse-care-cards" className={skin.alt} />
          <SimpleInfoSection id="greenhouse-care-note" kind="features" label="טיפול" title={g("productDetailOne")} text={g("productDetailTwo")} />
          <GalleryTriptych id="greenhouse-glasshouse" label="בית זכוכית" />
          <ShippingPills id="greenhouse-delivery" className={skin.alt} />
          <TestimonialsSection id="greenhouse-growers" />
          <JournalSection id="greenhouse-journal" />
          <NewsletterSection id="greenhouse-club" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "toyArcade") {
      return (
        <div>
          {Header}
          <section {...sectionProps("arcade-ticket-strip", "promo", "כרטיסי ארקייד")} className="overflow-hidden bg-[#ffe86b] text-[#27122d]"><div className="store-marquee whitespace-nowrap py-3 text-xs font-black uppercase tracking-[0.35em]">{Array.from({ length: 9 }).map((_, i) => <span key={i} className="mx-8">★ {g("promoText")}</span>)}</div></section>
          <section {...sectionProps("arcade-hero-grid", "hero", "גריד משחק")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-12"><Reveal className="rounded-[2rem] border-4 border-[#27122d] bg-[#ff3ea5] p-8 text-right text-white shadow-[10px_10px_0_#ffe86b] md:col-span-6"><p className="text-xs font-black uppercase tracking-[0.32em]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 text-5xl font-black leading-none md:text-7xl">{g("heroTitle")}</h1><p className="mt-5 leading-8 text-white/80">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className="mt-8 rounded-full bg-[#ffe86b] px-7 py-4 text-sm font-black text-[#27122d]">{g("heroPrimaryButton")}</button></Reveal><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="aspect-square rounded-[2rem] border-4 border-[#27122d] object-cover md:col-span-3" /><div className="grid gap-5 md:col-span-3">{homeProducts.slice(0, 2).map((product, index) => <ProductCard key={product.id} product={product} currency={currency} skin={skin} index={index} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} />)}</div></div></section>
          <section {...sectionProps("arcade-badges", "features", "תגי משחק")} className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["WOW", "POP", "NEW", "FUN"].map((v, i) => <StatPill key={v} value={v} label={`שלב 0${i + 1}`} skin={skin} />)}</div></section>
          <ProductRail id="arcade-prize-wall" label="קיר פרסים" title={g("productsTitle")} text={g("productsText")} />
          <section {...sectionProps("arcade-category-buttons", "categories", "כפתורי קטגוריה")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-square rotate-[-2deg] border-4 border-[#27122d]" />)}</div></section>
          <ValuesSection id="arcade-play-values" />
          <GalleryTriptych id="arcade-playroom" label="חדר משחקים" />
          <ShippingPills id="arcade-gift-delivery" className={skin.alt} />
          <TestimonialsSection id="arcade-parent-reviews" />
          <JournalSection id="arcade-ideas" />
          <NewsletterSection id="arcade-club" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "chefAtelier") {
      return (
        <div>
          {Header}
          <section {...sectionProps("chef-cookbook-cover", "hero", "שער ספר מתכונים")} className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]"><Reveal className="text-right"><p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 font-serif text-6xl font-black leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mt-6 border-y border-[var(--line)] py-6 text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p></Reveal><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="aspect-[5/4] object-cover" /></div></section>
          <section {...sectionProps("chef-magazine-columns", "features", "טורי מגזין")} className="px-5 py-16 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">{[g("valueOneText"), g("valueTwoText"), g("valueThreeText")].map((text, i) => <Reveal key={text} delayMs={i * 80}><article className="border-r border-[var(--line)] pr-6 text-right"><p className="font-serif text-5xl text-[var(--p)]">0{i + 1}</p><p className="mt-4 text-sm leading-8 text-[var(--muted)]">{text}</p></article></Reveal>)}</div></section>
          <ProductRail id="chef-recipe-products" label="מוצרי מתכון" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-3" />
          <section {...sectionProps("chef-pantry-categories", "categories", "מזווה")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/4]" />)}</div></section>
          <SimpleInfoSection id="chef-test-kitchen" kind="about" label="מטבח ניסוי" title={g("aboutTitle")} text={g("aboutText")} />
          <ValuesSection id="chef-craft-values" className={skin.alt} />
          <GalleryTriptych id="chef-table-scenes" label="שולחן ערוך" />
          <ShippingPills id="chef-kitchen-shipping" />
          <TestimonialsSection id="chef-cooks-say" />
          <JournalSection id="chef-recipes" />
          <NewsletterSection id="chef-newsletter" className={skin.alt} />
          {Footer}
        </div>
      );
    }

    if (layoutId === "streetDrop") {
      return (
        <div>
          {Header}
          <section {...sectionProps("drop-warning-strip", "promo", "אזהרת דרופ")} className="overflow-hidden bg-black text-white"><div className="store-marquee whitespace-nowrap py-3 text-xs font-black uppercase tracking-[0.35em]">{Array.from({ length: 10 }).map((_, i) => <span key={i} className="mx-8">{g("promoText")}</span>)}</div></section>
          <section {...sectionProps("drop-stacked-hero", "hero", "שכבות דרופ")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-4"><Reveal className="border-2 border-black bg-white p-8 text-right shadow-[12px_12px_0_black]"><p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-4 text-6xl font-black uppercase leading-none md:text-9xl">{g("heroTitle")}</h1></Reveal><div className="grid gap-4 md:grid-cols-3">{[g("heroImage"), g("lookOne"), g("lookTwo")].map((image, index) => <StoreImage key={index} src={image} alt="" fallbackLabel={g("brandName")} className={cx("aspect-[4/3] border-2 border-black object-cover", index === 1 ? "md:translate-y-8" : "")} />)}</div></div></section>
          <section {...sectionProps("drop-release-stack", "products", "דרופים בערימה")} className="px-5 py-20 lg:px-8" data-bizuply-widget="products"><div className="mx-auto grid max-w-7xl gap-4">{showcase.slice(0, 5).map((product, index) => <div key={product.id} className={cx("grid items-center gap-5 border-2 border-black bg-white p-4 md:grid-cols-[180px_1fr_auto]", index % 2 ? "ms-10" : "me-10")}><StoreImage src={product.image} alt={product.name} fallbackLabel={product.name} className="aspect-square object-cover" /><div className="text-right"><p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--p)]">DROP 0{index + 1}</p><h3 className="store-display text-3xl font-black uppercase">{product.name}</h3><p className="text-[var(--muted)]">{product.category}</p></div><button type="button" onClick={() => openProduct(product)} className={skin.button}>פתיחה</button></div>)}</div></section>
          <section {...sectionProps("drop-category-tags", "categories", "תגי רחוב")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[4/5] border-2 border-black" />)}</div></section>
          <section {...sectionProps("drop-countdown-stats", "features", "ספירת דרופ")} className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["00", "12", "48", "99"].map((v, i) => <StatPill key={v} value={v} label={`DROP 0${i + 1}`} skin={skin} />)}</div></section>
          <ValuesSection id="drop-street-values" className={skin.dark} />
          <GalleryTriptych id="drop-lookbook" label="לוקבוק רחוב" />
          <ShippingPills id="drop-fast-shipping" className={skin.alt} />
          <TestimonialsSection id="drop-community" />
          <JournalSection id="drop-zine" />
          <NewsletterSection id="drop-alerts" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "runwayRail") {
      return (
        <div>
          {Header}
          <section {...sectionProps("runway-ticker", "promo", "מסלול אופנה")} className="overflow-hidden bg-black text-white"><div className="store-marquee whitespace-nowrap py-3 text-xs font-black uppercase tracking-[0.35em]">{Array.from({ length: 10 }).map((_, i) => <span key={i} className="mx-8">{g("promoText")}</span>)}</div></section>
          <section {...sectionProps("runway-editorial-hero", "hero", "עריכת מסלול")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]"><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="aspect-[4/5] object-cover" /><Reveal className="flex flex-col justify-end text-right"><p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 font-serif text-6xl font-black leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 w-fit text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button></Reveal></div></section>
          <ProductRail id="runway-looks" label="לוקים נבחרים" title={g("productsTitle")} text={g("productsText")} />
          <section {...sectionProps("runway-category-rails", "categories", "מסילות קטגוריה")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/5]" />)}</div></section>
          <section {...sectionProps("runway-offset-products", "products", "מוצרים מוזחים")} className="px-5 py-20 lg:px-8" data-bizuply-widget="products"><div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">{homeProducts.map((product, index) => <ProductCard key={product.id} product={product} currency={currency} skin={skin} index={index} className={index === 1 ? "md:mt-16" : ""} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} />)}</div></section>
          <ValuesSection id="runway-fit-values" className={skin.dark} />
          <SimpleInfoSection id="runway-atelier-note" kind="about" label="אטליה" title={g("aboutTitle")} text={g("aboutText")} />
          <GalleryTriptych id="runway-lookbook" label="לוקבוק" />
          <TestimonialsSection id="runway-clients" />
          <JournalSection id="runway-journal" />
          <NewsletterSection id="runway-list" className={skin.alt} />
          {Footer}
        </div>
      );
    }

    if (layoutId === "indigoStack") {
      return (
        <div>
          {Header}
          <section {...sectionProps("indigo-stack-hero", "hero", "ערימת אינדיגו")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-4"><Reveal className="border border-[var(--line)] bg-[var(--dark)] p-8 text-right text-white shadow-[8px_8px_0_#f59e0b]"><p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--accent)]">{g("heroEyebrow")}</p><h1 className="store-display mt-4 text-6xl font-black uppercase leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mt-5 max-w-2xl text-lg text-white/75">{g("heroSubtitle")}</p></Reveal><div className="grid gap-3 md:grid-cols-3">{[g("heroImage"), g("lookOne"), g("lookTwo")].map((image, index) => <StoreImage key={index} src={image} alt="" fallbackLabel={g("brandName")} className="aspect-[4/5] object-cover" />)}</div></div></section>
          <section {...sectionProps("indigo-wash-stats", "features", "מדדי שטיפה")} className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["14oz", "Raw", "Selvage", "Wash"].map((v, i) => <StatPill key={v} value={v} label={`שכבה 0${i + 1}`} skin={skin} />)}</div></section>
          <ProductRail id="indigo-stack-rail" label="ערימת דנים" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-3" />
          <section {...sectionProps("indigo-categories", "categories", "מדפי דנים")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[16/7]" />)}</div></section>
          <ValuesSection id="indigo-street-values" />
          <SimpleInfoSection id="indigo-fit-guide" kind="features" label="חיתוך" title={g("productDetailOne")} text={g("productDetailTwo")} className={skin.dark} />
          <GalleryTriptych id="indigo-street-gallery" label="גלריית רחוב" />
          <ShippingPills id="indigo-shipping" className={skin.alt} />
          <TestimonialsSection id="indigo-reviews" />
          <JournalSection id="indigo-zine" />
          <NewsletterSection id="indigo-club" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "lastBench") {
      return (
        <div>
          {Header}
          <section {...sectionProps("last-bench-hero", "hero", "ספסל הנעלן")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr]"><Reveal className="rounded-[2rem] bg-[#1c1917] p-8 text-right text-[#fffbeb] lg:p-12"><p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--accent)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 font-serif text-6xl font-black leading-none md:text-7xl">{g("heroTitle")}</h1><p className="mt-6 text-lg leading-8 text-white/75">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 w-fit text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button></Reveal><div className="grid gap-4"><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="aspect-[16/8] rounded-[1.5rem] object-cover" /><div className="grid gap-4 md:grid-cols-3">{homeProducts.map((product, index) => <ProductCard key={product.id} product={product} currency={currency} skin={skin} index={index} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} />)}</div></div></div></section>
          <section {...sectionProps("last-size-stats", "features", "מדדי מידה")} className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["EU", "US", "UK", "CM"].map((v, i) => <StatPill key={v} value={v} label={`מידה 0${i + 1}`} skin={skin} />)}</div></section>
          <ProductRail id="last-bench-rail" label="שורה על הספסל" title={g("productsTitle")} text={g("productsText")} />
          <section {...sectionProps("last-categories", "categories", "מדפי נעליים")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[4/5] rounded-[1.25rem]" />)}</div></section>
          <ValuesSection id="last-craft-values" />
          <SimpleInfoSection id="last-fit-note" kind="about" label="התאמה" title={g("aboutTitle")} text={g("aboutText")} />
          <GalleryTriptych id="last-atelier" label="סדנת נעליים" />
          <ShippingPills id="last-shipping" className={skin.alt} />
          <TestimonialsSection id="last-reviews" />
          <JournalSection id="last-journal" />
          <NewsletterSection id="last-club" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "courtDrop") {
      return (
        <div>
          {Header}
          <section {...sectionProps("court-alert", "promo", "התראת דרופ")} className="overflow-hidden bg-[#22d3ee] text-black"><div className="store-marquee whitespace-nowrap py-3 text-xs font-black uppercase tracking-[0.35em]">{Array.from({ length: 10 }).map((_, i) => <span key={i} className="mx-8">{g("promoText")}</span>)}</div></section>
          <section {...sectionProps("court-stacked-hero", "hero", "ערימת קורט")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-4"><Reveal className="border-2 border-black bg-white p-8 text-right shadow-[12px_12px_0_#22d3ee]"><p className="text-xs font-black uppercase tracking-[0.35em]">{g("heroEyebrow")}</p><h1 className="store-display mt-4 text-6xl font-black uppercase leading-none md:text-9xl">{g("heroTitle")}</h1><p className="mt-5 max-w-2xl text-lg text-[var(--muted)]">{g("heroSubtitle")}</p></Reveal><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="aspect-[16/7] border-2 border-black object-cover" /></div></section>
          <section {...sectionProps("court-release-stack", "products", "שחרורים")} className="px-5 py-20 lg:px-8" data-bizuply-widget="products"><div className="mx-auto grid max-w-7xl gap-4">{showcase.slice(0, 5).map((product, index) => <div key={product.id} className={cx("grid items-center gap-5 border-2 border-black bg-white p-4 md:grid-cols-[160px_1fr_auto]", index % 2 ? "ms-8" : "me-8")}><StoreImage src={product.image} alt={product.name} fallbackLabel={product.name} className="aspect-square object-cover" /><div className="text-right"><p className="text-xs font-black uppercase tracking-[0.2em]">PAIR 0{index + 1}</p><h3 className="store-display text-3xl font-black uppercase">{product.name}</h3></div><button type="button" onClick={() => openProduct(product)} className={skin.button}>פתיחה</button></div>)}</div></section>
          <section {...sectionProps("court-categories", "categories", "תגי קורט")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-square border-2 border-black" />)}</div></section>
          <section {...sectionProps("court-stats", "features", "ספירת דרופ")} className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["01", "07", "24", "99"].map((v, i) => <StatPill key={v} value={v} label={`COURT 0${i + 1}`} skin={skin} />)}</div></section>
          <ValuesSection id="court-values" className={skin.dark} />
          <GalleryTriptych id="court-gallery" label="גלריית סניקרס" />
          <ShippingPills id="court-shipping" className={skin.alt} />
          <TestimonialsSection id="court-reviews" />
          <JournalSection id="court-zine" />
          <NewsletterSection id="court-alerts" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "luxeVitrine") {
      return (
        <div>
          {Header}
          <section {...sectionProps("vitrine-centered-hero", "hero", "ויטרינה")} className="px-5 py-24 text-center lg:px-8 lg:py-36"><Reveal className="mx-auto max-w-4xl"><p className="text-xs font-black uppercase tracking-[0.4em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-8 font-serif text-6xl font-light leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button></Reveal></section>
          <section {...sectionProps("vitrine-glass-cases", "categories", "תיבות זכוכית")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/4] rounded-[2rem]" />)}</div></section>
          <ProductRail id="vitrine-pieces" label="יצירות נבחרות" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-3" />
          <section {...sectionProps("vitrine-spotlight", "products", "זרקור")} className={skin.alt + " px-5 py-20 lg:px-8"} data-bizuply-widget="products"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">{homeProducts.map((product, index) => <ProductCard key={product.id} product={product} currency={currency} skin={skin} index={index} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} />)}</div></section>
          <ValuesSection id="vitrine-values" />
          <SimpleInfoSection id="vitrine-atelier" kind="about" label="סדנה" title={g("aboutTitle")} text={g("aboutText")} className={skin.dark} />
          <GalleryTriptych id="vitrine-gallery" label="גלריית ברק" />
          <ShippingPills id="vitrine-shipping" className={skin.alt} />
          <TestimonialsSection id="vitrine-reviews" />
          <JournalSection id="vitrine-journal" />
          <NewsletterSection id="vitrine-club" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "roomShelf") {
      return (
        <div>
          {Header}
          <section {...sectionProps("room-bento-hero", "hero", "בנטו בית")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-12"><Reveal className="rounded-[1.5rem] bg-white p-8 text-right shadow-[0_18px_44px_rgba(15,118,110,0.12)] md:col-span-5 lg:p-12"><p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 text-5xl font-black leading-tight md:text-7xl">{g("heroTitle")}</h1><p className="mt-5 leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button></Reveal><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="min-h-[340px] rounded-[1.5rem] object-cover md:col-span-4" /><div className="grid gap-5 md:col-span-3">{categoryTiles.slice(0, 2).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-square rounded-[1.25rem]" />)}</div></div></section>
          <section {...sectionProps("room-shelf-grid", "categories", "מדפי חדר")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[4/5] rounded-[1.25rem]" />)}</div></section>
          <ProductRail id="room-products" label="מוצרים לבית" title={g("productsTitle")} text={g("productsText")} />
          <ValuesSection id="room-values" className={skin.alt} />
          <SimpleInfoSection id="room-story" kind="about" label="בית" title={g("aboutTitle")} text={g("aboutText")} />
          <GalleryTriptych id="room-gallery" label="פינות בית" />
          <ShippingPills id="room-shipping" className={skin.alt} />
          <TestimonialsSection id="room-reviews" />
          <JournalSection id="room-journal" />
          <NewsletterSection id="room-club" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "softFold") {
      return (
        <div>
          {Header}
          <section {...sectionProps("soft-fold-hero", "hero", "קיפול רך")} className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]"><Reveal className="text-right"><p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 font-serif text-6xl font-black leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mt-6 border-y border-[var(--line)] py-6 text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p></Reveal><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="aspect-[5/4] rounded-[2.5rem] object-cover" /></div></section>
          <section {...sectionProps("soft-fabric-stats", "features", "מדדי בד")} className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["200TC", "Linen", "Wash", "Soft"].map((v, i) => <StatPill key={v} value={v} label={`בד 0${i + 1}`} skin={skin} />)}</div></section>
          <ProductRail id="soft-fold-rail" title={g("productsTitle")} text={g("productsText")} label="קיפולים נבחרים" railClassName="lg:grid-cols-3" />
          <section {...sectionProps("soft-categories", "categories", "מגירות בד")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/4] rounded-[2rem]" />)}</div></section>
          <ValuesSection id="soft-values" />
          <SimpleInfoSection id="soft-care" kind="features" label="טיפול" title={g("productDetailOne")} text={g("productDetailTwo")} />
          <GalleryTriptych id="soft-gallery" label="חדר שינה" />
          <ShippingPills id="soft-shipping" className={skin.alt} />
          <TestimonialsSection id="soft-reviews" />
          <JournalSection id="soft-journal" />
          <NewsletterSection id="soft-club" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "cleanCabinet") {
      return (
        <div>
          {Header}
          <section {...sectionProps("cabinet-hero", "hero", "ארון נקי")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_1fr]"><Reveal className="rounded-[1rem] border border-[var(--line)] bg-white p-8 text-right lg:p-12"><p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 text-5xl font-black leading-tight md:text-7xl">{g("heroTitle")}</h1><p className="mt-5 leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button></Reveal><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="min-h-[360px] rounded-[1rem] object-cover" /></div></section>
          <section {...sectionProps("cabinet-aisles", "categories", "מעברים")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-square rounded-[1rem]" />)}</div></section>
          <ProductRail id="cabinet-shelf" label="מדף נבחר" title={g("productsTitle")} text={g("productsText")} />
          <section {...sectionProps("cabinet-trust", "features", "אמון")} className={skin.alt + " px-5 py-12 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["ברור", "מדויק", "בטוח", "זמין"].map((v, i) => <StatPill key={v} value={v} label={`ערך 0${i + 1}`} skin={skin} />)}</div></section>
          <ValuesSection id="cabinet-values" />
          <SimpleInfoSection id="cabinet-guide" kind="features" label="הכוונה" title={g("productDetailOne")} text={g("productDetailTwo")} />
          <GalleryTriptych id="cabinet-gallery" label="מדפים מסודרים" />
          <ShippingPills id="cabinet-shipping" className={skin.alt} />
          <TestimonialsSection id="cabinet-reviews" />
          <JournalSection id="cabinet-journal" />
          <NewsletterSection id="cabinet-club" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "doseGrid") {
      return (
        <div>
          {Header}
          <section {...sectionProps("dose-grid-hero", "hero", "גריד מינון")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-12"><Reveal className="rounded-[0.75rem] border border-[var(--line)] bg-white p-8 text-right shadow-[4px_4px_0_rgba(21,128,61,0.18)] md:col-span-7"><p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 text-5xl font-black leading-tight md:text-7xl">{g("heroTitle")}</h1><p className="mt-5 leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button></Reveal><div className="grid gap-4 md:col-span-5">{homeProducts.slice(0, 2).map((product, index) => <ProductCard key={product.id} product={product} currency={currency} skin={skin} index={index} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} />)}</div></div></section>
          <section {...sectionProps("dose-goals", "features", "מטרות")} className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["אנרגיה", "חיסון", "שינה", "מיקוד"].map((v, i) => <StatPill key={v} value={v} label={`מטרה 0${i + 1}`} skin={skin} />)}</div></section>
          <ProductRail id="dose-rail" label="מינונים נבחרים" title={g("productsTitle")} text={g("productsText")} />
          <section {...sectionProps("dose-categories", "categories", "מדפי מטרה")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[4/5]" />)}</div></section>
          <ValuesSection id="dose-values" />
          <SimpleInfoSection id="dose-guide" kind="features" label="שגרה" title={g("productDetailOne")} text={g("productDetailTwo")} className={skin.dark} />
          <GalleryTriptych id="dose-gallery" label="שגרת בוקר" />
          <ShippingPills id="dose-shipping" className={skin.alt} />
          <TestimonialsSection id="dose-reviews" />
          <JournalSection id="dose-journal" />
          <NewsletterSection id="dose-club" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "strapStudio") {
      return (
        <div>
          {Header}
          <section {...sectionProps("strap-hero", "hero", "סטודיו רצועות")} className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr]"><Reveal className="text-right"><p className="text-xs font-black uppercase tracking-[0.35em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 font-serif text-6xl font-black leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mt-6 border-y border-[var(--line)] py-6 text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p></Reveal><div className="grid grid-cols-3 gap-3">{[g("heroImage"), g("lookOne"), g("lookTwo")].map((image, index) => <StoreImage key={index} src={image} alt="" fallbackLabel={g("brandName")} className="aspect-[2/5] rounded-t-[2rem] object-cover" />)}</div></div></section>
          <section {...sectionProps("strap-categories", "categories", "עמודי תיק")} className={cx("px-5 py-20 lg:px-8", skin.dark)}><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[2/5] rounded-t-[2rem] border-white/20" />)}</div></section>
          <ProductRail id="strap-rail" label="רצועות נבחרות" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-3" />
          <ValuesSection id="strap-values" />
          <SimpleInfoSection id="strap-craft" kind="about" label="מלאכה" title={g("aboutTitle")} text={g("aboutText")} className={skin.alt} />
          <GalleryTriptych id="strap-gallery" label="סטודיו" />
          <ShippingPills id="strap-shipping" />
          <TestimonialsSection id="strap-reviews" />
          <JournalSection id="strap-journal" />
          <NewsletterSection id="strap-club" className={skin.alt} />
          {Footer}
        </div>
      );
    }

    if (layoutId === "dialAtelier") {
      return (
        <div>
          {Header}
          <section {...sectionProps("dial-hero", "hero", "אטליה מחוגים")} className="px-5 py-24 text-center lg:px-8 lg:py-32"><Reveal className="mx-auto max-w-4xl"><p className="text-xs font-black uppercase tracking-[0.4em] text-[var(--accent)]">{g("heroEyebrow")}</p><h1 className="store-display mt-8 font-serif text-6xl font-light leading-none md:text-8xl">{g("heroTitle")}</h1><p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button></Reveal><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="mx-auto mt-12 aspect-square max-w-md rounded-full object-cover shadow-[0_30px_80px_rgba(0,0,0,0.18)]" /></section>
          <section {...sectionProps("dial-stats", "features", "מדדי דיוק")} className="px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["Swiss", "Auto", "Sapphire", "5ATM"].map((v, i) => <StatPill key={v} value={v} label={`מד 0${i + 1}`} skin={skin} />)}</div></section>
          <ProductRail id="dial-rail" label="מחוגים נבחרים" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-3" />
          <section {...sectionProps("dial-categories", "categories", "ויטרינות")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-square rounded-full" />)}</div></section>
          <ValuesSection id="dial-values" className={skin.dark} />
          <SimpleInfoSection id="dial-service" kind="features" label="שירות" title={g("productDetailOne")} text={g("productDetailTwo")} />
          <GalleryTriptych id="dial-gallery" label="גלריית שעונים" />
          <ShippingPills id="dial-shipping" className={skin.alt} />
          <TestimonialsSection id="dial-reviews" />
          <JournalSection id="dial-journal" />
          <NewsletterSection id="dial-club" />
          {Footer}
        </div>
      );
    }

    if (layoutId === "quietLounge") {
      return (
        <div>
          {Header}
          <section {...sectionProps("lounge-soft-hero", "hero", "לאונג׳ רך")} className="px-5 py-20 lg:px-8 lg:py-28"><div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]"><Reveal className="rounded-[2.5rem] bg-white/80 p-8 text-right shadow-[0_26px_70px_rgba(91,33,182,0.12)] lg:p-12"><p className="text-xs font-black uppercase tracking-[0.32em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-5 font-serif text-6xl font-black leading-none md:text-7xl">{g("heroTitle")}</h1><p className="mt-6 text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 w-fit text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button></Reveal><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="min-h-[380px] rounded-[2.5rem] object-cover" /></div></section>
          <section {...sectionProps("lounge-categories", "categories", "מגירות רכות")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/4] rounded-[2rem]" />)}</div></section>
          <ProductRail id="lounge-rail" label="סטים רכים" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-3" />
          <ValuesSection id="lounge-values" className={skin.alt} />
          <SimpleInfoSection id="lounge-story" kind="about" label="נוחות" title={g("aboutTitle")} text={g("aboutText")} />
          <GalleryTriptych id="lounge-gallery" label="רגעי בית" />
          <ShippingPills id="lounge-shipping" className={skin.alt} />
          <TestimonialsSection id="lounge-reviews" />
          <JournalSection id="lounge-journal" />
          <NewsletterSection id="lounge-club" />
          {Footer}
        </div>
      );
    }

    return (
      <div>
        {Header}
        <section {...sectionProps("salon-centered-hero", "hero", "סלון יוקרתי")} className="px-5 py-24 text-center lg:px-8 lg:py-36"><Reveal className="mx-auto max-w-5xl"><p className="text-xs font-black uppercase tracking-[0.4em] text-[var(--p)]">{g("heroEyebrow")}</p><h1 className="store-display mt-8 font-serif text-6xl font-light leading-none md:text-9xl">{g("heroTitle")}</h1><p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-[var(--muted)]">{g("heroSubtitle")}</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-8 text-sm font-black", skin.button)}>{g("heroPrimaryButton")}</button></Reveal></section>
        <section {...sectionProps("salon-fragrance-orbit", "gallery", "אורביט ניחוח")} className="px-5 py-16 lg:px-8"><div className="mx-auto grid max-w-7xl items-center gap-5 md:grid-cols-3"><StoreImage src={g("lookOne")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[3/4] rounded-full object-cover" /><StoreImage src={g("heroImage")} alt="" fallbackLabel={g("brandName")} className="aspect-square rounded-full object-cover md:scale-110" /><StoreImage src={g("lookTwo")} alt="" fallbackLabel={g("lookbookTitle")} className="aspect-[3/4] rounded-full object-cover" /></div></section>
        <ProductRail id="salon-product-portraits" label="פורטרטים ריחניים" title={g("productsTitle")} text={g("productsText")} railClassName="lg:grid-cols-3" />
        <section {...sectionProps("salon-soft-categories", "categories", "משפחות ניחוח")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/4] rounded-[999px]" />)}</div></section>
        <SimpleInfoSection id="salon-notes" kind="features" label="תווי ניחוח" title={g("productDetailOne")} text={g("productDetailTwo")} />
        <ValuesSection id="salon-rituals" className={skin.alt} />
        <GalleryTriptych id="salon-luxury-scenes" label="סצנות סלון" />
        <ShippingPills id="salon-gift-wrap" />
        <TestimonialsSection id="salon-client-notes" />
        <JournalSection id="salon-journal" />
        <NewsletterSection id="salon-private-list" className={skin.alt} />
        {Footer}
      </div>
    );
  };

  const ShopControls = (id: string) => (
    <section
      {...sectionProps(id, "filters", "חיפוש וסינון")}
      className={cx("border-y border-[var(--line)] px-5 py-6 lg:px-8", skin.alt)}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cx(
              "px-4 py-2 text-xs font-black uppercase tracking-[0.14em]",
              activeCategory === "all"
                ? "bg-[var(--p)] text-[var(--on-p)]"
                : skin.outlineButton,
            )}
          >
            הכל
          </button>
          {categoryTiles.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.slug)}
              className={cx(
                "px-4 py-2 text-xs font-black uppercase tracking-[0.14em]",
                activeCategory === cat.slug
                  ? "bg-[var(--p)] text-[var(--on-p)]"
                  : skin.outlineButton,
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="חיפוש מוצר..."
            className={cx("min-w-[220px] flex-1 border px-4 py-3 text-sm outline-none focus:border-[var(--p)]", skin.input)}
          />
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as RichSort)}
            className={cx("border px-4 py-3 text-sm", skin.input)}
          >
            <option value="featured">נבחרים</option>
            <option value="price-asc">מחיר: נמוך לגבוה</option>
            <option value="price-desc">מחיר: גבוה לנמוך</option>
            <option value="name">שם א-ת</option>
          </select>
        </div>
      </div>
    </section>
  );

  const ProductGridSection = (id: string, title = "רשת מוצרים") => (
    <section
      {...sectionProps(id, "products", title)}
      className="px-5 py-16 lg:px-8"
      data-bizuply-widget="products"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="text-right">
            <h2 className={cx("store-display text-4xl font-black", skin.title)}>
              {title}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {filteredProducts.length} מוצרים
              {fromPlugin
                ? " · המוצרים מהחנות שלך"
                : " · דמו זמני — הוסיפו מוצרים בפאנל חנות"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveCategory("all");
              setSort("featured");
            }}
            className={cx("text-xs font-black uppercase tracking-[0.14em]", skin.outlineButton)}
          >
            איפוס
          </button>
        </div>
        <div className={cx("mt-10 grid gap-5 sm:grid-cols-2", skin.grid)}>
          {filteredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              skin={skin}
              index={index}
              onOpen={() => openProduct(product)}
              onAdd={() => addToCart(product)}
            />
          ))}
        </div>
        {!filteredProducts.length ? (
          <div className={cx("mt-12 border border-dashed p-10 text-center text-[var(--muted)]", skin.softCard)}>
            לא נמצאו מוצרים בסינון הנוכחי. נסו חיפוש אחר או קטגוריה אחרת.
          </div>
        ) : null}
      </div>
    </section>
  );

  const renderSecondaryPage = (pageId: RichStoreSitePageId) => {
    if (pageId === "shop") {
      return (
        <div>
          {Header}
          <section {...sectionProps("shop-rich-hero", "hero", "חנות")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow={g("shopEyebrow")} title={g("shopTitle")} text={g("shopText")} skin={skin} giant /></div></section>
          {ShopControls("shop-rich-filters")}
          {ProductGridSection("shop-rich-grid")}
          <ProductRail id="shop-featured-rail" label="מוצרים נבחרים" title="בחירות מומלצות" text={g("productsText")} productsToShow={showcase.slice(0, 4)} className={skin.alt} />
          <section {...sectionProps("shop-category-lift", "categories", "קטגוריות מהירות")} className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[4/5]" />)}</div></section>
          <SimpleInfoSection id="shop-service-story" kind="about" label="שירות" title={g("aboutTitle")} text={g("aboutText")} className={skin.alt} />
          <ValuesSection id="shop-proof-values" />
          <SimpleInfoSection id="shop-bundle-builder" kind="cta" label="בניית סט" title={g("ctaTitle")} text={g("ctaText")} />
          <JournalSection id="shop-buying-guides" className={skin.alt} />
          <ShippingPills id="shop-shipping-strip" />
          <NewsletterSection id="shop-newsletter" className={skin.alt} />
          {Footer}
        </div>
      );
    }

    if (pageId === "collections") {
      return (
        <div>
          {Header}
          <section {...sectionProps("collections-rich-hero", "hero", "קולקציות")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow={g("collectionsEyebrow")} title={g("collectionsTitle")} text={g("collectionsText")} skin={skin} giant /></div></section>
          <section {...sectionProps("collections-category-map", "categories", "מפת אוספים")} className={skin.alt + " px-5 py-20 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">{categoryTiles.slice(0, 4).map((cat, index) => <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[3/4]" />)}</div></section>
          <section {...sectionProps("collections-product-rows", "products", "שורות אוסף")} className="px-5 py-20 lg:px-8" data-bizuply-widget="products"><div className="mx-auto grid max-w-7xl gap-10">{categoryTiles.slice(0, 4).map((cat) => { const items = products.filter((product) => product.categorySlug === cat.slug || product.category === cat.name).slice(0, 4); const displayItems = items.length ? items : showcase.slice(0, 4); return <div key={cat.id}><div className="flex items-center justify-between gap-4 border-b border-[var(--line)] pb-4"><h2 className={cx("store-display text-3xl font-black", skin.title)}>{cat.name}</h2><button type="button" onClick={() => navigateCategory(cat)} className="text-xs font-black uppercase tracking-[0.18em] text-[var(--p)]">לצפייה</button></div><div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{displayItems.map((product, index) => <ProductCard key={`${cat.id}-${product.id}`} product={product} currency={currency} skin={skin} index={index} onOpen={() => openProduct(product)} onAdd={() => addToCart(product)} />)}</div></div>; })}</div></section>
          <SimpleInfoSection id="collections-story" kind="about" label="סיפור אוסף" title={g("aboutTitle")} text={g("aboutText")} className={skin.alt} />
          <ProductRail id="collections-featured" label="אוסף מוביל" title="האוסף שהלקוחות בוחרים" productsToShow={showcase.slice(0, 4)} />
          <ValuesSection id="collections-comparison" className={skin.alt} />
          <GalleryTriptych id="collections-lookbook" label="לוקבוק אוספים" />
          <ShippingPills id="collections-delivery" className={skin.alt} />
          <TestimonialsSection id="collections-reviews" />
          <NewsletterSection id="collections-newsletter" />
          {Footer}
        </div>
      );
    }

    if (pageId === "product") {
      return (
        <div>
          {Header}
          <section {...sectionProps("product-rich-main", "product", "מוצר")} className="px-5 py-16 lg:px-8 lg:py-24">
            {selectedProduct ? (
              <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
                <Reveal variant="right"><StoreImage src={selectedProduct.image} alt={selectedProduct.name} fallbackLabel={selectedProduct.name} className={cx("w-full object-cover", skin.media)} /></Reveal>
                <Reveal variant="left" className="text-right"><p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--p)]">{selectedProduct.category}</p><h1 className={cx("store-display mt-4 text-5xl font-black", skin.title)}>{selectedProduct.name}</h1><p className="mt-4 text-2xl font-black text-[var(--p)]">{formatStorePrice((selectedProduct.variants.find((v) => v.id === selectedVariantId)?.price ?? selectedProduct.price), currency)}</p><p className="mt-6 text-base leading-8 text-[var(--muted)]">{selectedProduct.shortDescription || g("productFallbackText")}</p>{selectedProduct.variants.length > 0 ? <div className="mt-6"><p className="mb-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]">בחירת וריאציה</p><div className="flex flex-wrap gap-2">{selectedProduct.variants.map((variant) => { const disabled = selectedProduct.trackStock && !selectedProduct.allowBackorder && variant.stock <= 0; return <button key={variant.id || variant.label} type="button" disabled={disabled} onClick={() => setSelectedVariantId(variant.id)} className={cx("px-4 py-2 text-xs font-black", skin.outlineButton, selectedVariantId === variant.id ? "ring-2 ring-[var(--p)]" : "", disabled ? "opacity-40" : "")}>{variant.label || variant.optionValue}{selectedProduct.trackStock ? ` · ${variant.stock}` : ""}</button>; })}</div></div> : null}{!selectedProduct.inStock ? <p className="mt-4 text-sm font-black text-red-600">אזל מהמלאי</p> : selectedProduct.trackStock && selectedProduct.stock <= 3 ? <p className="mt-4 text-sm font-black text-amber-600">נותרו {selectedProduct.stock} במלאי</p> : null}{stockMessage ? <p className="mt-3 text-sm font-black text-red-600">{stockMessage}</p> : null}<div className="mt-8 flex flex-wrap items-center gap-3"><div className={cx("flex items-center border", skin.input)}><button type="button" className="px-4 py-3" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button><span className="min-w-10 text-center font-black">{qty}</span><button type="button" className="px-4 py-3" onClick={() => setQty((q) => q + 1)}>+</button></div><button type="button" disabled={!selectedProduct.inStock} onClick={() => { addToCart(selectedProduct, qty); goToPage("cart"); }} className={cx("text-sm font-black", skin.button, !selectedProduct.inStock ? "opacity-50" : "")}>{selectedProduct.inStock ? "הוספה לסל" : "אזל מהמלאי"}</button><button type="button" onClick={() => goToPage("shop")} className={cx("text-sm font-black", skin.outlineButton)}>חזרה לחנות</button></div></Reveal>
              </div>
            ) : <p className="mx-auto max-w-7xl text-[var(--muted)]">אין מוצרים להצגה.</p>}
          </section>
          <SimpleInfoSection id="product-rich-details" kind="features" label="פרטים" title={g("productDetailOne")} text={g("productDetailTwo")} className={skin.alt} />
          <ValuesSection id="product-rich-specs" />
          <ProductRail id="product-rich-related" label="מוצרים דומים" title="אולי גם יעניין אתכם" productsToShow={products.filter((p) => p.id !== selectedProduct?.id).slice(0, 4)} className={skin.alt} />
          <SimpleInfoSection id="product-rich-story" kind="about" label="סיפור מוצר" title={g("aboutTitle")} text={g("aboutText")} />
          <GalleryTriptych id="product-rich-use-cases" label="שימושים וסגנון" className={skin.alt} />
          <TestimonialsSection id="product-rich-reviews" />
          <ShippingPills id="product-rich-shipping" />
          <SimpleInfoSection id="product-rich-faq" kind="faq" label="שאלה נפוצה" title={g("faqOneQ")} text={g("faqOneA")} className={skin.alt} />
          <JournalSection id="product-rich-guides" />
          <NewsletterSection id="product-rich-newsletter" className={skin.alt} />
          {Footer}
        </div>
      );
    }

    if (pageId === "cart") {
      return (
        <div>
          {Header}
          <section {...sectionProps("cart-rich-main", "cart", "סל")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-5xl"><h1 className={cx("store-display text-5xl font-black", skin.title)}>{g("cartTitle")}</h1><p className="mt-3 text-[var(--muted)]">{g("cartText")}</p><div className="mt-10 space-y-4">{cart.length === 0 ? <div className={cx("border border-dashed p-10 text-center", skin.softCard)}><p className="text-[var(--muted)]">הסל ריק כרגע.</p><button type="button" onClick={() => goToPage("shop")} className={cx("mt-6 text-sm font-black", skin.button)}>לעמוד החנות</button></div> : cart.map((item) => <div key={item.id} className={cx("flex flex-wrap items-center justify-between gap-4 border p-4", skin.card)}><div className="flex items-center gap-4"><StoreImage src={item.image} alt="" fallbackLabel={item.name} className="h-20 w-16 object-cover" /><div className="text-right"><p className="font-black">{item.name}</p>{item.variantLabel ? <p className="text-xs font-bold text-[var(--muted)]">{item.variantLabel}</p> : null}<p className="text-sm text-[var(--muted)]">{formatStorePrice(item.price, currency)} x {item.qty}</p></div></div><div className="flex items-center gap-3"><p className="font-black">{formatStorePrice(item.price * item.qty, currency)}</p><button type="button" className="text-xs font-bold text-red-600" onClick={() => setCart((prev) => prev.filter((x) => x.id !== item.id))}>הסר</button></div></div>)}</div>{cart.length > 0 ? <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-6"><p className="text-xl font-black">סה"כ: {formatStorePrice(cartTotal, currency)}</p><button type="button" onClick={openCheckout} className={cx("text-sm font-black", skin.button)}>המשך לתשלום</button></div> : null}</div></section>
          <SimpleInfoSection id="cart-rich-steps" kind="features" label="שלבי הזמנה" title="מה קורה אחרי הסל" text={g("shippingText")} className={skin.alt} />
          <ProductRail id="cart-rich-upsells" label="השלמות לסל" title="אולי תרצו להוסיף" productsToShow={showcase.slice(0, 4)} />
          <ShippingPills id="cart-rich-secure" className={skin.alt} />
          <SimpleInfoSection id="cart-rich-support" kind="contact" label="תמיכה" title={g("contactTitle")} text={g("contactText")} />
          <ValuesSection id="cart-rich-promises" className={skin.alt} />
          <SimpleInfoSection id="cart-rich-payment" kind="features" label="תשלום" title="תשלום מאובטח" text={g("secureBenefit")} />
          <SimpleInfoSection id="cart-rich-returns" kind="shipping" label="החזרות" title={g("returnBenefit")} text={g("shipThreeText")} className={skin.alt} />
          <SimpleInfoSection id="cart-rich-gift-note" kind="cta" label="מתנה" title="אפשר להוסיף פתק אישי" text={g("ctaText")} />
          <NewsletterSection id="cart-rich-newsletter" className={skin.alt} />
          {Footer}
        </div>
      );
    }

    if (pageId === "lookbook") {
      return (
        <div>
          {Header}
          <section {...sectionProps("lookbook-rich-hero", "hero", "לוקבוק")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow={g("lookbookEyebrow")} title={g("lookbookTitle")} text={g("lookbookText")} skin={skin} giant /></div></section>
          <GalleryTriptych id="lookbook-rich-mosaic" label="מוזאיקה ראשית" className={skin.alt} />
          <ProductRail id="lookbook-rich-products" label="מוצרים מתוך הלוקבוק" title={g("productsTitle")} text={g("productsText")} />
          <GalleryTriptych id="lookbook-rich-scenes" label="סצנות נוספות" />
          <SimpleInfoSection id="lookbook-rich-materials" kind="features" label="חומרים" title={g("productDetailOne")} text={g("productDetailTwo")} className={skin.alt} />
          <SimpleInfoSection id="lookbook-rich-behind" kind="about" label="מאחורי הצילום" title={g("aboutTitle")} text={g("aboutText")} />
          <ValuesSection id="lookbook-rich-style-guide" className={skin.alt} />
          <JournalSection id="lookbook-rich-journal" />
          <SimpleInfoSection id="lookbook-rich-cta" kind="cta" label="המשך" title={g("ctaTitle")} text={g("ctaText")} className={skin.alt} />
          <NewsletterSection id="lookbook-rich-newsletter" />
          {Footer}
        </div>
      );
    }

    if (pageId === "about") {
      return (
        <div>
          {Header}
          <section {...sectionProps("about-rich-hero", "hero", "אודות")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2"><StoreImage src={g("aboutImage")} alt="" fallbackLabel={g("aboutTitle")} className={cx("w-full object-cover", skin.media)} /><SectionHeading eyebrow={g("aboutEyebrow")} title={g("aboutTitle")} text={g("aboutText")} skin={skin} giant /></div></section>
          <ValuesSection id="about-rich-values" className={skin.alt} />
          <SimpleInfoSection id="about-rich-timeline" kind="features" label="ציר זמן" title="איך המותג גדל" text={g("aboutTextTwo")} />
          <SimpleInfoSection id="about-rich-craft" kind="features" label="אומנות" title={g("productDetailOne")} text={g("productDetailTwo")} className={skin.alt} />
          <GalleryTriptych id="about-rich-studio" label="סטודיו" />
          <section {...sectionProps("about-rich-stats", "features", "מספרים")} className={skin.alt + " px-5 py-14 lg:px-8"}><div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-4">{["24h", "3", "100%", "5★"].map((v, i) => <StatPill key={v} value={v} label={`מדד 0${i + 1}`} skin={skin} />)}</div></section>
          <SimpleInfoSection id="about-rich-sourcing" kind="about" label="מקורות" title="בחירה אחראית" text={g("valueOneText")} />
          <TestimonialsSection id="about-rich-testimonials" />
          <SimpleInfoSection id="about-rich-cta" kind="cta" label="הזמנה" title={g("ctaTitle")} text={g("ctaText")} className={skin.alt} />
          <NewsletterSection id="about-rich-newsletter" />
          {Footer}
        </div>
      );
    }

    if (pageId === "journal") {
      return (
        <div>
          {Header}
          <section
            {...sectionProps("journal-rich-hero", "hero", "מגזין")}
            className="journal-hero relative isolate min-h-[72vh] overflow-hidden"
          >
            <div className="journal-media absolute inset-0">
              <StoreImage
                src={g("lookOne") || g("heroImage")}
                alt={g("journalTitle")}
                fallbackLabel={g("journalTitle")}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />
            <div className="relative z-10 mx-auto flex min-h-[72vh] max-w-7xl flex-col justify-end px-5 py-16 text-right text-white lg:px-8 lg:py-24">
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/75">
                {g("journalEyebrow")}
              </p>
              <h1 className={cx("store-display mt-4 max-w-4xl text-4xl font-black leading-tight sm:text-5xl md:text-7xl", skin.title)}>
                {g("journalTitle")}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                {g("journalText")}
              </p>
            </div>
          </section>
          <section
            {...sectionProps("journal-rich-spotlight", "journal", "כתבה ראשית")}
            className={cx("px-5 py-16 lg:px-8 lg:py-24", skin.alt)}
          >
            <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2 lg:items-center">
              <Reveal variant="right">
                <div className="journal-media relative aspect-[4/3] overflow-hidden border bg-[var(--bg-soft)] sm:aspect-[16/10] lg:min-h-[28rem] lg:aspect-auto">
                  <StoreImage
                    src={g("lookOne")}
                    alt={g("journalOneTitle")}
                    fallbackLabel={g("journalOneTitle")}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </Reveal>
              <Reveal variant="left" className="text-right">
                <p className="text-xs font-black uppercase tracking-[0.28em] text-[var(--p)]">כתבה ראשית</p>
                <h2 className={cx("store-display mt-4 text-3xl font-black leading-tight sm:text-4xl md:text-5xl", skin.title)}>
                  {g("journalOneTitle")}
                </h2>
                <p className="mt-5 text-base leading-8 text-[var(--muted)]">{g("journalOneText")}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[g("lookTwo"), g("lookThree")].map((image, index) => (
                    <div
                      key={image || index}
                      className="journal-card-media relative aspect-[16/10] overflow-hidden border bg-[var(--bg-soft)]"
                    >
                      <StoreImage
                        src={image}
                        alt=""
                        fallbackLabel={g("journalTitle")}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>
          <JournalSection id="journal-rich-featured" showHeading={false} />
          <ProductRail id="journal-rich-editor-picks" label="בחירות מערכת" title={g("productsTitle")} productsToShow={showcase.slice(0, 4)} className={skin.alt} />
          <section {...sectionProps("journal-rich-categories", "categories", "מדורי תוכן")} className="px-5 py-20 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <SectionHeading eyebrow="מדורים" title="נושאים לקריאה" skin={skin} />
              <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {categoryTiles.slice(0, 4).map((cat, index) => (
                  <CategoryTile key={cat.id} cat={cat} index={index} className="aspect-[4/5]" />
                ))}
              </div>
            </div>
          </section>
          <GalleryTriptych id="journal-rich-behind-scenes" label="מאחורי הקלעים" className={skin.alt} />
          <SimpleInfoSection id="journal-rich-interview" kind="journal" label="ראיון" title={g("journalTwoTitle")} text={g("journalTwoText")} />
          <ValuesSection id="journal-rich-guides" className={skin.alt} />
          <NewsletterSection id="journal-rich-newsletter" />
          {Footer}
        </div>
      );
    }

    if (pageId === "contact") {
      return (
        <div>
          {Header}
          <section {...sectionProps("contact-rich-hero", "hero", "קשר")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow={g("contactEyebrow")} title={g("contactTitle")} text={g("contactText")} skin={skin} giant /></div></section>
          <section {...sectionProps("contact-rich-form", "contact", "טופס")} className={skin.alt + " px-5 py-16 lg:px-8"}><form className={cx("mx-auto grid max-w-3xl gap-3 border p-6", skin.card)} data-bizuply-block="lead-form" data-bizuply-crm-lead="true" data-bizuply-form-builder="true" data-bizuply-form-id="store-contact" data-bizuply-success-message="תודה! קיבלנו את הפנייה ונחזור אלייך בהקדם."><input className={cx("border px-4 py-3 text-sm", skin.input)} placeholder="שם מלא" name="name" data-bizuply-form-field-id="name" type="text" autoComplete="name" /><input className={cx("border px-4 py-3 text-sm", skin.input)} placeholder="טלפון" name="phone" data-bizuply-form-field-id="phone" type="tel" autoComplete="tel" /><input className={cx("border px-4 py-3 text-sm", skin.input)} placeholder="אימייל" name="email" data-bizuply-form-field-id="email" type="email" autoComplete="email" /><textarea className={cx("min-h-32 border px-4 py-3 text-sm", skin.input)} placeholder="הודעה"  name="message" data-bizuply-form-field-id="message"></textarea><button type="submit" className={cx("text-sm font-black", skin.button)}>{g("contactButton")}</button></form></section>
          <section {...sectionProps("contact-rich-cards", "contact", "כרטיסי קשר")} className="px-5 py-16 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-3">{[["טלפון", g("phone")], ["אימייל", g("email")], ["כתובת", g("address")]].map(([label, value]) => <div key={label} className={cx("border p-7 text-right", skin.card)}><p className="text-xs font-black uppercase tracking-[0.22em] text-[var(--p)]">{label}</p><p className="mt-3 text-lg font-black">{value}</p></div>)}</div></section>
          <SimpleInfoSection id="contact-rich-map" kind="contact" label="מפה" title={g("address")} text="מפה אינטראקטיבית תתחבר כאן בפרסום האתר." className={skin.alt} />
          <SimpleInfoSection id="contact-rich-hours" kind="contact" label="שעות" title="זמינים לשאלות" text="ראשון עד חמישי, 09:00-18:00." />
          <SimpleInfoSection id="contact-rich-support" kind="contact" label="תמיכה" title={g("supportBenefit")} text={g("contactText")} className={skin.alt} />
          <SimpleInfoSection id="contact-rich-wholesale" kind="contact" label="עסקי" title="הזמנות מרוכזות" text={g("ctaText")} />
          <SimpleInfoSection id="contact-rich-appointments" kind="contact" label="פגישה" title="ייעוץ אישי" text={g("aboutTextTwo")} className={skin.alt} />
          <SimpleInfoSection id="contact-rich-faq" kind="faq" label="שאלה מהירה" title={g("faqFourQ")} text={g("faqFourA")} />
          <NewsletterSection id="contact-rich-newsletter" className={skin.alt} />
          {Footer}
        </div>
      );
    }

    if (pageId === "faq") {
      const faqs = [
        [g("faqOneQ"), g("faqOneA")],
        [g("faqTwoQ"), g("faqTwoA")],
        [g("faqThreeQ"), g("faqThreeA")],
        [g("faqFourQ"), g("faqFourA")],
        [g("faqFiveQ"), g("faqFiveA")],
      ];
      const FaqBlock = ({ id, label, offset = 0 }: { id: string; label: string; offset?: number }) => (
        <section {...sectionProps(id, "faq", label)} className={cx("px-5 py-12 lg:px-8", offset % 2 ? skin.alt : "")}><div className="mx-auto max-w-4xl space-y-4">{faqs.slice(0, 3).map(([q, a], i) => <Reveal key={`${id}-${q}`} delayMs={i * 60}><article className={cx("border p-6 text-right", skin.card)}><h3 className="text-lg font-black">{q}</h3><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{a}</p></article></Reveal>)}</div></section>
      );
      return (
        <div>
          {Header}
          <section {...sectionProps("faq-rich-hero", "hero", "שאלות")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="FAQ" title={g("faqTitle")} text={g("faqText")} skin={skin} giant /></div></section>
          <FaqBlock id="faq-rich-general" label="כללי" />
          <FaqBlock id="faq-rich-products" label="מוצרים" offset={1} />
          <FaqBlock id="faq-rich-shipping" label="משלוחים" />
          <FaqBlock id="faq-rich-payment" label="תשלום" offset={1} />
          <FaqBlock id="faq-rich-care" label="טיפול" />
          <FaqBlock id="faq-rich-sizing" label="מידות" offset={1} />
          <SimpleInfoSection id="faq-rich-policies" kind="faq" label="מדיניות" title={g("shippingTitle")} text={g("shippingText")} />
          <SimpleInfoSection id="faq-rich-contact-cta" kind="cta" label="לא מצאת תשובה?" title={g("contactTitle")} text={g("contactText")} className={skin.alt} />
          <NewsletterSection id="faq-rich-newsletter" />
          {Footer}
        </div>
      );
    }

    return (
      <div>
        {Header}
        <section {...sectionProps("shipping-rich-hero", "hero", "משלוחים")} className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-7xl"><SectionHeading eyebrow="Delivery" title={g("shippingTitle")} text={g("shippingText")} skin={skin} giant /></div></section>
        <ShippingPills id="shipping-rich-promise" className={skin.alt} />
        <section {...sectionProps("shipping-rich-zones", "shipping", "אזורי שילוח")} className="px-5 py-16 lg:px-8"><div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-4">{[g("shipOneTitle"), g("shipTwoTitle"), g("shipThreeTitle"), g("shipFourTitle")].map((title, index) => <div key={title} className={cx("border p-6 text-right", skin.card)}><p className="text-xs font-black text-[var(--p)]">0{index + 1}</p><h3 className="mt-3 font-black">{title}</h3><p className="mt-3 text-sm leading-7 text-[var(--muted)]">{[g("shipOneText"), g("shipTwoText"), g("shipThreeText"), g("shipFourText")][index]}</p></div>)}</div></section>
        <SimpleInfoSection id="shipping-rich-timeline" kind="shipping" label="לוח זמנים" title="מהזמנה עד הדלת" text={g("shippingText")} className={skin.alt} />
        <SimpleInfoSection id="shipping-rich-returns" kind="shipping" label="החזרות" title={g("returnBenefit")} text={g("shipThreeText")} />
        <SimpleInfoSection id="shipping-rich-pickup" kind="shipping" label="איסוף" title={g("shipFourTitle")} text={g("shipFourText")} className={skin.alt} />
        <SimpleInfoSection id="shipping-rich-packaging" kind="shipping" label="אריזה" title={g("shipOneTitle")} text={g("shipOneText")} />
        <SimpleInfoSection id="shipping-rich-international" kind="shipping" label="בינלאומי" title="שילוח מיוחד" text="אפשר לתאם פתרונות שילוח לפי יעד ומוצר." className={skin.alt} />
        <SimpleInfoSection id="shipping-rich-faq" kind="faq" label="שאלה נפוצה" title={g("faqThreeQ")} text={g("faqThreeA")} />
        <NewsletterSection id="shipping-rich-newsletter" className={skin.alt} />
        {Footer}
      </div>
    );
  };

  const activePage = (
    [
      "home",
      "shop",
      "collections",
      "product",
      "cart",
      "lookbook",
      "about",
      "journal",
      "contact",
      "faq",
      "shipping",
    ] as string[]
  ).includes(currentPage)
    ? (currentPage as RichStoreSitePageId)
    : "home";

  const activeContent =
    activePage === "home" ? renderHome() : renderSecondaryPage(activePage);

  const stackPages = [{ id: currentPage || "home", content: activeContent }];

  return (
    <div
      dir="rtl"
      data-template-id={templateId}
      data-rich-store-layout={layoutId}
      data-bizuply-site="true"
      data-store-plugin="true"
      data-bizuply-template-cart="true"
      className={cx(
        "min-h-screen w-full overflow-x-hidden bg-[var(--bg)] text-right text-[var(--text)]",
        skin.page,
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: editorCss }} />
      <VisualPageStack activePageId={currentPage || "home"} pages={stackPages} />
      <div className="sr-only" aria-live="polite">
        עמוד נוכחי: {pageLabel(activePage)}
      </div>
    </div>
  );
}
