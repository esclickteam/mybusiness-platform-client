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
  textClass,
  videoBox,
  whatsappButton,
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — Bot Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/botLayoutVariants.ts

  סקשן בוט חכם / AI Assistant.
  מתאים ל:
  - בוט שירות לקוחות
  - בוט לידים
  - בוט תיאום תורים
  - בוט שאלות נפוצות
  - בוט WhatsApp
  - בוט מכירות
  - בוט SaaS
  - בוט לאתר עסקי
  - AI Assistant
  - אוטומציות חכמות
*/

const kind = "bot" as const;

function botBubble(text: string, side: "bot" | "user" = "bot") {
  const isUser = side === "user";

  return `
<div class="flex ${isUser ? "justify-end" : "justify-start"}" data-editable-card="true">
  <div class="${
    isUser
      ? "bg-[var(--biz-primary,#7C3AED)] text-white"
      : "bg-slate-100 text-slate-700"
  } max-w-[82%] rounded-[24px] px-5 py-4 text-sm font-bold leading-7 shadow-sm" data-editable-text="true">
    ${text}
  </div>
</div>
`;
}

function botChatWindow(title = "AI Assistant") {
  return `
<div class="rounded-[42px] border border-slate-200 bg-white p-5 shadow-[0_34px_120px_rgba(15,23,42,0.12)]" data-bizuply-block="ai-bot" data-editable-card="true">
  <div class="mb-5 flex items-center justify-between gap-4 rounded-[30px] bg-slate-950 p-5 text-white">
    <div class="flex items-center gap-4">
      <div class="grid h-12 w-12 place-items-center rounded-2xl bg-white/12 text-lg font-black">
        AI
      </div>

      <div>
        <h3 class="text-lg font-black text-white" data-editable-text="true">
          ${title}
        </h3>

        <p class="mt-1 text-xs font-bold text-white/55" data-editable-text="true">
          מחובר · עונה ללקוחות בזמן אמת
        </p>
      </div>
    </div>

    <span class="rounded-full bg-emerald-400/15 px-4 py-2 text-xs font-black text-emerald-300" data-editable-text="true">
      Online
    </span>
  </div>

  <div class="grid gap-4">
    ${botBubble("שלום! איך אפשר לעזור לך היום?", "bot")}
    ${botBubble("אני רוצה לדעת על השירותים והמחירים.", "user")}
    ${botBubble("בשמחה. אפשר לבחור שירות, לראות מחיר ולקבוע תור פנוי.", "bot")}
    ${botBubble("יש לכם תור השבוע?", "user")}
    ${botBubble("כן, יש זמינות ביום שני ב־10:30 או ביום רביעי ב־16:00.", "bot")}
  </div>

  <div class="mt-5 flex gap-3">
    <input
      class="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none placeholder:text-slate-400"
      placeholder="כתבו הודעה..."
      data-editable-input="true"
    />

    <button
      type="button"
      class="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--biz-primary,#7C3AED)] text-sm font-black text-white shadow-xl"
    >
      ↗
    </button>
  </div>
</div>
`;
}

