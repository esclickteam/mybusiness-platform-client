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
  Bizuply Website Studio — Events Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/eventsLayoutVariants.ts

  סקשן אירועים מקצועי.
  מתאים ל:
  - אירועים
  - הזמנות
  - חתונות
  - בר/בת מצווה
  - כנסים
  - סדנאות
  - הופעות
  - וובינרים
  - מכירת כרטיסים
  - אישורי הגעה
  - אולם / מפיק / צלם / DJ / קייטרינג
*/

const kind = "events" as const;

function eventDateBadge(day: string, month: string) {
  return `
<div class="grid h-20 w-20 shrink-0 place-items-center rounded-[24px] bg-slate-950 text-center text-white shadow-xl">
  <div>
    <strong class="block text-3xl font-black leading-none" data-editable-text="true">${day}</strong>
    <span class="mt-1 block text-xs font-black text-white/60" data-editable-text="true">${month}</span>
  </div>
</div>
`;
}

function eventCard(
  title: string,
  date: string,
  location: string,
  imageUrl = sectionImages.event,
  badge = "אירוע"
) {
  return `
<article class="${cardClass}" data-editable-card="true">
  <div class="relative overflow-hidden rounded-[30px]" data-media-replaceable="true">
    <span class="absolute right-5 top-5 z-10 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-950 shadow-lg" data-editable-text="true">
      ${badge}
    </span>

    <img
      src="${imageUrl}"
      alt=""
      class="h-[300px] w-full object-cover"
      data-editable-image="true"
    />
  </div>

  <div class="mt-6 flex gap-5">
    ${eventDateBadge("24", "יוני")}

    <div>
      <h3 class="text-2xl font-black text-slate-950" data-editable-text="true">
        ${title}
      </h3>

      <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
        ${date} · ${location}
      </p>

      <div class="mt-5 flex flex-wrap gap-3">
        ${primaryButton("הרשמה", "#events")}
        ${secondaryButton("פרטים")}
      </div>
    </div>
  </div>
</article>
`;
}

function eventScheduleItem(time: string, title: string, text: string) {
  return `
<div class="flex gap-5 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <div class="grid h-14 w-20 shrink-0 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-sm font-black text-[var(--biz-primary,#7C3AED)]">
    ${time}
  </div>

  <div>
    <h3 class="text-xl font-black text-slate-950" data-editable-text="true">${title}</h3>
    <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
  </div>
</div>
`;
}

function ticketCard(title: string, price: string, text: string, highlighted = false) {
  return `
<article class="${cardClass} ${highlighted ? "ring-2 ring-[var(--biz-primary,#7C3AED)]" : ""}" data-editable-card="true">
  <p class="mb-4 inline-flex rounded-full ${highlighted ? "bg-[var(--biz-primary,#7C3AED)] text-white" : "bg-[var(--biz-secondary,#F3E8FF)] text-[var(--biz-primary,#7C3AED)]"} px-4 py-2 text-xs font-black" data-editable-text="true">
    ${highlighted ? "פופולרי" : "כרטיס"}
  </p>

  <h3 class="text-2xl font-black text-slate-950" data-editable-text="true">${title}</h3>

  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>

  <div class="mt-7 flex items-end justify-between gap-4">
    <span class="text-sm font-bold text-slate-400" data-editable-text="true">מחיר</span>
    <strong class="text-4xl font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">${price}</strong>
  </div>

  <div class="mt-7">
    ${highlighted ? primaryButton("רכישת כרטיס", "#events") : secondaryButton("רכישת כרטיס", "#events")}
  </div>
</article>
`;
}

function speakerCard(name: string, role: string, imageUrl = sectionImages.people) {
  return `
<article class="${cardClass} text-center" data-editable-card="true">
  ${imageBlock(imageUrl, "min-h-[300px]", "rounded-[30px]")}

  <h3 class="mt-6 text-2xl font-black text-slate-950" data-editable-text="true">
    ${name}
  </h3>

  <p class="mt-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
    ${role}
  </p>

  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    תיאור קצר על המרצה, נותן השירות, האומן או בעל התפקיד באירוע.
  </p>
</article>
`;
}

