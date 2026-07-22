import type { ElementCategory, StudioElement } from "../types";

export const elementCategories: {
  key: ElementCategory;
  label: string;
  icon: string;
}[] = [
  { key: "text", label: "טקסט", icon: "T" },
  { key: "image", label: "תמונה", icon: "▧" },
  { key: "button", label: "כפתור", icon: "◉" },
  { key: "strip", label: "סקציה", icon: "▭" },
  { key: "decorative", label: "עיצוב", icon: "✦" },
  { key: "box", label: "קופסה", icon: "□" },
  { key: "gallery", label: "גלריה", icon: "▦" },
  { key: "menu", label: "תפריט", icon: "☰" },
  { key: "forms", label: "טפסים", icon: "▤" },
  { key: "video", label: "וידאו", icon: "▶" },
  { key: "interactive", label: "אינטראקטיבי", icon: "✺" },
  { key: "list", label: "רשימות", icon: "≡" },
  { key: "embed", label: "Embed", icon: "</>" },
  { key: "social", label: "סושיאל", icon: "↗" },
  { key: "payments", label: "תשלומים", icon: "₪" },
  { key: "store", label: "חנות", icon: "◈" },
  { key: "bookings", label: "תורים", icon: "◷" },
  { key: "bizuply", label: "Bizuply", icon: "B" },
];

const images = {
  beauty:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=90",
  beautySoft:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=90",
  salon:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=90",
  clinic:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=90",
  store:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=90",
  product:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=90",
  office:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
  people:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=90",
  food:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=90",
  fitness:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=90",
};

function element(
  id: string,
  label: string,
  description: string,
  icon: string,
  category: ElementCategory,
  html: string
): StudioElement {
  return {
    id,
    label,
    description,
    icon,
    category,
    html,
  };
}

const section =
  "relative mx-auto w-full max-w-7xl px-6 py-20 sm:px-10 lg:px-12";
const card =
  "rounded-[2rem] border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]";
const title =
  "text-4xl font-black leading-tight tracking-[-0.04em] text-slate-800 md:text-6xl";
const h2 =
  "text-3xl font-black leading-tight tracking-[-0.035em] text-slate-800 md:text-5xl";
const text =
  "mt-5 max-w-3xl text-base font-bold leading-8 text-slate-500 md:text-lg";
const pill =
  "mb-4 inline-flex rounded-full bg-violet-50 px-5 py-2 text-xs font-black text-violet-700";
const primaryBtn =
  "inline-flex min-h-12 items-center justify-center rounded-2xl bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 px-7 text-sm font-black text-black shadow-xl shadow-violet-200 transition hover:-translate-y-0.5";
const secondaryBtn =
  "inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-7 text-sm font-black text-slate-800 shadow-lg transition hover:-translate-y-0.5 hover:border-violet-200 hover:text-violet-700";
const input =
  "min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-300 focus:bg-white";
const textarea =
  "min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-violet-300 focus:bg-white";

function img(src: string, extra = "h-[360px]") {
  return `<div class="overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.10)]" data-editable-image-card="true"><img src="${src}" alt="" class="${extra} w-full rounded-[1.5rem] object-cover" data-editable-image="true" /></div>`;
}

function actionRow(primary = "קביעת תור", secondary = "יצירת קשר") {
  return `<div class="mt-8 flex flex-wrap gap-3"><a class="${primaryBtn}">${primary}</a><a class="${secondaryBtn}">${secondary}</a></div>`;
}

