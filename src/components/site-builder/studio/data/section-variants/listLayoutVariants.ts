import type { SectionLayoutVariant } from "../../types";
import {
  actionRow,
  addMediaBox,
  backgroundSection,
  cardClass,
  createVariant,
  darkButton,
  darkFeatureCard,
  h2Class,
  imageBlock,
  imageGrid,
  leadForm,
  pillClass,
  primaryButton,
  secondaryButton,
  sectionImages,
  sectionIntro,
  sectionShell,
  simpleList,
  softCardClass,
  softFeatureCard,
  splitLayout,
  statCard,
  testimonialCard,
  textClass,
  timelineItem,
  videoBox,
  whatsappButton,
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — List Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/listLayoutVariants.ts

  סקשני רשימות מקצועיים.
  מתאים ל:
  - רשימת יתרונות
  - מה כלול
  - צ׳קליסט
  - מחירון
  - שלבים
  - השוואות
  - שאלות נפוצות
  - רשימת שירותים
  - רשימת פיצ׳רים
  - SaaS Features
  - תוכן שיווקי מסודר
*/

const kind = "list" as const;

function checklistItem(text: string) {
  return `
<li class="flex items-start gap-4 rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]" data-editable-card="true">
  <span class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-sm font-black text-emerald-600">
    ✓
  </span>

  <span class="text-sm font-black leading-7 text-slate-700" data-editable-text="true">
    ${text}
  </span>
</li>
`;
}

function numberedListItem(number: string, title: string, text: string) {
  return `
<li class="flex gap-5 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
    ${number}
  </div>

  <div>
    <h3 class="text-xl font-black text-slate-800" data-editable-text="true">
      ${title}
    </h3>

    <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
      ${text}
    </p>
  </div>
</li>
`;
}

function featureListCard(title: string, items: string[], icon = "✦") {
  return `
<article class="${cardClass}" data-editable-card="true">
  <div class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-black">
    ${icon}
  </div>

  <h3 class="text-2xl font-black text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <ul class="mt-6 grid gap-3" style="list-style:none;">
    ${items.map((item) => checklistItem(item)).join("")}
  </ul>
</article>
`;
}

function priceListRow(title: string, text: string, price: string) {
  return `
<div class="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between" data-editable-card="true">
  <div>
    <h3 class="text-xl font-black text-slate-800" data-editable-text="true">
      ${title}
    </h3>

    <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
      ${text}
    </p>
  </div>

  <div class="flex shrink-0 items-center gap-3">
    <span class="rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
      ${price}
    </span>

    ${primaryButton("בחירה")}
  </div>
</div>
`;
}

function comparisonRow(feature: string, basic: string, pro: string) {
  return `
<div class="grid grid-cols-3 gap-3 rounded-[24px] border border-slate-200 bg-white p-4 text-sm font-black shadow-[0_14px_45px_rgba(15,23,42,0.04)]" data-editable-card="true">
  <div class="text-slate-800" data-editable-text="true">${feature}</div>
  <div class="text-center text-slate-500" data-editable-text="true">${basic}</div>
  <div class="text-center text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">${pro}</div>
</div>
`;
}

function faqListItem(question: string, answer: string) {
  return `
<details class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <summary class="cursor-pointer text-lg font-black text-slate-800" data-editable-text="true">
    ${question}
  </summary>

  <p class="mt-4 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${answer}
  </p>
</details>
`;
}

function darkListItem(text: string) {
  return `
<li class="flex items-start gap-4 rounded-[24px] border border-white/10 bg-white/8 p-5" data-editable-card="true">
  <span class="grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-white/12 text-sm font-black text-black">
    ✓
  </span>

  <span class="text-sm font-bold leading-7 text-white/75" data-editable-text="true">
    ${text}
  </span>
</li>
`;
}

function pillListItem(text: string) {
  return `
<span class="inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-3 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
  ${text}
</span>
`;
}

export const listLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "list-layout-1",
    kind,
    "צ׳קליסט מקצועי",
    "רשימת צ׳קליסט נקייה וברורה להצגת יתרונות, מה כלול או תנאים.",
    "מומלץ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "מה כלול?",
        "הציגו רשימה ברורה של יתרונות, שירותים, תכולה או נקודות חשובות.",
        "center"
      )}

      <ul class="mx-auto mt-12 grid max-w-[900px] gap-4" style="list-style:none;">
        ${checklistItem("נקודה ראשונה ברשימה שאפשר לערוך")}
        ${checklistItem("נקודה שנייה שמסבירה ערך או יתרון ללקוח")}
        ${checklistItem("נקודה שלישית שמחזקת אמון ומקצועיות")}
        ${checklistItem("נקודה רביעית שמובילה לפעולה")}
        ${checklistItem("נקודה חמישית שמתאימה לשירות / מוצר / מערכת")}
      </ul>
      `
    ),
    { featured: true, tags: ["checklist", "benefits", "clean"] }
  ),

  createVariant(
    "list-layout-2",
    kind,
    "רשימה + תמונה",
    "טקסט ורשימת יתרונות לצד תמונה גדולה.",
    "תמונה",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">רשימת יתרונות</p>

        <h2 class="${h2Class}" data-editable-text="true">
          הציגו את היתרונות בצורה שמובילה להחלטה
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מבנה שמתאים לשירותים, מוצרים, קורסים, מערכות, תהליכים או דפי נחיתה.
        </p>

        <ul class="mt-8 grid gap-4" style="list-style:none;">
          ${checklistItem("יתרון ראשון וברור")}
          ${checklistItem("יתרון שני שמחזק את הבחירה")}
          ${checklistItem("יתרון שלישי שמוביל לפנייה")}
        </ul>

        ${actionRow("קבלת פרטים", "מידע נוסף")}
      </div>
      `,
      imageBlock(sectionImages.office, "min-h-[560px]"),
      false
    ),
    { tags: ["image", "benefits", "split"] }
  ),

  createVariant(
    "list-layout-3",
    kind,
    "תמונה + רשימה",
    "אותו מבנה כמו רשימה ותמונה, רק הפוך.",
    "הפוך",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">למה זה חשוב?</p>

        <h2 class="${h2Class}" data-editable-text="true">
          רשימה מסודרת שמסבירה את הערך
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מבנה מעולה לגיוון עמודים, הסבר שירות או הצגת תכולת חבילה.
        </p>

        <ul class="mt-8 grid gap-4" style="list-style:none;">
          ${checklistItem("תוכן ראשון שאפשר לערוך")}
          ${checklistItem("תוכן שני שאפשר לערוך")}
          ${checklistItem("תוכן שלישי שאפשר לערוך")}
        </ul>
      </div>
      `,
      imageBlock(sectionImages.people, "min-h-[560px]"),
      true
    ),
    { tags: ["reverse", "image", "list"] }
  ),

  createVariant(
    "list-layout-4",
    kind,
    "רשימות בכרטיסים",
    "שלושה כרטיסים, בכל כרטיס רשימת נקודות משלו.",
    "Cards",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "רשימות לפי קטגוריות",
        "חלקו מידע מורכב לכרטיסים מסודרים וברורים.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${featureListCard("קטגוריה ראשונה", ["נקודה ראשונה", "נקודה שנייה", "נקודה שלישית"], "1")}
        ${featureListCard("קטגוריה שנייה", ["נקודה ראשונה", "נקודה שנייה", "נקודה שלישית"], "2")}
        ${featureListCard("קטגוריה שלישית", ["נקודה ראשונה", "נקודה שנייה", "נקודה שלישית"], "3")}
      </div>
      `
    ),
    { tags: ["cards", "categories", "features"] }
  ),

  createVariant(
    "list-layout-5",
    kind,
    "מחירון ברשימה",
    "רשימת שירותים או מוצרים עם מחיר וכפתור בחירה.",
    "מחירון",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "מחירון שירותים",
        "הציגו שירותים, חבילות או מוצרים ברשימה ברורה עם מחיר ופעולה.",
        "center"
      )}

      <div class="mx-auto mt-12 grid max-w-[980px] gap-4">
        ${priceListRow("שירות ראשון", "תיאור קצר של השירות ומה הוא כולל.", "₪250")}
        ${priceListRow("שירות שני", "תיאור קצר של השירות, משך או תוצאה.", "₪350")}
        ${priceListRow("שירות שלישי", "תיאור קצר של חבילה או שירות מתקדם.", "₪450")}
      </div>
      `
    ),
    { tags: ["pricing", "services", "list"] }
  ),

  createVariant(
    "list-layout-6",
    kind,
    "רשימה ממוספרת",
    "רשימה מקצועית עם מספרים, כותרות ותיאורים.",
    "Numbers",
    sectionShell(
      kind,
      `
      <div class="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">שלבים מסודרים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            רשימה ממוספרת שמסבירה תהליך
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לתהליך עבודה, הרשמה, קנייה, תיאום תור, שירות או הדרכה.
          </p>

          ${actionRow("התחלת תהליך", "שאלה לפני")}
        </div>

        <ol class="grid gap-4" style="list-style:none;">
          ${numberedListItem("1", "שלב ראשון", "הסבר קצר על השלב הראשון בתהליך.")}
          ${numberedListItem("2", "שלב שני", "הסבר קצר על השלב השני בתהליך.")}
          ${numberedListItem("3", "שלב שלישי", "הסבר קצר על השלב השלישי בתהליך.")}
          ${numberedListItem("4", "שלב רביעי", "הסבר קצר שמוביל לפעולה.")}
        </ol>
      </div>
      `
    ),
    { tags: ["numbered", "steps", "process"] }
  ),

  createVariant(
    "list-layout-7",
    kind,
    "השוואת חבילות",
    "טבלת השוואה נקייה בין חבילות, שירותים או אפשרויות.",
    "Compare",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "השוואה פשוטה וברורה",
        "עזרו ללקוח להבין מה ההבדל בין חבילות, מסלולים או שירותים.",
        "center"
      )}

      <div class="mx-auto mt-12 max-w-[980px] rounded-[38px] border border-slate-200 bg-slate-50 p-5 shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
        <div class="mb-4 grid grid-cols-3 gap-3 rounded-[24px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
          <div data-editable-text="true">פיצ׳ר</div>
          <div class="text-center" data-editable-text="true">Basic</div>
          <div class="text-center" data-editable-text="true">Pro</div>
        </div>

        <div class="grid gap-3">
          ${comparisonRow("עמוד עסקי", "✓", "✓")}
          ${comparisonRow("טופס לידים", "✓", "✓")}
          ${comparisonRow("תיאום תורים", "—", "✓")}
          ${comparisonRow("חנות / מוצרים", "—", "✓")}
          ${comparisonRow("אוטומציות", "—", "✓")}
        </div>
      </div>
      `
    ),
    { tags: ["comparison", "pricing", "plans"] }
  ),

  createVariant(
    "list-layout-8",
    kind,
    "רשימה כהה פרימיום",
    "רשימה כהה, יוקרתית ומעוצבת.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
              Premium List
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              רשימה שנראית כמו מותג פרימיום
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים להצגת יתרונות, תכולת שירות, פיצ׳רים, חבילות או הבטחות ללקוח.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("התחילו עכשיו")}
              ${darkButton("מידע נוסף")}
            </div>
          </div>

          <ul class="relative grid gap-4" style="list-style:none;">
            ${darkListItem("יתרון ראשון שמחזק את הבחירה")}
            ${darkListItem("יתרון שני שמציג מקצועיות")}
            ${darkListItem("יתרון שלישי שמסביר את הערך")}
            ${darkListItem("יתרון רביעי שמוביל לפעולה")}
          </ul>
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "luxury"] }
  ),

  createVariant(
    "list-layout-9",
    kind,
    "רשימה על תמונת רקע",
    "רשימת יתרונות על תמונת רקע עם Overlay.",
    "Background",
    backgroundSection(
      kind,
      sectionImages.darkOffice,
      `
      <div class="max-w-[860px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          רשימת יתרונות
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          כל מה שחשוב לדעת במקום אחד
        </h2>

        <ul class="mt-8 grid max-w-[720px] gap-4" style="list-style:none;">
          ${darkListItem("נקודה ראשונה שאפשר לערוך")}
          ${darkListItem("נקודה שנייה שאפשר לערוך")}
          ${darkListItem("נקודה שלישית שאפשר לערוך")}
        </ul>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("פעולה ראשית")}
          ${secondaryButton("מידע נוסף")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "visual", "list"] }
  ),

  createVariant(
    "list-layout-10",
    kind,
    "רשימת FAQ",
    "רשימת שאלות נפוצות בסגנון נקי וברור.",
    "FAQ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "שאלות נפוצות",
        "רשימת שאלות ותשובות שעוזרת ללקוח להבין הכל לפני פנייה.",
        "center"
      )}

      <div class="mx-auto mt-12 grid max-w-[980px] gap-4">
        ${faqListItem("שאלה ראשונה?", "כאן תופיע תשובה קצרה וברורה שאפשר לערוך.")}
        ${faqListItem("שאלה שנייה?", "כאן תופיע תשובה קצרה וברורה שאפשר לערוך.")}
        ${faqListItem("שאלה שלישית?", "כאן תופיע תשובה קצרה וברורה שאפשר לערוך.")}
        ${faqListItem("שאלה רביעית?", "כאן תופיע תשובה קצרה וברורה שאפשר לערוך.")}
      </div>
      `
    ),
    { tags: ["faq", "questions", "support"] }
  ),

  createVariant(
    "list-layout-11",
    kind,
    "רשימה עם נתונים",
    "רשימה לצד מספרים שמחזקים אמון.",
    "Stats",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">אמון וערך</p>

          <h2 class="${h2Class}" data-editable-text="true">
            רשימה שמתחזקת עם נתונים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            שלבו רשימת יתרונות עם מספרים כדי להראות ניסיון, תוצאה ומקצועיות.
          </p>

          <ul class="mt-8 grid gap-4" style="list-style:none;">
            ${checklistItem("יתרון ראשון שמדגיש ניסיון")}
            ${checklistItem("יתרון שני שמציג תוצאה")}
            ${checklistItem("יתרון שלישי שמוביל לפנייה")}
          </ul>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          ${statCard("500+", "לקוחות")}
          ${statCard("98%", "שביעות רצון")}
          ${statCard("7", "שנות ניסיון")}
          ${statCard("24/7", "זמינות דיגיטלית")}
        </div>
      </div>
      `
    ),
    { tags: ["stats", "trust", "benefits"] }
  ),

  createVariant(
    "list-layout-12",
    kind,
    "רשימת פיצ׳רים SaaS",
    "רשימת יכולות שמתאימה למערכת, מוצר דיגיטלי או Mini SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[64px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
              SaaS Features
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              כל הפיצ׳רים החשובים במערכת אחת
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים למוצר דיגיטלי, CRM, תורים, חנות, קורסים, אזור אישי ואוטומציות.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("בקשת דמו")}
              ${darkButton("צפייה בפיצ׳רים")}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${darkFeatureCard("CRM", "לקוחות, לידים ומשימות.", "CRM")}
            ${darkFeatureCard("Booking", "תיאום תורים וזמינות.", "◷")}
            ${darkFeatureCard("Payments", "חבילות, מנויים ותשלומים.", "₪")}
            ${darkFeatureCard("AI", "תובנות ואוטומציות חכמות.", "AI")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "features", "system"] }
  ),

  createVariant(
    "list-layout-13",
    kind,
    "רשימה עם וידאו",
    "רשימת נקודות לצד סרטון הסבר.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">רשימה + וידאו</p>

        <h2 class="${h2Class}" data-editable-text="true">
          הסבירו נקודות חשובות דרך טקסט וסרטון
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לקורס, הדרכה, שירות מורכב, מוצר דיגיטלי או הסבר לפני רכישה.
        </p>

        <ul class="mt-8 grid gap-4" style="list-style:none;">
          ${checklistItem("נקודה ראשונה מתוך הסרטון")}
          ${checklistItem("נקודה שנייה מתוך הסרטון")}
          ${checklistItem("נקודה שלישית מתוך הסרטון")}
        </ul>
      </div>
      `,
      videoBox(),
      false
    ),
    { tags: ["video", "explain", "list"] }
  ),

  createVariant(
    "list-layout-14",
    kind,
    "רשימה + טופס ליד",
    "רשימת יתרונות לצד טופס פנייה.",
    "Lead",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">רוצים לקבל פרטים?</p>

          <h2 class="${h2Class}" data-editable-text="true">
            רשימה שמובילה את הלקוח להשאיר פרטים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מבנה מעולה לדפי נחיתה, שירותים, הצעות מחיר, קורסים ומערכות.
          </p>

          <ul class="mt-8 grid gap-4" style="list-style:none;">
            ${checklistItem("הלקוח מבין מה הוא מקבל")}
            ${checklistItem("היתרונות מוצגים בצורה ברורה")}
            ${checklistItem("הטופס נמצא בדיוק ליד ההסבר")}
          </ul>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            השאירו פרטים
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            נחזור אליכם עם כל המידע.
          </p>

          <div class="mt-6">
            ${leadForm("שליחת פרטים")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["lead", "form", "conversion"] }
  ),

  createVariant(
    "list-layout-15",
    kind,
    "רשימת Tags / Pills",
    "רשימת תגיות מעוצבות להצגת תחומים, קטגוריות או יכולות.",
    "Tags",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] text-center">
        <p class="${pillClass}" data-editable-text="true">תחומים ויכולות</p>

        <h2 class="${h2Class}" data-editable-text="true">
          כל מה שאפשר להציג ברשימת תגיות
        </h2>

        <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          מתאים לקטגוריות, תחומי פעילות, שירותים, פיצ׳רים, ערכים או מילות מפתח.
        </p>

        <div class="mt-10 flex flex-wrap justify-center gap-3">
          ${pillListItem("CRM")}
          ${pillListItem("תיאום תורים")}
          ${pillListItem("חנות")}
          ${pillListItem("וואטסאפ")}
          ${pillListItem("טפסים")}
          ${pillListItem("אוטומציות")}
          ${pillListItem("מועדון לקוחות")}
          ${pillListItem("תשלומים")}
          ${pillListItem("AI")}
          ${pillListItem("דפי נחיתה")}
        </div>
      </div>
      `
    ),
    { tags: ["tags", "pills", "categories"] }
  ),

  createVariant(
    "list-layout-16",
    kind,
    "רשימה מינימליסטית",
    "רשימה פשוטה, נקייה ואלגנטית בלי עומס.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[860px]">
        <div class="text-center">
          <p class="${pillClass}" data-editable-text="true">רשימה קצרה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            נקודות חשובות בלי עומס
          </h2>

          <p class="mx-auto mt-6 max-w-[680px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
            מתאים לאתרים אלגנטיים שרוצים להציג רשימה קצרה וברורה.
          </p>
        </div>

        <div class="mt-10">
          ${simpleList([
            "נקודה ראשונה שאפשר לערוך",
            "נקודה שנייה שאפשר לערוך",
            "נקודה שלישית שאפשר לערוך",
            "נקודה רביעית שאפשר לערוך",
          ])}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "short"] }
  ),

  createVariant(
    "list-layout-17",
    kind,
    "רשימה עם מדיה",
    "רשימה עם אזור להוספת תמונה או וידאו.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.product, "min-h-[340px]")}
          ${addMediaBox("הוספת תמונה / וידאו לרשימה")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">רשימה עם מדיה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו תמונה או וידאו ליד הנקודות החשובות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים להצגת מוצר, שירות, תהליך, הדרכה, תוצאה או תוכן ויזואלי.
          </p>

          <ul class="mt-8 grid gap-4" style="list-style:none;">
            ${checklistItem("נקודה ראשונה עם תמיכה ויזואלית")}
            ${checklistItem("נקודה שנייה עם תמיכה ויזואלית")}
            ${checklistItem("נקודה שלישית עם תמיכה ויזואלית")}
          </ul>
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "list-layout-18",
    kind,
    "CTA רשימה וואו",
    "סקשן רשימה קצר, צבעוני וממיר לסוף עמוד.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[60px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] via-fuchsia-600 to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_44px_150px_rgba(139,92,246,0.30)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/15 blur-3xl"></div>

        <div class="relative grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
              בקצרה
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              כל הסיבות להתחיל עכשיו
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              סקשן קצר שמרכז את הסיבות לפעולה ומוביל לכפתור ברור.
            </p>
          </div>

          <div class="rounded-[34px] bg-white/12 p-6 backdrop-blur-2xl">
            <ul class="grid gap-3" style="list-style:none;">
              ${darkListItem("סיבה ראשונה")}
              ${darkListItem("סיבה שנייה")}
              ${darkListItem("סיבה שלישית")}
            </ul>

            <div class="mt-6 flex flex-wrap gap-3">
              <a
                href="#contact"
                class="inline-flex min-h-14 flex-1 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl"
                data-editable-link="true"
              >
                פעולה ראשית
              </a>

              <a
                href="https://wa.me/972500000000"
                class="inline-flex min-h-14 flex-1 items-center justify-center rounded-2xl bg-white/15 px-8 text-sm font-black text-black ring-1 ring-white/20"
                data-editable-link="true"
              >
                וואטסאפ
              </a>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["cta", "wow", "conversion"] }
  ),
];