function rsvpCard(buttonText = "אישור הגעה") {
  return `
<div class="${softCardClass}" data-bizuply-block="event-rsvp" data-editable-card="true">
  <h3 class="text-3xl font-black text-slate-950" data-editable-text="true">
    אישור הגעה
  </h3>

  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    מלאו פרטים ואשרו הגעה לאירוע.
  </p>

  <form class="mt-7 grid gap-4" data-bizuply-block="lead-form">
    <input
      class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
      placeholder="שם מלא"
      data-editable-input="true"
    />

    <input
      class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
      placeholder="טלפון"
      data-editable-input="true"
    />

    <select
      class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
      data-editable-input="true"
    >
      <option>מגיע/ה</option>
      <option>לא מגיע/ה</option>
      <option>אולי</option>
    </select>

    <input
      class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
      placeholder="מספר משתתפים"
      data-editable-input="true"
    />

    <button
      class="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-white shadow-xl"
      type="button"
    >
      ${buttonText}
    </button>
  </form>
</div>
`;
}

function darkEventFeature(title: string, text: string, icon = "✦") {
  return `
<div class="rounded-[30px] border border-white/10 bg-white/8 p-6 text-white" data-editable-card="true">
  <div class="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/12 text-sm font-black text-white">
    ${icon}
  </div>

  <h3 class="text-xl font-black text-white" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-white/65" data-editable-text="true">${text}</p>
</div>
`;
}

function eventInfoRow(label: string, value: string, icon = "✦") {
  return `
<div class="flex items-center gap-4 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]" data-editable-card="true">
  <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-sm font-black text-[var(--biz-primary,#7C3AED)]">
    ${icon}
  </div>

  <div>
    <p class="text-xs font-black text-slate-400" data-editable-text="true">${label}</p>
    <p class="mt-1 text-sm font-black text-slate-950" data-editable-text="true">${value}</p>
  </div>
</div>
`;
}

