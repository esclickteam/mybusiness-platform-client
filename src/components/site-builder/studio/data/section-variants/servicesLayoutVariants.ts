import type { SectionLayoutVariant } from "../../types";
import {
  actionRow,
  addMediaBox,
  backgroundSection,
  bookingTimes,
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
  secondaryButton,
  sectionImages,
  sectionIntro,
  sectionShell,
  softCardClass,
  softFeatureCard,
  splitLayout,
  statCard,
  textClass,
  videoBox,
  whatsappButton,
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — Services Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/servicesLayoutVariants.ts

  סקשן שירותים מקצועי.
  מתאים ל:
  - שירותים עסקיים
  - קליניקות
  - יועצים
  - מאמנים
  - חנויות
  - SaaS
  - שירותים עם מחיר
  - שירותים עם תיאום תור
  - שירותים עם טופס ליד
*/

const kind = "services" as const;

function serviceCard(
  title: string,
  text: string,
  price = "החל מ־₪350",
  icon = "✦"
) {
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

  <div class="mt-6 flex items-center justify-between gap-3">
    <span class="rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
      ${price}
    </span>

    <a
      href="#booking"
      class="rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-lg"
      data-editable-link="true"
    >
      לתיאום
    </a>
  </div>
</article>
`;
}

function horizontalServiceCard(title: string, text: string, icon = "✓") {
  return `
<article class="flex gap-5 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-lg font-black text-[var(--biz-primary,#7C3AED)]">
    ${icon}
  </div>

  <div>
    <h3 class="text-xl font-black text-slate-800" data-editable-text="true">
      ${title}
    </h3>

    <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
      ${text}
    </p>
  </div>
</article>
`;
}

function serviceRow(title: string, text: string, price: string) {
  return `
<div class="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between" data-editable-card="true">
  <div>
    <h3 class="text-xl font-black text-slate-800" data-editable-text="true">${title}</h3>
    <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
  </div>

  <div class="flex shrink-0 items-center gap-3">
    <span class="rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
      ${price}
    </span>
    ${primaryButton("לתיאום", "#booking")}
  </div>
</div>
`;
}

export const servicesLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "services-layout-1",
    kind,
    "שירותים בכרטיסים",
    "גריד שירותים קלאסי עם שלושה כרטיסים, מחיר וכפתור תיאום.",
    "מומלץ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "השירותים שלנו",
        "בחרו שירות, קראו פרטים וקבעו תור או השאירו פנייה בצורה פשוטה וברורה.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${serviceCard("שירות ראשון", "תיאור קצר וברור של השירות, למי הוא מתאים ומה מקבלים.", "₪250", "1")}
        ${serviceCard("שירות שני", "תיאור קצר וברור של השירות, היתרון המרכזי והתוצאה ללקוח.", "₪350", "2")}
        ${serviceCard("שירות שלישי", "תיאור קצר שמציג את הערך של השירות ומוביל לפעולה.", "₪450", "3")}
      </div>
      `
    ),
    { featured: true, tags: ["cards", "pricing", "classic"] }
  ),

  createVariant(
    "services-layout-2",
    kind,
    "שירותים עם תמונה",
    "טקסט ושירותים בצד אחד, תמונה גדולה בצד השני.",
    "תמונה",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">מה אנחנו מציעים</p>

        <h2 class="${h2Class}" data-editable-text="true">
          שירותים שמותאמים בדיוק לצורך של הלקוח
        </h2>

        <p class="${textClass}" data-editable-text="true">
          הציגו את השירותים המרכזיים של העסק בצורה מקצועית, קצרה וברורה.
        </p>

        <div class="mt-8 grid gap-4">
          ${horizontalServiceCard("שירות מקצועי", "שירות מותאם אישית עם תוצאה ברורה.", "✓")}
          ${horizontalServiceCard("ליווי אישי", "מענה, הסבר ותהליך פשוט ללקוח.", "♡")}
          ${horizontalServiceCard("תוצאה מדויקת", "עבודה מקצועית, מסודרת וברמה גבוהה.", "✦")}
        </div>

        ${actionRow("קביעת תור", "צור קשר")}
      </div>
      `,
      imageBlock(sectionImages.salon),
      false
    ),
    { tags: ["image", "services", "business"] }
  ),

  createVariant(
    "services-layout-3",
    kind,
    "תמונה + שירותים",
    "מבנה הפוך עם תמונה בצד ימין ושירותים בצד שמאל.",
    "הפוך",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">שירותים מובילים</p>

        <h2 class="${h2Class}" data-editable-text="true">
          כל שירות מוצג בצורה שמובילה לפנייה
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לקליניקות, יועצים, מאמנים, נותני שירות, סטודיו, חנויות ומערכות.
        </p>

        <div class="mt-8 grid gap-4">
          ${horizontalServiceCard("ייעוץ ראשוני", "בדיקה, התאמה והבנת הצורך.", "1")}
          ${horizontalServiceCard("שירות מלא", "תהליך מלא מתחילתו ועד סופו.", "2")}
          ${horizontalServiceCard("ליווי מתמשך", "מעקב, שיפור ותמיכה לאורך זמן.", "3")}
        </div>
      </div>
      `,
      imageBlock(sectionImages.clinic),
      true
    ),
    { tags: ["reverse", "image", "clean"] }
  ),

  createVariant(
    "services-layout-4",
    kind,
    "שירותים כהה יוקרתי",
    "סקשן שירותים כהה ויוקרתי לעסקים שרוצים להיראות פרימיום.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[54px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_44px_150px_rgba(15,23,42,0.25)] md:p-14">
        <div class="mx-auto max-w-[880px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
            Premium Services
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            שירותים ברמה גבוהה, עם חוויה יוקרתית
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים לקליניקות, אולמות, יועצים, משרדים, נדל״ן ומותגים שרוצים מראה חזק.
          </p>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          ${darkFeatureCard("שירות פרימיום", "תיאור קצר של שירות יוקרתי וממוקד תוצאה.", "01")}
          ${darkFeatureCard("ליווי אישי", "תהליך ברור, שירות אישי וזמינות גבוהה.", "02")}
          ${darkFeatureCard("חבילת VIP", "שירות מורחב עם יתרונות נוספים.", "03")}
        </div>

        <div class="mt-10 flex justify-center gap-4">
          ${primaryButton("לתיאום פגישה")}
          ${darkButton("כל השירותים")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "luxury", "premium"] }
  ),

  createVariant(
    "services-layout-5",
    kind,
    "מחירון שירותים",
    "רשימת שירותים עם מחיר וכפתור תיאום לכל שירות.",
    "מחירון",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "מחירון שירותים",
        "הציגו שירותים ומחירים בצורה מסודרת, נקייה וברורה.",
        "center"
      )}

      <div class="mx-auto mt-12 grid max-w-[980px] gap-4">
        ${serviceRow("שירות ראשון", "תיאור קצר של השירות ומה הוא כולל.", "₪250")}
        ${serviceRow("שירות שני", "תיאור קצר של השירות, משך ותוצאה.", "₪350")}
        ${serviceRow("שירות שלישי", "תיאור קצר של חבילה או שירות מתקדם.", "₪450")}
      </div>
      `
    ),
    { tags: ["pricing", "list", "booking"] }
  ),

  createVariant(
    "services-layout-6",
    kind,
    "חבילות שירות",
    "שלוש חבילות שירות עם מחיר, יתרונות וכפתור בחירה.",
    "חבילות",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "בחרו חבילת שירות",
        "מתאים לעסקים שמוכרים חבילות, מנויים, שירותים מדורגים או הצעות מחיר.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${priceCard("Basic", "₪199", "חבילה בסיסית להתחלה מהירה.", false)}
        ${priceCard("Pro", "₪399", "החבילה הפופולרית עם יותר אפשרויות.", true)}
        ${priceCard("VIP", "₪699", "חבילה מלאה עם ליווי ושירות מורחב.", false)}
      </div>
      `
    ),
    { tags: ["packages", "pricing", "plans"] }
  ),

  createVariant(
    "services-layout-7",
    kind,
    "שירות מרכזי",
    "סקשן שמדגיש שירות אחד מרכזי עם תמונה, מחיר וכפתור.",
    "Featured",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[54px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_44px_150px_rgba(139,92,246,0.28)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              השירות הפופולרי
            </p>

            <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              שירות מרכזי שמוביל את הלקוח לפעולה
            </h2>

            <p class="mt-6 text-xl font-bold leading-10 text-white/80" data-editable-text="true">
              הציגו שירות אחד חזק עם תיאור, מחיר, יתרונות וכפתור תיאום.
            </p>

            <div class="mt-9 flex flex-wrap items-center gap-4">
              <a href="#booking" class="rounded-2xl bg-white px-8 py-4 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl" data-editable-link="true">
                קביעת תור
              </a>
              <span class="rounded-full bg-white/20 px-5 py-3 text-sm font-black text-white" data-editable-text="true">
                החל מ־₪350
              </span>
            </div>
          </div>

          ${imageBlock(sectionImages.product)}
        </div>
      </div>
      `
    ),
    { tags: ["featured", "service", "cta"] }
  ),

  createVariant(
    "services-layout-8",
    kind,
    "שירותים עם יומן",
    "שירותים בצד אחד ושעות פנויות לתיאום בצד השני.",
    "יומן",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">שירותים ותורים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            בוחרים שירות וקובעים שעה פנויה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לעסקים שמנהלים תורים, פגישות, טיפולים, ייעוצים או שיעורים.
          </p>

          <div class="mt-8 grid gap-4">
            ${horizontalServiceCard("שירות ראשון", "משך: 60 דקות · מחיר: ₪250", "1")}
            ${horizontalServiceCard("שירות שני", "משך: 90 דקות · מחיר: ₪350", "2")}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            שעות פנויות
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            בחרו שעה שמתאימה לכם.
          </p>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            ${bookingTimes()}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["booking", "appointments", "services"] }
  ),

  createVariant(
    "services-layout-9",
    kind,
    "שירותים עם טופס ליד",
    "שירותים בצד אחד וטופס יצירת קשר בצד השני.",
    "Lead",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">השאירו פרטים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לא בטוחים איזה שירות מתאים? נשמח לעזור
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הלקוחות יכולים לקרוא על השירותים ולהשאיר פנייה ישירות מהסקשן.
          </p>

          <div class="mt-8 grid gap-4">
            ${horizontalServiceCard("ייעוץ", "שיחת התאמה קצרה לפני בחירת שירות.", "☎")}
            ${horizontalServiceCard("התאמה אישית", "בניית פתרון לפי צורך, תקציב וזמינות.", "✦")}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            קבלת פרטים
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            השאירו פרטים ונחזור אליכם.
          </p>

          <div class="mt-6">
            ${leadForm("שליחת פנייה")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["lead", "form", "conversion"] }
  ),

  createVariant(
    "services-layout-10",
    kind,
    "שירותים על תמונת רקע",
    "סקשן שירותים עם תמונת רקע, טקסט לבן וכפתורים.",
    "רקע",
    backgroundSection(
      kind,
      sectionImages.salon,
      `
      <div class="max-w-[820px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          השירותים שלנו
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          שירותים מקצועיים שמותאמים ללקוח
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          סקשן מרשים שמתאים להצגת שירותים בצורה ויזואלית חזקה.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("קביעת תור")}
          ${secondaryButton("כל השירותים")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "hero", "visual"] }
  ),

  createVariant(
    "services-layout-11",
    kind,
    "שירותים עם גלריה",
    "שירותים לצד גריד תמונות שמציג אווירה, עבודות או מוצרים.",
    "גלריה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">שירותים בתמונות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הציגו גם את השירות וגם את התוצאה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לביוטי, אוכל, אירועים, סטודיו, נדל״ן, מוצרים או עבודות לפני/אחרי.
          </p>

          ${actionRow("צפייה בגלריה", "לתיאום")}
        </div>

        ${imageGrid(
          [
            sectionImages.beauty,
            sectionImages.salon,
            sectionImages.product,
            sectionImages.clinic,
          ],
          "min-h-[230px]",
          "md:grid-cols-2"
        )}
      </div>
      `
    ),
    { tags: ["gallery", "images", "visual"] }
  ),

  createVariant(
    "services-layout-12",
    kind,
    "שירותים עם מדיה להוספה",
    "מבנה עם אזור ברור להוספת תמונה או וידאו לשירותים.",
    "מדיה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.product, "min-h-[340px]")}
          ${addMediaBox("הוספת תמונה / וידאו לשירות")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">שירותים עם מדיה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו תמונות אמיתיות לכל שירות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            בעל העסק יכול להעלות תמונות, סרטונים, לפני/אחרי, תוצאות, מוצרים או עבודות.
          </p>

          ${actionRow("לתיאום", "צור קשר")}
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "image"] }
  ),

  createVariant(
    "services-layout-13",
    kind,
    "שירותים עם וידאו",
    "הצגת שירותים לצד סרטון הסבר או סרטון תדמית.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">וידאו שירותים</p>

        <h2 class="${h2Class}" data-editable-text="true">
          הסבירו את השירותים דרך סרטון קצר
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לסרטון תדמית, הסבר על טיפול, הדרכה קצרה, קורס או הצגת תהליך.
        </p>

        <div class="mt-8 grid gap-4">
          ${horizontalServiceCard("שירות ראשון", "תיאור קצר של השירות.", "1")}
          ${horizontalServiceCard("שירות שני", "תיאור קצר של השירות.", "2")}
        </div>

        ${actionRow("צפייה", "פנייה")}
      </div>
      `,
      videoBox(),
      false
    ),
    { tags: ["video", "explain", "services"] }
  ),

  createVariant(
    "services-layout-14",
    kind,
    "שירותים מינימליסטי",
    "רשימת שירותים נקייה בלי תמונות ובלי עומס.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px]">
        <div class="text-center">
          <p class="${pillClass}" data-editable-text="true">שירותים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            כל מה שהלקוח צריך לדעת — פשוט וברור
          </h2>

          <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
            תצוגה נקייה שמתאימה לעסקים שרוצים עמוד מינימליסטי, אלגנטי ומהיר.
          </p>
        </div>

        <div class="mt-12 grid gap-4">
          ${serviceRow("שירות ראשון", "תיאור קצר של השירות ומה הוא כולל.", "₪250")}
          ${serviceRow("שירות שני", "תיאור קצר של השירות ומה הוא כולל.", "₪350")}
          ${serviceRow("שירות שלישי", "תיאור קצר של השירות ומה הוא כולל.", "₪450")}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "list"] }
  ),

  createVariant(
    "services-layout-15",
    kind,
    "שירותים SaaS",
    "סקשן שירותים שמתאים למערכת, מוצר דיגיטלי או Mini SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[54px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_44px_150px_rgba(15,23,42,0.25)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Platform Features
            </p>

            <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              שירותים שהם גם יכולות מערכת
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים למיני SaaS, CRM, מערכת תורים, קורס דיגיטלי, אזור לקוחות או מוצר טכנולוגי.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("הפעלת מערכת")}
              ${darkButton("צפייה בדמו")}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${darkFeatureCard("CRM ולידים", "ניהול פניות, לקוחות ומשימות.", "CRM")}
            ${darkFeatureCard("תיאום תורים", "בחירת שירות, תאריך ושעה פנויה.", "◷")}
            ${darkFeatureCard("תשלומים", "חבילות, מנויים וסליקה.", "₪")}
            ${darkFeatureCard("AI ואוטומציות", "הודעות, תזכורות ותהליכים חכמים.", "AI")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "features", "dark"] }
  ),

  createVariant(
    "services-layout-16",
    kind,
    "שירותים עם וואטסאפ",
    "סקשן שירותים שמוביל ישירות לשיחת וואטסאפ.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="rounded-[54px] bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 shadow-[0_36px_120px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-700" data-editable-text="true">
              שירות מהיר בוואטסאפ
            </p>

            <h2 class="${h2Class}" data-editable-text="true">
              לקוחות יכולים לשאול על שירות ולקבל מענה מיד
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לעסקים שמקבלים פניות, שאלות, הזמנות ותיאומים דרך וואטסאפ.
            </p>

            <div class="mt-8 grid gap-4">
              ${horizontalServiceCard("שירות ראשון", "שאלה מהירה וקבלת פרטים.", "☎")}
              ${horizontalServiceCard("שירות שני", "מעבר ישיר לשיחה עם העסק.", "↗")}
            </div>

            <div class="mt-9 flex flex-wrap gap-4">
              ${whatsappButton("שאלו על שירות")}
              ${secondaryButton("צפייה בכל השירותים")}
            </div>
          </div>

          <div class="${cardClass}">
            <div class="rounded-[32px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
              <p class="text-sm font-black text-white/60" data-editable-text="true">
                WhatsApp Preview
              </p>

              <div class="mt-5 grid gap-4">
                <div class="rounded-[24px] bg-white/10 p-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
                  שלום, אשמח לדעת איזה שירות מתאים לי.
                </div>

                <div class="mr-auto rounded-[24px] bg-emerald-500 p-4 text-sm font-bold leading-7 text-white" data-editable-text="true">
                  בשמחה! אפשר לשלוח לי כמה פרטים?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["whatsapp", "lead", "contact"] }
  ),

  createVariant(
    "services-layout-17",
    kind,
    "שירותים עם אמון",
    "סקשן שירותים שמשלב כרטיסי שירות עם נתוני אמון.",
    "אמון",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">שירותים עם תוצאות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            שירותים שמייצרים חוויה ותוצאה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הציגו שירותים לצד נתוני אמון שמחזקים את ההחלטה של הלקוח.
          </p>

          <div class="mt-8 grid gap-4">
            ${horizontalServiceCard("שירות ראשון", "תיאור קצר של השירות והתוצאה.", "✓")}
            ${horizontalServiceCard("שירות שני", "תיאור קצר של השירות והתוצאה.", "✦")}
          </div>

          ${actionRow("לתיאום", "צור קשר")}
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          ${statCard("500+", "לקוחות")}
          ${statCard("98%", "שביעות רצון")}
          ${statCard("7", "שנות ניסיון")}
          ${statCard("24/7", "זמינות אונליין")}
        </div>
      </div>
      `
    ),
    { tags: ["trust", "stats", "services"] }
  ),

  createVariant(
    "services-layout-18",
    kind,
    "שירותים קצר עם CTA",
    "סקשן שירותים קצר וממיר שמתאים לסוף עמוד או דף נחיתה.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="rounded-[52px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_34px_120px_rgba(15,23,42,0.09)] md:p-14">
        <div class="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">שירותים</p>

            <h2 class="${h2Class}" data-editable-text="true">
              לא בטוחים מה מתאים לכם? אנחנו נעזור לבחור
            </h2>

            <p class="${textClass}" data-editable-text="true">
              סקשן קצר, ברור וממיר שמוביל את הלקוח לפנייה או לתיאום.
            </p>

            <div class="mt-8 flex flex-wrap gap-4">
              ${primaryButton("קביעת שיחה")}
              ${secondaryButton("כל השירותים")}
            </div>
          </div>

          <div class="grid gap-4">
            ${softFeatureCard("שירות ראשון", "תיאור קצר ומדויק.", "1")}
            ${softFeatureCard("שירות שני", "תיאור קצר ומדויק.", "2")}
            ${softFeatureCard("שירות שלישי", "תיאור קצר ומדויק.", "3")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["cta", "short", "conversion"] }
  ),
];