export const studioElements: StudioElement[] = [
  /* =====================================================
     TEXT — professional editable text blocks
  ===================================================== */

  element(
    "text-h1",
    "כותרת H1 ענקית",
    "כותרת ראשית גדולה ומרשימה",
    "H1",
    "text",
    `<h1 class="${title}" data-editable-text="true">כותרת ראשית מרשימה</h1>`
  ),

  element(
    "text-h2",
    "כותרת H2",
    "כותרת גדולה לסקשן",
    "H2",
    "text",
    `<h2 class="${h2}" data-editable-text="true">כותרת סקשן מקצועית</h2>`
  ),

  element(
    "text-h3",
    "כותרת כרטיס",
    "כותרת לשירות, מוצר או יתרון",
    "H3",
    "text",
    `<h3 class="text-2xl font-black tracking-[-0.02em] text-slate-800" data-editable-text="true">כותרת כרטיס</h3>`
  ),

  element(
    "text-paragraph",
    "פסקה",
    "טקסט הסבר מקצועי",
    "¶",
    "text",
    `<p class="${text}" data-editable-text="true">כאן כותבים טקסט מקצועי וברור שמסביר את הערך של העסק, השירות או ההצעה.</p>`
  ),

  element(
    "text-kicker",
    "כותרת קטנה",
    "תגית מעל כותרת",
    "•",
    "text",
    `<p class="${pill}" data-editable-text="true">כותרת קטנה</p>`
  ),

  element(
    "text-pill",
    "תגית Pill",
    "תגית מעוגלת למבצע או סטטוס",
    "P",
    "text",
    `<div class="${pill}" data-editable-text="true">חדש · אתר מקצועי לעסק</div>`
  ),

  element(
    "text-highlight",
    "משפט מודגש",
    "משפט גדול שמושך תשומת לב",
    "!",
    "text",
    `<p class="max-w-4xl text-3xl font-black leading-snug tracking-[-0.03em] text-slate-800 md:text-5xl" data-editable-text="true">משפט מודגש שמוביל את הלקוח להבין למה לבחור דווקא בכם.</p>`
  ),

  element(
    "text-quote",
    "ציטוט",
    "ציטוט לקוח או משפט השראה",
    "”",
    "text",
    `<blockquote class="${card} text-2xl font-black leading-10 text-slate-900" data-editable-text="true">“חוויה מקצועית, ברורה ויוקרתית מהרגע הראשון.”</blockquote>`
  ),

  element(
    "text-stat-row",
    "מספרי אמון",
    "שלושה נתונים קצרים",
    "123",
    "text",
    `<div class="grid gap-4 md:grid-cols-3"><div class="${card} text-center"><strong class="text-4xl font-black text-slate-800">500+</strong><p class="mt-2 text-sm font-bold text-slate-500">לקוחות</p></div><div class="${card} text-center"><strong class="text-4xl font-black text-slate-800">98%</strong><p class="mt-2 text-sm font-bold text-slate-500">שביעות רצון</p></div><div class="${card} text-center"><strong class="text-4xl font-black text-slate-800">7</strong><p class="mt-2 text-sm font-bold text-slate-500">שנות ניסיון</p></div></div>`
  ),

  element(
    "text-marquee",
    "טקסט נע",
    "שורת פרסום נעה",
    "↔",
    "text",
    `<div class="overflow-hidden rounded-3xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"><div class="whitespace-nowrap text-center text-sm font-black tracking-wide">מבצע מיוחד · קביעת תור אונליין · שירות מקצועי · חוויית לקוח פרימיום ·</div></div>`
  ),

  /* =====================================================
     IMAGE
  ===================================================== */

  element(
    "image-basic",
    "תמונה",
    "תמונה עם מסגרת פרימיום",
    "▧",
    "image",
    img(images.beautySoft)
  ),

  element(
    "image-rounded",
    "תמונה עגולה",
    "תמונה לפרופיל / בעל עסק",
    "◯",
    "image",
    `<img src="${images.salon}" alt="" class="h-72 w-72 rounded-full object-cover shadow-[0_28px_90px_rgba(15,23,42,0.15)]" data-editable-image="true" />`
  ),

  element(
    "image-wide",
    "תמונה רחבה",
    "תמונה רחבה לראש סקשן",
    "▭",
    "image",
    img(images.beauty, "h-[440px]")
  ),

  element(
    "image-background-card",
    "תמונת רקע",
    "כרטיס עם תמונה כרקע וטקסט",
    "▧",
    "image",
    `<div class="relative min-h-[480px] overflow-hidden rounded-[2.5rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 p-10 shadow-[0_30px_110px_rgba(15,23,42,0.18)]" style="background-image:linear-gradient(135deg,rgba(2,6,23,.72),rgba(2,6,23,.25)),url('${images.beautySoft}');background-size:cover;background-position:center;" data-background-editable="true"><div class="max-w-xl"><p class="mb-4 inline-flex rounded-full bg-white/15 px-5 py-2 text-xs font-black text-black">תמונת רקע</p><h2 class="text-5xl font-black leading-tight tracking-[-0.04em] text-white">כותרת על תמונת רקע</h2><p class="mt-5 text-lg font-bold leading-8 text-white/75">אפשר להחליף תמונה, צבע, טקסט וכפתורים.</p>${actionRow("פעולה ראשית", "מידע נוסף")}</div></div>`
  ),

  element(
    "image-before-after",
    "לפני / אחרי",
    "השוואת שתי תמונות",
    "⇄",
    "image",
    `<section class="${section}"><h2 class="${h2} text-center">לפני ואחרי</h2><div class="mt-10 grid gap-6 md:grid-cols-2"><div>${img(images.beautySoft, "h-[380px]")}<p class="mt-4 text-center text-sm font-black text-slate-500">לפני</p></div><div>${img(images.salon, "h-[380px]")}<p class="mt-4 text-center text-sm font-black text-slate-500">אחרי</p></div></div></section>`
  ),

  element(
    "image-stack",
    "שתי תמונות מדורגות",
    "תצוגת תמונות יוקרתית",
    "▥",
    "image",
    `<div class="relative min-h-[520px]"><div class="absolute right-0 top-0 w-[72%]">${img(images.beautySoft, "h-[380px]")}</div><div class="absolute bottom-0 left-0 w-[58%]">${img(images.product, "h-[300px]")}</div></div>`
  ),

  /* =====================================================
     BUTTONS
  ===================================================== */

  element(
    "button-primary",
    "כפתור ראשי",
    "כפתור פעולה מרכזי",
    "●",
    "button",
    `<a class="${primaryBtn}" data-editable-link="true">כפתור פעולה</a>`
  ),

  element(
    "button-secondary",
    "כפתור משני",
    "כפתור רגוע יותר",
    "○",
    "button",
    `<a class="${secondaryBtn}" data-editable-link="true">כפתור משני</a>`
  ),

  element(
    "button-double",
    "שני כפתורים",
    "שני כפתורי פעולה יחד",
    "◉",
    "button",
    actionRow()
  ),

  element(
    "button-whatsapp",
    "כפתור וואטסאפ",
    "קישור מהיר לוואטסאפ",
    "☎",
    "button",
    `<a class="${primaryBtn}" href="https://wa.me/972500000000" data-editable-link="true">שליחה בוואטסאפ</a>`
  ),

  element(
    "button-phone",
    "כפתור שיחה",
    "קישור להתקשרות",
    "☏",
    "button",
    `<a class="${secondaryBtn}" href="tel:0500000000" data-editable-link="true">התקשרו עכשיו</a>`
  ),

  element(
    "button-floating",
    "כפתור צף",
    "כפתור צף בתחתית האתר",
    "↗",
    "button",
    `<a class="${primaryBtn} fixed bottom-7 left-7 z-[999] rounded-full" href="https://wa.me/972500000000" data-editable-link="true">וואטסאפ</a>`
  ),

  /* =====================================================
     STRIP / SECTIONS
  ===================================================== */

  element(
    "strip-light",
    "סקציה בהירה",
    "סקציה נקייה",
    "▭",
    "strip",
    `<section class="${section}" data-section-kind="basic"><div class="mx-auto max-w-3xl text-center"><p class="${pill}">סקציה חדשה</p><h2 class="${h2}">כותרת סקשן</h2><p class="${text} mx-auto">טקסט הסבר קצר וברור שמסביר את האזור באתר.</p></div></section>`
  ),

  element(
    "strip-soft",
    "סקציה רכה",
    "סקציה עם רקע רך וצל",
    "▱",
    "strip",
    `<section class="${section}" data-section-kind="basic"><div class="rounded-[3rem] bg-gradient-to-br from-violet-50 to-white p-12 shadow-[0_30px_110px_rgba(15,23,42,0.08)]"><p class="${pill}">אזור מעוצב</p><h2 class="${h2}">סקציה רכה ומעוצבת</h2><p class="${text}">אפשר לשנות צבעים, רקע, פינות, ריווח ותמונה.</p></div></section>`
  ),

  element(
    "strip-dark",
    "סקציה כהה",
    "סקציה כהה יוקרתית",
    "◼",
    "strip",
    `<section class="${section}" data-section-kind="basic"><div class="rounded-[3rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_34px_120px_rgba(15,23,42,0.22)]"><p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-xs font-black text-black">Premium</p><h2 class="${h2} text-white">סקציה כהה ויוקרתית</h2><p class="${text} text-white/70">מתאים להצגת שירות יוקרתי, מבצע או מסר חשוב.</p></div></section>`
  ),

  element(
    "strip-background-image",
    "סקציה עם תמונת רקע",
    "סקציה עם Overlay",
    "▧",
    "strip",
    `<section class="${section}" data-section-kind="basic"><div class="relative min-h-[560px] overflow-hidden rounded-[3rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 p-12" style="background-image:linear-gradient(135deg,rgba(2,6,23,.72),rgba(2,6,23,.24)),url('${images.beautySoft}');background-size:cover;background-position:center;" data-background-editable="true"><div class="max-w-2xl"><p class="mb-4 inline-flex rounded-full bg-white/15 px-5 py-2 text-xs font-black text-black">תמונת רקע</p><h2 class="${h2} text-white">סקציה עם תמונת רקע</h2><p class="${text} text-white/80">אפשר להחליף תמונה, צבעים, כפתורים וטקסטים.</p>${actionRow()}</div></div></section>`
  ),

  element(
    "strip-split",
    "סקציה חצויה",
    "טקסט בצד ותמונה בצד",
    "▥",
    "strip",
    `<section class="${section} grid items-center gap-12 lg:grid-cols-2" data-section-kind="basic"><div><p class="${pill}">כותרת קטנה</p><h2 class="${h2}">סקציה חצויה מקצועית</h2><p class="${text}">טקסט בצד אחד ותמונה בצד השני. מתאים לשירות, אודות או מוצר.</p>${actionRow()}</div>${img(images.salon)}</section>`
  ),

  element(
    "strip-cta",
    "CTA רחב",
    "אזור הנעה לפעולה",
    "↗",
    "strip",
    `<section class="${section}" data-section-kind="contact"><div class="rounded-[3rem] bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 p-12 text-center text-white shadow-[0_30px_110px_rgba(139,92,246,.28)]"><h2 class="${h2} text-white">מוכנים להתחיל?</h2><p class="mx-auto mt-5 max-w-2xl text-lg font-bold leading-8 text-white/80">משפט קצר שמוביל את הלקוח להשאיר פרטים או לקבוע תור.</p><div class="mt-8 flex justify-center"><a class="inline-flex min-h-12 items-center rounded-2xl bg-white px-8 text-sm font-black text-violet-700">יצירת קשר</a></div></div></section>`
  ),

  /* =====================================================
     DECORATIVE
  ===================================================== */

  element(
    "decor-divider",
    "קו מפריד",
    "קו מעבר עדין",
    "—",
    "decorative",
    `<div class="my-12 h-px w-full bg-gradient-to-l from-transparent via-violet-400 to-transparent"></div>`
  ),

  element(
    "decor-spacer",
    "רווח",
    "רווח אנכי",
    "↕",
    "decorative",
    `<div class="h-20"></div>`
  ),

  element(
    "decor-gradient-orb",
    "עיגול גרדיאנט",
    "אלמנט דקורטיבי",
    "●",
    "decorative",
    `<div class="h-48 w-48 rounded-full bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 opacity-70 blur-sm"></div>`
  ),

  element(
    "decor-badge",
    "תגית צפה",
    "תגית מבצע",
    "✦",
    "decorative",
    `<div class="inline-flex rounded-full bg-white px-5 py-3 text-xs font-black text-violet-700 shadow-[0_18px_55px_rgba(15,23,42,.12)]">חדש · פרימיום</div>`
  ),

  element(
    "decor-wave",
    "גל מעבר",
    "מעבר דקורטיבי בין אזורים",
    "≈",
    "decorative",
    `<div class="h-24 w-full rounded-[3rem] bg-gradient-to-l from-violet-50 via-white to-fuchsia-50"></div>`
  ),

  /* =====================================================
     BOX
  ===================================================== */

  element(
    "box-card",
    "כרטיס מידע",
    "כרטיס בסיסי",
    "□",
    "box",
    `<article class="${card}"><div class="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-lg font-black text-violet-700">✦</div><h3 class="text-2xl font-black text-slate-800">כרטיס מידע</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">טקסט קצר בתוך כרטיס מעוצב.</p></article>`
  ),

  element(
    "box-price",
    "כרטיס מחיר",
    "שירות עם מחיר",
    "₪",
    "box",
    `<article class="${card}"><h3 class="text-2xl font-black text-slate-800">חבילה מקצועית</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">תיאור קצר של החבילה או השירות.</p><div class="mt-6 flex items-end justify-between gap-4"><span class="text-sm font-bold text-slate-400">החל מ־</span><strong class="text-4xl font-black text-violet-700">₪350</strong></div><a class="${primaryBtn} mt-6 w-full">בחירה</a></article>`
  ),

  element(
    "box-feature",
    "כרטיס יתרון",
    "יתרון לבניית אמון",
    "✓",
    "box",
    `<article class="${card}"><div class="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-lg font-black text-emerald-700">✓</div><h3 class="text-2xl font-black text-slate-800">יתרון מרכזי</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">משפט קצר שמסביר למה כדאי לבחור בעסק.</p></article>`
  ),

  element(
    "box-contact",
    "כרטיס קשר",
    "טלפון, וואטסאפ ופרטי קשר",
    "☎",
    "box",
    `<article class="${card}"><div class="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-lg font-black text-violet-700">☎</div><h3 class="text-2xl font-black text-slate-800">דברו איתנו</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">050-0000000</p><a class="${primaryBtn} mt-6">שליחת הודעה</a></article>`
  ),

  element(
    "box-testimonial",
    "כרטיס ביקורת",
    "ביקורת לקוח",
    "★",
    "box",
    `<article class="${card}"><div class="text-xl text-amber-400">★★★★★</div><p class="mt-4 text-base font-bold leading-8 text-slate-600">שירות מדהים, מקצועי ומדויק. ממליצה בחום.</p><div class="mt-6 flex items-center gap-3"><div class="h-11 w-11 rounded-full bg-violet-100"></div><div><p class="text-sm font-black text-slate-800">לקוחה מרוצה</p><p class="text-xs font-bold text-slate-400">ביקורת מאומתת</p></div></div></article>`
  ),

  element(
    "box-team",
    "כרטיס איש צוות",
    "פרופיל איש צוות",
    "👤",
    "box",
    `<article class="${card} text-center">${img(images.people, "h-64")}<h3 class="mt-6 text-2xl font-black text-slate-800">שם איש צוות</h3><p class="mt-2 text-sm font-bold text-violet-600">תפקיד בעסק</p><p class="mt-3 text-sm font-bold leading-7 text-slate-500">תיאור קצר על ניסיון, התמחות ויחס אישי.</p></article>`
  ),

  /* =====================================================
     GALLERY
  ===================================================== */

  element(
    "gallery-grid",
    "גלריית גריד",
    "ארבע תמונות מסודרות",
    "▦",
    "gallery",
    `<section class="${section}" data-section-kind="gallery"><h2 class="${h2} text-center">גלריה</h2><div class="mt-10 grid gap-5 md:grid-cols-4"><img class="h-64 w-full rounded-[1.5rem] object-cover shadow-lg" src="${images.beautySoft}" data-editable-image="true"/><img class="h-64 w-full rounded-[1.5rem] object-cover shadow-lg" src="${images.salon}" data-editable-image="true"/><img class="h-64 w-full rounded-[1.5rem] object-cover shadow-lg" src="${images.beauty}" data-editable-image="true"/><img class="h-64 w-full rounded-[1.5rem] object-cover shadow-lg" src="${images.product}" data-editable-image="true"/></div></section>`
  ),

  element(
    "gallery-carousel",
    "קרוסלת תמונות",
    "גלריה נגללת לרוחב",
    "↔",
    "gallery",
    `<section class="${section}" data-section-kind="gallery"><h2 class="${h2}">קרוסלה</h2><div class="mt-10 flex gap-5 overflow-x-auto pb-5"><img class="h-72 min-w-[320px] rounded-[1.5rem] object-cover shadow-lg" src="${images.beautySoft}" data-editable-image="true"/><img class="h-72 min-w-[320px] rounded-[1.5rem] object-cover shadow-lg" src="${images.salon}" data-editable-image="true"/><img class="h-72 min-w-[320px] rounded-[1.5rem] object-cover shadow-lg" src="${images.beauty}" data-editable-image="true"/><img class="h-72 min-w-[320px] rounded-[1.5rem] object-cover shadow-lg" src="${images.product}" data-editable-image="true"/></div></section>`
  ),

  element(
    "gallery-featured",
    "גלריה Featured",
    "תמונה גדולה לצד קטנות",
    "▥",
    "gallery",
    `<section class="${section}" data-section-kind="gallery"><h2 class="${h2}">תצוגת עבודות</h2><div class="mt-10 grid gap-5 lg:grid-cols-[1.2fr_.8fr]">${img(images.beautySoft, "h-[560px]")}<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-1"><img class="h-44 w-full rounded-[1.5rem] object-cover shadow-lg" src="${images.salon}" data-editable-image="true"/><img class="h-44 w-full rounded-[1.5rem] object-cover shadow-lg" src="${images.product}" data-editable-image="true"/><img class="h-44 w-full rounded-[1.5rem] object-cover shadow-lg" src="${images.office}" data-editable-image="true"/></div></div></section>`
  ),

  element(
    "gallery-masonry",
    "גלריית Masonry",
    "גלריה גבוהה/נמוכה",
    "▩",
    "gallery",
    `<section class="${section}" data-section-kind="gallery"><h2 class="${h2} text-center">גלריה מעוצבת</h2><div class="mt-10 grid gap-5 md:grid-cols-3"><img class="h-80 w-full rounded-[1.5rem] object-cover shadow-lg" src="${images.beauty}" data-editable-image="true"/><img class="h-56 w-full rounded-[1.5rem] object-cover shadow-lg md:mt-16" src="${images.salon}" data-editable-image="true"/><img class="h-96 w-full rounded-[1.5rem] object-cover shadow-lg" src="${images.product}" data-editable-image="true"/></div></section>`
  ),

  /* =====================================================
     MENU
  ===================================================== */

  element(
    "menu-simple",
    "תפריט פשוט",
    "קישורי ניווט",
    "☰",
    "menu",
    `<nav class="flex flex-wrap items-center justify-center gap-8 rounded-[2rem] border border-slate-200 bg-white px-8 py-5 text-sm font-black text-slate-600 shadow-lg"><a>דף הבית</a><a>אודות</a><a>שירותים</a><a>גלריה</a><a>צור קשר</a></nav>`
  ),

  element(
    "menu-header",
    "Header מלא",
    "לוגו, שם עסק ותפריט",
    "▤",
    "menu",
    `<header class="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 rounded-[2rem] border border-slate-200 bg-white px-6 py-5 shadow-lg"><div class="flex items-center gap-3"><div class="grid h-12 w-12 place-items-center rounded-2xl bg-violet-700 text-lg font-black text-black">B</div><div><p class="text-base font-black text-slate-800">שם העסק</p><p class="text-xs font-bold text-slate-400">תחום העסק</p></div></div><nav class="hidden items-center gap-7 text-sm font-black text-slate-600 md:flex"><a>בית</a><a>אודות</a><a>שירותים</a><a>צור קשר</a></nav><a class="${primaryBtn}">קביעת תור</a></header>`
  ),

  element(
    "menu-footer",
    "Footer",
    "פוטר מלא לאתר",
    "▤",
    "menu",
    `<footer class="mx-auto w-full max-w-7xl rounded-[3rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"><div class="grid gap-10 md:grid-cols-3"><div><h3 class="text-2xl font-black">שם העסק</h3><p class="mt-3 text-sm font-bold leading-7 text-white/60">תיאור קצר על העסק והערך שלו.</p></div><div><p class="font-black">ניווט</p><div class="mt-4 grid gap-2 text-sm font-bold text-black/60"><a>בית</a><a>אודות</a><a>שירותים</a></div></div><div><p class="font-black">יצירת קשר</p><p class="mt-4 text-sm font-bold text-black/60">050-0000000</p></div></div></footer>`
  ),

  /* =====================================================
     FORMS
  ===================================================== */

  element(
    "form-lead",
    "טופס ליד",
    "טופס פנייה ל־CRM",
    "▤",
    "forms",
    `<section class="${section}" data-section-kind="contact" data-bizuply-block="lead-form"><div class="mx-auto max-w-3xl rounded-[3rem] border border-slate-200 bg-white p-8 shadow-[0_30px_100px_rgba(15,23,42,.10)]"><h2 class="${h2}">השאירו פרטים</h2><p class="${text}">נחזור אליכם בהקדם.</p><form class="mt-8 grid gap-4"><input class="${input}" placeholder="שם מלא"/><input class="${input}" placeholder="טלפון"/><input class="${input}" placeholder="אימייל"/><textarea class="${textarea}" placeholder="במה אפשר לעזור?"></textarea><button class="${primaryBtn}" type="button">שליחה</button></form></div></section>`
  ),

  element(
    "form-newsletter",
    "ניוזלטר",
    "הרשמה לעדכונים",
    "✉",
    "forms",
    `<section class="${section}"><div class="rounded-[3rem] bg-gradient-to-br from-violet-50 to-white p-12 text-center shadow-[0_25px_90px_rgba(15,23,42,.08)]"><h2 class="${h2}">הצטרפות לעדכונים</h2><p class="${text} mx-auto">קבלו עדכונים, מבצעים והטבות.</p><form class="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"><input class="${input}" placeholder="אימייל"/><button class="${primaryBtn}" type="button">הרשמה</button></form></div></section>`
  ),

  element(
    "form-booking-request",
    "בקשת תור",
    "טופס בקשת תור",
    "◷",
    "forms",
    `<section class="${section}" data-section-kind="booking"><div class="grid gap-10 lg:grid-cols-2"><div><p class="${pill}">בקשת תור</p><h2 class="${h2}">השאירו פרטים לתיאום</h2><p class="${text}">הלקוח בוחר שירות ותאריך מועדף והבקשה נכנסת למערכת.</p></div><form class="${card} grid gap-4"><input class="${input}" placeholder="שם מלא"/><input class="${input}" placeholder="טלפון"/><input class="${input}" placeholder="שירות רצוי"/><input class="${input}" placeholder="תאריך מועדף"/><button class="${primaryBtn}" type="button">שליחת בקשה</button></form></div></section>`
  ),

  /* =====================================================
     VIDEO
  ===================================================== */

  element(
    "video-youtube",
    "וידאו YouTube",
    "הטמעת סרטון",
    "▶",
    "video",
    `<section class="${section}"><div class="overflow-hidden rounded-[2.5rem] bg-white p-2 shadow-[0_30px_100px_rgba(15,23,42,.12)]"><iframe width="100%" height="520" src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="YouTube video" class="rounded-[2rem]" style="border:0;" allowfullscreen></iframe></div></section>`
  ),

  element(
    "video-background",
    "וידאו רקע",
    "סקשן שנראה כמו וידאו רקע",
    "▶",
    "video",
    `<section class="${section}"><div class="relative grid min-h-[560px] place-items-center overflow-hidden rounded-[3rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 p-12 text-center" style="background-image:linear-gradient(135deg,rgba(2,6,23,.75),rgba(2,6,23,.25)),url('${images.beautySoft}');background-size:cover;background-position:center;"><button class="grid h-20 w-20 place-items-center rounded-full bg-white/90 text-2xl font-black text-violet-700 shadow-2xl">▶</button><h2 class="${h2} mt-8 text-white">וידאו תדמית לעסק</h2><p class="mt-4 max-w-2xl text-lg font-bold leading-8 text-white/75">כאן אפשר להציג וידאו או תמונת רקע מרשימה.</p></div></section>`
  ),

  /* =====================================================
     INTERACTIVE
  ===================================================== */

  element(
    "interactive-accordion",
    "שאלות נפתחות",
    "FAQ",
    "?",
    "interactive",
    `<section class="${section}"><h2 class="${h2} text-center">שאלות נפוצות</h2><div class="mx-auto mt-10 grid max-w-4xl gap-4"><details class="${card}" open><summary class="cursor-pointer text-lg font-black text-slate-800">איך קובעים תור?</summary><p class="mt-3 text-sm font-bold leading-7 text-slate-500">לוחצים על קביעת תור ובוחרים זמן פנוי.</p></details><details class="${card}"><summary class="cursor-pointer text-lg font-black text-slate-800">האם אפשר לשלם באתר?</summary><p class="mt-3 text-sm font-bold leading-7 text-slate-500">כן, ניתן לחבר סליקה לעסק.</p></details></div></section>`
  ),

  element(
    "interactive-tabs",
    "Tabs",
    "טאבים להצגת תוכן",
    "▥",
    "interactive",
    `<section class="${section}"><div class="rounded-[3rem] bg-slate-50 p-8"><div class="flex flex-wrap gap-3"><a class="${primaryBtn}">טאב ראשון</a><a class="${secondaryBtn}">טאב שני</a><a class="${secondaryBtn}">טאב שלישי</a></div><h2 class="${h2} mt-10">תוכן הטאב</h2><p class="${text}">מתאים להצגת שירותים, תוכניות או שלבים.</p></div></section>`
  ),

  element(
    "interactive-counters",
    "מספרים עולים",
    "מספרים ליצירת אמון",
    "123",
    "interactive",
    `<section class="${section}"><div class="grid gap-5 md:grid-cols-3"><div class="${card} text-center"><strong class="text-5xl font-black text-violet-700">500+</strong><span class="mt-3 block text-sm font-bold text-slate-500">לקוחות מרוצים</span></div><div class="${card} text-center"><strong class="text-5xl font-black text-violet-700">7</strong><span class="mt-3 block text-sm font-bold text-slate-500">שנות ניסיון</span></div><div class="${card} text-center"><strong class="text-5xl font-black text-violet-700">98%</strong><span class="mt-3 block text-sm font-bold text-slate-500">שביעות רצון</span></div></div></section>`
  ),

  element(
    "interactive-popup-box",
    "פופאפ / קופון",
    "כרטיס הודעה או קופון",
    "□",
    "interactive",
    `<div class="${card} mx-auto max-w-md text-center"><div class="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-violet-50 text-2xl font-black text-violet-700">✦</div><h3 class="text-2xl font-black text-slate-800">הטבה מיוחדת</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">אפשר להשתמש כקופון, הודעה או קריאה לפעולה.</p><a class="${primaryBtn} mt-6">מימוש הטבה</a></div>`
  ),

  /* =====================================================
     LIST
  ===================================================== */

  element(
    "list-checks",
    "רשימת יתרונות",
    "רשימה עם סימוני וי",
    "✓",
    "list",
    `<ul class="${card} grid gap-4 text-base font-bold text-slate-700" style="list-style:none;"><li>✓ יתרון ראשון של העסק</li><li>✓ יתרון שני שמחזק אמון</li><li>✓ יתרון שלישי שמוביל לפעולה</li></ul>`
  ),

  element(
    "list-steps",
    "שלבי תהליך",
    "3 שלבים ברורים",
    "1",
    "list",
    `<section class="${section}"><h2 class="${h2} text-center">איך זה עובד?</h2><div class="mt-10 grid gap-5 md:grid-cols-3"><article class="${card}"><div class="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-violet-700 text-lg font-black text-black">1</div><h3 class="text-2xl font-black text-slate-800">שיחה</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">מכירים את הצורך.</p></article><article class="${card}"><div class="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-violet-700 text-lg font-black text-black">2</div><h3 class="text-2xl font-black text-slate-800">התאמה</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">בונים פתרון מתאים.</p></article><article class="${card}"><div class="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-violet-700 text-lg font-black text-black">3</div><h3 class="text-2xl font-black text-slate-800">ביצוע</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">יוצאים לדרך.</p></article></div></section>`
  ),

  element(
    "list-pricing",
    "מחירון",
    "רשימת שירותים ומחירים",
    "₪",
    "list",
    `<section class="${section}"><h2 class="${h2}">מחירון שירותים</h2><div class="mt-8 grid gap-3"><div class="${card} flex items-center justify-between"><span class="font-black text-slate-800">שירות ראשון</span><strong class="text-2xl font-black text-violet-700">₪250</strong></div><div class="${card} flex items-center justify-between"><span class="font-black text-slate-800">שירות שני</span><strong class="text-2xl font-black text-violet-700">₪350</strong></div><div class="${card} flex items-center justify-between"><span class="font-black text-slate-800">שירות שלישי</span><strong class="text-2xl font-black text-violet-700">₪450</strong></div></div></section>`
  ),

  /* =====================================================
     EMBED
  ===================================================== */

  element(
    "embed-map",
    "מפה",
    "Google Maps",
    "⌖",
    "embed",
    `<section class="${section}"><div class="overflow-hidden rounded-[2.5rem] bg-white p-2 shadow-[0_30px_100px_rgba(15,23,42,.12)]"><iframe src="https://www.google.com/maps?q=Tel%20Aviv&output=embed" width="100%" height="460" class="rounded-[2rem]" style="border:0;" loading="lazy"></iframe></div></section>`
  ),

  element(
    "embed-html",
    "Embed HTML",
    "מקום לקוד חיצוני",
    "</>",
    "embed",
    `<div class="${card}"><h3 class="text-2xl font-black text-slate-800">Embed</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">כאן אפשר לשים קוד חיצוני בהמשך.</p></div>`
  ),

  /* =====================================================
     SOCIAL
  ===================================================== */

  element(
    "social-row",
    "קישורי סושיאל",
    "אינסטגרם, פייסבוק וטיקטוק",
    "↗",
    "social",
    `<div class="flex flex-wrap gap-3"><a class="${secondaryBtn}">Instagram</a><a class="${secondaryBtn}">Facebook</a><a class="${secondaryBtn}">TikTok</a></div>`
  ),

  element(
    "social-card",
    "כרטיס סושיאל",
    "מעקב ברשתות",
    "#",
    "social",
    `<article class="${card}"><h3 class="text-2xl font-black text-slate-800">עקבו אחרינו</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">הישארו מעודכנים ברשתות החברתיות.</p><div class="mt-6 flex flex-wrap gap-3"><a class="${secondaryBtn}">Instagram</a><a class="${secondaryBtn}">Facebook</a></div></article>`
  ),

  element(
    "social-icons",
    "אייקוני סושיאל",
    "שורת אייקונים עגולים",
    "◎",
    "social",
    `<div class="flex flex-wrap gap-3"><a class="grid h-12 w-12 place-items-center rounded-full border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">IG</a><a class="grid h-12 w-12 place-items-center rounded-full border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">FB</a><a class="grid h-12 w-12 place-items-center rounded-full border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">TT</a><a class="grid h-12 w-12 place-items-center rounded-full border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">WA</a></div>`
  ),

  /* =====================================================
     PAYMENTS
  ===================================================== */

  element(
    "payments-box",
    "תשלום",
    "בלוק תשלום מאובטח",
    "₪",
    "payments",
    `<article class="${card}"><h3 class="text-2xl font-black text-slate-800">תשלום מאובטח</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">חיבור לסליקה של העסק.</p><a class="${primaryBtn} mt-6">לתשלום</a></article>`
  ),

  element(
    "payments-deposit",
    "מקדמה לתור",
    "גביית מקדמה לפני תור",
    "₪",
    "payments",
    `<article class="${card}"><h3 class="text-2xl font-black text-slate-800">תשלום מקדמה</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">אפשר לחבר גביית מקדמה לפני קביעת תור.</p><div class="mt-6 flex items-end justify-between gap-4"><span class="text-sm font-bold text-slate-400">מקדמה</span><strong class="text-4xl font-black text-violet-700">₪100</strong></div><a class="${primaryBtn} mt-6 w-full">תשלום מקדמה</a></article>`
  ),

  element(
    "payments-pricing-table",
    "טבלת חבילות",
    "3 חבילות תשלום",
    "₪",
    "payments",
    `<section class="${section}"><h2 class="${h2} text-center">בחרו חבילה</h2><div class="mt-10 grid gap-5 md:grid-cols-3"><article class="${card}"><h3 class="text-2xl font-black text-slate-800">Basic</h3><strong class="mt-5 block text-4xl font-black text-violet-700">₪99</strong><a class="${secondaryBtn} mt-6 w-full">בחירה</a></article><article class="${card} ring-2 ring-violet-500"><h3 class="text-2xl font-black text-slate-800">Pro</h3><strong class="mt-5 block text-4xl font-black text-violet-700">₪199</strong><a class="${primaryBtn} mt-6 w-full">בחירה</a></article><article class="${card}"><h3 class="text-2xl font-black text-slate-800">VIP</h3><strong class="mt-5 block text-4xl font-black text-violet-700">₪399</strong><a class="${secondaryBtn} mt-6 w-full">בחירה</a></article></div></section>`
  ),

  /* =====================================================
     STORE
  ===================================================== */

  element(
    "store-product-card",
    "מוצר",
    "כרטיס מוצר בודד",
    "◈",
    "store",
    `<article class="${card}">${img(images.product, "h-64")}<h3 class="mt-6 text-2xl font-black text-slate-800">שם מוצר</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">תיאור קצר של המוצר.</p><div class="mt-6 flex items-center justify-between gap-3"><a class="${primaryBtn}">הוספה לסל</a><span class="text-2xl font-black text-violet-700">₪129</span></div></article>`
  ),

  element(
    "store-products-grid",
    "גריד מוצרים",
    "3 מוצרים לרכישה",
    "▦",
    "store",
    `<section class="${section}" data-section-kind="store" data-bizuply-block="products"><h2 class="${h2} text-center">מוצרים לרכישה</h2><div class="mt-10 grid gap-5 md:grid-cols-3"><article class="${card}">${img(images.product, "h-56")}<h3 class="mt-5 text-xl font-black text-slate-800">מוצר ראשון</h3><span class="mt-3 block text-2xl font-black text-violet-700">₪129</span></article><article class="${card}">${img(images.store, "h-56")}<h3 class="mt-5 text-xl font-black text-slate-800">מוצר שני</h3><span class="mt-3 block text-2xl font-black text-violet-700">₪99</span></article><article class="${card}">${img(images.beauty, "h-56")}<h3 class="mt-5 text-xl font-black text-slate-800">מוצר שלישי</h3><span class="mt-3 block text-2xl font-black text-violet-700">₪249</span></article></div></section>`
  ),

  element(
    "store-featured-product",
    "מוצר מוביל",
    "מוצר אחד גדול",
    "◈",
    "store",
    `<section class="${section}" data-section-kind="store"><div class="grid items-center gap-12 lg:grid-cols-2">${img(images.product, "h-[520px]")}<div><p class="${pill}">מוצר מוביל</p><h2 class="${h2}">מוצר פרימיום לעסק</h2><p class="${text}">הצגת מוצר אחד בצורה חזקה עם מחיר, תיאור וכפתור רכישה.</p><div class="mt-8 flex items-center gap-4"><a class="${primaryBtn}">הוספה לסל</a><strong class="text-3xl font-black text-violet-700">₪249</strong></div></div></div></section>`
  ),

  /* =====================================================
     BOOKINGS
  ===================================================== */

  element(
    "booking-times",
    "שעות פנויות",
    "בחירת שעה פנויה",
    "◷",
    "bookings",
    `<section class="${section}" data-section-kind="booking" data-bizuply-block="booking"><h2 class="${h2} text-center">בחרו שעה פנויה</h2><div class="mx-auto mt-10 max-w-3xl rounded-[2.5rem] bg-white p-8 shadow-[0_28px_100px_rgba(15,23,42,.10)]"><div class="grid gap-4 sm:grid-cols-3"><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">09:00</button><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">10:30</button><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">12:00</button><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">14:00</button><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">16:30</button><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">18:00</button></div></div></section>`
  ),

  element(
    "booking-dark",
    "תיאום תורים כהה",
    "תיאום תורים בעיצוב כהה",
    "◷",
    "bookings",
    `<section class="${section}" data-section-kind="booking" data-bizuply-block="booking"><div class="rounded-[3rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_34px_120px_rgba(15,23,42,.22)]"><div class="grid items-center gap-10 lg:grid-cols-2"><div><p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-xs font-black text-black">מחובר ליומן</p><h2 class="${h2} text-white">קובעים תור ישירות מהאתר</h2><p class="${text} text-white/70">בחירת שירות, תאריך ושעה פנויה.</p></div><div class="rounded-[2rem] bg-white p-6"><div class="grid gap-3 sm:grid-cols-2"><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">09:00</button><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">10:30</button><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">12:00</button><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">14:00</button></div></div></div></div></section>`
  ),

  element(
    "booking-calendar-card",
    "כרטיס יומן",
    "תצוגת יומן מקצועית",
    "◷",
    "bookings",
    `<section class="${section}" data-section-kind="booking"><div class="grid gap-8 lg:grid-cols-[.9fr_1.1fr]"><div><p class="${pill}">תיאום תורים</p><h2 class="${h2}">בחירת תאריך ושעה</h2><p class="${text}">בלוק תצוגה ליומן שמתחבר בהמשך לזמינות העסק.</p></div><div class="${card}"><div class="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400"><span>א</span><span>ב</span><span>ג</span><span>ד</span><span>ה</span><span>ו</span><span>ש</span></div><div class="mt-4 grid grid-cols-7 gap-2">${Array.from({ length: 35 }, (_, i) => `<button class="aspect-square rounded-2xl bg-slate-50 text-sm font-black text-slate-600">${i + 1}</button>`).join("")}</div></div></div></section>`
  ),

  /* =====================================================
     BIZUPLY SMART
  ===================================================== */

  element(
    "bizuply-services",
    "שירותים מהעסק",
    "יוחלף בהמשך בשירותי העסק",
    "B",
    "bizuply",
    `<section class="${section}" data-section-kind="services" data-bizuply-block="services"><h2 class="${h2} text-center">השירותים שלי</h2><div class="mt-10 grid gap-5 md:grid-cols-3"><article class="${card}"><div class="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-700">✦</div><h3 class="text-2xl font-black text-slate-800">שירות מהמערכת</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">יוחלף אוטומטית בשירותי העסק.</p><div class="mt-6 flex justify-between"><span class="text-sm font-bold text-slate-400">60 דקות</span><span class="text-2xl font-black text-violet-700">₪350</span></div></article></div></section>`
  ),

  element(
    "bizuply-booking",
    "תיאום תורים",
    "בלוק תורים חכם",
    "◷",
    "bizuply",
    `<section class="${section}" data-section-kind="booking" data-bizuply-block="booking"><div class="rounded-[3rem] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"><div class="grid items-center gap-10 lg:grid-cols-2"><div><p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-xs font-black text-black">מחובר ליומן</p><h2 class="${h2} text-white">קובעים תור ישירות מהאתר</h2><p class="${text} text-white/70">בחירת שירות, תאריך ושעה פנויה.</p></div><div class="rounded-[2rem] bg-white p-6"><div class="grid gap-3 sm:grid-cols-2"><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">09:00</button><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">10:30</button><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">12:00</button><button class="rounded-2xl bg-violet-50 px-5 py-4 text-sm font-black text-violet-700">14:00</button></div></div></div></div></section>`
  ),

  element(
    "bizuply-products",
    "מוצרים מהחנות",
    "יוחלף במוצרי העסק",
    "◈",
    "bizuply",
    `<section class="${section}" data-section-kind="store" data-bizuply-block="products"><h2 class="${h2} text-center">מוצרים מהחנות</h2><div class="mt-10 grid gap-5 md:grid-cols-3"><article class="${card}"><h3 class="text-2xl font-black text-slate-800">מוצר מהמערכת</h3><p class="mt-3 text-sm font-bold leading-7 text-slate-500">יוחלף אוטומטית במוצרי העסק.</p><div class="mt-6 flex items-center justify-between"><a class="${primaryBtn}">הוספה לסל</a><span class="text-2xl font-black text-violet-700">₪129</span></div></article></div></section>`
  ),

  element(
    "bizuply-lead-form",
    "טופס ל־CRM",
    "כל ליד ייכנס למערכת",
    "✉",
    "bizuply",
    `<section class="${section}" data-section-kind="contact" data-bizuply-block="lead-form"><div class="mx-auto max-w-3xl rounded-[3rem] border border-slate-200 bg-white p-8 shadow-[0_30px_100px_rgba(15,23,42,.10)]"><h2 class="${h2}">השאירו פרטים</h2><p class="${text}">כל ליד ייכנס ל־CRM של העסק.</p><form class="mt-8 grid gap-4"><input class="${input}" placeholder="שם מלא"/><input class="${input}" placeholder="טלפון"/><input class="${input}" placeholder="אימייל"/><textarea class="${textarea}" placeholder="הודעה"></textarea><button class="${primaryBtn}" type="button">שליחה</button></form></div></section>`
  ),

  element(
    "bizuply-reviews",
    "ביקורות מהמערכת",
    "ביקורות לקוחות",
    "★",
    "bizuply",
    `<section class="${section}" data-section-kind="reviews" data-bizuply-block="reviews"><h2 class="${h2} text-center">ביקורות לקוחות</h2><div class="mt-10 grid gap-5 md:grid-cols-3"><article class="${card}"><div class="text-xl text-amber-400">★★★★★</div><p class="mt-4 text-sm font-bold leading-7 text-slate-500">ביקורת מהמערכת תופיע כאן.</p><h3 class="mt-5 text-xl font-black text-slate-800">לקוחה</h3></article></div></section>`
  ),

  element(
    "bizuply-club",
    "מועדון לקוחות",
    "הרשמה וקופונים",
    "♛",
    "bizuply",
    `<section class="${section}" data-section-kind="club" data-bizuply-block="customer-club"><div class="rounded-[3rem] bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 p-12 text-white shadow-[0_30px_110px_rgba(139,92,246,.28)]"><h2 class="${h2} text-white">הצטרפות למועדון לקוחות</h2><p class="mt-5 text-lg font-bold leading-8 text-white/80">קבלו הטבות, קופונים ועדכונים מהעסק.</p><a class="mt-8 inline-flex min-h-12 items-center rounded-2xl bg-white px-8 text-sm font-black text-violet-700">הצטרפות</a></div></section>`
  ),
];
