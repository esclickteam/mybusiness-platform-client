import type { SectionLayoutVariant } from "../../types";
import {
  actionRow,
  backgroundSection,
  cardClass,
  createVariant,
  darkButton,
  darkCardClass,
  darkFeatureCard,
  h2Class,
  imageBlock,
  leadForm,
  pillClass,
  primaryButton,
  secondaryButton,
  sectionImages,
  sectionIntro,
  sectionShell,
  softCardClass,
  softFeatureCard,
  splitLayout,
  statCard,
  testimonialCard,
  textClass,
  videoBox,
  whatsappButton,
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — Contact Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/contactLayoutVariants.ts

  סקשן יצירת קשר מקצועי.
  מתאים ל:
  - טופס ליד
  - וואטסאפ
  - טלפון
  - מפה
  - שעות פעילות
  - דף נחיתה
  - קליניקות
  - יועצים
  - SaaS
  - חנויות
  - נותני שירות
*/

const kind = "contact" as const;

function contactInfoCard(title: string, value: string, icon = "☎") {
  return `
<article class="${cardClass}" data-editable-card="true">
  <div class="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-lg font-black text-[var(--biz-primary,#7C3AED)]">
    ${icon}
  </div>

  <h3 class="text-xl font-black text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${value}
  </p>
</article>
`;
}

function contactMethodCard(
  title: string,
  text: string,
  button: string,
  href: string,
  icon = "↗"
) {
  return `
<article class="rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_22px_70px_rgba(15,23,42,0.08)]" data-editable-card="true">
  <div class="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-white">
    ${icon}
  </div>

  <h3 class="text-2xl font-black text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>

  <a
    href="${href}"
    class="mt-6 inline-flex min-h-12 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-lg"
    data-editable-link="true"
  >
    ${button}
  </a>
</article>
`;
}

function mapBlock() {
  return `
<div class="overflow-hidden rounded-[38px] bg-white p-3 shadow-[0_30px_100px_rgba(15,23,42,0.12)]" data-editable-card="true">
  <iframe
    src="https://www.google.com/maps?q=Tel%20Aviv&output=embed"
    width="100%"
    height="440"
    class="rounded-[28px]"
    style="border:0;"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    data-editable-map="true"
  ></iframe>
</div>
`;
}

function contactMiniForm(buttonText = "שליחת פנייה") {
  return `
<div class="${softCardClass}" data-editable-card="true">
  <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
    נשמח לשמוע מכם
  </h3>

  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    השאירו פרטים ונחזור אליכם בהקדם.
  </p>

  <div class="mt-6">
    ${leadForm(buttonText)}
  </div>
</div>
`;
}

function scheduleCard() {
  return `
<div class="${cardClass}" data-editable-card="true">
  <div class="mb-6 flex items-center justify-between gap-4">
    <div>
      <p class="text-xs font-black uppercase tracking-[0.18em] text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
        Opening Hours
      </p>
      <h3 class="mt-2 text-2xl font-black text-slate-800" data-editable-text="true">
        שעות פעילות
      </h3>
    </div>

    <div class="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-lg font-black text-[var(--biz-primary,#7C3AED)]">
      ◷
    </div>
  </div>

  <div class="grid gap-3">
    <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-600">
      <span data-editable-text="true">ראשון - חמישי</span>
      <span data-editable-text="true">09:00 - 18:00</span>
    </div>

    <div class="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm font-black text-slate-600">
      <span data-editable-text="true">שישי</span>
      <span data-editable-text="true">09:00 - 13:00</span>
    </div>

    <div class="flex items-center justify-between rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
      <span data-editable-text="true">שבת</span>
      <span data-editable-text="true">סגור</span>
    </div>
  </div>
</div>
`;
}

function luxuryContactCard() {
  return `
<div class="rounded-[42px] border border-white/10 bg-white/8 p-8 text-white shadow-[0_30px_100px_rgba(0,0,0,0.18)]" data-editable-card="true">
  <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-xs font-black text-white" data-editable-text="true">
    Contact
  </p>

  <h3 class="text-4xl font-black leading-tight text-white" data-editable-text="true">
    בואו נבנה יחד את הצעד הבא
  </h3>

  <p class="mt-4 text-base font-bold leading-8 text-white/70" data-editable-text="true">
    מלאו פרטים או שלחו הודעה ונחזור אליכם עם מענה מקצועי, מהיר וברור.
  </p>

  <div class="mt-8 flex flex-wrap gap-4">
    ${whatsappButton("שליחת וואטסאפ")}
    ${darkButton("שיחה טלפונית", "tel:0500000000")}
  </div>
</div>
`;
}

export const contactLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "contact-layout-1",
    kind,
    "טופס קלאסי מקצועי",
    "טופס יצירת קשר נקי וממיר עם טקסט בצד וטופס בצד.",
    "מומלץ",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">יצירת קשר</p>

          <h2 class="${h2Class}" data-editable-text="true">
            נשמח לשמוע מכם ולעזור לכם לבחור את הפתרון המתאים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            השאירו פרטים ונחזור אליכם עם מענה מקצועי, ברור ומהיר. מתאים ללידים, ייעוץ, תיאום תור או בקשת הצעת מחיר.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${softFeatureCard("מענה מהיר", "חוזרים אליכם בהקדם.", "✓")}
            ${softFeatureCard("התאמה אישית", "מענה לפי צורך העסק או הלקוח.", "✦")}
          </div>
        </div>

        ${contactMiniForm()}
      </div>
      `
    ),
    { featured: true, tags: ["form", "lead", "classic"] }
  ),

  createVariant(
    "contact-layout-2",
    kind,
    "וואו טופס זכוכית",
    "סקשן יוקרתי עם גרדיאנט, טופס Glass וכרטיסי מידע.",
    "Glass",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[58px] bg-gradient-to-br from-slate-950 via-violet-950 to-fuchsia-900 p-8 text-white shadow-[0_50px_170px_rgba(76,29,149,0.32)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-fuchsia-400/30 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-violet-400/30 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Let’s Talk
            </p>

            <h2 class="text-4xl font-black leading-[1.02] tracking-[-0.06em] text-white md:text-6xl" data-editable-text="true">
              השאירו פרטים וניצור עבורכם חוויה מקצועית
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/72" data-editable-text="true">
              מבנה קשר יוקרתי שמתאים לעסקים שרוצים להיראות ברמה של מותג גדול.
            </p>

            <div class="mt-9 grid gap-4 sm:grid-cols-2">
              ${darkFeatureCard("ייעוץ", "שיחת התאמה קצרה וברורה.", "01")}
              ${darkFeatureCard("ליווי", "מענה אישי ומקצועי.", "02")}
            </div>
          </div>

          <div class="rounded-[42px] border border-white/18 bg-white/12 p-6 shadow-[0_30px_110px_rgba(0,0,0,0.18)] backdrop-blur-2xl" data-editable-card="true">
            <h3 class="text-3xl font-black text-white" data-editable-text="true">
              דברו איתנו
            </h3>

            <p class="mt-2 text-sm font-bold leading-7 text-white/65" data-editable-text="true">
              השאירו פרטים ונחזור אליכם.
            </p>

            <div class="mt-6">
              ${leadForm("שליחת פרטים")}
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["glass", "luxury", "wow"] }
  ),

  createVariant(
    "contact-layout-3",
    kind,
    "וואטסאפ ראשון",
    "סקשן קשר שמוביל ישירות לשיחת וואטסאפ.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="rounded-[54px] bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 shadow-[0_36px_120px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-700" data-editable-text="true">
              זמינים בוואטסאפ
            </p>

            <h2 class="${h2Class}" data-editable-text="true">
              הלקוח לוחץ ומתחיל שיחה מיד
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לעסקים שרוצים לקבל פניות מהירות, שאלות, תיאומים, הזמנות ושירות לקוחות דרך וואטסאפ.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${whatsappButton("שליחת הודעה")}
              ${secondaryButton("שיחה טלפונית", "tel:0500000000")}
            </div>
          </div>

          <div class="${cardClass}">
            <div class="rounded-[32px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
              <p class="text-sm font-black text-white/60" data-editable-text="true">
                WhatsApp Preview
              </p>

              <div class="mt-5 grid gap-4">
                <div class="rounded-[24px] bg-white/10 p-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
                  שלום, אשמח לקבל פרטים על השירות.
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
    { tags: ["whatsapp", "lead", "fast"] }
  ),

  createVariant(
    "contact-layout-4",
    kind,
    "טופס + מפה",
    "סקשן יצירת קשר עם טופס ומפה בצד.",
    "מפה",
    sectionShell(
      kind,
      `
      <div class="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        ${contactMiniForm("שליחת פנייה")}

        <div>
          <p class="${pillClass}" data-editable-text="true">מיקום ופרטים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            כאן תוכלו למצוא אותנו
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הוסיפו כתובת, טלפון, שעות פעילות ומפה כדי שהלקוח יוכל להגיע או ליצור קשר בקלות.
          </p>

          <div class="mt-8">
            ${mapBlock()}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["map", "form", "local"] }
  ),

  createVariant(
    "contact-layout-5",
    kind,
    "כרטיסי יצירת קשר",
    "כרטיסים יפים לטלפון, וואטסאפ, מייל וכתובת.",
    "כרטיסים",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "בחרו דרך ליצור איתנו קשר",
        "טלפון, וואטסאפ, אימייל או הגעה למקום — כל האפשרויות מוצגות בצורה ברורה.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-4">
        ${contactInfoCard("טלפון", "050-0000000", "☎")}
        ${contactInfoCard("וואטסאפ", "שלחו הודעה מהירה", "WA")}
        ${contactInfoCard("אימייל", "hello@business.com", "@" )}
        ${contactInfoCard("כתובת", "רחוב העסק 10, ישראל", "⌖")}
      </div>

      <div class="mt-10 flex justify-center gap-4">
        ${primaryButton("השארת פרטים")}
        ${whatsappButton("וואטסאפ")}
      </div>
      `
    ),
    { tags: ["cards", "contact-methods", "clean"] }
  ),

  createVariant(
    "contact-layout-6",
    kind,
    "כהה יוקרתי",
    "סקשן קשר כהה, יוקרתי ודרמטי.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[58px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_50px_170px_rgba(15,23,42,0.34)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Premium Contact
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.055em] text-white md:text-6xl" data-editable-text="true">
              קשר שמרגיש כמו מותג פרימיום
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים לקליניקות, יועצים, משרדים, נדל״ן, אירועים, מותגים וסוכנויות.
            </p>

            <div class="mt-9 grid gap-4 sm:grid-cols-2">
              ${darkFeatureCard("תגובה מהירה", "מענה מקצועי ובהיר.", "✓")}
              ${darkFeatureCard("תיאום פשוט", "הלקוח יודע מה הצעד הבא.", "↗")}
            </div>
          </div>

          ${luxuryContactCard()}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "luxury", "premium"] }
  ),

  createVariant(
    "contact-layout-7",
    kind,
    "תמונה + טופס",
    "תמונה גדולה לצד טופס יצירת קשר.",
    "תמונה",
    splitLayout(
      kind,
      contactMiniForm("שליחה"),
      imageBlock(sectionImages.office, "min-h-[560px]"),
      true
    ),
    { tags: ["image", "form", "business"] }
  ),

  createVariant(
    "contact-layout-8",
    kind,
    "יצירת קשר עם שעות פעילות",
    "טופס קשר לצד שעות פעילות ופרטים.",
    "שעות",
    sectionShell(
      kind,
      `
      <div class="grid items-start gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">שעות ופרטים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            צרו קשר בזמן שנוח לכם
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הציגו שעות פעילות, טלפון, כתובת ודרכי קשר בצורה מסודרת ומקצועית.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${contactInfoCard("טלפון", "050-0000000", "☎")}
            ${contactInfoCard("מייל", "hello@business.com", "@")}
          </div>
        </div>

        ${scheduleCard()}
      </div>
      `
    ),
    { tags: ["hours", "info", "business"] }
  ),

  createVariant(
    "contact-layout-9",
    kind,
    "קשר על תמונת רקע",
    "סקשן קשר עם תמונת רקע מלאה וכפתורי פעולה.",
    "רקע",
    backgroundSection(
      kind,
      sectionImages.office,
      `
      <div class="max-w-[820px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          דברו איתנו
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          השלב הבא מתחיל בשיחה קצרה
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          השאירו פרטים, התקשרו או שלחו וואטסאפ — אנחנו כאן כדי לעזור.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("השארת פרטים")}
          ${whatsappButton("וואטסאפ")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "hero", "cta"] }
  ),

  createVariant(
    "contact-layout-10",
    kind,
    "שלוש דרכי קשר",
    "שלושה כרטיסי פעולה גדולים ומעוצבים.",
    "Actions",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "איך תרצו ליצור קשר?",
        "בחרו את הדרך הנוחה לכם — הודעה, שיחה או השארת פרטים.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${contactMethodCard("שליחת וואטסאפ", "הדרך הכי מהירה לקבל מענה מהעסק.", "שלחו הודעה", "https://wa.me/972500000000", "WA")}
        ${contactMethodCard("שיחה טלפונית", "לחצו כדי להתקשר ישירות לעסק.", "התקשרו עכשיו", "tel:0500000000", "☎")}
        ${contactMethodCard("טופס פנייה", "השאירו פרטים ונחזור אליכם.", "השארת פרטים", "#contact", "✉")}
      </div>
      `
    ),
    { tags: ["methods", "cards", "cta"] }
  ),

  createVariant(
    "contact-layout-11",
    kind,
    "SaaS Contact",
    "סקשן קשר למערכת, מוצר דיגיטלי או Mini SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[58px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_50px_170px_rgba(15,23,42,0.34)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Book a demo
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.055em] text-white md:text-6xl" data-editable-text="true">
              רוצים לראות איך המערכת תעבוד אצלכם?
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים למיני SaaS, מערכת ניהול, מוצר דיגיטלי, CRM, קורסים או שירות טכנולוגי.
            </p>

            <div class="mt-9 grid gap-4 md:grid-cols-2">
              ${darkFeatureCard("Demo", "שיחת דמו קצרה וברורה.", "D")}
              ${darkFeatureCard("Setup", "הבנה של הצורך והקמה ראשונית.", "S")}
            </div>
          </div>

          <div class="rounded-[42px] bg-white p-6 text-slate-800" data-editable-card="true">
            <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
              בקשת דמו
            </h3>

            <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
              השאירו פרטים ונחזור לתיאום.
            </p>

            <div class="mt-6">
              ${leadForm("קביעת דמו")}
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "demo", "system"] }
  ),

  createVariant(
    "contact-layout-12",
    kind,
    "קשר מינימליסטי",
    "סקשן קשר נקי וקצר בלי עומס.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[940px] rounded-[52px] border border-slate-200 bg-white p-8 text-center shadow-[0_34px_120px_rgba(15,23,42,0.08)] md:p-14">
        <p class="${pillClass}" data-editable-text="true">יצירת קשר</p>

        <h2 class="${h2Class}" data-editable-text="true">
          שאלה? בקשה? אנחנו כאן.
        </h2>

        <p class="mx-auto mt-6 max-w-[700px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          השאירו פרטים ונחזור אליכם בהקדם.
        </p>

        <div class="mx-auto mt-9 max-w-[720px]">
          ${leadForm("שליחה")}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "form"] }
  ),

  createVariant(
    "contact-layout-13",
    kind,
    "קשר עם ביקורת",
    "טופס יצירת קשר לצד המלצת לקוח שמחזקת אמון.",
    "המלצה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">לקוחות ממליצים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            אפשר ליצור קשר בביטחון
          </h2>

          <p class="${textClass}" data-editable-text="true">
            שילוב של המלצה וטופס פנייה מייצר אמון ומעודד את הלקוח להשאיר פרטים.
          </p>

          <div class="mt-8">
            ${testimonialCard(
              "השירות היה מקצועי, מהיר וברור. קיבלתי מענה מדויק והרגשתי שיש על מי לסמוך.",
              "לקוחה מרוצה"
            )}
          </div>
        </div>

        ${contactMiniForm("שליחת פרטים")}
      </div>
      `
    ),
    { tags: ["testimonial", "trust", "form"] }
  ),

  createVariant(
    "contact-layout-14",
    kind,
    "קשר עם סטטיסטיקות",
    "סקשן קשר שמציג אמון לפני הטופס.",
    "אמון",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">למה לפנות אלינו</p>

          <h2 class="${h2Class}" data-editable-text="true">
            מאות לקוחות כבר התחילו בשיחה אחת
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הציגו נתוני אמון, ניסיון ושביעות רצון לפני שהלקוח משאיר פרטים.
          </p>

          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            ${statCard("500+", "לקוחות")}
            ${statCard("98%", "שביעות רצון")}
            ${statCard("24/7", "זמינות דיגיטלית")}
            ${statCard("7", "שנות ניסיון")}
          </div>
        </div>

        ${contactMiniForm("דברו איתנו")}
      </div>
      `
    ),
    { tags: ["stats", "trust", "lead"] }
  ),

  createVariant(
    "contact-layout-15",
    kind,
    "קשר עם וידאו",
    "וידאו הסבר/תדמית לצד טופס פנייה.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">לפני שפונים</p>

        <h2 class="${h2Class}" data-editable-text="true">
          צפו בסרטון קצר וקבלו את כל הפרטים
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לעסק שרוצה להסביר את השירות, התהליך או המערכת לפני השארת פרטים.
        </p>

        ${contactMiniForm("שליחת פנייה")}
      </div>
      `,
      videoBox(),
      true
    ),
    { tags: ["video", "form", "explain"] }
  ),

  createVariant(
    "contact-layout-16",
    kind,
    "קשר מפוצל יוקרתי",
    "צד אחד פרטים, צד שני טופס, בעיצוב מאוד יוקרתי.",
    "Luxury",
    wideSectionShell(
      kind,
      `
      <div class="grid overflow-hidden rounded-[58px] bg-white shadow-[0_44px_150px_rgba(15,23,42,0.18)] lg:grid-cols-2">
        <div class="border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 md:p-14">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
            Contact Details
          </p>

          <h2 class="text-4xl font-black leading-[1.04] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            כל הדרכים להגיע אלינו
          </h2>

          <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            טלפון, וואטסאפ, אימייל, כתובת ושעות פעילות — הכל במקום אחד.
          </p>

          <div class="mt-10 grid gap-4">
            <div class="rounded-[24px] bg-white/10 p-5">
              <p class="text-sm font-black text-white" data-editable-text="true">טלפון · 050-0000000</p>
            </div>

            <div class="rounded-[24px] bg-white/10 p-5">
              <p class="text-sm font-black text-white" data-editable-text="true">מייל · hello@business.com</p>
            </div>

            <div class="rounded-[24px] bg-white/10 p-5">
              <p class="text-sm font-black text-white" data-editable-text="true">כתובת · רחוב העסק 10</p>
            </div>
          </div>
        </div>

        <div class="p-8 md:p-14">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            השאירו פרטים
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            נחזור אליכם עם כל הפרטים.
          </p>

          <div class="mt-7">
            ${leadForm("שליחת פרטים")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["luxury", "split", "contact"] }
  ),

  createVariant(
    "contact-layout-17",
    kind,
    "קשר לחנות",
    "סקשן קשר שמתאים לחנות אונליין, משלוחים ושירות לקוחות.",
    "Store",
    sectionShell(
      kind,
      `
      <div class="rounded-[54px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_36px_120px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">שירות לקוחות</p>

            <h2 class="${h2Class}" data-editable-text="true">
              שאלה על מוצר, משלוח או הזמנה?
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לחנויות, קטלוגים, מותגים, מוצרים ושירות לקוחות.
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              ${softFeatureCard("משלוחים", "שאלות על זמני אספקה.", "↗")}
              ${softFeatureCard("הזמנות", "בירור פרטי הזמנה.", "₪")}
              ${softFeatureCard("החלפות", "מענה על מדיניות החלפה.", "✓")}
              ${softFeatureCard("מוצרים", "שאלות על התאמה ומלאי.", "◈")}
            </div>

            <div class="mt-9 flex flex-wrap gap-4">
              ${whatsappButton("שירות בוואטסאפ")}
              ${secondaryButton("מעבר לחנות", "#store")}
            </div>
          </div>

          ${contactMiniForm("שליחת שאלה")}
        </div>
      </div>
      `
    ),
    { tags: ["store", "support", "customer-service"] }
  ),

  createVariant(
    "contact-layout-18",
    kind,
    "CTA קשר קצר",
    "סקשן קשר קצר, וואו וממיר לסוף עמוד.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[58px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_44px_150px_rgba(139,92,246,0.28)] md:p-14">
        <div class="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/15 blur-3xl"></div>

        <div class="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div class="max-w-[760px]">
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              מוכנים להתחיל?
            </p>

            <h2 class="text-4xl font-black leading-[1.04] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              דברו איתנו ונבנה לכם את הצעד הבא
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/80" data-editable-text="true">
              השאירו פרטים, שלחו הודעה או התקשרו — אנחנו כאן.
            </p>
          </div>

          <div class="flex shrink-0 flex-wrap gap-4">
            <a href="#contact" class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl" data-editable-link="true">
              השארת פרטים
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