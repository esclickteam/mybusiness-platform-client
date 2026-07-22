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
  imageGrid,
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
  subscribeForm,
  testimonialCard,
  textClass,
  videoBox,
  whatsappButton,
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — Form Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/formLayoutVariants.ts

  סקשן טפסים מקצועי.
  מתאים ל:
  - טופס ליד
  - יצירת קשר
  - הרשמה
  - בקשת הצעת מחיר
  - תיאום תור
  - שאלון התאמה
  - RSVP לאירוע
  - תמיכה / שירות לקוחות
  - הרשמה לניוזלטר
  - בקשת דמו SaaS
  - הזמנת מוצר / שירות
*/

const kind = "form" as const;

function inputField(placeholder: string, type = "text") {
  return `
<input
  type="${type}"
  class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
  placeholder="${placeholder}"
  data-editable-input="true"
/>
`;
}

function textareaField(placeholder: string) {
  return `
<textarea
  class="min-h-[130px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
  placeholder="${placeholder}"
  data-editable-input="true"
></textarea>
`;
}

function selectField(label = "בחרו אפשרות") {
  return `
<select
  class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
  data-editable-input="true"
>
  <option>${label}</option>
  <option>אפשרות ראשונה</option>
  <option>אפשרות שנייה</option>
  <option>אפשרות שלישית</option>
</select>
`;
}

function formButton(text = "שליחת פרטים") {
  return `
<button
  type="button"
  class="inline-flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5"
  data-editable-text="true"
>
  ${text}
</button>
`;
}

function premiumFormCard(title: string, text: string, buttonText = "שליחה") {
  return `
<div class="${softCardClass}" data-bizuply-block="form" data-editable-card="true">
  <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>

  <form class="mt-7 grid gap-4" data-bizuply-block="lead-form">
    ${inputField("שם מלא")}
    ${inputField("טלפון")}
    ${inputField("אימייל", "email")}
    ${textareaField("איך אפשר לעזור?")}
    ${formButton(buttonText)}
  </form>
</div>
`;
}

function darkInputField(placeholder: string, type = "text") {
  return `
<input
  type="${type}"
  class="min-h-14 w-full rounded-2xl border border-white/10 bg-white/10 px-5 text-sm font-bold text-white outline-none placeholder:text-white/45 focus:border-white/30"
  placeholder="${placeholder}"
  data-editable-input="true"
/>
`;
}

function darkTextareaField(placeholder: string) {
  return `
<textarea
  class="min-h-[130px] w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-sm font-bold text-white outline-none placeholder:text-white/45 focus:border-white/30"
  placeholder="${placeholder}"
  data-editable-input="true"
></textarea>
`;
}

function darkFormCard(title = "דברו איתנו", buttonText = "שליחה") {
  return `
<div class="rounded-[42px] border border-white/12 bg-white/10 p-7 text-white shadow-[0_30px_110px_rgba(0,0,0,0.18)] backdrop-blur-2xl" data-bizuply-block="form" data-editable-card="true">
  <h3 class="text-3xl font-black text-white" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-2 text-sm font-bold leading-7 text-white/60" data-editable-text="true">
    מלאו פרטים ונחזור אליכם בהקדם.
  </p>

  <form class="mt-7 grid gap-4" data-bizuply-block="lead-form">
    ${darkInputField("שם מלא")}
    ${darkInputField("טלפון")}
    ${darkInputField("אימייל", "email")}
    ${darkTextareaField("הודעה")}
    <button
      type="button"
      class="inline-flex min-h-[56px] w-full items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-slate-800 shadow-xl"
      data-editable-text="true"
    >
      ${buttonText}
    </button>
  </form>
</div>
`;
}

function miniChoice(label: string, active = false) {
  return `
<button
  type="button"
  class="rounded-2xl px-5 py-4 text-sm font-black transition ${
    active
      ? "bg-[var(--biz-primary,#7C3AED)] text-white shadow-xl"
      : "border border-slate-200 bg-white text-slate-600 shadow-sm"
  }"
  data-editable-text="true"
>
  ${label}
</button>
`;
}

