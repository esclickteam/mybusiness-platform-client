import type { SectionLayoutVariant } from "../../types";
import {
  actionRow,
  backgroundSection,
  cardClass,
  createVariant,
  darkButton,
  darkFeatureCard,
  faqItem,
  h2Class,
  imageBlock,
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
  Bizuply Website Studio — Text Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/textLayoutVariants.ts

  סקשני טקסט מקצועיים.
  מתאים ל:
  - כותרות
  - פסקאות
  - מאמרים
  - תוכן שיווקי
  - הסבר שירות
  - תקנון קצר
  - סיפור עסק
  - תוכן עם תמונה
  - Quote / ציטוט
  - CTA טקסטואלי
*/

const kind = "text" as const;

function paragraphBlock(title: string, text: string) {
  return `
<div class="rounded-[34px] border border-slate-200 bg-white p-7 shadow-[0_22px_70px_rgba(15,23,42,0.07)]" data-editable-card="true">
  <h3 class="text-2xl font-black tracking-[-0.03em] text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-4 text-base font-bold leading-8 text-slate-500" data-editable-text="true">
    ${text}
  </p>
</div>
`;
}

function textColumn(title: string, text: string, icon = "✦") {
  return `
<article class="${cardClass}" data-editable-card="true">
  <div class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-white">
    ${icon}
  </div>

  <h3 class="text-2xl font-black text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>
</article>
`;
}

function quoteBlock(quote: string, author = "שם הכותב") {
  return `
<blockquote class="rounded-[48px] border border-slate-200 bg-white p-8 shadow-[0_34px_120px_rgba(15,23,42,0.10)] md:p-12" data-editable-card="true">
  <div class="mb-6 text-7xl font-black leading-none text-[var(--biz-primary,#7C3AED)]/20">
    ”
  </div>

  <p class="text-2xl font-black leading-10 tracking-[-0.03em] text-slate-800 md:text-4xl md:leading-[1.25]" data-editable-text="true">
    ${quote}
  </p>

  <p class="mt-8 text-sm font-black text-slate-400" data-editable-text="true">
    ${author}
  </p>
</blockquote>
`;
}

function articleMeta(label: string, value: string) {
  return `
<div class="rounded-[24px] bg-slate-50 px-5 py-4" data-editable-card="true">
  <p class="text-xs font-black text-slate-400" data-editable-text="true">${label}</p>
  <p class="mt-1 text-sm font-black text-slate-800" data-editable-text="true">${value}</p>
</div>
`;
}

function textHighlightBox(title: string, text: string) {
  return `
<div class="rounded-[38px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_26px_90px_rgba(15,23,42,0.08)]" data-editable-card="true">
  <p class="${pillClass}" data-editable-text="true">חשוב לדעת</p>

  <h3 class="text-3xl font-black tracking-[-0.04em] text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-4 text-base font-bold leading-8 text-slate-500" data-editable-text="true">
    ${text}
  </p>
</div>
`;
}

function darkTextCard(title: string, text: string, icon = "✦") {
  return `
<article class="rounded-[34px] border border-white/10 bg-white/8 p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]" data-editable-card="true">
  <div class="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-white/12 text-sm font-black text-white">
    ${icon}
  </div>

  <h3 class="text-2xl font-black text-white" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-3 text-sm font-bold leading-7 text-white/65" data-editable-text="true">
    ${text}
  </p>
</article>
`;
}

export const textLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "text-layout-1",
    kind,
    "כותרת ופסקה ממורכזת",
    "סקשן טקסט נקי וממורכז עם כותרת גדולה, פסקה וכפתורים.",
    "מומלץ",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] text-center">
        <p class="${pillClass}" data-editable-text="true">טקסט מרכזי</p>

        <h2 class="${h2Class}" data-editable-text="true">
          כותרת חזקה שמעבירה מסר ברור ומקצועי
        </h2>

        <p class="mx-auto mt-6 max-w-[780px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          כאן אפשר לכתוב טקסט שיווקי, הסבר קצר, הקדמה, סיפור, מסר חשוב או כל תוכן שהעסק רוצה להציג בצורה נקייה ומרשימה.
        </p>

        <div class="mt-9 flex flex-wrap justify-center gap-4">
          ${primaryButton("כפתור ראשי")}
          ${secondaryButton("מידע נוסף")}
        </div>
      </div>
      `
    ),
    { featured: true, tags: ["center", "headline", "clean"] }
  ),

  createVariant(
    "text-layout-2",
    kind,
    "מאמר / תוכן ארוך",
    "מבנה טקסט ארוך בסגנון מאמר מקצועי.",
    "Article",
    sectionShell(
      kind,
      `
      <article class="mx-auto max-w-[920px] rounded-[52px] border border-slate-200 bg-white p-8 shadow-[0_34px_120px_rgba(15,23,42,0.08)] md:p-14" data-editable-card="true">
        <div class="mb-8 grid gap-4 sm:grid-cols-3">
          ${articleMeta("קטגוריה", "מאמר")}
          ${articleMeta("זמן קריאה", "4 דקות")}
          ${articleMeta("עודכן", "2026")}
        </div>

        <p class="${pillClass}" data-editable-text="true">תוכן מקצועי</p>

        <h2 class="${h2Class}" data-editable-text="true">
          כותרת מאמר מקצועית שמסבירה את הנושא
        </h2>

        <p class="mt-6 text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          זו פסקת פתיחה שמתאימה למאמר, הסבר שירות, מדריך, תקנון קצר או תוכן מקצועי באתר.
        </p>

        <div class="mt-8 grid gap-6 text-base font-bold leading-8 text-slate-600">
          <p data-editable-text="true">
            כאן אפשר להוסיף פסקה ראשונה עם הסבר מפורט יותר. הטקסט יכול להיות שיווקי, מקצועי או אינפורמטיבי, בהתאם לסוג העסק.
          </p>

          <p data-editable-text="true">
            כאן אפשר להוסיף פסקה נוספת עם דוגמאות, יתרונות, תהליך עבודה, מידע חשוב ללקוח או כל תוכן אחר.
          </p>

          <p data-editable-text="true">
            בסוף אפשר להוסיף סיכום קצר שמוביל את הלקוח לפעולה — יצירת קשר, קביעת תור, קנייה או הרשמה.
          </p>
        </div>
      </article>
      `
    ),
    { tags: ["article", "long-text", "content"] }
  ),

  createVariant(
    "text-layout-3",
    kind,
    "טקסט + תמונה",
    "סקשן תוכן עם טקסט בצד ותמונה גדולה בצד השני.",
    "תמונה",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">מסר עם תמונה</p>

        <h2 class="${h2Class}" data-editable-text="true">
          טקסט שמקבל כוח מתמונה מקצועית
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים להסבר שירות, סיפור עסק, הצגת מוצר, תוכן שיווקי או כל אזור שצריך שילוב של ויזואל וטקסט.
        </p>

        <div class="mt-8 grid gap-4">
          ${softFeatureCard("מסר ברור", "הלקוח מבין מיד את הערך.", "✓")}
          ${softFeatureCard("תמונה מחזקת", "הוויזואל יוצר אמון ועניין.", "✦")}
        </div>

        ${actionRow("המשך קריאה", "צור קשר")}
      </div>
      `,
      imageBlock(sectionImages.office, "min-h-[560px]"),
      false
    ),
    { tags: ["image", "split", "content"] }
  ),

  createVariant(
    "text-layout-4",
    kind,
    "תמונה + טקסט",
    "מבנה טקסט הפוך עם תמונה מימין וטקסט משמאל.",
    "הפוך",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">תוכן ויזואלי</p>

        <h2 class="${h2Class}" data-editable-text="true">
          מבנה הפוך שמתאים לגיוון עמודים
        </h2>

        <p class="${textClass}" data-editable-text="true">
          אפשר להשתמש במבנה הזה לסיפור, הסבר, יתרונות, חזון, שירות או תוכן עם תמונה.
        </p>

        ${actionRow("פעולה ראשית", "מידע נוסף")}
      </div>
      `,
      imageBlock(sectionImages.people, "min-h-[560px]"),
      true
    ),
    { tags: ["reverse", "image", "text"] }
  ),

  createVariant(
    "text-layout-5",
    kind,
    "שלוש עמודות טקסט",
    "שלושה בלוקים של טקסט עם כותרות, מתאים להסברים ויתרונות.",
    "Columns",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "שלושה מסרים חשובים",
        "הציגו שלושה רעיונות, יתרונות, שלבים או הסברים בצורה מסודרת.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${textColumn("מסר ראשון", "הסבר קצר וברור על המסר הראשון שהלקוח צריך להבין.", "1")}
        ${textColumn("מסר שני", "הסבר קצר וברור על המסר השני, היתרון או הערך המרכזי.", "2")}
        ${textColumn("מסר שלישי", "הסבר קצר שמוביל לאמון, עניין או פעולה.", "3")}
      </div>
      `
    ),
    { tags: ["columns", "text", "features"] }
  ),

  createVariant(
    "text-layout-6",
    kind,
    "ציטוט גדול",
    "סקשן Quote גדול ויוקרתי להדגשת משפט חזק.",
    "Quote",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[1100px]">
        ${quoteBlock(
          "משפט חזק אחד יכול להסביר את כל הערך של העסק ולהישאר ללקוח בראש.",
          "שם העסק / בעל העסק"
        )}
      </div>
      `
    ),
    { tags: ["quote", "statement", "premium"] }
  ),

  createVariant(
    "text-layout-7",
    kind,
    "טקסט כהה פרימיום",
    "סקשן טקסט כהה, דרמטי ויוקרתי.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative mx-auto max-w-[900px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
            Premium Text
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            תוכן שנראה כמו מותג גדול
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים למסרים חשובים, חזון, הצגת ערך, תוכן שיווקי או אזור פרימיום באתר.
          </p>
        </div>

        <div class="relative mt-12 grid gap-6 md:grid-cols-3">
          ${darkTextCard("נקודה ראשונה", "תיאור קצר של מסר חשוב או יתרון מרכזי.", "01")}
          ${darkTextCard("נקודה שנייה", "תיאור קצר שמוסיף עומק ומחזק את המסר.", "02")}
          ${darkTextCard("נקודה שלישית", "תיאור קצר שמוביל את הלקוח לפעולה.", "03")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "luxury"] }
  ),

  createVariant(
    "text-layout-8",
    kind,
    "טקסט על תמונת רקע",
    "כותרת ופסקה על רקע תמונה עם Overlay.",
    "Background",
    backgroundSection(
      kind,
      sectionImages.darkOffice,
      `
      <div class="max-w-[860px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          מסר מרכזי
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          כותרת חזקה מעל תמונת רקע
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          זה המקום להדגיש משפט, מסר, חזון, הצהרה, יתרון או קריאה לפעולה בצורה ויזואלית.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("פעולה ראשית")}
          ${secondaryButton("מידע נוסף")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "text", "hero"] }
  ),

  createVariant(
    "text-layout-9",
    kind,
    "טקסט עם רשימה",
    "כותרת וטקסט לצד רשימת נקודות ברורה.",
    "List",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">מה חשוב לדעת?</p>

          <h2 class="${h2Class}" data-editable-text="true">
            תוכן שמסביר בצורה מסודרת
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לרשימת יתרונות, מה כלול, תהליך, תנאים, הסברים או תקנון קצר.
          </p>

          ${actionRow("קבלת פרטים", "שאלה")}
        </div>

        ${simpleList([
          "נקודה ראשונה שאפשר לערוך",
          "נקודה שנייה שאפשר לערוך",
          "נקודה שלישית שאפשר לערוך",
          "נקודה רביעית שאפשר לערוך",
          "נקודה חמישית שאפשר לערוך",
        ])}
      </div>
      `
    ),
    { tags: ["list", "bullets", "content"] }
  ),

  createVariant(
    "text-layout-10",
    kind,
    "שאלות ותשובות טקסט",
    "FAQ טקסטואלי נקי לשאלות נפוצות.",
    "FAQ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "שאלות נפוצות",
        "ענו מראש על שאלות נפוצות כדי לחסוך זמן ולחזק אמון.",
        "center"
      )}

      <div class="mx-auto mt-12 grid max-w-[980px] gap-4">
        ${faqItem("שאלה ראשונה?", "כאן תופיע תשובה קצרה וברורה שאפשר לערוך.", true)}
        ${faqItem("שאלה שנייה?", "כאן תופיע תשובה קצרה וברורה שאפשר לערוך.")}
        ${faqItem("שאלה שלישית?", "כאן תופיע תשובה קצרה וברורה שאפשר לערוך.")}
        ${faqItem("שאלה רביעית?", "כאן תופיע תשובה קצרה וברורה שאפשר לערוך.")}
      </div>
      `
    ),
    { tags: ["faq", "questions", "text"] }
  ),

  createVariant(
    "text-layout-11",
    kind,
    "טקסט בשלבים",
    "תוכן שמסביר תהליך בשלושה שלבים.",
    "Steps",
    sectionShell(
      kind,
      `
      <div class="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">איך זה עובד?</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הסבר ברור בשלבים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים להסבר שירות, תהליך עבודה, קנייה, הרשמה, תיאום תור או כל תהליך שצריך להיות ברור ללקוח.
          </p>

          ${actionRow("התחלה", "פרטים נוספים")}
        </div>

        <div class="${softCardClass}">
          <div class="grid gap-7">
            ${timelineItem("1", "שלב ראשון", "הסבר קצר על השלב הראשון בתהליך.")}
            ${timelineItem("2", "שלב שני", "הסבר קצר על השלב השני בתהליך.")}
            ${timelineItem("3", "שלב שלישי", "הסבר קצר על השלב השלישי בתהליך.")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["steps", "timeline", "process"] }
  ),

  createVariant(
    "text-layout-12",
    kind,
    "טקסט עם נתונים",
    "תוכן שיווקי עם מספרים לחיזוק אמון.",
    "Stats",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">אמון במספרים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            טקסט שמתחזק עם נתונים אמיתיים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            שלבו טקסט שיווקי עם מספרים כדי להראות ניסיון, תוצאות, לקוחות ושביעות רצון.
          </p>

          ${actionRow("הצטרפות", "מידע נוסף")}
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
    { tags: ["stats", "trust", "text"] }
  ),

  createVariant(
    "text-layout-13",
    kind,
    "טקסט עם וידאו",
    "טקסט הסבר לצד וידאו.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">וידאו הסבר</p>

        <h2 class="${h2Class}" data-editable-text="true">
          סרטון קצר שמחזק את הטקסט
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים להסבר שירות, סרטון תדמית, הדרכה, מוצר דיגיטלי, קורס או הצגת תהליך.
        </p>

        ${actionRow("צפייה", "צור קשר")}
      </div>
      `,
      videoBox(),
      false
    ),
    { tags: ["video", "explain", "text"] }
  ),

  createVariant(
    "text-layout-14",
    kind,
    "טקסט + טופס",
    "תוכן טקסטואלי לצד טופס פנייה.",
    "Lead",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">רוצים לדעת עוד?</p>

          <h2 class="${h2Class}" data-editable-text="true">
            טקסט שמוביל לפנייה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מבנה טוב לדפי נחיתה, הסבר שירות, מאמר שיווקי או אזור שמטרתו להפוך קוראים ללידים.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${softFeatureCard("מענה מהיר", "נחזור אליכם בהקדם.", "✓")}
            ${softFeatureCard("שירות אישי", "התאמה לפי הצורך.", "♡")}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            השאירו פרטים
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            מלאו פרטים ונחזור אליכם.
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
    "text-layout-15",
    kind,
    "טקסט עם המלצה",
    "תוכן שיווקי לצד המלצת לקוח.",
    "Review",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">הוכחת אמון</p>

          <h2 class="${h2Class}" data-editable-text="true">
            טקסט חזק עובד טוב יותר כשיש המלצה לידו
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לסיפור שירות, יתרונות, דף נחיתה, מוצר, קורס או כל מסר שמצריך אמון.
          </p>

          ${actionRow("גם אני רוצה", "עוד המלצות")}
        </div>

        ${testimonialCard(
          "הטקסט באתר היה ברור, השירות היה מקצועי והתהליך כולו הרגיש מסודר ונעים.",
          "לקוחה מרוצה"
        )}
      </div>
      `
    ),
    { tags: ["testimonial", "trust", "text"] }
  ),

  createVariant(
    "text-layout-16",
    kind,
    "טקסט מינימליסטי",
    "סקשן טקסט קצר, נקי ואלגנטי בלי עומס.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[820px] text-center">
        <p class="${pillClass}" data-editable-text="true">בקצרה</p>

        <h2 class="${h2Class}" data-editable-text="true">
          טקסט קצר, נקי ומדויק
        </h2>

        <p class="mx-auto mt-6 max-w-[680px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          מתאים לאתרים אלגנטיים שרוצים להציג מידע ברור בלי עומס ובלי יותר מדי אלמנטים.
        </p>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "short"] }
  ),

  createVariant(
    "text-layout-17",
    kind,
    "הדגשת הודעה",
    "כרטיס טקסט מודגש להודעה חשובה, הערה או מסר.",
    "Notice",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px]">
        ${textHighlightBox(
          "הודעה חשובה או מסר מרכזי",
          "כאן אפשר להציג עדכון חשוב, תנאי שירות, מבצע, הבהרה, מידע לפני רכישה או כל הודעה שהלקוח חייב לראות."
        )}
      </div>
      `
    ),
    { tags: ["notice", "highlight", "message"] }
  ),

  createVariant(
    "text-layout-18",
    kind,
    "CTA טקסט וואו",
    "סקשן טקסט קצר, צבעוני וממיר לסוף עמוד.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[60px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] via-fuchsia-600 to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_44px_150px_rgba(139,92,246,0.30)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/15 blur-3xl"></div>

        <div class="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div class="max-w-[780px]">
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              מסר אחרון
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              כותרת טקסט חזקה שמובילה לפעולה
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              טקסט קצר שמסביר למה כדאי ללחוץ עכשיו.
            </p>
          </div>

          <div class="flex shrink-0 flex-wrap gap-4">
            <a
              href="#contact"
              class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl"
              data-editable-link="true"
            >
              פעולה ראשית
            </a>

            <a
              href="https://wa.me/972500000000"
              class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white/15 px-8 text-sm font-black text-white ring-1 ring-white/20"
              data-editable-link="true"
            >
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