function botFeature(title: string, text: string, icon = "AI") {
  return `
<article class="${cardClass}" data-editable-card="true">
  <div class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-sm font-black text-white">
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

function botActionCard(title: string, text: string, icon = "✓") {
  return `
<div class="flex items-start gap-4 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]" data-editable-card="true">
  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-sm font-black text-[var(--biz-primary,#7C3AED)]">
    ${icon}
  </div>

  <div>
    <h3 class="text-base font-black text-slate-950" data-editable-text="true">
      ${title}
    </h3>

    <p class="mt-1 text-sm font-bold leading-6 text-slate-500" data-editable-text="true">
      ${text}
    </p>
  </div>
</div>
`;
}

function automationRow(title: string, text: string, status = "פעיל") {
  return `
<div class="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between" data-editable-card="true">
  <div>
    <h3 class="text-xl font-black text-slate-950" data-editable-text="true">
      ${title}
    </h3>

    <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
      ${text}
    </p>
  </div>

  <span class="shrink-0 rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-600" data-editable-text="true">
    ${status}
  </span>
</div>
`;
}

function darkBotWindow() {
  return `
<div class="rounded-[42px] border border-white/12 bg-white/10 p-5 text-white shadow-[0_34px_120px_rgba(0,0,0,0.20)] backdrop-blur-2xl" data-bizuply-block="ai-bot" data-editable-card="true">
  <div class="mb-5 flex items-center justify-between rounded-[30px] bg-white/10 p-5">
    <div class="flex items-center gap-4">
      <div class="grid h-12 w-12 place-items-center rounded-2xl bg-white/12 text-lg font-black">
        AI
      </div>

      <div>
        <h3 class="text-lg font-black text-white" data-editable-text="true">
          Smart Bot
        </h3>

        <p class="mt-1 text-xs font-bold text-white/50" data-editable-text="true">
          עוזר חכם לעסק
        </p>
      </div>
    </div>

    <span class="rounded-full bg-emerald-400/15 px-4 py-2 text-xs font-black text-emerald-300" data-editable-text="true">
      Live
    </span>
  </div>

  <div class="grid gap-4">
    <div class="max-w-[82%] rounded-[24px] bg-white/12 px-5 py-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
      שלום! אפשר לעזור לך לבחור שירות?
    </div>

    <div class="mr-auto max-w-[82%] rounded-[24px] bg-[var(--biz-primary,#7C3AED)] px-5 py-4 text-sm font-bold leading-7 text-white" data-editable-text="true">
      כן, אני רוצה לקבוע תור.
    </div>

    <div class="max-w-[82%] rounded-[24px] bg-white/12 px-5 py-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
      מעולה. יש זמינות ביום שני ב־10:30.
    </div>
  </div>
</div>
`;
}

function botStatsPanel() {
  return `
<div class="grid gap-5 sm:grid-cols-2">
  ${statCard("24/7", "מענה ללקוחות")}
  ${statCard("3x", "יותר פניות")}
  ${statCard("90%", "שאלות חוזרות")}
  ${statCard("AI", "המלצות חכמות")}
</div>
`;
}

export const botLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "bot-layout-1",
    kind,
    "בוט צ׳אט מקצועי",
    "סקשן בוט חכם עם חלון צ׳אט גדול, כותרת והסבר.",
    "מומלץ",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">בוט חכם</p>

          <h2 class="${h2Class}" data-editable-text="true">
            בוט שעונה ללקוחות, מסביר שירותים ומוביל לפנייה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לעסק שרוצה מענה מהיר באתר: שאלות, מחירים, זמינות, תיאום תור, מוצרים ולידים.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${botActionCard("מענה מיידי", "הלקוח מקבל תשובה בלי לחכות.", "AI")}
            ${botActionCard("הובלה לפעולה", "תיאום תור, פנייה או וואטסאפ.", "↗")}
            ${botActionCard("שאלות נפוצות", "הבוט עונה לפי תוכן העסק.", "?")}
            ${botActionCard("לידים חכמים", "אוסף פרטים ומעביר לעסק.", "CRM")}
          </div>
        </div>

        ${botChatWindow("Bizuply AI")}
      </div>
      `
    ),
    { featured: true, tags: ["chat", "ai", "professional"] }
  ),

  createVariant(
    "bot-layout-2",
    kind,
    "AI Hero וואו",
    "Hero יוקרתי לבוט חכם עם גרדיאנט כהה וחלון צ׳אט.",
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
              AI Business Assistant
            </p>

            <h2 class="text-5xl font-black leading-[0.95] tracking-[-0.065em] text-white md:text-7xl" data-editable-text="true">
              עוזר חכם שמרגיש כמו עובד נוסף בעסק
            </h2>

            <p class="mt-6 max-w-2xl text-xl font-bold leading-10 text-white/75" data-editable-text="true">
              הבוט עונה, ממליץ, אוסף פרטים ומוביל את הלקוח לצעד הבא — 24/7.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("הפעלת הבוט", "#bot")}
              ${darkButton("צפייה בדמו")}
            </div>
          </div>

          ${darkBotWindow()}
        </div>
      </div>
      `
    ),
    { tags: ["hero", "dark", "wow"] }
  ),

  createVariant(
    "bot-layout-3",
    kind,
    "בוט שירות לקוחות",
    "סקשן שמציג בוט לשירות לקוחות ושאלות חוזרות.",
    "Support",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "שירות לקוחות חכם",
        "תנו לבוט לענות על שאלות שחוזרות על עצמן ולחסוך זמן לעסק.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${botFeature("שאלות נפוצות", "הבוט עונה על שעות פעילות, מחירים, שירותים ותנאים.", "?")}
        ${botFeature("מענה מהיר", "לקוחות מקבלים תשובה מיידית גם מחוץ לשעות הפעילות.", "24/7")}
        ${botFeature("העברה לעסק", "כשצריך, הבוט אוסף פרטים ומעביר לבעל העסק.", "↗")}
      </div>
      `
    ),
    { tags: ["support", "faq", "service"] }
  ),

  createVariant(
    "bot-layout-4",
    kind,
    "בוט תיאום תורים",
    "בוט שמציג זמינות, שירותים ותיאום תור.",
    "Booking",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">בוט תורים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לקוחות שואלים על זמינות והבוט מוביל לקביעת תור
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לקליניקות, יועצים, מאמנים, שיעורים, טיפולים וכל עסק שעובד לפי יומן.
          </p>

          <div class="mt-8 grid gap-4">
            ${automationRow("בדיקת שירות", "הבוט שואל איזה שירות הלקוח צריך.")}
            ${automationRow("בדיקת זמינות", "הבוט מציג שעות ותאריכים פנויים.")}
            ${automationRow("אישור תור", "הלקוח מתקדם לפנייה, וואטסאפ או אישור תור.")}
          </div>
        </div>

        ${botChatWindow("Booking Bot")}
      </div>
      `
    ),
    { tags: ["booking", "appointments", "calendar"] }
  ),

  createVariant(
    "bot-layout-5",
    kind,
    "בוט לידים",
    "בוט שאוסף פרטי לקוח ומעביר ליד לעסק.",
    "Leads",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">בוט לידים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הבוט לא רק עונה — הוא הופך שיחה לליד
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הבוט שואל שאלות, מבין צורך, אוסף שם וטלפון ומעביר את הפנייה לעסק בצורה מסודרת.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${botActionCard("שם וטלפון", "איסוף פרטי לקוח.", "👤")}
            ${botActionCard("סוג שירות", "הבנת הצורך של הלקוח.", "✦")}
            ${botActionCard("תקציב / תאריך", "שאלות התאמה לפי העסק.", "₪")}
            ${botActionCard("שליחה ל־CRM", "שמירת ליד להמשך טיפול.", "CRM")}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-950" data-editable-text="true">
            קבלת ליד מהבוט
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            הלקוח יכול להשאיר פרטים גם דרך טופס רגיל.
          </p>

          <div class="mt-6">
            ${leadForm("שליחת ליד")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["leads", "crm", "form"] }
  ),

  createVariant(
    "bot-layout-6",
    kind,
    "בוט WhatsApp",
    "בוט שמוביל לשיחה בוואטסאפ או מדמה שיחת וואטסאפ.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-700" data-editable-text="true">
              WhatsApp AI
            </p>

            <h2 class="${h2Class}" data-editable-text="true">
              לקוחות יכולים להתחיל שיחה ולקבל מענה חכם
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לעסקים שרוצים שאלות, הזמנות, תורים ושירות לקוחות דרך וואטסאפ.
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              ${botActionCard("מענה מהיר", "תגובה לשאלות נפוצות.", "WA")}
              ${botActionCard("איסוף פרטים", "שם, טלפון וסוג פנייה.", "CRM")}
              ${botActionCard("תיאום תור", "הובלה לזמינות.", "◷")}
              ${botActionCard("שליחת הודעה", "מעבר ישיר לוואטסאפ.", "↗")}
            </div>

            <div class="mt-9 flex flex-wrap gap-4">
              ${whatsappButton("שיחה בוואטסאפ")}
              ${secondaryButton("צפייה בדמו")}
            </div>
          </div>

          <div class="${cardClass}">
            <div class="rounded-[32px] bg-slate-950 p-6 text-white">
              <p class="text-sm font-black text-white/60" data-editable-text="true">
                WhatsApp AI Preview
              </p>

              <div class="mt-5 grid gap-4">
                <div class="rounded-[24px] bg-white/10 p-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
                  שלום, אני רוצה לדעת על השירות.
                </div>

                <div class="mr-auto rounded-[24px] bg-emerald-500 p-4 text-sm font-bold leading-7 text-white" data-editable-text="true">
                  בשמחה! איזה שירות מעניין אותך?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["whatsapp", "chat", "automation"] }
  ),

  createVariant(
    "bot-layout-7",
    kind,
    "בוט מכירות",
    "בוט שמכוון לרכישה, מוצר מתאים או הצעה.",
    "Sales",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">בוט מכירות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הבוט עוזר ללקוח לבחור מוצר או שירות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לחנויות, שירותים, חבילות, קורסים ומוצרים דיגיטליים.
          </p>

          <div class="mt-8 grid gap-4">
            ${automationRow("שאלת התאמה", "מה הלקוח מחפש ומה חשוב לו?")}
            ${automationRow("המלצת מוצר", "הבוט מציע מוצר / שירות מתאים.")}
            ${automationRow("הובלה לרכישה", "מעבר לחנות, טופס או וואטסאפ.")}
          </div>

          ${actionRow("הפעלת בוט מכירות", "צפייה במוצרים")}
        </div>

        ${botChatWindow("Sales Bot")}
      </div>
      `
    ),
    { tags: ["sales", "store", "products"] }
  ),

  createVariant(
    "bot-layout-8",
    kind,
    "בוט FAQ",
    "בוט שאלות ותשובות שמסביר את העסק בצורה חכמה.",
    "FAQ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "בוט שאלות נפוצות",
        "הבוט עוזר ללקוח להבין מחירים, שירותים, שעות פעילות, מיקום ותהליך.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${botFeature("שעות פעילות", "מענה אוטומטי על ימים ושעות.", "◷")}
        ${botFeature("מחירים ושירותים", "הסבר לפי השירותים של העסק.", "₪")}
        ${botFeature("תהליך עבודה", "הבוט מסביר מה קורה אחרי פנייה.", "1")}
      </div>

      <div class="mx-auto mt-12 max-w-[900px]">
        ${botChatWindow("FAQ Bot")}
      </div>
      `
    ),
    { tags: ["faq", "questions", "answers"] }
  ),

  createVariant(
    "bot-layout-9",
    kind,
    "בוט כהה פרימיום",
    "סקשן בוט כהה ויוקרתי לעסקים ברמת פרימיום.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] bg-slate-950 p-8 text-white shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative mx-auto max-w-[900px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
            Premium AI Bot
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            בוט חכם עם נראות של מותג גדול
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים לקליניקות, יועצים, SaaS, חנויות, משרדים, אירועים ומותגים.
          </p>
        </div>

        <div class="relative mt-12 grid gap-6 lg:grid-cols-3">
          ${darkFeatureCard("Answer", "מענה לשאלות לקוחות.", "AI")}
          ${darkFeatureCard("Recommend", "המלצה על שירות מתאים.", "↗")}
          ${darkFeatureCard("Convert", "איסוף ליד או תיאום פעולה.", "CRM")}
        </div>

        <div class="relative mt-12">
          ${darkBotWindow()}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "luxury"] }
  ),

  createVariant(
    "bot-layout-10",
    kind,
    "בוט עם תמונה",
    "תמונה גדולה לצד הסבר על הבוט והיכולות שלו.",
    "Image",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">AI לעסק</p>

        <h2 class="${h2Class}" data-editable-text="true">
          תנו לאתר לעבוד גם כשהעסק סגור
        </h2>

        <p class="${textClass}" data-editable-text="true">
          הבוט עונה לשאלות, ממליץ על שירותים, אוסף לידים ומפנה את הלקוח לפעולה הבאה.
        </p>

        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          ${botActionCard("24/7", "מענה תמידי ללקוחות.", "◷")}
          ${botActionCard("לידים", "איסוף פרטי לקוחות.", "CRM")}
          ${botActionCard("תורים", "הובלה לקביעת תור.", "✓")}
          ${botActionCard("מכירות", "עזרה בבחירת מוצר.", "₪")}
        </div>

        ${actionRow("הפעלת הבוט", "צפייה בדמו")}
      </div>
      `,
      imageBlock(sectionImages.office, "min-h-[560px]"),
      false
    ),
    { tags: ["image", "ai", "business"] }
  ),

  createVariant(
    "bot-layout-11",
    kind,
    "בוט על תמונת רקע",
    "סקשן AI על תמונת רקע עם CTA.",
    "Background",
    backgroundSection(
      kind,
      sectionImages.darkOffice,
      `
      <div class="max-w-[860px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          AI Assistant
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          בוט חכם שמנהל שיחות עם לקוחות באתר
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          מענה מהיר, איסוף פניות, שאלות נפוצות והובלה לפעולה — הכל במקום אחד.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("הפעלת בוט")}
          ${secondaryButton("צפייה בדמו")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "hero", "ai"] }
  ),

  createVariant(
    "bot-layout-12",
    kind,
    "בוט + נתונים",
    "סקשן בוט עם מספרים שמחזקים אמון.",
    "Stats",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">AI שמייצר תוצאות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            פחות שאלות חוזרות, יותר פניות מסודרות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הציגו את הערך של הבוט דרך נתונים: זמינות, לידים, שאלות שחוזרות ושיפור שירות.
          </p>

          <div class="mt-8">
            ${botStatsPanel()}
          </div>
        </div>

        ${botChatWindow("Results Bot")}
      </div>
      `
    ),
    { tags: ["stats", "results", "ai"] }
  ),

  createVariant(
    "bot-layout-13",
    kind,
    "בוט SaaS",
    "סקשן בוט שמתאים למערכת SaaS או Mini SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[64px] bg-slate-950 p-8 text-white shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              AI SaaS
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              בוט כחלק ממערכת עסקית מלאה
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים ל־CRM, תורים, חנות, קורסים, אזור לקוחות, אוטומציות ו־AI.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("בקשת דמו")}
              ${darkButton("צפייה בפיצ׳רים")}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${darkFeatureCard("Smart Chat", "מענה באתר ובוואטסאפ.", "AI")}
            ${darkFeatureCard("CRM", "שמירת לידים ושיחות.", "CRM")}
            ${darkFeatureCard("Booking", "תורים וזמינות.", "◷")}
            ${darkFeatureCard("Automation", "פעולות חכמות והמלצות.", "⚙")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "system", "dark"] }
  ),

  createVariant(
    "bot-layout-14",
    kind,
    "בוט עם וידאו",
    "וידאו הסבר על הבוט לצד צ׳אט.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">איך הבוט עובד?</p>

        <h2 class="${h2Class}" data-editable-text="true">
          סרטון קצר שמסביר את חוויית הבוט
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים להצגת הדגמה, הסבר מערכת, בוט שירות לקוחות או AI לעסק.
        </p>

        <div class="mt-8">
          ${botChatWindow("Demo Bot")}
        </div>
      </div>
      `,
      videoBox(),
      true
    ),
    { tags: ["video", "demo", "ai"] }
  ),

  createVariant(
    "bot-layout-15",
    kind,
    "בוט + טופס",
    "בוט חכם לצד טופס למי שמעדיף להשאיר פרטים.",
    "Form",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">שיחה או טופס</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הלקוח יכול לדבר עם הבוט או להשאיר פרטים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מבנה שמחבר AI עם טופס ליד רגיל, כדי לתת ללקוח שתי דרכים לפנות.
          </p>

          <div class="mt-8">
            ${botChatWindow("Lead Bot")}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-950" data-editable-text="true">
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
    { tags: ["form", "lead", "chat"] }
  ),

  createVariant(
    "bot-layout-16",
    kind,
    "בוט + ניוזלטר",
    "בוט שמוביל להרשמה לעדכונים, קופונים או רשימת המתנה.",
    "Subscribe",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">AI + הרשמות</p>

            <h2 class="${h2Class}" data-editable-text="true">
              הבוט יכול להציע קופון, עדכון או הרשמה
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לחנויות, מועדוני לקוחות, קורסים, השקות ורשימות המתנה.
            </p>

            <div class="mt-8">
              ${botChatWindow("Subscribe Bot")}
            </div>
          </div>

          <div class="${softCardClass}">
            <h3 class="text-3xl font-black text-slate-950" data-editable-text="true">
              קבלת עדכונים
            </h3>

            <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
              הצטרפו וקבלו הטבות ועדכונים.
            </p>

            <div class="mt-6">
              ${subscribeForm("הצטרפות")}
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["subscribe", "newsletter", "ai"] }
  ),

  createVariant(
    "bot-layout-17",
    kind,
    "בוט עם מדיה",
    "מבנה עם בוט ואזור להוספת תמונה או וידאו.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${botChatWindow("Media Bot")}
          ${addMediaBox("הוספת תמונה / וידאו לבוט")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">בוט עם מדיה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו סרטון הסבר, תמונת מוצר או תמונת שירות ליד הבוט
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים להדגמה של הבוט, הסבר שירות, מוצר, קורס, תהליך או מערכת.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${botActionCard("תמונה", "המחשה חזקה יותר.", "▧")}
            ${botActionCard("וידאו", "הסבר ברור על הבוט.", "▶")}
            ${botActionCard("צ׳אט", "שיחה לדוגמה.", "AI")}
            ${botActionCard("ליד", "מעבר לפנייה.", "CRM")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "bot-layout-18",
    kind,
    "CTA בוט וואו",
    "סקשן קצר, צבעוני וממיר שמוביל להפעלת הבוט.",
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
              AI באתר שלכם
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              תנו לבוט לענות, לאסוף פניות ולהוביל לקוחות לפעולה
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              מענה חכם, תיאום תורים, לידים, וואטסאפ ושירות לקוחות — הכל במקום אחד.
            </p>
          </div>

          <div class="rounded-[34px] bg-white/12 p-6 backdrop-blur-2xl">
            <div class="grid gap-3">
              ${darkFeatureCard("AI Chat", "שיחה חכמה באתר.", "AI")}
              ${darkFeatureCard("Lead Capture", "איסוף פרטים מהלקוח.", "CRM")}
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <a
                href="#bot"
                class="inline-flex min-h-14 flex-1 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl"
                data-editable-link="true"
              >
                הפעלת הבוט
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
    { tags: ["cta", "wow", "ai"] }
  ),
];