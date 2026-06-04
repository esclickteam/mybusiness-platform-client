import type { SectionLayoutVariant } from "../../types";
import {
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
  logoCloud,
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
  Bizuply Website Studio — Subscribe Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/subscribeLayoutVariants.ts

  סקשן הרשמה / ניוזלטר / הצטרפות.
  מתאים ל:
  - ניוזלטר
  - מועדון לקוחות
  - קופונים
  - רשימת המתנה
  - קורס דיגיטלי
  - השקת מוצר
  - SaaS Waitlist
  - הרשמה למבצעים
  - קבלת מדריך / Freebie
*/

const kind = "subscribe" as const;

function subscribeCard(
  title: string,
  text: string,
  buttonText = "הרשמה"
) {
  return `
<div class="${softCardClass}" data-editable-card="true">
  <h3 class="text-3xl font-black text-slate-950" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>

  <div class="mt-7">
    ${subscribeForm(buttonText)}
  </div>

  <p class="mt-4 text-xs font-bold text-slate-400" data-editable-text="true">
    ללא ספאם. רק עדכונים והטבות חשובות.
  </p>
</div>
`;
}

function benefitPill(text: string) {
  return `
<span class="inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-xs font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
  ${text}
</span>
`;
}

function subscribeBenefit(title: string, text: string, icon = "✓") {
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

function darkSubscribeForm(buttonText = "Join now") {
  return `
<form class="mt-8 flex flex-col gap-3 sm:flex-row" data-bizuply-block="subscribe-form">
  <input
    class="min-h-14 flex-1 rounded-2xl border border-white/10 bg-white/10 px-5 text-sm font-bold text-white outline-none placeholder:text-white/45 focus:border-white/30"
    placeholder="כתובת אימייל"
    data-editable-input="true"
  />

  <button
    class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-slate-950 shadow-xl"
    type="button"
  >
    ${buttonText}
  </button>
</form>
`;
}

function couponBox(text = "WELCOME10") {
  return `
<div
  class="inline-flex rotate-[-2deg] rounded-[24px] border-2 border-dashed border-[var(--biz-primary,#7C3AED)] bg-white px-7 py-4 text-2xl font-black tracking-[-0.04em] text-[var(--biz-primary,#7C3AED)] shadow-[0_18px_60px_rgba(124,58,237,0.16)]"
  data-editable-text="true"
>
  ${text}
</div>
`;
}

function waitlistStep(number: string, title: string, text: string) {
  return `
<div class="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <div class="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">
    ${number}
  </div>

  <h3 class="text-xl font-black text-slate-950" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>
</div>
`;
}

export const subscribeLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "subscribe-layout-1",
    kind,
    "הרשמה נקייה",
    "סקשן הרשמה קלאסי, נקי וממיר עם כותרת וטופס.",
    "מומלץ",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] rounded-[54px] border border-slate-200 bg-white p-8 text-center shadow-[0_34px_120px_rgba(15,23,42,0.08)] md:p-14">
        <p class="${pillClass}" data-editable-text="true">הצטרפות לעדכונים</p>

        <h2 class="${h2Class}" data-editable-text="true">
          הצטרפו וקבלו עדכונים, הטבות ותוכן מקצועי
        </h2>

        <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          הרשמה פשוטה לניוזלטר, מועדון לקוחות, מבצעים, השקות או תוכן מקצועי.
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
    { featured: true, tags: ["clean", "newsletter", "form"] }
  ),

  createVariant(
    "subscribe-layout-2",
    kind,
    "הרשמה עם הטבה",
    "הרשמה לניוזלטר או מועדון לקוחות עם קופון ברור.",
    "Coupon",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">הטבה לנרשמים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הצטרפו וקבלו קופון ראשון
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לחנויות, נותני שירות, מועדוני לקוחות, השקות וקמפיינים שמובילים לרכישה או פנייה.
          </p>

          <div class="mt-8 flex flex-wrap gap-3">
            ${benefitPill("קופונים")}
            ${benefitPill("מבצעים")}
            ${benefitPill("השקות")}
            ${benefitPill("עדכונים")}
          </div>

          <div class="mt-9">
            ${couponBox("WELCOME10")}
          </div>
        </div>

        ${subscribeCard(
          "קבלו את ההטבה למייל",
          "השאירו אימייל ונשלח לכם קופון או עדכון מיוחד.",
          "קבלת קופון"
        )}
      </div>
      `
    ),
    { tags: ["coupon", "store", "club"] }
  ),

  createVariant(
    "subscribe-layout-3",
    kind,
    "הרשמה Glass וואו",
    "סקשן הרשמה יוקרתי עם גרדיאנט, זכוכית וטופס.",
    "Glass",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[60px] bg-gradient-to-br from-slate-950 via-violet-950 to-fuchsia-900 p-8 text-white shadow-[0_54px_180px_rgba(76,29,149,0.34)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-400/30 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-400/30 blur-3xl"></div>

        <div class="relative mx-auto max-w-[980px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
            VIP Updates
          </p>

          <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
            הרשמה שנראית כמו מותג פרימיום
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/72" data-editable-text="true">
            מתאים למועדון לקוחות, רשימת המתנה, קורס, מוצר דיגיטלי או קמפיין יוקרתי.
          </p>

          <div class="mx-auto mt-9 max-w-[760px] rounded-[34px] border border-white/18 bg-white/12 p-5 backdrop-blur-2xl">
            ${darkSubscribeForm("הצטרפות")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["glass", "luxury", "wow"] }
  ),

  createVariant(
    "subscribe-layout-4",
    kind,
    "רשימת המתנה",
    "סקשן Waitlist להשקה, מערכת, מוצר או קורס.",
    "Waitlist",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">רשימת המתנה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הצטרפו לרשימת ההמתנה וקבלו גישה ראשונים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים להשקת מוצר, מערכת SaaS, קורס דיגיטלי, שירות חדש, קולקציה או מועדון לקוחות.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-3">
            ${waitlistStep("1", "נרשמים", "משאירים אימייל.")}
            ${waitlistStep("2", "מקבלים עדכון", "שולחים לכם פרטים.")}
            ${waitlistStep("3", "נכנסים ראשונים", "מקבלים גישה מוקדמת.")}
          </div>
        </div>

        ${subscribeCard(
          "הצטרפות לרשימה",
          "השאירו אימייל ונעדכן אתכם ברגע שההשקה עולה.",
          "הצטרפות לרשימה"
        )}
      </div>
      `
    ),
    { tags: ["waitlist", "launch", "saas"] }
  ),

  createVariant(
    "subscribe-layout-5",
    kind,
    "הרשמה כהה פרימיום",
    "סקשן הרשמה כהה, דרמטי ויוקרתי.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[60px] bg-slate-950 p-8 text-white shadow-[0_54px_180px_rgba(15,23,42,0.38)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/24 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/24 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Premium Club
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              הצטרפו למעגל הלקוחות שמקבלים הכל לפני כולם
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              הרשמה למבצעים, השקות, תוכן מקצועי ועדכונים חשובים.
            </p>

            <div class="mt-9 grid gap-4 sm:grid-cols-2">
              ${darkFeatureCard("VIP", "הטבות בלעדיות לחברי הרשימה.", "♛")}
              ${darkFeatureCard("Early Access", "גישה מוקדמת להשקות.", "↗")}
            </div>
          </div>

          <div class="rounded-[42px] border border-white/12 bg-white/8 p-7 backdrop-blur-2xl" data-editable-card="true">
            <h3 class="text-3xl font-black text-white" data-editable-text="true">
              הצטרפות מהירה
            </h3>

            <p class="mt-2 text-sm font-bold leading-7 text-white/60" data-editable-text="true">
              השאירו אימייל ונעדכן אתכם.
            </p>

            ${darkSubscribeForm("Join")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "club"] }
  ),

  createVariant(
    "subscribe-layout-6",
    kind,
    "ניוזלטר עם תמונה",
    "טופס הרשמה לצד תמונה גדולה ומרשימה.",
    "תמונה",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">ניוזלטר מקצועי</p>

        <h2 class="${h2Class}" data-editable-text="true">
          קבלו תוכן, טיפים ועדכונים ישירות למייל
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לעסקים שרוצים לבנות קהל, לשמור על קשר עם לקוחות ולשלוח עדכונים שיווקיים.
        </p>

        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          ${subscribeBenefit("תוכן מקצועי", "טיפים, הדרכות ועדכונים.", "✦")}
          ${subscribeBenefit("הטבות", "קופונים ומבצעים לנרשמים.", "₪")}
        </div>

        <div class="mt-8">
          ${subscribeForm("הרשמה לעדכונים")}
        </div>
      </div>
      `,
      imageBlock(sectionImages.office, "min-h-[560px]"),
      false
    ),
    { tags: ["image", "newsletter", "content"] }
  ),

  createVariant(
    "subscribe-layout-7",
    kind,
    "מועדון לקוחות",
    "הרשמה למועדון לקוחות עם יתרונות וכפתור.",
    "Club",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">מועדון לקוחות</p>

            <h2 class="${h2Class}" data-editable-text="true">
              הצטרפו למועדון וקבלו הטבות מיוחדות
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לעסק שרוצה לבנות קהילה, לקוחות חוזרים, הטבות, קופונים והודעות.
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              ${subscribeBenefit("קופונים", "הטבות מיוחדות לחברי המועדון.", "₪")}
              ${subscribeBenefit("עדכונים", "השקות, מבצעים ותוכן חדש.", "↗")}
              ${subscribeBenefit("ימי הולדת", "הטבות אישיות ללקוחות.", "♡")}
              ${subscribeBenefit("גישה מוקדמת", "לפני כולם.", "♛")}
            </div>
          </div>

          ${subscribeCard(
            "הצטרפות למועדון",
            "השאירו אימייל וקבלו עדכונים והטבות.",
            "הצטרפות"
          )}
        </div>
      </div>
      `
    ),
    { tags: ["club", "customers", "benefits"] }
  ),

  createVariant(
    "subscribe-layout-8",
    kind,
    "הרשמה לקורס",
    "סקשן הרשמה לקורס דיגיטלי, סדנה או וובינר.",
    "Course",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">קורס דיגיטלי</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הרשמה מוקדמת לקורס החדש
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לקורסים, וובינרים, סדנאות, שיעורים אונליין ותוכן דיגיטלי.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${subscribeBenefit("גישה מוקדמת", "כניסה לפני כולם.", "▶")}
            ${subscribeBenefit("מחיר השקה", "הטבה לנרשמים מראש.", "₪")}
            ${subscribeBenefit("בונוסים", "קבצים ותכנים נוספים.", "✦")}
            ${subscribeBenefit("עדכונים", "התראות כששיעור חדש עולה.", "↗")}
          </div>

          <div class="mt-8">
            ${subscribeForm("הרשמה לקורס")}
          </div>
        </div>

        ${videoBox()}
      </div>
      `
    ),
    { tags: ["course", "webinar", "video"] }
  ),

  createVariant(
    "subscribe-layout-9",
    kind,
    "הרשמה על תמונת רקע",
    "סקשן הרשמה עם תמונת רקע גדולה וטופס.",
    "רקע",
    backgroundSection(
      kind,
      sectionImages.office,
      `
      <div class="max-w-[860px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          הצטרפו לעדכונים
        </p>

        <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
          קבלו גישה ראשונים לכל מה שחדש
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          הרשמה למבצעים, השקות, קופונים ותוכן מקצועי.
        </p>

        <div class="mt-9 max-w-[720px] rounded-[30px] bg-white/12 p-4 backdrop-blur-2xl">
          ${darkSubscribeForm("הצטרפות")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "hero", "newsletter"] }
  ),

  createVariant(
    "subscribe-layout-10",
    kind,
    "הרשמה עם סטטיסטיקות",
    "הרשמה שמחוזקת על ידי מספרים ונתוני אמון.",
    "אמון",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">קהילה צומחת</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הצטרפו לאנשים שכבר מקבלים ערך ועדכונים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לעסקים שרוצים להראות אמון, קהל פעיל, לקוחות חוזרים או רשימת תפוצה קיימת.
          </p>

          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            ${statCard("2,500+", "נרשמים")}
            ${statCard("98%", "שביעות רצון")}
            ${statCard("12", "עדכונים בחודש")}
            ${statCard("24/7", "גישה לתוכן")}
          </div>
        </div>

        ${subscribeCard(
          "רוצים להצטרף?",
          "השאירו אימייל וקבלו עדכונים ישירות למייל.",
          "הצטרפות"
        )}
      </div>
      `
    ),
    { tags: ["stats", "trust", "community"] }
  ),

  createVariant(
    "subscribe-layout-11",
    kind,
    "הרשמה עם המלצה",
    "טופס הרשמה לצד המלצה ליצירת אמון.",
    "המלצה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">לקוחות ממליצים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הצטרפו לעדכונים שאנשים באמת מחכים להם
          </h2>

          <p class="${textClass}" data-editable-text="true">
            שילוב של הרשמה והמלצה מחזק אמון ומעלה את אחוזי ההצטרפות.
          </p>

          <div class="mt-8">
            ${testimonialCard(
              "העדכונים היו מדויקים, שימושיים ונתנו לי ערך אמיתי. ההטבות לגמרי שוות.",
              "לקוחה רשומה"
            )}
          </div>
        </div>

        ${subscribeCard(
          "הצטרפות לעדכונים",
          "השאירו אימייל ונשלח לכם תוכן והטבות.",
          "הרשמה"
        )}
      </div>
      `
    ),
    { tags: ["testimonial", "trust", "newsletter"] }
  ),

  createVariant(
    "subscribe-layout-12",
    kind,
    "SaaS Waitlist",
    "הרשמה למערכת, מוצר דיגיטלי או Mini SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[60px] bg-slate-950 p-8 text-white shadow-[0_54px_180px_rgba(15,23,42,0.38)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              SaaS Waitlist
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              הצטרפו לרשימת ההמתנה של המערכת
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים למוצר טכנולוגי, CRM, מערכת תורים, אזור לקוחות, קורסים ומנויים.
            </p>

            <div class="mt-9 max-w-[720px]">
              ${darkSubscribeForm("Join waitlist")}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${darkFeatureCard("CRM", "ניהול לידים ולקוחות.", "CRM")}
            ${darkFeatureCard("Booking", "תורים וזמינות.", "◷")}
            ${darkFeatureCard("Billing", "מנויים ותשלומים.", "₪")}
            ${darkFeatureCard("AI", "אוטומציות ותובנות.", "AI")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "waitlist", "dark"] }
  ),

  createVariant(
    "subscribe-layout-13",
    kind,
    "הרשמה לחנות",
    "הרשמה לעדכוני חנות, קולקציות ומבצעים.",
    "Store",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">עדכוני חנות</p>

            <h2 class="${h2Class}" data-editable-text="true">
              קבלו ראשונים קולקציות, מבצעים וקופונים
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים למותגים, חנויות, מוצרים, קולקציות ולקוחות חוזרים.
            </p>

            <div class="mt-8">
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
          </div>

          ${subscribeCard(
            "הצטרפות לעדכוני החנות",
            "השאירו אימייל וקבלו קופון לקנייה הראשונה.",
            "קבלת קופון"
          )}
        </div>
      </div>
      `
    ),
    { tags: ["store", "products", "coupon"] }
  ),

  createVariant(
    "subscribe-layout-14",
    kind,
    "הרשמה עם WhatsApp",
    "סקשן הרשמה שמציע גם אימייל וגם וואטסאפ.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">עדכונים בדרך שנוחה לכם</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הצטרפו במייל או שלחו הודעה בוואטסאפ
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לעסקים שרוצים לאסוף הרשמות וגם לפתוח שיחה ישירה עם לקוחות.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${subscribeBenefit("אימייל", "עדכונים מסודרים למייל.", "@")}
            ${subscribeBenefit("וואטסאפ", "שיחה מהירה עם העסק.", "WA")}
          </div>

          <div class="mt-9 flex flex-wrap gap-4">
            ${whatsappButton("שליחת וואטסאפ")}
            ${secondaryButton("צפייה בהטבות")}
          </div>
        </div>

        ${subscribeCard(
          "הרשמה באימייל",
          "השאירו כתובת ונעדכן אתכם במבצעים ותוכן חדש.",
          "הרשמה"
        )}
      </div>
      `
    ),
    { tags: ["whatsapp", "email", "lead"] }
  ),

  createVariant(
    "subscribe-layout-15",
    kind,
    "הרשמה עם Freebie",
    "קבלת מדריך/קובץ/הטבה בתמורה להרשמה.",
    "Freebie",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">מתנה לנרשמים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            קבלו מדריך חינמי ישירות למייל
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים למדריכים, צ׳קליסטים, קטלוגים, קבצי PDF, הטבות, קורסים או תוכן מקצועי.
          </p>

          <div class="mt-8 grid gap-4">
            ${subscribeBenefit("מדריך PDF", "קובץ מסודר עם ערך מקצועי.", "PDF")}
            ${subscribeBenefit("טיפים מעשיים", "תוכן קצר וברור ליישום.", "✓")}
            ${subscribeBenefit("הטבה נוספת", "קופון או בונוס לנרשמים.", "✦")}
          </div>
        </div>

        <div class="${softCardClass}">
          <div class="mb-6 grid min-h-[260px] place-items-center rounded-[32px] bg-gradient-to-br from-slate-950 via-violet-950 to-fuchsia-900 text-center text-white">
            <div>
              <div class="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-white/12 text-xl font-black">
                PDF
              </div>

              <h3 class="text-3xl font-black" data-editable-text="true">
                מדריך חינמי
              </h3>

              <p class="mt-2 text-sm font-bold text-white/60" data-editable-text="true">
                קובץ להורדה לאחר הרשמה
              </p>
            </div>
          </div>

          ${subscribeForm("שלחו לי את המדריך")}
        </div>
      </div>
      `
    ),
    { tags: ["freebie", "lead-magnet", "pdf"] }
  ),

  createVariant(
    "subscribe-layout-16",
    kind,
    "הרשמה עם מדיה להוספה",
    "מבנה עם תמונה קיימת ואזור להוספת מדיה נוספת.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.product, "min-h-[340px]")}
          ${addMediaBox("הוספת תמונת הרשמה / וידאו")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">הרשמה עם מדיה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו תמונה או וידאו שמסבירים למה כדאי להצטרף
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לווידאו הסבר, תמונת קופון, תמונת מוצר, מדריך, קורס או השקה.
          </p>

          <div class="mt-8">
            ${subscribeForm("הצטרפות")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "subscribe-layout-17",
    kind,
    "הרשמה מינימליסטית",
    "סקשן הרשמה קצר ואלגנטי בלי עומס.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[860px] text-center">
        <p class="${pillClass}" data-editable-text="true">ניוזלטר</p>

        <h2 class="${h2Class}" data-editable-text="true">
          רוצים לקבל עדכון כשיש משהו חדש?
        </h2>

        <p class="mx-auto mt-6 max-w-[680px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          השאירו אימייל ונעדכן אתכם רק בדברים החשובים.
        </p>

        <div class="mx-auto mt-8 max-w-[680px]">
          ${subscribeForm("הרשמה")}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "newsletter"] }
  ),

  createVariant(
    "subscribe-layout-18",
    kind,
    "CTA הרשמה וואו",
    "סקשן קצר, צבעוני וממיר לסוף עמוד.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[58px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] via-fuchsia-600 to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_44px_150px_rgba(139,92,246,0.30)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/15 blur-3xl"></div>

        <div class="relative grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              הצטרפו עכשיו
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              קבלו הטבות ועדכונים לפני כולם
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              הרשמה מהירה למבצעים, תוכן חדש, השקות וקופונים.
            </p>
          </div>

          <div class="rounded-[34px] bg-white/12 p-5 backdrop-blur-2xl">
            ${darkSubscribeForm("הצטרפות")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["cta", "wow", "conversion"] }
  ),
];