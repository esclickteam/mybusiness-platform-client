import type { SectionLayoutVariant } from "../../types";
import {
  actionRow,
  addMediaBox,
  backgroundSection,
  cardClass,
  createVariant,
  darkButton,
  darkCardClass,
  darkFeatureCard,
  featureCard,
  h2Class,
  imageBlock,
  imageGrid,
  leadForm,
  pillClass,
  priceCard,
  primaryButton,
  productCard,
  secondaryButton,
  sectionImages,
  sectionIntro,
  sectionShell,
  softCardClass,
  softFeatureCard,
  splitLayout,
  statCard,
  subscribeForm,
  testimonialCard,
  textClass,
  videoBox,
  whatsappButton,
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — Promotion Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/promotionLayoutVariants.ts

  סקשן מבצעים / קמפיין / הטבות.
  מתאים ל:
  - מבצע חודשי
  - קופון
  - השקת מוצר
  - הרשמה מוקדמת
  - Black Friday
  - שירות בהנחה
  - חנות
  - קורס
  - SaaS
  - וואטסאפ / ליד / תיאום תור
*/

const kind = "promotion" as const;

function couponBadge(text = "SAVE 20%") {
  return `
<div
  class="inline-flex rotate-[-2deg] rounded-[24px] border-2 border-dashed border-[var(--biz-primary,#7C3AED)] bg-white px-6 py-4 text-2xl font-black tracking-[-0.04em] text-[var(--biz-primary,#7C3AED)] shadow-[0_18px_60px_rgba(124,58,237,0.16)]"
  data-editable-text="true"
>
  ${text}
</div>
`;
}

function countdownBox(value: string, label: string) {
  return `
<div class="rounded-[26px] border border-slate-200 bg-white p-5 text-center shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <strong class="block text-4xl font-black text-slate-800" data-editable-text="true">${value}</strong>
  <span class="mt-2 block text-xs font-black text-slate-400" data-editable-text="true">${label}</span>
</div>
`;
}

function promoFeature(title: string, text: string, icon = "✓") {
  return `
<div class="flex items-start gap-4 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]" data-editable-card="true">
  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-sm font-black text-[var(--biz-primary,#7C3AED)]">
    ${icon}
  </div>
  <div>
    <h3 class="text-base font-black text-slate-800" data-editable-text="true">${title}</h3>
    <p class="mt-1 text-sm font-bold leading-6 text-slate-500" data-editable-text="true">${text}</p>
  </div>
</div>
`;
}

function promoStripItem(text: string) {
  return `
<span class="inline-flex items-center gap-2 rounded-full bg-white/14 px-5 py-3 text-sm font-black text-white ring-1 ring-white/15" data-editable-text="true">
  <span>✦</span>
  <span>${text}</span>
</span>
`;
}

function dealCard(title: string, oldPrice: string, newPrice: string, imageUrl = sectionImages.product) {
  return `
<article class="${cardClass}" data-editable-card="true">
  ${imageBlock(imageUrl, "min-h-[250px]", "rounded-[28px]")}

  <p class="mt-6 inline-flex rounded-full bg-rose-50 px-4 py-2 text-xs font-black text-rose-600" data-editable-text="true">
    מבצע מוגבל
  </p>

  <h3 class="mt-4 text-2xl font-black text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <div class="mt-5 flex items-end justify-between gap-4">
    <div>
      <p class="text-sm font-black text-slate-400 line-through" data-editable-text="true">${oldPrice}</p>
      <strong class="text-4xl font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">${newPrice}</strong>
    </div>

    ${primaryButton("קנייה עכשיו", "#store")}
  </div>
</article>
`;
}

export const promotionLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "promotion-layout-1",
    kind,
    "מבצע Hero ענק",
    "סקשן מבצע גדול וממיר עם כותרת חזקה, קופון ותמונה.",
    "מומלץ",
    sectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_44px_150px_rgba(124,58,237,0.14)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-300/40 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-violet-300/40 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">מבצע החודש</p>

            <h2 class="text-5xl font-black leading-[0.96] tracking-[-0.06em] text-slate-800 md:text-7xl" data-editable-text="true">
              הטבה מיוחדת לזמן מוגבל
            </h2>

            <p class="${textClass}" data-editable-text="true">
              הצעה חזקה וברורה שמובילה את הלקוח לפעולה — קנייה, תיאום תור, הרשמה או השארת פרטים.
            </p>

            <div class="mt-8">
              ${couponBadge("20% הנחה")}
            </div>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("מימוש ההטבה")}
              ${secondaryButton("פרטים נוספים")}
            </div>
          </div>

          ${imageBlock(sectionImages.product, "min-h-[520px]")}
        </div>
      </div>
      `
    ),
    { featured: true, tags: ["hero", "coupon", "wow"] }
  ),

  createVariant(
    "promotion-layout-2",
    kind,
    "קופון יוקרתי",
    "כרטיס קופון נקי, גדול ויוקרתי עם כפתור פעולה.",
    "Coupon",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[1040px] rounded-[58px] border border-slate-200 bg-white p-8 text-center shadow-[0_44px_150px_rgba(15,23,42,0.10)] md:p-16">
        <p class="${pillClass}" data-editable-text="true">קופון מיוחד</p>

        <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-slate-800 md:text-7xl" data-editable-text="true">
          קבלו הטבה בלעדית
        </h2>

        <p class="mx-auto mt-6 max-w-[740px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          השתמשו בקופון באתר, בחנות, בטופס או מול בעל העסק.
        </p>

        <div class="mt-10 flex justify-center">
          ${couponBadge("BIZ20")}
        </div>

        <div class="mt-10 flex flex-wrap justify-center gap-4">
          ${primaryButton("מימוש קופון")}
          ${secondaryButton("שליחת הודעה")}
        </div>
      </div>
      `
    ),
    { tags: ["coupon", "center", "minimal"] }
  ),

  createVariant(
    "promotion-layout-3",
    kind,
    "מבצע כהה פרימיום",
    "סקשן מבצע כהה, דרמטי ויוקרתי.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[60px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_54px_180px_rgba(15,23,42,0.38)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-fuchsia-500/25 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/25 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Limited Offer
            </p>

            <h2 class="text-5xl font-black leading-[0.96] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              מבצע פרימיום שנראה כמו מותג גדול
            </h2>

            <p class="mt-6 text-xl font-bold leading-10 text-white/70" data-editable-text="true">
              מתאים למותגים, קליניקות, SaaS, חנויות, אירועים וקמפיינים מיוחדים.
            </p>

            <div class="mt-8 flex flex-wrap gap-3">
              ${promoStripItem("זמן מוגבל")}
              ${promoStripItem("לקוחות חדשים")}
              ${promoStripItem("הטבת VIP")}
            </div>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("לקבלת ההטבה")}
              ${darkButton("דברו איתנו")}
            </div>
          </div>

          <div class="rounded-[46px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl">
            ${imageBlock(sectionImages.store, "min-h-[520px]", "rounded-[38px]")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "luxury"] }
  ),

  createVariant(
    "promotion-layout-4",
    kind,
    "מבצע עם Countdown",
    "מבצע מוגבל בזמן עם טיימר וקריאה חזקה לפעולה.",
    "Timer",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">המבצע מסתיים בקרוב</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הזדמנות אחרונה לקבל את ההטבה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לקמפיינים, השקות, מכירות מיוחדות, הנחות עונתיות ומבצעי הרשמה.
          </p>

          <div class="mt-8 grid grid-cols-4 gap-3">
            ${countdownBox("03", "ימים")}
            ${countdownBox("12", "שעות")}
            ${countdownBox("45", "דקות")}
            ${countdownBox("22", "שניות")}
          </div>

          <div class="mt-9 flex flex-wrap gap-4">
            ${primaryButton("מימוש עכשיו")}
            ${secondaryButton("שאלות?")}
          </div>
        </div>

        <div class="${softCardClass}">
          <p class="${pillClass}" data-editable-text="true">הטבה מוגבלת</p>

          <h3 class="text-4xl font-black leading-tight text-slate-800" data-editable-text="true">
            30% הנחה למצטרפים היום
          </h3>

          <p class="mt-4 text-base font-bold leading-8 text-slate-500" data-editable-text="true">
            הצעה ברורה שמייצרת דחיפות ומובילה לפעולה.
          </p>

          <div class="mt-8">
            ${couponBadge("TODAY30")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["countdown", "urgent", "sale"] }
  ),

  createVariant(
    "promotion-layout-5",
    kind,
    "באנר מבצע רחב",
    "באנר קצר, צבעוני וחזק שאפשר לשלב בכל עמוד.",
    "Banner",
    sectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[42px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_34px_120px_rgba(139,92,246,0.28)] md:p-10">
        <div class="pointer-events-none absolute -left-16 -top-16 h-52 w-52 rounded-full bg-white/20 blur-3xl"></div>

        <div class="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <p class="text-sm font-black text-white/75" data-editable-text="true">מבצע מיוחד</p>

            <h2 class="mt-2 text-3xl font-black leading-tight tracking-[-0.04em] text-white md:text-5xl" data-editable-text="true">
              מקבלים הטבה בלעדית בהזמנה הקרובה
            </h2>
          </div>

          <div class="flex shrink-0 flex-wrap gap-3">
            <a href="#contact" class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl" data-editable-link="true">
              מימוש הטבה
            </a>

            <a href="https://wa.me/972500000000" class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white/15 px-8 text-sm font-black text-white ring-1 ring-white/20" data-editable-link="true">
              וואטסאפ
            </a>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["banner", "short", "cta"] }
  ),

  createVariant(
    "promotion-layout-6",
    kind,
    "מבצע מוצר",
    "כרטיס מוצר במבצע עם מחיר קודם, מחיר חדש ותמונה.",
    "Product",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "מוצרים במבצע",
        "הציגו מוצרים, חבילות או שירותים במחיר מיוחד.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${dealCard("מוצר ראשון", "₪299", "₪199", sectionImages.product)}
        ${dealCard("מוצר שני", "₪449", "₪349", sectionImages.store)}
        ${dealCard("מוצר שלישי", "₪599", "₪449", sectionImages.beauty)}
      </div>
      `
    ),
    { tags: ["products", "store", "sale"] }
  ),

  createVariant(
    "promotion-layout-7",
    kind,
    "מבצע שירות",
    "מבצע שמדגיש שירות אחד מרכזי עם מחיר והסבר.",
    "Service",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_44px_150px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="${pillClass}" data-editable-text="true">שירות במבצע</p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-slate-800 md:text-7xl" data-editable-text="true">
              טיפול / שירות ראשון במחיר מיוחד
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לקליניקות, יועצים, מאמנים, נותני שירות, שיעורים, טיפולים וקורסים.
            </p>

            <div class="mt-8 flex flex-wrap items-end gap-5">
              <div>
                <p class="text-sm font-black text-slate-400 line-through" data-editable-text="true">₪450</p>
                <strong class="text-6xl font-black tracking-[-0.06em] text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">₪299</strong>
              </div>

              ${couponBadge("חדש")}
            </div>

            ${actionRow("קביעת תור", "שאלו בוואטסאפ")}
          </div>

          ${imageBlock(sectionImages.clinic, "min-h-[540px]")}
        </div>
      </div>
      `
    ),
    { tags: ["service", "booking", "discount"] }
  ),

  createVariant(
    "promotion-layout-8",
    kind,
    "מבצע עם טופס ליד",
    "מבצע שמוביל להשארת פרטים דרך טופס בצד.",
    "Lead",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">הטבה לנרשמים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            השאירו פרטים וקבלו הצעה מיוחדת
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מבנה מעולה לדפי נחיתה, קמפיינים, מבצעי הרשמה, ייעוץ ראשוני והטבות לעסקים.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${promoFeature("הטבה מיידית", "קופון או הצעה מיוחדת לנרשמים.", "✓")}
            ${promoFeature("מענה מהיר", "חזרה ללקוח עם פרטים ברורים.", "↗")}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            קבלת הטבה
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            מלאו פרטים ונחזור אליכם עם ההטבה.
          </p>

          <div class="mt-6">
            ${leadForm("קבלת ההטבה")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["lead", "form", "conversion"] }
  ),

  createVariant(
    "promotion-layout-9",
    kind,
    "מבצע וואטסאפ",
    "מבצע שמוביל ישירות לשיחת וואטסאפ.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-700" data-editable-text="true">
              מבצע בוואטסאפ
            </p>

            <h2 class="${h2Class}" data-editable-text="true">
              שלחו הודעה וקבלו את ההטבה
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לעסקים שרוצים לקבל פניות מהירות ולסגור לקוחות בשיחה.
            </p>

            <div class="mt-8">
              ${couponBadge("WA10")}
            </div>

            <div class="mt-9 flex flex-wrap gap-4">
              ${whatsappButton("מימוש בוואטסאפ")}
              ${secondaryButton("פרטים נוספים")}
            </div>
          </div>

          <div class="${cardClass}">
            <div class="rounded-[32px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
              <p class="text-sm font-black text-white/60" data-editable-text="true">
                WhatsApp Promo
              </p>

              <div class="mt-5 grid gap-4">
                <div class="rounded-[24px] bg-white/10 p-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
                  שלום, ראיתי את המבצע באתר.
                </div>

                <div class="mr-auto rounded-[24px] bg-emerald-500 p-4 text-sm font-bold leading-7 text-white" data-editable-text="true">
                  מעולה! שולחים לך את ההטבה עכשיו.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["whatsapp", "fast", "lead"] }
  ),

  createVariant(
    "promotion-layout-10",
    kind,
    "השקת מוצר",
    "סקשן השקה דרמטי למוצר, קולקציה, שירות או מערכת.",
    "Launch",
    backgroundSection(
      kind,
      sectionImages.store,
      `
      <div class="max-w-[860px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          השקה חדשה
        </p>

        <h2 class="text-5xl font-black leading-[0.96] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
          מוצר חדש הגיע — וההטבה לזמן מוגבל
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          מבנה מושלם להשקה, קולקציה, שירות חדש, קורס או מערכת.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("לצפייה בהשקה")}
          ${secondaryButton("קבלת עדכון")}
        </div>
      </div>
      `
    ),
    { tags: ["launch", "background", "product"] }
  ),

  createVariant(
    "promotion-layout-11",
    kind,
    "מבצע עם הרשמה",
    "מבצע שמוביל להרשמה לרשימת תפוצה או מועדון.",
    "Subscribe",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 text-center shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <p class="${pillClass}" data-editable-text="true">הטבה לנרשמים</p>

        <h2 class="text-4xl font-black leading-[1.02] tracking-[-0.05em] text-slate-800 md:text-6xl" data-editable-text="true">
          הצטרפו וקבלו הטבה ראשונה
        </h2>

        <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          מתאים למועדון לקוחות, ניוזלטר, השקות, קופונים ומבצעי לקוחות חוזרים.
        </p>

        <div class="mx-auto mt-8 max-w-[720px]">
          ${subscribeForm("קבלת קופון")}
        </div>

        <p class="mt-5 text-xs font-bold text-slate-400" data-editable-text="true">
          ללא ספאם. רק הטבות ועדכונים חשובים.
        </p>
      </div>
      `
    ),
    { tags: ["subscribe", "newsletter", "coupon"] }
  ),

  createVariant(
    "promotion-layout-12",
    kind,
    "מבצע קורס",
    "מבצע לקורס דיגיטלי, שיעור, סדנה או וובינר.",
    "Course",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">הרשמה מוקדמת</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הצטרפו לקורס במחיר השקה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לקורס דיגיטלי, סדנה, וובינר, שיעורים פרטיים או תוכן נעול.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${promoFeature("גישה לשיעורים", "תוכן מסודר ונוח לצפייה.", "▶")}
            ${promoFeature("מחיר השקה", "הטבה לנרשמים מוקדם.", "₪")}
            ${promoFeature("בונוסים", "חומרים נוספים למשתתפים.", "✦")}
            ${promoFeature("קהילה", "ליווי ועדכונים לאורך הדרך.", "♡")}
          </div>

          ${actionRow("הרשמה לקורס", "פרטים נוספים")}
        </div>

        ${videoBox()}
      </div>
      `
    ),
    { tags: ["course", "launch", "video"] }
  ),

  createVariant(
    "promotion-layout-13",
    kind,
    "מבצע SaaS",
    "מבצע למערכת, מנוי חודשי, דמו או Mini SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[60px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_54px_180px_rgba(15,23,42,0.38)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              SaaS Offer
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              חודש ראשון במערכת במחיר מיוחד
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים למערכות, מיני SaaS, CRM, תורים, קורסים, אזור לקוחות ומנויים.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("הפעלת דמו")}
              ${darkButton("פיצ׳רים")}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${darkFeatureCard("CRM", "לקוחות, לידים ומשימות.", "CRM")}
            ${darkFeatureCard("Booking", "תיאום תורים וזמינות.", "◷")}
            ${darkFeatureCard("Payments", "מנויים ותשלומים.", "₪")}
            ${darkFeatureCard("AI", "אוטומציות ותובנות.", "AI")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "subscription", "dark"] }
  ),

  createVariant(
    "promotion-layout-14",
    kind,
    "מבצע עם המלצה",
    "מבצע לצד ביקורת לקוח שמחזקת אמון.",
    "Review",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">מבצע עם הוכחת אמון</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לקוחות כבר נהנו מההטבה — עכשיו תורכם
          </h2>

          <p class="${textClass}" data-editable-text="true">
            שילוב מבצע עם המלצה מעלה אמון ומעודד לקוחות להשאיר פרטים.
          </p>

          <div class="mt-8">
            ${couponBadge("VIP15")}
          </div>

          ${actionRow("מימוש הטבה", "כל ההמלצות")}
        </div>

        ${testimonialCard(
          "קיבלתי שירות מקצועי, ברור ומהיר. ההטבה הייתה משתלמת והתהליך היה פשוט.",
          "לקוחה מרוצה"
        )}
      </div>
      `
    ),
    { tags: ["testimonial", "trust", "promotion"] }
  ),

  createVariant(
    "promotion-layout-15",
    kind,
    "מבצע עם גלריה",
    "מבצע שמציג תמונות, מוצרים או תוצאות ליד ההצעה.",
    "Gallery",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">מבצע ויזואלי</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הצעה חזקה עם תמונות שמוכרות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים למוצרים, קולקציות, עבודות, טיפולים, אירועים וגלריות.
          </p>

          ${actionRow("קבלת ההטבה", "צפייה בגלריה")}
        </div>

        ${imageGrid(
          [
            sectionImages.beauty,
            sectionImages.product,
            sectionImages.salon,
            sectionImages.store,
          ],
          "min-h-[230px]",
          "md:grid-cols-2"
        )}
      </div>
      `
    ),
    { tags: ["gallery", "visual", "sale"] }
  ),

  createVariant(
    "promotion-layout-16",
    kind,
    "מבצע עם מדיה להוספה",
    "מבנה מבצע עם אזור להוספת תמונה או וידאו.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.product, "min-h-[340px]")}
          ${addMediaBox("הוספת תמונת מבצע / וידאו")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">מבצע עם מדיה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו תמונה אמיתית שתמכור את ההטבה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            בעל העסק יכול להעלות תמונת מוצר, סרטון, באנר, לפני/אחרי או תמונת קמפיין.
          </p>

          <div class="mt-8">
            ${couponBadge("NEW")}
          </div>

          ${actionRow("מימוש", "צור קשר")}
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "promotion-layout-17",
    kind,
    "מבצע מינימליסטי",
    "סקשן מבצע נקי, קצר ואלגנטי.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[920px] rounded-[52px] border border-slate-200 bg-white p-8 text-center shadow-[0_34px_120px_rgba(15,23,42,0.08)] md:p-14">
        <p class="${pillClass}" data-editable-text="true">מבצע מיוחד</p>

        <h2 class="${h2Class}" data-editable-text="true">
          הטבה פשוטה וברורה ללקוחות חדשים
        </h2>

        <p class="mx-auto mt-6 max-w-[680px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          מבנה נקי שמתאים לאתרים אלגנטיים, דפי נחיתה או עמודים עם פחות עומס.
        </p>

        <div class="mt-8 flex justify-center">
          ${couponBadge("10% OFF")}
        </div>

        <div class="mt-9 flex flex-wrap justify-center gap-4">
          ${primaryButton("מימוש הטבה")}
          ${secondaryButton("פרטים")}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "coupon"] }
  ),

  createVariant(
    "promotion-layout-18",
    kind,
    "CTA מבצע וואו",
    "סקשן קצר, צבעוני וממיר לסוף עמוד.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[58px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] via-fuchsia-600 to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_44px_150px_rgba(139,92,246,0.30)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/15 blur-3xl"></div>

        <div class="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div class="max-w-[780px]">
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              הזדמנות אחרונה
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              רוצים לקבל את ההטבה לפני שהיא מסתיימת?
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              השאירו פרטים או שלחו וואטסאפ ונשמור לכם את המבצע.
            </p>
          </div>

          <div class="flex shrink-0 flex-wrap gap-4">
            <a href="#contact" class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl" data-editable-link="true">
              קבלת הטבה
            </a>

            <a href="https://wa.me/972500000000" class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white/15 px-8 text-sm font-black text-white ring-1 ring-white/20" data-editable-link="true">
              וואטסאפ
            </a>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["cta", "wow", "conversion"] }
  ),
];