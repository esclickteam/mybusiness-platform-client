import type { SectionLayoutVariant } from "../../types";
import {
  actionRow,
  addMediaBox,
  backgroundSection,
  bookingTimes,
  cardClass,
  createVariant,
  darkButton,
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
  Bizuply Website Studio — Booking Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/bookingLayoutVariants.ts

  סקשן תיאום תורים מקצועי.
  מתאים ל:
  - תיאום תורים
  - יומן פגישות
  - קליניקות
  - יועצים
  - מאמנים
  - שיעורים
  - טיפולים
  - שירותים בבית הלקוח
  - SaaS Booking
  - וואטסאפ / ליד / זמינות
*/

const kind = "booking" as const;

function datePill(day: string, date: string, active = false) {
  return `
<button
  type="button"
  class="rounded-[24px] px-5 py-4 text-center transition ${
    active
      ? "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-xl"
      : "border border-slate-200 bg-white text-slate-700 shadow-sm"
  }"
  data-editable-card="true"
>
  <span class="block text-xs font-black opacity-70" data-editable-text="true">${day}</span>
  <strong class="mt-1 block text-2xl font-black" data-editable-text="true">${date}</strong>
</button>
`;
}

function bookingServiceCard(
  title: string,
  duration: string,
  price: string,
  active = false
) {
  return `
<button
  type="button"
  class="w-full rounded-[28px] border p-5 text-right transition ${
    active
      ? "border-[var(--biz-primary,#7C3AED)] bg-[var(--biz-secondary,#F3E8FF)] shadow-[0_20px_70px_rgba(124,58,237,0.14)]"
      : "border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.05)]"
  }"
  data-editable-card="true"
>
  <div class="flex items-start justify-between gap-4">
    <div>
      <h3 class="text-lg font-black text-slate-800" data-editable-text="true">${title}</h3>
      <p class="mt-2 text-sm font-bold text-slate-500" data-editable-text="true">${duration}</p>
    </div>

    <span class="rounded-full bg-white px-4 py-2 text-xs font-black text-[var(--biz-primary,#7C3AED)] shadow-sm" data-editable-text="true">
      ${price}
    </span>
  </div>
</button>
`;
}

function timeSlot(time: string, active = false, disabled = false) {
  return `
<button
  type="button"
  class="min-h-14 rounded-2xl px-5 text-sm font-black transition ${
    disabled
      ? "cursor-not-allowed bg-slate-100 text-slate-300"
      : active
        ? "bg-[var(--biz-primary,#7C3AED)] text-white shadow-xl shadow-violet-100"
        : "bg-[var(--biz-secondary,#F3E8FF)] text-[var(--biz-primary,#7C3AED)] hover:bg-[var(--biz-primary,#7C3AED)] hover:text-white"
  }"
  data-editable-text="true"
>
  ${time}
</button>
`;
}

function calendarMock() {
  return `
<div class="${softCardClass}" data-bizuply-block="booking" data-editable-card="true">
  <div class="mb-7 flex items-center justify-between gap-4">
    <div>
      <p class="text-xs font-black uppercase tracking-[0.18em] text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
        Booking Calendar
      </p>

      <h3 class="mt-2 text-3xl font-black text-slate-800" data-editable-text="true">
        בחרו תאריך ושעה
      </h3>
    </div>

    <div class="grid h-14 w-14 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-xl font-black text-[var(--biz-primary,#7C3AED)]">
      ◷
    </div>
  </div>

  <div class="grid grid-cols-4 gap-3 sm:grid-cols-7">
    ${datePill("א׳", "12")}
    ${datePill("ב׳", "13", true)}
    ${datePill("ג׳", "14")}
    ${datePill("ד׳", "15")}
    ${datePill("ה׳", "16")}
    ${datePill("ו׳", "17")}
    ${datePill("ש׳", "18")}
  </div>

  <div class="mt-7 grid gap-3 sm:grid-cols-3">
    ${timeSlot("09:00")}
    ${timeSlot("10:30", true)}
    ${timeSlot("12:00")}
    ${timeSlot("14:00")}
    ${timeSlot("16:30")}
    ${timeSlot("18:00", false, true)}
  </div>

  <a
    href="#booking"
    class="mt-7 flex min-h-14 items-center justify-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-white shadow-xl"
    data-editable-link="true"
  >
    אישור תור
  </a>
</div>
`;
}

function bookingFormCard(buttonText = "קביעת תור") {
  return `
<div class="${softCardClass}" data-bizuply-block="booking-form" data-editable-card="true">
  <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
    קביעת תור מהירה
  </h3>

  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    השאירו פרטים ונחזור אליכם לאישור התור.
  </p>

  <form class="mt-7 grid gap-4" data-bizuply-block="lead-form">
    <input class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white" placeholder="שם מלא" data-editable-input="true" />
    <input class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white" placeholder="טלפון" data-editable-input="true" />
    <select class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white" data-editable-input="true">
      <option>בחרו שירות</option>
      <option>שירות ראשון</option>
      <option>שירות שני</option>
      <option>שירות שלישי</option>
    </select>
    <input class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white" placeholder="יום ושעה מועדפים" data-editable-input="true" />

    <button class="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-white shadow-xl" type="button">
      ${buttonText}
    </button>
  </form>
</div>
`;
}

function bookingStep(number: string, title: string, text: string) {
  return `
<div class="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <div class="mb-5 grid h-12 w-12 place-items-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
    ${number}
  </div>

  <h3 class="text-xl font-black text-slate-800" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
</div>
`;
}

function appointmentPreviewCard() {
  return `
<div class="${cardClass}" data-editable-card="true">
  <div class="mb-6 flex items-center justify-between gap-4">
    <div>
      <p class="text-xs font-black uppercase tracking-[0.18em] text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
        Next appointment
      </p>

      <h3 class="mt-2 text-2xl font-black text-slate-800" data-editable-text="true">
        התור הבא שלך
      </h3>
    </div>

    <span class="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-600" data-editable-text="true">
      מאושר
    </span>
  </div>

  <div class="rounded-[30px] bg-slate-50 p-6">
    <p class="text-sm font-black text-slate-400" data-editable-text="true">יום שני · 13 לחודש</p>
    <h4 class="mt-3 text-4xl font-black text-slate-800" data-editable-text="true">10:30</h4>
    <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
      שירות ראשון · 60 דקות · אצל העסק / אונליין / בבית הלקוח
    </p>
  </div>

  <div class="mt-5 grid gap-3 sm:grid-cols-2">
    ${secondaryButton("שינוי תור", "#booking")}
    ${whatsappButton("שאלה בוואטסאפ")}
  </div>
</div>
`;
}

function mobileBookingPreview() {
  return `
<div class="mx-auto max-w-[360px] rounded-[44px] border border-slate-200 border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 p-4 shadow-[0_42px_140px_rgba(15,23,42,0.25)]" data-editable-card="true">
  <div class="rounded-[34px] bg-white p-5">
    <div class="mb-5 flex items-center justify-between">
      <h3 class="text-xl font-black text-slate-800" data-editable-text="true">קביעת תור</h3>
      <span class="rounded-full bg-violet-50 px-3 py-1 text-xs font-black text-violet-600" data-editable-text="true">Online</span>
    </div>

    <div class="grid gap-3">
      ${bookingServiceCard("שירות ראשון", "60 דקות", "₪250", true)}
      ${bookingServiceCard("שירות שני", "90 דקות", "₪350")}
    </div>

    <div class="mt-5 grid grid-cols-3 gap-2">
      ${timeSlot("09:00")}
      ${timeSlot("10:30", true)}
      ${timeSlot("12:00")}
    </div>

    <a href="#booking" class="mt-5 flex min-h-12 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800" data-editable-link="true">
      אישור
    </a>
  </div>
</div>
`;
}

export const bookingLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "booking-layout-1",
    kind,
    "יומן תורים מקצועי",
    "מבנה Booking מלא עם שירותים, תאריכים, שעות וכפתור אישור.",
    "מומלץ",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">תיאום תורים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לקוחות בוחרים שירות, תאריך ושעה — בלי שיחות מיותרות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            סקשן מקצועי לתיאום תורים, פגישות, טיפולים, שיעורים, ייעוצים ושירותים.
          </p>

          <div class="mt-8 grid gap-4">
            ${bookingServiceCard("שירות ראשון", "60 דקות", "₪250", true)}
            ${bookingServiceCard("שירות שני", "90 דקות", "₪350")}
            ${bookingServiceCard("שירות שלישי", "120 דקות", "₪450")}
          </div>
        </div>

        ${calendarMock()}
      </div>
      `
    ),
    { featured: true, tags: ["calendar", "booking", "professional"] }
  ),

  createVariant(
    "booking-layout-2",
    kind,
    "Booking Hero וואו",
    "פתיחה חזקה ליומן תורים עם כפתור פעולה, נתונים ותצוגת יומן.",
    "Hero",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] bg-gradient-to-br from-slate-950 via-violet-950 to-fuchsia-900 p-8 text-white shadow-[0_58px_190px_rgba(76,29,149,0.34)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-400/30 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-400/30 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Online Booking
            </p>

            <h2 class="text-5xl font-black leading-[0.95] tracking-[-0.065em] text-white md:text-7xl" data-editable-text="true">
              תיאום תורים שנראה כמו מערכת אמיתית
            </h2>

            <p class="mt-6 max-w-2xl text-xl font-bold leading-10 text-white/75" data-editable-text="true">
              לקוחות רואים זמינות, בוחרים שירות ומתקדמים לפנייה או אישור תור בצורה נוחה וברורה.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("קביעת תור", "#booking")}
              ${darkButton("שאלה בוואטסאפ")}
            </div>
          </div>

          <div class="rounded-[42px] border border-white/12 bg-white/10 p-4 backdrop-blur-2xl">
            ${calendarMock()}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["hero", "dark", "wow"] }
  ),

  createVariant(
    "booking-layout-3",
    kind,
    "טופס תור מהיר",
    "טופס פשוט שבו הלקוח משאיר פרטים לתיאום תור.",
    "Form",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">קביעת תור מהירה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            השאירו פרטים ונחזור אליכם לאישור התור
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לעסקים שרוצים לאסוף פניות לתורים בלי יומן מלא בשלב הראשון.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${softFeatureCard("תגובה מהירה", "חזרה ללקוח בהקדם.", "✓")}
            ${softFeatureCard("התאמה אישית", "בחירת שירות ושעה נוחה.", "✦")}
            ${softFeatureCard("אישור תור", "אפשר לשלוח SMS או וואטסאפ.", "↗")}
            ${softFeatureCard("ניהול קל", "כל הפניות במקום אחד.", "AI")}
          </div>
        </div>

        ${bookingFormCard("שליחת בקשה לתור")}
      </div>
      `
    ),
    { tags: ["form", "lead", "simple"] }
  ),

  createVariant(
    "booking-layout-4",
    kind,
    "בחירת שירות תחילה",
    "מבנה שמתחיל מבחירת שירות ואז תאריך ושעה.",
    "Services",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "בחרו שירות לקביעת תור",
        "הלקוח מתחיל מבחירת השירות, רואה מחיר ומשך, ואז בוחר תאריך ושעה.",
        "center"
      )}

      <div class="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="grid gap-4">
          ${bookingServiceCard("ייעוץ ראשוני", "30 דקות", "₪150", true)}
          ${bookingServiceCard("פגישה מלאה", "60 דקות", "₪300")}
          ${bookingServiceCard("חבילת VIP", "90 דקות", "₪450")}
          ${bookingServiceCard("שירות אונליין", "45 דקות", "₪220")}
        </div>

        ${calendarMock()}
      </div>
      `
    ),
    { tags: ["services", "calendar", "booking"] }
  ),

  createVariant(
    "booking-layout-5",
    kind,
    "Booking כהה פרימיום",
    "יומן תורים כהה ויוקרתי לעסקים ברמת פרימיום.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative mx-auto max-w-[900px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
            Premium Booking
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            תיאום תורים שמתאים למותג יוקרתי
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים לקליניקות, יועצים, שירותי VIP, נדל״ן, אירועים ומותגים.
          </p>
        </div>

        <div class="relative mt-12 grid gap-6 lg:grid-cols-3">
          ${darkFeatureCard("בחירת שירות", "הלקוח בוחר שירות מתאים.", "01")}
          ${darkFeatureCard("זמינות חכמה", "בחירת תאריך ושעה פנויה.", "02")}
          ${darkFeatureCard("אישור מהיר", "אישור תור או פנייה לעסק.", "03")}
        </div>

        <div class="relative mt-12 rounded-[42px] border border-white/12 bg-white/10 p-4 backdrop-blur-2xl">
          ${calendarMock()}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "luxury"] }
  ),

  createVariant(
    "booking-layout-6",
    kind,
    "מובייל Booking",
    "מוקאפ מובייל שמראה איך הלקוח קובע תור בטלפון.",
    "Mobile",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">Mobile Booking</p>

          <h2 class="${h2Class}" data-editable-text="true">
            תיאום תור שנראה מצוין גם במובייל
          </h2>

          <p class="${textClass}" data-editable-text="true">
            רוב הלקוחות קובעים תור מהטלפון. המבנה הזה מדגיש חוויית מובייל ברורה ומהירה.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${softFeatureCard("בחירת שירות", "קל ומהיר במובייל.", "1")}
            ${softFeatureCard("בחירת שעה", "כפתורים גדולים וברורים.", "2")}
            ${softFeatureCard("אישור", "הלקוח יודע מה השלב הבא.", "3")}
            ${softFeatureCard("וואטסאפ", "אפשרות לשאלה מהירה.", "WA")}
          </div>

          ${actionRow("קביעת תור", "שאלה בוואטסאפ")}
        </div>

        ${mobileBookingPreview()}
      </div>
      `
    ),
    { tags: ["mobile", "booking", "app"] }
  ),

  createVariant(
    "booking-layout-7",
    kind,
    "תיאום לפי צוות",
    "בחירת איש צוות / מומחה לפני בחירת שעה.",
    "Team",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "בחרו איש צוות ותור פנוי",
        "מתאים לעסק עם כמה עובדים, מומחים, מטפלים, יועצים או נותני שירות.",
        "center"
      )}

      <div class="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="grid gap-4">
          ${bookingServiceCard("הדר · מומחית ראשית", "איפור קבוע / ייעוץ / טיפול", "₪350", true)}
          ${bookingServiceCard("דנה · שירות לקוחות", "שיחת התאמה / תיאום", "חינם")}
          ${bookingServiceCard("אור · מומחה תחום", "פגישה מקצועית", "₪250")}
        </div>

        ${calendarMock()}
      </div>
      `
    ),
    { tags: ["staff", "team", "booking"] }
  ),

  createVariant(
    "booking-layout-8",
    kind,
    "תיאום עם תמונה",
    "תמונה גדולה לצד יומן תורים מקצועי.",
    "Image",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">קביעת תור אונליין</p>

        <h2 class="${h2Class}" data-editable-text="true">
          לקוחות רואים את השירות ומיד קובעים
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לקליניקות, סטודיו, יועצים, מאמנים, שיעורים ושירותים פיזיים או אונליין.
        </p>

        ${actionRow("קביעת תור", "צור קשר")}
      </div>
      `,
      imageBlock(sectionImages.salon, "min-h-[560px]"),
      false
    ),
    { tags: ["image", "booking", "service"] }
  ),

  createVariant(
    "booking-layout-9",
    kind,
    "תור על תמונת רקע",
    "סקשן תיאום תור עם תמונת רקע וכפתורים חזקים.",
    "Background",
    backgroundSection(
      kind,
      sectionImages.clinic,
      `
      <div class="max-w-[860px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          קביעת תור
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          בחרו זמן שנוח לכם ואנחנו נדאג לשאר
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          תיאום תורים קל, ברור ומקצועי לעסק שמקבל לקוחות לפי זמינות.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("קביעת תור")}
          ${secondaryButton("שאלה לפני תיאום")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "hero", "booking"] }
  ),

  createVariant(
    "booking-layout-10",
    kind,
    "תהליך קביעת תור",
    "הסבר בשלושה שלבים איך קובעים תור.",
    "Steps",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "איך קובעים תור?",
        "הציגו תהליך פשוט שמסיר חשש ומוביל את הלקוח לפעולה.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${bookingStep("1", "בחרו שירות", "הלקוח בוחר את השירות שמתאים לו.")}
        ${bookingStep("2", "בחרו זמן", "בחירת תאריך ושעה פנויים ביומן.")}
        ${bookingStep("3", "מאשרים", "הלקוח מקבל אישור או שהעסק חוזר אליו.")}
      </div>

      <div class="mt-10 flex justify-center gap-4">
        ${primaryButton("קביעת תור עכשיו")}
        ${secondaryButton("שאלה לפני תיאום")}
      </div>
      `
    ),
    { tags: ["steps", "process", "booking"] }
  ),

  createVariant(
    "booking-layout-11",
    kind,
    "תור + וואטסאפ",
    "קביעת תור או פתיחת שיחה בוואטסאפ.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-700" data-editable-text="true">
              קביעת תור בוואטסאפ
            </p>

            <h2 class="${h2Class}" data-editable-text="true">
              לקוחות יכולים לקבוע תור או לשאול שאלה מיד
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לעסקים שרוצים לשלב יומן תורים עם שיחה מהירה בוואטסאפ.
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              ${softFeatureCard("זמינות", "בחירת שעה נוחה.", "◷")}
              ${softFeatureCard("וואטסאפ", "שיחה מהירה עם העסק.", "WA")}
              ${softFeatureCard("אישור", "הלקוח מקבל ודאות.", "✓")}
              ${softFeatureCard("שירות", "מענה אישי לפני התור.", "♡")}
            </div>

            <div class="mt-9 flex flex-wrap gap-4">
              ${whatsappButton("קביעת תור בוואטסאפ")}
              ${secondaryButton("צפייה בזמינות")}
            </div>
          </div>

          <div class="${cardClass}">
            <div class="rounded-[32px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
              <p class="text-sm font-black text-white/60" data-editable-text="true">
                WhatsApp Booking
              </p>

              <div class="mt-5 grid gap-4">
                <div class="rounded-[24px] bg-white/10 p-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
                  שלום, אני רוצה לקבוע תור לשבוע הבא.
                </div>

                <div class="mr-auto rounded-[24px] bg-emerald-500 p-4 text-sm font-bold leading-7 text-white" data-editable-text="true">
                  בשמחה! יש לנו זמינות ביום שני ב־10:30.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["whatsapp", "booking", "fast"] }
  ),

  createVariant(
    "booking-layout-12",
    kind,
    "תור + מחירון",
    "שירותים עם מחיר ומשך לצד זמינות.",
    "Pricing",
    sectionShell(
      kind,
      `
      <div class="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">מחירון ותורים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            כל שירות כולל מחיר, משך וזמינות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            תצוגה מושלמת לעסק שמוכר שירותים עם תורים.
          </p>

          <div class="mt-8 grid gap-4">
            ${bookingServiceCard("שירות ראשון", "45 דקות", "₪220", true)}
            ${bookingServiceCard("שירות שני", "60 דקות", "₪300")}
            ${bookingServiceCard("שירות שלישי", "90 דקות", "₪450")}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            זמינות קרובה
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            בחרו שעה פנויה לקביעת תור.
          </p>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            ${bookingTimes()}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["pricing", "services", "availability"] }
  ),

  createVariant(
    "booking-layout-13",
    kind,
    "תור + הוכחת אמון",
    "יומן תורים עם נתונים והמלצה כדי להעלות ביטחון.",
    "Trust",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">קובעים בביטחון</p>

          <h2 class="${h2Class}" data-editable-text="true">
            מאות לקוחות כבר קבעו תור דרך האתר
          </h2>

          <p class="${textClass}" data-editable-text="true">
            שילוב של יומן, מספרים והמלצות מחזק את ההחלטה של הלקוח לקבוע תור.
          </p>

          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            ${statCard("500+", "לקוחות")}
            ${statCard("98%", "שביעות רצון")}
            ${statCard("24/7", "תיאום אונליין")}
            ${statCard("7", "שנות ניסיון")}
          </div>
        </div>

        <div class="grid gap-5">
          ${appointmentPreviewCard()}
          ${testimonialCard(
            "קביעת התור הייתה פשוטה, מהירה וברורה. קיבלתי אישור בלי להסתבך.",
            "לקוחה מרוצה"
          )}
        </div>
      </div>
      `
    ),
    { tags: ["trust", "stats", "reviews"] }
  ),

  createVariant(
    "booking-layout-14",
    kind,
    "תור עם וידאו",
    "וידאו הסבר לצד קביעת תור.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">לפני שקובעים</p>

        <h2 class="${h2Class}" data-editable-text="true">
          סרטון קצר שמסביר את השירות לפני התיאום
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לטיפולים, קורסים, ייעוצים, שירותים מורכבים או מוצר שצריך הסבר.
        </p>

        <div class="mt-8 grid gap-4">
          ${bookingServiceCard("פגישת התאמה", "30 דקות", "חינם", true)}
          ${bookingServiceCard("שירות מלא", "60 דקות", "₪300")}
        </div>

        ${actionRow("קביעת תור", "שאלה לפני")}
      </div>
      `,
      videoBox(),
      true
    ),
    { tags: ["video", "booking", "explain"] }
  ),

  createVariant(
    "booking-layout-15",
    kind,
    "SaaS Booking",
    "סקשן תורים שמתאים למערכת SaaS או Mini SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[64px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Booking SaaS
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              יומן תורים כחלק ממערכת עסקית מלאה
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים למיני SaaS, CRM, מערכת תורים, אזור לקוחות, תשלומים ואוטומציות.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("בקשת דמו")}
              ${darkButton("פיצ׳רים")}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${darkFeatureCard("Calendar", "תורים וזמינות.", "◷")}
            ${darkFeatureCard("CRM", "לקוחות ולידים.", "CRM")}
            ${darkFeatureCard("Reminders", "תזכורות אוטומטיות.", "SMS")}
            ${darkFeatureCard("Payments", "חבילות ותשלומים.", "₪")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "system", "dark"] }
  ),

  createVariant(
    "booking-layout-16",
    kind,
    "תור בבית הלקוח",
    "מבנה לתיאום שירות בבית הלקוח עם אזור ומיקום.",
    "Home Service",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">שירות עד הבית</p>

            <h2 class="${h2Class}" data-editable-text="true">
              קביעת תור לשירות בבית הלקוח
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לחשמלאים, מתקינים, מנקים, יועצים, מדריכים, טכנאים ושירותים שמגיעים ללקוח.
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              ${softFeatureCard("בחירת אזור", "הלקוח מציין כתובת.", "⌖")}
              ${softFeatureCard("בחירת זמן", "תיאום לפי זמינות.", "◷")}
              ${softFeatureCard("אישור", "תיאום סופי מול העסק.", "✓")}
              ${softFeatureCard("תזכורת", "SMS / וואטסאפ לפני הגעה.", "WA")}
            </div>

            ${actionRow("קביעת שירות", "שאלה בוואטסאפ")}
          </div>

          ${bookingFormCard("בקשת שירות בבית")}
        </div>
      </div>
      `
    ),
    { tags: ["home-service", "field-service", "booking"] }
  ),

  createVariant(
    "booking-layout-17",
    kind,
    "תור עם מדיה",
    "מבנה עם אזור להוספת תמונה או וידאו לצד תיאום תור.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.clinic, "min-h-[340px]")}
          ${addMediaBox("הוספת תמונה / וידאו לתיאום")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">תיאום עם מדיה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו תמונה או סרטון שמסבירים את השירות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים להצגת קליניקה, מקום, טיפול, שירות, שיעור, ייעוץ או הסבר לפני קביעת תור.
          </p>

          <div class="mt-8">
            ${bookingServiceCard("פגישת התאמה", "30 דקות", "חינם", true)}
          </div>

          ${actionRow("קביעת תור", "צור קשר")}
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "booking-layout-18",
    kind,
    "CTA תור וואו",
    "סקשן קצר וחזק לסוף עמוד שמוביל לקביעת תור.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[60px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] via-fuchsia-600 to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_44px_150px_rgba(139,92,246,0.30)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/15 blur-3xl"></div>

        <div class="relative grid items-center gap-10 lg:grid-cols-[1fr_0.82fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Ready to book?
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              מצאתם זמן שמתאים לכם? קבעו תור עכשיו
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              כפתור ברור, וואטסאפ או טופס — הלקוח מבין מיד מה לעשות.
            </p>
          </div>

          <div class="rounded-[34px] bg-white/12 p-6 backdrop-blur-2xl">
            <div class="grid gap-3 sm:grid-cols-2">
              ${timeSlot("09:00")}
              ${timeSlot("10:30", true)}
              ${timeSlot("12:00")}
              ${timeSlot("14:00")}
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <a
                href="#booking"
                class="inline-flex min-h-14 flex-1 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl"
                data-editable-link="true"
              >
                קביעת תור
              </a>

              <a
                href="https://wa.me/972500000000"
                class="inline-flex min-h-14 flex-1 items-center justify-center rounded-2xl bg-white/15 px-8 text-sm font-black text-white ring-1 ring-white/20"
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
    { tags: ["cta", "wow", "booking"] }
  ),
];