export const eventsLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "events-layout-1",
    kind,
    "אירועים בכרטיסים",
    "גריד אירועים מקצועי עם תמונה, תאריך, מיקום וכפתור הרשמה.",
    "מומלץ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "אירועים קרובים",
        "הציגו אירועים, כנסים, סדנאות, הופעות או הזמנות בצורה מקצועית וממירה.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${eventCard("אירוע ראשון", "24.06.2026", "תל אביב", sectionImages.event, "חדש")}
        ${eventCard("סדנה מקצועית", "30.06.2026", "חיפה", sectionImages.office, "סדנה")}
        ${eventCard("כנס מיוחד", "08.07.2026", "ירושלים", sectionImages.people, "כנס")}
      </div>
      `
    ),
    { featured: true, tags: ["cards", "events", "classic"] }
  ),

  createVariant(
    "events-layout-2",
    kind,
    "Hero אירוע וואו",
    "פתיחה דרמטית לאירוע עם תמונת רקע, תאריך וכפתורי פעולה.",
    "Hero",
    backgroundSection(
      kind,
      sectionImages.event,
      `
      <div class="max-w-[900px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          אירוע מיוחד
        </p>

        <h2 class="text-5xl font-black leading-[0.96] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
          אירוע שלא שוכחים מתחיל בעמוד שנראה וואו
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          הציגו תאריך, מיקום, פרטים, הרשמה ואישור הגעה בצורה ברורה ומרגשת.
        </p>

        <div class="mt-8 flex flex-wrap gap-4">
          <span class="rounded-full bg-white/18 px-5 py-3 text-sm font-black text-white backdrop-blur-xl" data-editable-text="true">
            24.06.2026
          </span>
          <span class="rounded-full bg-white/18 px-5 py-3 text-sm font-black text-white backdrop-blur-xl" data-editable-text="true">
            20:30
          </span>
          <span class="rounded-full bg-white/18 px-5 py-3 text-sm font-black text-white backdrop-blur-xl" data-editable-text="true">
            אולם / אונליין / מיקום
          </span>
        </div>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("אישור הגעה", "#events")}
          ${secondaryButton("פרטים נוספים")}
        </div>
      </div>
      `
    ),
    { tags: ["hero", "background", "wow"] }
  ),

  createVariant(
    "events-layout-3",
    kind,
    "אירוע + RSVP",
    "פרטי אירוע בצד אחד וטופס אישור הגעה בצד השני.",
    "RSVP",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">אישור הגעה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            אשרו הגעה לאירוע בכמה שניות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים להזמנות, חתונות, בר/בת מצווה, אירועים עסקיים, כנסים, סדנאות ואירועים פרטיים.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${eventInfoRow("תאריך", "24.06.2026", "📅")}
            ${eventInfoRow("שעה", "20:30", "◷")}
            ${eventInfoRow("מיקום", "שם האולם / כתובת", "⌖")}
            ${eventInfoRow("אורחים", "עד 2 משתתפים", "👥")}
          </div>
        </div>

        ${rsvpCard("שליחת אישור")}
      </div>
      `
    ),
    { tags: ["rsvp", "form", "invitation"] }
  ),

  createVariant(
    "events-layout-4",
    kind,
    "לו״ז אירוע",
    "סקשן לוח זמנים מקצועי עם שעות ושלבים.",
    "Schedule",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "לוח זמנים",
        "הציגו את שלבי האירוע בצורה ברורה: קבלת פנים, הרצאות, פעילות, הופעה או סיום.",
        "center"
      )}

      <div class="mx-auto mt-12 grid max-w-[980px] gap-4">
        ${eventScheduleItem("18:30", "קבלת פנים", "התכנסות, רישום, אוכל קל או קבלת אורחים.")}
        ${eventScheduleItem("19:30", "פתיחת האירוע", "ברכות, הצגת התוכנית ותחילת הפעילות המרכזית.")}
        ${eventScheduleItem("20:30", "הרצאה / מופע / טקס", "החלק המרכזי של האירוע, ההופעה או הסדנה.")}
        ${eventScheduleItem("22:00", "סיום והמשך קשר", "סיכום, צילום, נטוורקינג או המשך פעילות.")}
      </div>
      `
    ),
    { tags: ["schedule", "timeline", "program"] }
  ),

  createVariant(
    "events-layout-5",
    kind,
    "אירוע כהה פרימיום",
    "עיצוב כהה ויוקרתי לאירוע פרימיום, כנס או השקה.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] bg-slate-950 p-8 text-white shadow-[0_58px_190px_rgba(15,23,42,0.42)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/22 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/22 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Premium Event
            </p>

            <h2 class="text-5xl font-black leading-[0.96] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              אירוע יוקרתי עם חוויית הרשמה מקצועית
            </h2>

            <p class="mt-6 text-xl font-bold leading-10 text-white/72" data-editable-text="true">
              מתאים להשקות, כנסים, אירועים עסקיים, אולמות, מפיקים וסדנאות פרימיום.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("הרשמה לאירוע")}
              ${darkButton("פרטים נוספים")}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${darkEventFeature("תאריך", "24.06.2026 · 20:30", "📅")}
            ${darkEventFeature("מיקום", "אולם / אונליין / כתובת", "⌖")}
            ${darkEventFeature("כרטיסים", "מקומות מוגבלים בהרשמה.", "₪")}
            ${darkEventFeature("חוויה", "תוכן, קהילה, נטוורקינג.", "✦")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["dark", "luxury", "premium"] }
  ),

  createVariant(
    "events-layout-6",
    kind,
    "כרטיסים ומחירים",
    "מכירת כרטיסים לאירוע עם כמה סוגי כרטיסים.",
    "Tickets",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "בחרו כרטיס לאירוע",
        "הציגו כרטיס רגיל, VIP, Early Bird או חבילות משתתפים.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${ticketCard("Early Bird", "₪99", "כרטיס מוקדם במחיר מיוחד.", false)}
        ${ticketCard("Regular", "₪149", "כניסה מלאה לאירוע ולכל התוכן.", true)}
        ${ticketCard("VIP", "₪299", "כניסה מלאה, הטבות ותוכן בונוס.", false)}
      </div>
      `
    ),
    { tags: ["tickets", "pricing", "sales"] }
  ),

  createVariant(
    "events-layout-7",
    kind,
    "מרצים / משתתפים",
    "כרטיסי מרצים, אומנים, ספקים או אנשי צוות באירוע.",
    "Speakers",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "מי משתתף באירוע",
        "הציגו מרצים, אמנים, נותני חסות, ספקים או צוות מקצועי.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${speakerCard("שם מרצה", "הרצאה מרכזית", sectionImages.people)}
        ${speakerCard("שם מומחה", "סדנה מקצועית", sectionImages.office)}
        ${speakerCard("שם אורח", "אורח מיוחד", sectionImages.event)}
      </div>
      `
    ),
    { tags: ["speakers", "team", "people"] }
  ),

  createVariant(
    "events-layout-8",
    kind,
    "אירוע עם גלריה",
    "פרטי אירוע לצד תמונות אווירה.",
    "Gallery",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">האווירה באירוע</p>

          <h2 class="${h2Class}" data-editable-text="true">
            תנו לתמונות לספר את החוויה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לאולמות, מפיקים, אירועים פרטיים, כנסים, הופעות וסדנאות.
          </p>

          ${actionRow("אישור הגעה", "צפייה בגלריה")}
        </div>

        ${imageGrid(
          [
            sectionImages.event,
            sectionImages.food,
            sectionImages.people,
            sectionImages.office,
          ],
          "min-h-[230px]",
          "md:grid-cols-2"
        )}
      </div>
      `
    ),
    { tags: ["gallery", "visual", "event"] }
  ),

  createVariant(
    "events-layout-9",
    kind,
    "חתונה / הזמנה",
    "מבנה הזמנה אלגנטי לאירוע פרטי, חתונה, בר/בת מצווה.",
    "Invitation",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[1040px] rounded-[64px] border border-slate-200 bg-gradient-to-br from-stone-50 via-white to-violet-50 p-8 text-center shadow-[0_44px_150px_rgba(15,23,42,0.10)] md:p-16">
        <p class="${pillClass}" data-editable-text="true">הזמנה לאירוע</p>

        <h2 class="text-5xl font-black leading-[0.96] tracking-[-0.06em] text-slate-950 md:text-7xl" data-editable-text="true">
          שמחים להזמין אתכם לחגוג איתנו
        </h2>

        <p class="mx-auto mt-6 max-w-[740px] text-xl font-bold leading-10 text-slate-500" data-editable-text="true">
          יום חמישי · 24.06.2026 · 20:30 · שם האולם
        </p>

        <div class="mx-auto mt-10 grid max-w-[720px] gap-4 sm:grid-cols-3">
          ${eventInfoRow("תאריך", "24.06.2026", "📅")}
          ${eventInfoRow("שעה", "20:30", "◷")}
          ${eventInfoRow("מיקום", "שם האולם", "⌖")}
        </div>

        <div class="mt-10 flex flex-wrap justify-center gap-4">
          ${primaryButton("אישור הגעה")}
          ${secondaryButton("ניווט")}
          ${whatsappButton("שאלה")}
        </div>
      </div>
      `
    ),
    { tags: ["wedding", "invitation", "private-event"] }
  ),

  createVariant(
    "events-layout-10",
    kind,
    "וובינר / אונליין",
    "סקשן לאירוע אונליין, וובינר, שיעור או שידור חי.",
    "Webinar",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">וובינר אונליין</p>

          <h2 class="${h2Class}" data-editable-text="true">
            אירוע דיגיטלי עם הרשמה פשוטה וברורה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לוובינרים, קורסים, הרצאות אונליין, שידורים חיים, הדרכות וסדנאות.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${softFeatureCard("קישור צפייה", "נשלח לנרשמים לפני האירוע.", "↗")}
            ${softFeatureCard("תזכורת", "אפשר לשלוח SMS / מייל.", "SMS")}
            ${softFeatureCard("הקלטה", "אפשר להוסיף גישה לאחר האירוע.", "▶")}
            ${softFeatureCard("שאלות", "איסוף שאלות מהמשתתפים.", "?" )}
          </div>

          ${actionRow("הרשמה לוובינר", "קבלת פרטים")}
        </div>

        ${videoBox()}
      </div>
      `
    ),
    { tags: ["webinar", "online", "video"] }
  ),

  createVariant(
    "events-layout-11",
    kind,
    "אירוע עם טופס ליד",
    "טופס הרשמה / בקשת פרטים לאירוע בצד.",
    "Lead",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">הרשמה לאירוע</p>

          <h2 class="${h2Class}" data-editable-text="true">
            השאירו פרטים ונשמור לכם מקום
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לאירועים עם הרשמה מוקדמת, כנסים, סדנאות, הרצאות והשקות.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${eventInfoRow("מקומות", "מוגבל", "👥")}
            ${eventInfoRow("עלות", "החל מ־₪99", "₪")}
            ${eventInfoRow("תאריך", "24.06.2026", "📅")}
            ${eventInfoRow("שעה", "20:30", "◷")}
          </div>
        </div>

        <div class="${softCardClass}" data-editable-card="true">
          <h3 class="text-3xl font-black text-slate-950" data-editable-text="true">
            הרשמה מהירה
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            מלאו פרטים ונחזור אליכם עם אישור.
          </p>

          <div class="mt-6">
            ${leadForm("הרשמה לאירוע")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["lead", "form", "registration"] }
  ),

  createVariant(
    "events-layout-12",
    kind,
    "אירוע WhatsApp",
    "הרשמה או שאלה לאירוע ישירות דרך וואטסאפ.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-700" data-editable-text="true">
              הרשמה בוואטסאפ
            </p>

            <h2 class="${h2Class}" data-editable-text="true">
              שאלות, הרשמה ואישור הגעה דרך וואטסאפ
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לאירועים שרוצים לסגור הרשמה בצורה אישית ומהירה.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${whatsappButton("הרשמה בוואטסאפ")}
              ${secondaryButton("פרטי האירוע")}
            </div>
          </div>

          <div class="${cardClass}">
            <div class="rounded-[32px] bg-slate-950 p-6 text-white">
              <p class="text-sm font-black text-white/60" data-editable-text="true">
                WhatsApp Event
              </p>

              <div class="mt-5 grid gap-4">
                <div class="rounded-[24px] bg-white/10 p-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
                  שלום, אשמח להירשם לאירוע.
                </div>

                <div class="mr-auto rounded-[24px] bg-emerald-500 p-4 text-sm font-bold leading-7 text-white" data-editable-text="true">
                  בשמחה! כמה משתתפים תרצו לרשום?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["whatsapp", "registration", "fast"] }
  ),

  createVariant(
    "events-layout-13",
    kind,
    "אירוע עם וידאו",
    "וידאו תדמית / הזמנה לאירוע לצד פרטים והרשמה.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">סרטון הזמנה</p>

        <h2 class="${h2Class}" data-editable-text="true">
          הציגו את האירוע דרך וידאו קצר ומרגש
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים להזמנה, קליפ אירוע, סרטון תדמית, סדנה, כנס או מופע.
        </p>

        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          ${eventInfoRow("תאריך", "24.06.2026", "📅")}
          ${eventInfoRow("מיקום", "שם המקום", "⌖")}
        </div>

        ${actionRow("הרשמה", "שיתוף")}
      </div>
      `,
      videoBox(),
      true
    ),
    { tags: ["video", "event", "invitation"] }
  ),

  createVariant(
    "events-layout-14",
    kind,
    "ספקי אירוע",
    "סקשן להצגת ספקים באירוע: צלם, DJ, קייטרינג, עיצוב.",
    "Vendors",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "ספקי האירוע",
        "הציגו את הצוות או הספקים שמרכיבים את החוויה.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-4">
        ${speakerCard("שם הספק", "צילום", sectionImages.people)}
        ${speakerCard("שם הספק", "DJ / מוזיקה", sectionImages.event)}
        ${speakerCard("שם הספק", "קייטרינג", sectionImages.food)}
        ${speakerCard("שם הספק", "עיצוב", sectionImages.office)}
      </div>
      `
    ),
    { tags: ["vendors", "suppliers", "event-team"] }
  ),

  createVariant(
    "events-layout-15",
    kind,
    "אירוע עם מיקום",
    "פרטי מיקום, כתובת ומפה מדומה לצד פרטי האירוע.",
    "Location",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">איך מגיעים?</p>

          <h2 class="${h2Class}" data-editable-text="true">
            כל פרטי המיקום במקום אחד
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הציגו כתובת, חניה, שעה, אולם, קישור ניווט ופרטים חשובים לאורחים.
          </p>

          <div class="mt-8 grid gap-4">
            ${eventInfoRow("כתובת", "רחוב האירוע 10, תל אביב", "⌖")}
            ${eventInfoRow("חניה", "חניה זמינה בסמוך", "P")}
            ${eventInfoRow("שעת הגעה", "20:00 - 20:30", "◷")}
          </div>

          <div class="mt-9 flex flex-wrap gap-4">
            ${primaryButton("ניווט לאירוע")}
            ${secondaryButton("שאלה למארגנים")}
          </div>
        </div>

        <div class="overflow-hidden rounded-[38px] bg-white p-3 shadow-[0_30px_100px_rgba(15,23,42,0.12)]" data-editable-card="true">
          <iframe
            src="https://www.google.com/maps?q=Tel%20Aviv&output=embed"
            width="100%"
            height="460"
            class="rounded-[28px]"
            style="border:0;"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            data-editable-map="true"
          ></iframe>
        </div>
      </div>
      `
    ),
    { tags: ["location", "map", "venue"] }
  ),

  createVariant(
    "events-layout-16",
    kind,
    "אירוע מינימליסטי",
    "סקשן אירוע נקי, קצר ואלגנטי.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] rounded-[54px] border border-slate-200 bg-white p-8 text-center shadow-[0_34px_120px_rgba(15,23,42,0.08)] md:p-14">
        <p class="${pillClass}" data-editable-text="true">אירוע קרוב</p>

        <h2 class="${h2Class}" data-editable-text="true">
          שם האירוע שלכם
        </h2>

        <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          תיאור קצר של האירוע, למי הוא מתאים ומה חשוב לדעת לפני הרשמה.
        </p>

        <div class="mx-auto mt-8 grid max-w-[720px] gap-4 sm:grid-cols-3">
          ${eventInfoRow("תאריך", "24.06.2026", "📅")}
          ${eventInfoRow("שעה", "20:30", "◷")}
          ${eventInfoRow("מיקום", "שם המקום", "⌖")}
        </div>

        <div class="mt-10 flex flex-wrap justify-center gap-4">
          ${primaryButton("הרשמה")}
          ${secondaryButton("פרטים")}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "event"] }
  ),

  createVariant(
    "events-layout-17",
    kind,
    "אירוע עם מדיה להוספה",
    "מבנה עם תמונה קיימת ואזור להוספת תמונה או וידאו.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.event, "min-h-[340px]")}
          ${addMediaBox("הוספת תמונת אירוע / וידאו")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">מדיה לאירוע</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו תמונות, סרטון הזמנה או גלריית אווירה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לאירועים פרטיים, אולמות, כנסים, סדנאות, הופעות והפקות.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${eventInfoRow("תאריך", "24.06.2026", "📅")}
            ${eventInfoRow("מיקום", "שם המקום", "⌖")}
          </div>

          ${actionRow("אישור הגעה", "פרטים")}
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "events-layout-18",
    kind,
    "CTA אירוע וואו",
    "סקשן קצר וחזק לסוף עמוד שמוביל להרשמה או אישור הגעה.",
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
              מוכנים להירשם?
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              נשאר לכם רק לאשר הגעה
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              הרשמה, אישור הגעה, רכישת כרטיס או וואטסאפ — הכל ברור ומהיר.
            </p>
          </div>

          <div class="flex shrink-0 flex-wrap gap-4">
            <a
              href="#events"
              class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl"
              data-editable-link="true"
            >
              אישור הגעה
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
    { tags: ["cta", "wow", "event"] }
  ),
];