function formStep(number: string, title: string, text: string) {
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

function contactMethodMini(title: string, text: string, icon = "✓") {
  return `
<div class="flex items-start gap-4 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]" data-editable-card="true">
  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-sm font-black text-[var(--biz-primary,#7C3AED)]">
    ${icon}
  </div>

  <div>
    <h3 class="text-base font-black text-slate-800" data-editable-text="true">
      ${title}
    </h3>

    <p class="mt-1 text-sm font-bold leading-6 text-slate-500" data-editable-text="true">
      ${text}
    </p>
  </div>
</div>
`;
}

export const formLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "form-layout-1",
    kind,
    "טופס ליד מקצועי",
    "טופס ליד קלאסי וממיר עם טקסט בצד וטופס בצד.",
    "מומלץ",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">השאירו פרטים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            טופס ברור שממיר מבקרים ללקוחות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים ללידים, יצירת קשר, בקשת הצעת מחיר, תיאום שיחה או קבלת פרטים על שירות.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${softFeatureCard("מענה מהיר", "חוזרים ללקוח בהקדם.", "✓")}
            ${softFeatureCard("התאמה אישית", "איסוף פרטים לפי צורך.", "✦")}
          </div>
        </div>

        ${premiumFormCard("דברו איתנו", "מלאו את הפרטים ונחזור אליכם.", "שליחת פרטים")}
      </div>
      `
    ),
    { featured: true, tags: ["lead", "form", "classic"] }
  ),

  createVariant(
    "form-layout-2",
    kind,
    "טופס Glass וואו",
    "טופס יוקרתי על רקע גרדיאנט כהה עם אפקט זכוכית.",
    "Glass",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] bg-gradient-to-br from-slate-950 via-violet-950 to-fuchsia-900 p-8 text-white shadow-[0_58px_190px_rgba(76,29,149,0.34)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-400/30 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-400/30 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Premium Form
            </p>

            <h2 class="text-5xl font-black leading-[0.96] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              טופס שנראה כמו מותג פרימיום
            </h2>

            <p class="mt-6 max-w-2xl text-xl font-bold leading-10 text-white/72" data-editable-text="true">
              מתאים לדפי נחיתה, SaaS, קליניקות, מותגים, קורסים ושירותי פרימיום.
            </p>

            <div class="mt-9 grid gap-4 sm:grid-cols-2">
              ${darkFeatureCard("Lead", "איסוף פניות בצורה מקצועית.", "01")}
              ${darkFeatureCard("Follow up", "אפשר לחבר ל־CRM ואוטומציות.", "02")}
            </div>
          </div>

          ${darkFormCard("השאירו פרטים", "שליחה")}
        </div>
      </div>
      `
    ),
    { tags: ["glass", "luxury", "wow"] }
  ),

  createVariant(
    "form-layout-3",
    kind,
    "טופס יצירת קשר",
    "טופס יצירת קשר מלא עם שם, טלפון, אימייל והודעה.",
    "Contact",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "יצירת קשר",
        "טופס פשוט וברור שמאפשר ללקוח לשלוח הודעה ישירות מהאתר.",
        "center"
      )}

      <div class="mx-auto mt-12 max-w-[780px]">
        ${premiumFormCard("נשמח לשמוע מכם", "השאירו הודעה ונחזור אליכם בהקדם.", "שליחת הודעה")}
      </div>
      `
    ),
    { tags: ["contact", "message", "center"] }
  ),

  createVariant(
    "form-layout-4",
    kind,
    "טופס הצעת מחיר",
    "טופס מפורט לבקשת הצעת מחיר או התאמת שירות.",
    "Quote",
    sectionShell(
      kind,
      `
      <div class="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">בקשת הצעת מחיר</p>

          <h2 class="${h2Class}" data-editable-text="true">
            אספו את כל הפרטים החשובים לפני שחוזרים ללקוח
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לשירותים מותאמים אישית, פרויקטים, אירועים, עיצוב, ייעוץ, בנייה או SaaS.
          </p>

          <div class="mt-8 grid gap-4">
            ${contactMethodMini("פרטי לקוח", "שם, טלפון ואימייל.", "1")}
            ${contactMethodMini("סוג שירות", "הלקוח בוחר מה הוא צריך.", "2")}
            ${contactMethodMini("תקציב / הערות", "איסוף מידע לפני הצעת מחיר.", "3")}
          </div>
        </div>

        <div class="${softCardClass}" data-bizuply-block="quote-form" data-editable-card="true">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            קבלת הצעת מחיר
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            מלאו פרטים ונחזור אליכם עם התאמה אישית.
          </p>

          <form class="mt-7 grid gap-4">
            ${inputField("שם מלא")}
            ${inputField("טלפון")}
            ${selectField("בחרו סוג שירות")}
            ${selectField("תקציב משוער")}
            ${textareaField("תארו בקצרה מה אתם צריכים")}
            ${formButton("בקשת הצעת מחיר")}
          </form>
        </div>
      </div>
      `
    ),
    { tags: ["quote", "proposal", "business"] }
  ),

  createVariant(
    "form-layout-5",
    kind,
    "טופס תיאום תור",
    "טופס קביעת תור עם בחירת שירות, יום ושעה.",
    "Booking",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">תיאום תור</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לקוחות יכולים להשאיר בקשה לתור בקלות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לקליניקות, יועצים, מאמנים, שיעורים, טיפולים וכל שירות לפי זמן.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${softFeatureCard("בחירת שירות", "הלקוח בוחר שירות.", "1")}
            ${softFeatureCard("יום ושעה", "הלקוח מציין זמינות.", "2")}
            ${softFeatureCard("אישור", "העסק חוזר לאישור.", "3")}
            ${softFeatureCard("תזכורת", "אפשר לחבר לאוטומציה.", "WA")}
          </div>
        </div>

        <div class="${softCardClass}" data-bizuply-block="booking-form" data-editable-card="true">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            קביעת תור
          </h3>

          <form class="mt-7 grid gap-4">
            ${inputField("שם מלא")}
            ${inputField("טלפון")}
            ${selectField("בחרו שירות")}
            ${inputField("יום ושעה מועדפים")}
            <div class="grid gap-3 sm:grid-cols-3">
              ${bookingTimes()}
            </div>
            ${formButton("בקשת תור")}
          </form>
        </div>
      </div>
      `
    ),
    { tags: ["booking", "appointment", "service"] }
  ),

  createVariant(
    "form-layout-6",
    kind,
    "שאלון התאמה",
    "טופס שאלון עם בחירות מהירות לפני שליחת פרטים.",
    "Quiz",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[1040px] rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="mx-auto max-w-[820px] text-center">
          <p class="${pillClass}" data-editable-text="true">שאלון התאמה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            ענו על כמה שאלות ונחזור עם התאמה מדויקת
          </h2>

          <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
            מתאים לשירותים מותאמים אישית, קורסים, ייעוץ, טיפולים, מוצרים או SaaS.
          </p>
        </div>

        <div class="mt-10 rounded-[42px] bg-white p-7 shadow-[0_30px_100px_rgba(15,23,42,0.08)]" data-editable-card="true">
          <h3 class="text-2xl font-black text-slate-800" data-editable-text="true">
            מה הכי מתאים לכם?
          </h3>

          <div class="mt-6 grid gap-3 sm:grid-cols-3">
            ${miniChoice("אפשרות 1", true)}
            ${miniChoice("אפשרות 2")}
            ${miniChoice("אפשרות 3")}
          </div>

          <form class="mt-7 grid gap-4">
            ${inputField("שם מלא")}
            ${inputField("טלפון")}
            ${textareaField("ספרו לנו בקצרה מה חשוב לכם")}
            ${formButton("שליחת שאלון")}
          </form>
        </div>
      </div>
      `
    ),
    { tags: ["quiz", "match", "interactive"] }
  ),

  createVariant(
    "form-layout-7",
    kind,
    "טופס הרשמה",
    "טופס הרשמה לניוזלטר, מועדון לקוחות או רשימת המתנה.",
    "Subscribe",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] rounded-[54px] border border-slate-200 bg-white p-8 text-center shadow-[0_34px_120px_rgba(15,23,42,0.08)] md:p-14">
        <p class="${pillClass}" data-editable-text="true">הרשמה</p>

        <h2 class="${h2Class}" data-editable-text="true">
          הצטרפו וקבלו עדכונים והטבות
        </h2>

        <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          מתאים לניוזלטר, קופונים, מועדון לקוחות, השקה או רשימת המתנה.
        </p>

        <div class="mx-auto mt-8 max-w-[720px]">
          ${subscribeForm("הרשמה")}
        </div>

        <p class="mt-5 text-xs font-bold text-slate-400" data-editable-text="true">
          ללא ספאם. אפשר להסיר הרשמה בכל רגע.
        </p>
      </div>
      `
    ),
    { tags: ["subscribe", "newsletter", "club"] }
  ),

  createVariant(
    "form-layout-8",
    kind,
    "טופס כהה פרימיום",
    "טופס כהה, יוקרתי ומרשים לעסקים פרימיום.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Contact Form
            </p>

            <h2 class="text-5xl font-black leading-[0.96] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              טופס כהה שמתאים למותג יוקרתי
            </h2>

            <p class="mt-6 text-xl font-bold leading-10 text-white/72" data-editable-text="true">
              מתאים לעסקים שרוצים טופס מרשים, נקי ויוקרתי עם תחושת פרימיום.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("השארת פרטים")}
              ${darkButton("שיחה בוואטסאפ")}
            </div>
          </div>

          ${darkFormCard("פנייה מהירה", "שליחת פנייה")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "luxury"] }
  ),

  createVariant(
    "form-layout-9",
    kind,
    "טופס על תמונת רקע",
    "טופס וקריאה לפעולה מעל תמונת רקע חזקה.",
    "Background",
    backgroundSection(
      kind,
      sectionImages.office,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div class="max-w-[720px]">
          <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
            השאירו פרטים
          </p>

          <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
            ניצור איתכם קשר ונבנה את הצעד הבא
          </h2>

          <p class="mt-6 text-xl font-bold leading-10 text-white/85" data-editable-text="true">
            טופס על רקע תמונה מתאים לדפי נחיתה, שירותים, קמפיינים ועסקים שרוצים נראות חזקה.
          </p>
        </div>

        ${darkFormCard("קבלת פרטים", "שליחה")}
      </div>
      `
    ),
    { tags: ["background", "image", "form"] }
  ),

  createVariant(
    "form-layout-10",
    kind,
    "טופס + תמונה",
    "תמונה גדולה ליד טופס מקצועי.",
    "Image",
    splitLayout(
      kind,
      premiumFormCard("השאירו פרטים", "נחזור אליכם עם כל המידע.", "שליחה"),
      imageBlock(sectionImages.people, "min-h-[580px]"),
      true
    ),
    { tags: ["image", "split", "form"] }
  ),

  createVariant(
    "form-layout-11",
    kind,
    "טופס תמיכה",
    "טופס שירות לקוחות / תמיכה עם בחירת נושא.",
    "Support",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">שירות לקוחות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            צריכים עזרה? שלחו פנייה מסודרת
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לשירות לקוחות, תמיכה טכנית, שאלות על מוצר, הזמנות או תורים.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${contactMethodMini("פנייה מסודרת", "כל הפרטים במקום אחד.", "✓")}
            ${contactMethodMini("בחירת נושא", "הפנייה מגיעה בצורה ברורה.", "?" )}
            ${contactMethodMini("מענה מהיר", "העסק יודע במה לטפל.", "↗")}
            ${contactMethodMini("מעקב", "אפשר לחבר ל־CRM.", "CRM")}
          </div>
        </div>

        <div class="${softCardClass}" data-bizuply-block="support-form" data-editable-card="true">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            פתיחת פנייה
          </h3>

          <form class="mt-7 grid gap-4">
            ${inputField("שם מלא")}
            ${inputField("אימייל", "email")}
            ${selectField("בחרו נושא פנייה")}
            ${textareaField("תארו את הפנייה")}
            ${formButton("שליחת פנייה")}
          </form>
        </div>
      </div>
      `
    ),
    { tags: ["support", "customer-service", "ticket"] }
  ),

  createVariant(
    "form-layout-12",
    kind,
    "טופס RSVP",
    "טופס אישור הגעה לאירוע.",
    "RSVP",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-stone-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">אישור הגעה</p>

            <h2 class="${h2Class}" data-editable-text="true">
              אשרו הגעה לאירוע בכמה שניות
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לחתונה, בר/בת מצווה, כנס, סדנה, אירוע פרטי או עסקי.
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-3">
              ${contactMethodMini("תאריך", "24.06.2026", "📅")}
              ${contactMethodMini("שעה", "20:30", "◷")}
              ${contactMethodMini("מקום", "שם האולם", "⌖")}
            </div>
          </div>

          <div class="${softCardClass}" data-bizuply-block="rsvp-form" data-editable-card="true">
            <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
              אישור הגעה
            </h3>

            <form class="mt-7 grid gap-4">
              ${inputField("שם מלא")}
              ${inputField("טלפון")}
              ${selectField("מגיע/ה?")}
              ${inputField("מספר משתתפים")}
              ${textareaField("הערות / רגישויות / בקשות")}
              ${formButton("שליחת אישור")}
            </form>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["rsvp", "events", "invitation"] }
  ),

  createVariant(
    "form-layout-13",
    kind,
    "טופס SaaS Demo",
    "טופס בקשת דמו למערכת, מוצר דיגיטלי או Mini SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[64px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Book a Demo
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              בקשת דמו למערכת עסקית
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים ל־CRM, תיאום תורים, חנות, קורסים, אזור לקוחות, אוטומציות ו־AI.
            </p>

            <div class="mt-9 grid gap-4 sm:grid-cols-2">
              ${darkFeatureCard("Demo", "תיאום שיחת דמו.", "D")}
              ${darkFeatureCard("Setup", "התאמה לצורך העסק.", "S")}
            </div>
          </div>

          <div class="rounded-[42px] bg-white p-7 text-slate-800" data-bizuply-block="demo-form" data-editable-card="true">
            <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
              קביעת דמו
            </h3>

            <form class="mt-7 grid gap-4">
              ${inputField("שם מלא")}
              ${inputField("טלפון")}
              ${inputField("אימייל עסקי", "email")}
              ${inputField("שם העסק")}
              ${selectField("מה מעניין אתכם?")}
              ${formButton("בקשת דמו")}
            </form>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "demo", "system"] }
  ),

  createVariant(
    "form-layout-14",
    kind,
    "טופס הזמנה",
    "טופס להזמנת מוצר, שירות או חבילה.",
    "Order",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">טופס הזמנה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לקוחות יכולים לשלוח הזמנה ישירות מהאתר
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לעסק שרוצה לקבל הזמנות למוצר, שירות, חבילה, אירוע או קורס.
          </p>

          ${imageGrid(
            [
              sectionImages.product,
              sectionImages.store,
              sectionImages.beauty,
              sectionImages.food,
            ],
            "min-h-[190px]",
            "grid-cols-2"
          )}
        </div>

        <div class="${softCardClass}" data-bizuply-block="order-form" data-editable-card="true">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            פרטי הזמנה
          </h3>

          <form class="mt-7 grid gap-4">
            ${inputField("שם מלא")}
            ${inputField("טלפון")}
            ${selectField("בחרו מוצר / שירות")}
            ${inputField("כמות")}
            ${textareaField("כתובת / הערות להזמנה")}
            ${formButton("שליחת הזמנה")}
          </form>
        </div>
      </div>
      `
    ),
    { tags: ["order", "store", "product"] }
  ),

  createVariant(
    "form-layout-15",
    kind,
    "טופס עם וידאו",
    "סרטון הסבר לצד טופס פנייה.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">לפני שמשאירים פרטים</p>

        <h2 class="${h2Class}" data-editable-text="true">
          סרטון קצר שמסביר מה יקרה אחרי שליחת הטופס
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לקורסים, שירותים מורכבים, SaaS, ייעוץ, טיפולים או מוצר שצריך הסבר.
        </p>

        <div class="mt-8">
          ${premiumFormCard("קבלת פרטים", "השאירו פרטים ונחזור אליכם.", "שליחה")}
        </div>
      </div>
      `,
      videoBox(),
      true
    ),
    { tags: ["video", "form", "explain"] }
  ),

  createVariant(
    "form-layout-16",
    kind,
    "טופס עם אמון",
    "טופס לצד סטטיסטיקות והמלצה לחיזוק אמון.",
    "Trust",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">אפשר לפנות בביטחון</p>

          <h2 class="${h2Class}" data-editable-text="true">
            מאות לקוחות כבר השאירו פרטים וקיבלו מענה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הוסיפו הוכחות אמון ליד הטופס כדי לשפר המרות ולתת ביטחון ללקוח.
          </p>

          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            ${statCard("500+", "פניות")}
            ${statCard("98%", "שביעות רצון")}
            ${statCard("24/7", "טופס פעיל")}
            ${statCard("7", "שנות ניסיון")}
          </div>

          <div class="mt-8">
            ${testimonialCard(
              "השארתי פרטים וחזרו אליי מהר עם מענה מקצועי וברור.",
              "לקוחה מרוצה"
            )}
          </div>
        </div>

        ${premiumFormCard("השאירו פרטים", "נחזור אליכם עם כל המידע.", "שליחה")}
      </div>
      `
    ),
    { tags: ["trust", "stats", "testimonial"] }
  ),

  createVariant(
    "form-layout-17",
    kind,
    "טופס עם מדיה להוספה",
    "מבנה עם טופס ואזור להוספת תמונה או וידאו.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.office, "min-h-[340px]")}
          ${addMediaBox("הוספת תמונה / וידאו לטופס")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">טופס עם מדיה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו תמונה או וידאו שמחזקים את הפנייה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לדפי נחיתה, קמפיינים, שירותים, מוצרים, קורסים או אירועים.
          </p>

          <div class="mt-8">
            ${premiumFormCard("קבלת פרטים", "השאירו פרטים ונחזור אליכם.", "שליחה")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "form-layout-18",
    kind,
    "CTA טופס וואו",
    "סקשן טופס קצר, צבעוני וממיר לסוף עמוד.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[60px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] via-fuchsia-600 to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_44px_150px_rgba(139,92,246,0.30)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/15 blur-3xl"></div>

        <div class="relative grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              מוכנים להתחיל?
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              השאירו פרטים ונחזור אליכם
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              טופס קצר וברור שמוביל לפנייה מהירה.
            </p>
          </div>

          <div class="rounded-[34px] bg-white/12 p-6 backdrop-blur-2xl">
            <form class="grid gap-3">
              ${darkInputField("שם מלא")}
              ${darkInputField("טלפון")}
              <button
                type="button"
                class="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl"
                data-editable-text="true"
              >
                שליחת פרטים
              </button>
            </form>

            <div class="mt-4">
              <a
                href="https://wa.me/972500000000"
                class="inline-flex min-h-14 w-full items-center justify-center rounded-2xl bg-white/15 px-8 text-sm font-black text-white ring-1 ring-white/20"
                data-editable-link="true"
              >
                או שלחו וואטסאפ
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