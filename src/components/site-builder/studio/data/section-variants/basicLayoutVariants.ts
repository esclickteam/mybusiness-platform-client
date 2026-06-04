import type { SectionLayoutVariant } from "../../types";
import {
  actionRow,
  addMediaBox,
  backgroundSection,
  cardClass,
  createVariant,
  darkButton,
  darkFeatureCard,
  faqItem,
  featureCard,
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
  Bizuply Website Studio — Basic Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/basicLayoutVariants.ts

  סקשנים בסיסיים כלליים.
  מתאים ל:
  - אזור טקסט כללי
  - CTA
  - שאלות נפוצות
  - יתרונות
  - מספרים
  - תמונה וטקסט
  - וידאו
  - טופס
  - מדיה
  - אזור מעבר בין סקשנים
*/

const kind = "basic" as const;

function basicInfoCard(title: string, text: string, icon = "✦") {
  return `
<article class="${cardClass}" data-editable-card="true">
  <div class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-white">
    ${icon}
  </div>

  <h3 class="text-2xl font-black text-slate-950" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>
</article>
`;
}

function miniInfoRow(title: string, text: string, icon = "✓") {
  return `
<div class="flex gap-5 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-sm font-black text-[var(--biz-primary,#7C3AED)]">
    ${icon}
  </div>

  <div>
    <h3 class="text-xl font-black text-slate-950" data-editable-text="true">
      ${title}
    </h3>

    <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
      ${text}
    </p>
  </div>
</div>
`;
}

function noticeBar(title: string, text: string) {
  return `
<div class="rounded-[34px] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.07)]" data-editable-card="true">
  <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
    <div>
      <h3 class="text-2xl font-black text-slate-950" data-editable-text="true">
        ${title}
      </h3>

      <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
        ${text}
      </p>
    </div>

    <div class="flex shrink-0 flex-wrap gap-3">
      ${primaryButton("פעולה ראשית")}
      ${secondaryButton("עוד מידע")}
    </div>
  </div>
</div>
`;
}

export const basicLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "basic-layout-1",
    kind,
    "סקשן פתיחה בסיסי",
    "כותרת, טקסט וכפתורים במבנה נקי ומקצועי.",
    "מומלץ",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] text-center">
        <p class="${pillClass}" data-editable-text="true">סקשן בסיסי</p>

        <h2 class="${h2Class}" data-editable-text="true">
          כותרת ברורה שמסבירה את הערך של הסקשן
        </h2>

        <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          כאן אפשר לכתוב הסבר קצר, מסר שיווקי, מידע חשוב או כל תוכן שהעסק רוצה להציג בצורה נקייה.
        </p>

        <div class="mt-9 flex flex-wrap justify-center gap-4">
          ${primaryButton("כפתור ראשי")}
          ${secondaryButton("כפתור משני")}
        </div>
      </div>
      `
    ),
    { featured: true, tags: ["basic", "center", "clean"] }
  ),

  createVariant(
    "basic-layout-2",
    kind,
    "טקסט + תמונה",
    "מבנה בסיסי עם טקסט בצד ותמונה בצד השני.",
    "תמונה",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">מידע חשוב</p>

        <h2 class="${h2Class}" data-editable-text="true">
          הציגו מסר ברור לצד תמונה מקצועית
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לכל אזור באתר: הסבר, יתרון, סיפור, שירות, תהליך, מוצר או קריאה לפעולה.
        </p>

        ${actionRow("התחילו עכשיו", "מידע נוסף")}
      </div>
      `,
      imageBlock(sectionImages.office, "min-h-[540px]"),
      false
    ),
    { tags: ["image", "split", "content"] }
  ),

  createVariant(
    "basic-layout-3",
    kind,
    "תמונה + טקסט",
    "אותו מבנה כמו טקסט ותמונה, רק הפוך.",
    "הפוך",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">תוכן ויזואלי</p>

        <h2 class="${h2Class}" data-editable-text="true">
          מבנה הפוך שמתאים לעמודים מגוונים
        </h2>

        <p class="${textClass}" data-editable-text="true">
          אפשר להשתמש בו בין סקשנים כדי לשבור את העיצוב וליצור זרימה טובה באתר.
        </p>

        ${actionRow("צור קשר", "צפייה בעוד")}
      </div>
      `,
      imageBlock(sectionImages.people, "min-h-[540px]"),
      true
    ),
    { tags: ["reverse", "image", "layout"] }
  ),

  createVariant(
    "basic-layout-4",
    kind,
    "שלושה יתרונות",
    "שלושה כרטיסי יתרונות בסיסיים וברורים.",
    "יתרונות",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "למה לבחור בנו?",
        "הציגו שלושה יתרונות מרכזיים בצורה נקייה, קצרה וברורה.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${basicInfoCard("יתרון ראשון", "הסבר קצר על היתרון המרכזי שהעסק נותן ללקוחות.", "1")}
        ${basicInfoCard("יתרון שני", "הסבר קצר על הערך, השירות או התוצאה שהלקוח מקבל.", "2")}
        ${basicInfoCard("יתרון שלישי", "הסבר קצר שמחזק אמון ומוביל לפעולה.", "3")}
      </div>
      `
    ),
    { tags: ["features", "cards", "benefits"] }
  ),

  createVariant(
    "basic-layout-5",
    kind,
    "רשימת יתרונות",
    "רשימת נקודות מקצועית בתוך כרטיס.",
    "רשימה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">מה מקבלים?</p>

          <h2 class="${h2Class}" data-editable-text="true">
            כל היתרונות החשובים במקום אחד
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מבנה שמתאים להצגת יתרונות, מה כלול, תהליך, תכולת שירות או חבילה.
          </p>

          ${actionRow("קבלת פרטים", "שאלות נפוצות")}
        </div>

        ${simpleList([
          "יתרון ראשון שאפשר לערוך",
          "יתרון שני שאפשר לערוך",
          "יתרון שלישי שאפשר לערוך",
          "יתרון רביעי שאפשר לערוך",
          "יתרון חמישי שאפשר לערוך",
        ])}
      </div>
      `
    ),
    { tags: ["list", "benefits", "content"] }
  ),

  createVariant(
    "basic-layout-6",
    kind,
    "מספרים ונתונים",
    "ארבעה כרטיסי סטטיסטיקה לחיזוק אמון.",
    "נתונים",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "מספרים שמחזקים אמון",
        "הציגו ניסיון, לקוחות, תוצאות או פעילות עסקית בצורה ברורה.",
        "center"
      )}

      <div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        ${statCard("500+", "לקוחות")}
        ${statCard("98%", "שביעות רצון")}
        ${statCard("7", "שנות ניסיון")}
        ${statCard("24/7", "זמינות דיגיטלית")}
      </div>
      `
    ),
    { tags: ["stats", "trust", "numbers"] }
  ),

  createVariant(
    "basic-layout-7",
    kind,
    "כהה יוקרתי",
    "סקשן בסיסי כהה עם מראה פרימיום.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] bg-slate-950 p-8 text-white shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative mx-auto max-w-[900px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
            Premium Section
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            סקשן בסיסי שנראה כמו מותג גדול
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים להדגשה, מעבר בין אזורים, CTA, הצגת יתרונות או תוכן חשוב.
          </p>
        </div>

        <div class="relative mt-12 grid gap-6 md:grid-cols-3">
          ${darkFeatureCard("נקודה ראשונה", "תיאור קצר של יתרון או מסר.", "01")}
          ${darkFeatureCard("נקודה שנייה", "תיאור קצר של יתרון או מסר.", "02")}
          ${darkFeatureCard("נקודה שלישית", "תיאור קצר של יתרון או מסר.", "03")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "luxury"] }
  ),

  createVariant(
    "basic-layout-8",
    kind,
    "סקשן על תמונת רקע",
    "סקשן בסיסי עם תמונת רקע, Overlay וכפתורים.",
    "רקע",
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
          מתאים לאזורי מעבר, הודעה חשובה, קריאה לפעולה או הצגת מסר מרכזי.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("פעולה ראשית")}
          ${secondaryButton("עוד מידע")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "hero", "cta"] }
  ),

  createVariant(
    "basic-layout-9",
    kind,
    "שאלות נפוצות",
    "FAQ בסיסי עם שאלות ותשובות נפתחות.",
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
    { tags: ["faq", "questions", "support"] }
  ),

  createVariant(
    "basic-layout-10",
    kind,
    "תהליך בשלבים",
    "Timeline בסיסי עם שלושה שלבים.",
    "תהליך",
    sectionShell(
      kind,
      `
      <div class="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">איך זה עובד?</p>

          <h2 class="${h2Class}" data-editable-text="true">
            תהליך פשוט וברור בשלושה שלבים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לכל תהליך עסקי: שירות, הרשמה, קנייה, תיאום תור או קבלת הצעת מחיר.
          </p>

          ${actionRow("התחלת תהליך", "שאלה לפני")}
        </div>

        <div class="${softCardClass}">
          <div class="grid gap-7">
            ${timelineItem("1", "שלב ראשון", "הלקוח מבצע פעולה ראשונה או משאיר פרטים.")}
            ${timelineItem("2", "שלב שני", "העסק חוזר ללקוח, מאשר פרטים או נותן מענה.")}
            ${timelineItem("3", "שלב שלישי", "הלקוח מתקדם לשירות, רכישה, תור או תוצאה.")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["process", "timeline", "steps"] }
  ),

  createVariant(
    "basic-layout-11",
    kind,
    "וידאו בסיסי",
    "סקשן וידאו עם טקסט הסבר וכפתורים.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">וידאו הסבר</p>

        <h2 class="${h2Class}" data-editable-text="true">
          הסבירו את המסר דרך סרטון קצר
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לסרטון תדמית, הדרכה, הצגת מוצר, הסבר שירות או תוכן דיגיטלי.
        </p>

        ${actionRow("צפייה", "צור קשר")}
      </div>
      `,
      videoBox(),
      false
    ),
    { tags: ["video", "media", "explain"] }
  ),

  createVariant(
    "basic-layout-12",
    kind,
    "טופס בסיסי",
    "סקשן בסיסי עם טופס ליד.",
    "Form",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">השאירו פרטים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            רוצים לקבל עוד מידע?
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מבנה בסיסי שמתאים לכל מקום באתר שבו רוצים לאסוף פניות.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${miniInfoRow("מענה מהיר", "נחזור אליכם בהקדם.", "✓")}
            ${miniInfoRow("שירות אישי", "התאמה לפי הצורך.", "♡")}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-950" data-editable-text="true">
            קבלת פרטים
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
    { tags: ["form", "lead", "contact"] }
  ),

  createVariant(
    "basic-layout-13",
    kind,
    "הודעה / Banner",
    "רצועת הודעה קצרה עם כפתורים.",
    "Banner",
    sectionShell(
      kind,
      `
      ${noticeBar(
        "הודעה חשובה או קריאה לפעולה",
        "כאן אפשר להציג מבצע, עדכון, הודעה, קישור חשוב או מסר קצר בין סקשנים."
      )}
      `
    ),
    { tags: ["banner", "notice", "short"] }
  ),

  createVariant(
    "basic-layout-14",
    kind,
    "גריד תמונות בסיסי",
    "סקשן בסיסי להצגת תמונות בצורה נקייה.",
    "Images",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "תמונות נבחרות",
        "הציגו תמונות, עבודות, מוצרים, מקום או אווירה.",
        "center"
      )}

      <div class="mt-12">
        ${imageGrid(
          [
            sectionImages.office,
            sectionImages.people,
            sectionImages.product,
            sectionImages.salon,
            sectionImages.event,
            sectionImages.store,
          ],
          "min-h-[250px]",
          "md:grid-cols-3"
        )}
      </div>
      `
    ),
    { tags: ["images", "grid", "gallery"] }
  ),

  createVariant(
    "basic-layout-15",
    kind,
    "המלצה בסיסית",
    "סקשן המלצה פשוט עם טקסט וכפתור.",
    "Review",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">הוכחת אמון</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לקוחות מרוצים הם הדרך הכי טובה להסביר את הערך
          </h2>

          <p class="${textClass}" data-editable-text="true">
            אפשר להשתמש בסקשן הזה כדי להציג ביקורת, סיפור לקוח או משפט אמון.
          </p>

          ${actionRow("גם אני רוצה", "עוד המלצות")}
        </div>

        ${testimonialCard(
          "שירות מקצועי, ברור ונעים. קיבלתי בדיוק את מה שהייתי צריך/ה.",
          "לקוח מרוצה"
        )}
      </div>
      `
    ),
    { tags: ["testimonial", "trust", "review"] }
  ),

  createVariant(
    "basic-layout-16",
    kind,
    "וואטסאפ בסיסי",
    "סקשן שמוביל לשיחת וואטסאפ.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-700" data-editable-text="true">
              זמינים בוואטסאפ
            </p>

            <h2 class="${h2Class}" data-editable-text="true">
              לקוחות יכולים להתחיל שיחה בלחיצה
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לשאלות, הזמנות, תיאום תורים, שירות לקוחות או פניות מהירות.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${whatsappButton("שליחת הודעה")}
              ${secondaryButton("מידע נוסף")}
            </div>
          </div>

          <div class="${cardClass}">
            <div class="rounded-[32px] bg-slate-950 p-6 text-white">
              <p class="text-sm font-black text-white/60" data-editable-text="true">
                WhatsApp Preview
              </p>

              <div class="mt-5 grid gap-4">
                <div class="rounded-[24px] bg-white/10 p-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
                  שלום, אשמח לקבל פרטים.
                </div>

                <div class="mr-auto rounded-[24px] bg-emerald-500 p-4 text-sm font-bold leading-7 text-white" data-editable-text="true">
                  בשמחה! אפשר להשאיר שם וטלפון?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["whatsapp", "contact", "lead"] }
  ),

  createVariant(
    "basic-layout-17",
    kind,
    "הוספת מדיה",
    "סקשן בסיסי עם אזור להוספת תמונה או וידאו.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.product, "min-h-[340px]")}
          ${addMediaBox("הוספת תמונה / וידאו")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">מדיה גמישה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו תמונה, סרטון או קובץ ויזואלי
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לכל סקשן שבו בעל העסק רוצה להעלות תמונה או וידאו בעצמו.
          </p>

          ${actionRow("הוספה", "צפייה")}
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "basic-layout-18",
    kind,
    "CTA וואו",
    "סקשן קריאה לפעולה קצר, צבעוני וממיר.",
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
              מוכנים להתחיל?
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              כותרת חזקה שמובילה את הלקוח לפעולה
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              טקסט קצר וברור שמסביר מה קורה אחרי הלחיצה.
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