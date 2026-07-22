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
  Bizuply Website Studio — Social Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/socialLayoutVariants.ts

  סקשן רשתות חברתיות מקצועי.
  מתאים ל:
  - כפתורי סושיאל
  - עקבו אחרינו
  - אינסטגרם / פייסבוק / טיקטוק / יוטיוב
  - וואטסאפ
  - לינקדאין
  - קהילה
  - ביקורות Google
  - Social Proof
  - פיד תמונות
  - CTA לרשתות
*/

const kind = "social" as const;

type SocialButtonStyle = "light" | "dark" | "brand" | "glass";

function socialButton(
  label: string,
  href = "#",
  icon = "◎",
  style: SocialButtonStyle = "light"
) {
  const classes =
    style === "dark"
      ? "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_18px_60px_rgba(15,23,42,0.18)] hover:-translate-y-0.5"
      : style === "brand"
        ? "bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-white shadow-[0_18px_60px_rgba(124,58,237,0.22)] hover:-translate-y-0.5"
        : style === "glass"
          ? "bg-white/14 text-white ring-1 ring-white/18 backdrop-blur-2xl hover:bg-white/20"
          : "border border-slate-200 bg-white text-slate-800 shadow-[0_14px_45px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:shadow-[0_20px_70px_rgba(124,58,237,0.12)]";

  return `
<a
  href="${href}"
  class="inline-flex min-h-14 items-center justify-center gap-3 rounded-2xl px-6 text-sm font-black transition ${classes}"
  data-bizuply-block="social-button"
  data-editable-link="true"
>
  <span class="grid h-9 w-9 place-items-center rounded-xl ${style === "light" ? "bg-slate-100 text-[var(--biz-primary,#7C3AED)]" : "bg-white/14 text-white"}" data-editable-text="true">
    ${icon}
  </span>
  <span data-editable-text="true">${label}</span>
</a>
`;
}

function socialIconButton(
  label: string,
  href = "#",
  icon = "◎",
  style: SocialButtonStyle = "light"
) {
  const classes =
    style === "dark"
      ? "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"
      : style === "brand"
        ? "bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-white"
        : style === "glass"
          ? "bg-white/14 text-white ring-1 ring-white/18 backdrop-blur-2xl"
          : "border border-slate-200 bg-white text-slate-800";

  return `
<a
  href="${href}"
  aria-label="${label}"
  title="${label}"
  class="grid h-14 w-14 place-items-center rounded-2xl text-lg font-black shadow-[0_16px_50px_rgba(15,23,42,0.07)] transition hover:-translate-y-0.5 ${classes}"
  data-bizuply-block="social-icon-button"
  data-editable-link="true"
  data-editable-text="true"
>
  ${icon}
</a>
`;
}

function socialCard(
  title: string,
  text: string,
  buttonLabel: string,
  icon = "◎",
  href = "#"
) {
  return `
<article class="${cardClass}" data-editable-card="true">
  <div class="mb-6 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-xl font-black text-black shadow-xl">
    ${icon}
  </div>

  <h3 class="text-2xl font-black text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>

  <div class="mt-7">
    ${socialButton(buttonLabel, href, icon, "light")}
  </div>
</article>
`;
}

function socialFeedPost(
  imageUrl = sectionImages.people,
  title = "פוסט חדש",
  text = "תיאור קצר של הפוסט, עדכון, מוצר או תוכן מהרשת החברתית."
) {
  return `
<article class="group overflow-hidden rounded-[34px] border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_34px_120px_rgba(124,58,237,0.14)]" data-editable-card="true">
  <div class="relative overflow-hidden rounded-[28px]" data-media-replaceable="true">
    <img
      src="${imageUrl}"
      alt=""
      class="h-[300px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
      data-editable-image="true"
    />

    <div class="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-800 shadow-lg" data-editable-text="true">
      Social
    </div>
  </div>

  <div class="px-2 pb-2 pt-5">
    <h3 class="text-xl font-black text-slate-800" data-editable-text="true">
      ${title}
    </h3>

    <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
      ${text}
    </p>

    <div class="mt-5 flex items-center gap-3 text-xs font-black text-slate-400">
      <span data-editable-text="true">♡ 128</span>
      <span data-editable-text="true">↗ 32</span>
      <span data-editable-text="true">💬 14</span>
    </div>
  </div>
</article>
`;
}

function socialProfileCard(
  platform: string,
  handle: string,
  followers: string,
  icon = "◎"
) {
  return `
<div class="rounded-[34px] border border-slate-200 bg-white p-7 shadow-[0_22px_70px_rgba(15,23,42,0.07)]" data-editable-card="true">
  <div class="flex items-center justify-between gap-4">
    <div class="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-black">
      ${icon}
    </div>

    <span class="rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-xs font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
      ${followers}
    </span>
  </div>

  <h3 class="mt-6 text-2xl font-black text-slate-800" data-editable-text="true">
    ${platform}
  </h3>

  <p class="mt-2 text-sm font-bold text-slate-500" data-editable-text="true">
    ${handle}
  </p>

  <div class="mt-6">
    ${socialButton("מעבר לעמוד", "#", icon, "light")}
  </div>
</div>
`;
}

function darkSocialCard(
  title: string,
  text: string,
  icon = "◎"
) {
  return `
<article class="rounded-[34px] border border-white/10 bg-white/8 p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]" data-editable-card="true">
  <div class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-white/12 text-lg font-black text-black">
    ${icon}
  </div>

  <h3 class="text-2xl font-black text-black" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-3 text-sm font-bold leading-7 text-white/65" data-editable-text="true">
    ${text}
  </p>
</article>
`;
}

function socialMetric(value: string, label: string) {
  return `
<div class="rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <strong class="block text-4xl font-black tracking-[-0.05em] text-slate-800" data-editable-text="true">
    ${value}
  </strong>
  <span class="mt-2 block text-xs font-black text-slate-400" data-editable-text="true">
    ${label}
  </span>
</div>
`;
}

function floatingSocialStack(style: SocialButtonStyle = "light") {
  return `
<div class="flex flex-wrap gap-3" data-bizuply-block="social-buttons">
  ${socialIconButton("Instagram", "https://instagram.com", "IG", style)}
  ${socialIconButton("Facebook", "https://facebook.com", "FB", style)}
  ${socialIconButton("TikTok", "https://tiktok.com", "TT", style)}
  ${socialIconButton("YouTube", "https://youtube.com", "YT", style)}
  ${socialIconButton("LinkedIn", "https://linkedin.com", "IN", style)}
  ${socialIconButton("WhatsApp", "https://wa.me/972500000000", "WA", style)}
</div>
`;
}

function fullSocialButtons(style: SocialButtonStyle = "light") {
  return `
<div class="flex flex-wrap gap-4" data-bizuply-block="social-buttons">
  ${socialButton("Instagram", "https://instagram.com", "IG", style)}
  ${socialButton("Facebook", "https://facebook.com", "FB", style)}
  ${socialButton("TikTok", "https://tiktok.com", "TT", style)}
  ${socialButton("YouTube", "https://youtube.com", "YT", style)}
  ${socialButton("LinkedIn", "https://linkedin.com", "IN", style)}
  ${socialButton("WhatsApp", "https://wa.me/972500000000", "WA", style)}
</div>
`;
}

function socialProofRow(text: string, icon = "★") {
  return `
<div class="flex items-start gap-4 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]" data-editable-card="true">
  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-sm font-black text-[var(--biz-primary,#7C3AED)]">
    ${icon}
  </div>

  <p class="text-sm font-bold leading-7 text-slate-600" data-editable-text="true">
    ${text}
  </p>
</div>
`;
}

export const socialLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "social-layout-1",
    kind,
    "כפתורי סושיאל מקצועיים",
    "סקשן כפתורי רשתות חברתיות ברור, נקי ומקצועי.",
    "מומלץ",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] text-center">
        <p class="${pillClass}" data-editable-text="true">עקבו אחרינו</p>

        <h2 class="${h2Class}" data-editable-text="true">
          כל הרשתות החברתיות במקום אחד
        </h2>

        <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          הוסיפו קישורים לאינסטגרם, פייסבוק, טיקטוק, יוטיוב, לינקדאין ווואטסאפ בצורה יפה וברורה.
        </p>

        <div class="mt-10 flex justify-center">
          ${fullSocialButtons("light")}
        </div>
      </div>
      `
    ),
    { featured: true, tags: ["buttons", "social", "clean"] }
  ),

  createVariant(
    "social-layout-2",
    kind,
    "אייקונים בלבד",
    "שורת אייקונים נקייה שמתאימה להדר, פוטר או סקשן קצר.",
    "Icons",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[900px] rounded-[44px] border border-slate-200 bg-white p-8 text-center shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
        <h2 class="text-4xl font-black tracking-[-0.05em] text-slate-800" data-editable-text="true">
          בואו נישאר בקשר
        </h2>

        <p class="mx-auto mt-4 max-w-[620px] text-base font-bold leading-8 text-slate-500" data-editable-text="true">
          לחצו על הרשת החברתית המתאימה והמשיכו לעקוב.
        </p>

        <div class="mt-8 flex justify-center">
          ${floatingSocialStack("light")}
        </div>
      </div>
      `
    ),
    { tags: ["icons", "footer", "short"] }
  ),

  createVariant(
    "social-layout-3",
    kind,
    "Social Hero וואו",
    "פתיחה יוקרתית לרשתות החברתיות עם גרדיאנט וכפתורים.",
    "Hero",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] bg-gradient-to-br from-slate-950 via-violet-950 to-fuchsia-900 p-8 text-white shadow-[0_58px_190px_rgba(76,29,149,0.34)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-400/30 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-400/30 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
              Social Presence
            </p>

            <h2 class="text-5xl font-black leading-[0.95] tracking-[-0.065em] text-white md:text-7xl" data-editable-text="true">
              נוכחות דיגיטלית שנראית כמו מותג גדול
            </h2>

            <p class="mt-6 max-w-2xl text-xl font-bold leading-10 text-white/75" data-editable-text="true">
              חברו את כל הערוצים שלכם: אינסטגרם, פייסבוק, טיקטוק, יוטיוב, לינקדאין ווואטסאפ.
            </p>

            <div class="mt-9">
              ${fullSocialButtons("glass")}
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            ${socialFeedPost(sectionImages.people, "פוסט מהקהילה", "עדכון חדש מהרשתות החברתיות של העסק.")}
            ${socialFeedPost(sectionImages.product, "מוצר חדש", "תמונה, סרטון או פוסט שמוביל לרכישה.")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["hero", "dark", "wow"] }
  ),

  createVariant(
    "social-layout-4",
    kind,
    "כרטיסי רשתות",
    "כרטיס נפרד לכל רשת חברתית עם כפתור מעבר.",
    "Cards",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "התחברו אלינו ברשתות",
        "הציגו כל רשת חברתית בכרטיס מקצועי עם הסבר וכפתור.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${socialCard("Instagram", "תמונות, סטוריז, מוצרים, עבודות ועדכונים מהיום יום.", "עקבו באינסטגרם", "IG", "https://instagram.com")}
        ${socialCard("Facebook", "עדכונים, קהילה, ביקורות, פוסטים ושיתופים.", "מעבר לפייסבוק", "FB", "https://facebook.com")}
        ${socialCard("TikTok", "סרטונים קצרים, מאחורי הקלעים ותוכן ויראלי.", "צפייה בטיקטוק", "TT", "https://tiktok.com")}
      </div>
      `
    ),
    { tags: ["cards", "platforms", "links"] }
  ),

  createVariant(
    "social-layout-5",
    kind,
    "פיד אינסטגרם",
    "גריד פוסטים ויזואלי בסגנון אינסטגרם.",
    "Instagram",
    sectionShell(
      kind,
      `
      <div class="flex flex-col gap-8">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p class="${pillClass}" data-editable-text="true">Instagram Feed</p>

            <h2 class="${h2Class}" data-editable-text="true">
              הצצה לפיד שלנו
            </h2>

            <p class="${textClass}" data-editable-text="true">
              הציגו תמונות מהרשתות החברתיות, עבודות, מוצרים, לקוחות או מאחורי הקלעים.
            </p>
          </div>

          ${socialButton("עקבו באינסטגרם", "https://instagram.com", "IG", "brand")}
        </div>

        <div class="grid gap-6 md:grid-cols-3">
          ${socialFeedPost(sectionImages.beauty, "תוכן ראשון", "פוסט לדוגמה מתוך הפיד.")}
          ${socialFeedPost(sectionImages.product, "תוכן שני", "פוסט מוצר / שירות / תוצאה.")}
          ${socialFeedPost(sectionImages.store, "תוכן שלישי", "פוסט שמוביל למעורבות.")}
          ${socialFeedPost(sectionImages.people, "תוכן רביעי", "לקוחות, קהילה או מאחורי הקלעים.")}
          ${socialFeedPost(sectionImages.office, "תוכן חמישי", "עדכון מקצועי מהעסק.")}
          ${socialFeedPost(sectionImages.event, "תוכן שישי", "אירוע, השקה או פעילות.")}
        </div>
      </div>
      `
    ),
    { tags: ["instagram", "feed", "grid"] }
  ),

  createVariant(
    "social-layout-6",
    kind,
    "סושיאל כהה פרימיום",
    "סקשן כהה ויוקרתי לרשתות חברתיות.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative mx-auto max-w-[900px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
            Follow The Brand
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            עקבו אחרי העסק בכל הערוצים
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים למותגים, קליניקות, SaaS, חנויות, יועצים, אירועים ועסקים שרוצים נראות פרימיום.
          </p>

          <div class="mt-10 flex justify-center">
            ${fullSocialButtons("glass")}
          </div>
        </div>

        <div class="relative mt-12 grid gap-6 md:grid-cols-3">
          ${darkSocialCard("Instagram", "תמונות, סטוריז ועדכונים.", "IG")}
          ${darkSocialCard("TikTok", "סרטונים קצרים ותוכן ויראלי.", "TT")}
          ${darkSocialCard("YouTube", "וידאו, הדרכות ותוכן עומק.", "YT")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "luxury"] }
  ),

  createVariant(
    "social-layout-7",
    kind,
    "סושיאל עם מספרים",
    "כפתורי סושיאל עם נתוני עוקבים ומעורבות.",
    "Stats",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">קהילה דיגיטלית</p>

          <h2 class="${h2Class}" data-editable-text="true">
            קהל שעוקב, מגיב ונשאר מחובר
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הציגו מספרים שמחזקים אמון: עוקבים, צפיות, תגובות, לקוחות וקהילה.
          </p>

          <div class="mt-8">
            ${fullSocialButtons("light")}
          </div>
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          ${socialMetric("12K", "עוקבים")}
          ${socialMetric("280K", "צפיות")}
          ${socialMetric("4.9", "דירוג")}
          ${socialMetric("24/7", "זמינות")}
        </div>
      </div>
      `
    ),
    { tags: ["stats", "followers", "trust"] }
  ),

  createVariant(
    "social-layout-8",
    kind,
    "סושיאל + וואטסאפ",
    "רשתות חברתיות יחד עם כפתור וואטסאפ מרכזי.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-700" data-editable-text="true">
              Social + WhatsApp
            </p>

            <h2 class="${h2Class}" data-editable-text="true">
              עקבו אחרינו או התחילו שיחה בוואטסאפ
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לעסקים שמקבלים הרבה פניות דרך רשתות ורוצים להוביל גם לשיחה ישירה.
            </p>

            <div class="mt-8 flex flex-wrap gap-4">
              ${whatsappButton("שליחת וואטסאפ")}
              ${socialButton("Instagram", "https://instagram.com", "IG", "light")}
              ${socialButton("Facebook", "https://facebook.com", "FB", "light")}
            </div>
          </div>

          <div class="${cardClass}">
            <div class="rounded-[32px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
              <p class="text-sm font-black text-black/60" data-editable-text="true">
                Social Message
              </p>

              <div class="mt-5 grid gap-4">
                <div class="rounded-[24px] bg-white/10 p-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
                  ראיתי אתכם באינסטגרם ורוצה לקבל פרטים.
                </div>

                <div class="mr-auto rounded-[24px] bg-emerald-500 p-4 text-sm font-bold leading-7 text-white" data-editable-text="true">
                  בשמחה! איך אפשר לעזור?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["whatsapp", "social", "lead"] }
  ),

  createVariant(
    "social-layout-9",
    kind,
    "פרופילים חברתיים",
    "כרטיסי פרופיל עם שם משתמש וכמות עוקבים.",
    "Profiles",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "הפרופילים שלנו",
        "הציגו לכל רשת חברתית שם משתמש, כמות עוקבים וכפתור מעבר.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${socialProfileCard("Instagram", "@yourbrand", "12K עוקבים", "IG")}
        ${socialProfileCard("TikTok", "@yourbrand", "48K צפיות", "TT")}
        ${socialProfileCard("YouTube", "@yourbrand", "1.8K מנויים", "YT")}
      </div>
      `
    ),
    { tags: ["profiles", "followers", "cards"] }
  ),

  createVariant(
    "social-layout-10",
    kind,
    "סושיאל על תמונת רקע",
    "כפתורי סושיאל על רקע תמונה עם Overlay.",
    "Background",
    backgroundSection(
      kind,
      sectionImages.people,
      `
      <div class="max-w-[860px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          Social Links
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          בואו להכיר אותנו גם ברשתות
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          עקבו אחרי העדכונים, התמונות, הסרטונים, המוצרים והסיפורים שמאחורי העסק.
        </p>

        <div class="mt-9">
          ${fullSocialButtons("glass")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "hero", "social"] }
  ),

  createVariant(
    "social-layout-11",
    kind,
    "קהילה חברתית",
    "סקשן שמדגיש קהילה, מעורבות וקשר עם לקוחות.",
    "Community",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">הקהילה שלנו</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לקוחות, עוקבים ותוכן שמחבר את כולם
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים למותגים, קורסים, חנויות, קליניקות ועסקים שרוצים לבנות קהילה.
          </p>

          <div class="mt-8 grid gap-4">
            ${socialProofRow("עדכונים שוטפים, סטוריז, פוסטים וטיפים מקצועיים.", "IG")}
            ${socialProofRow("קהילה שמגיבה, שואלת ומשתפת חוויות.", "♡")}
            ${socialProofRow("לקוחות חדשים מגיעים מהרשתות החברתיות.", "↗")}
          </div>

          <div class="mt-9">
            ${fullSocialButtons("light")}
          </div>
        </div>

        ${imageGrid(
          [
            sectionImages.people,
            sectionImages.beauty,
            sectionImages.product,
            sectionImages.office,
          ],
          "min-h-[230px]",
          "md:grid-cols-2"
        )}
      </div>
      `
    ),
    { tags: ["community", "engagement", "content"] }
  ),

  createVariant(
    "social-layout-12",
    kind,
    "סושיאל לחנות",
    "רשתות חברתיות לחנות, מוצרים וקולקציות.",
    "Store",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">Shop Social</p>

            <h2 class="${h2Class}" data-editable-text="true">
              מוצרים, קולקציות ועדכונים מהרשתות
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לחנויות שרוצות להוביל לקוחות מהרשתות לחנות, וואטסאפ או הרשמה לקופון.
            </p>

            <div class="mt-8 flex flex-wrap gap-4">
              ${socialButton("Instagram Shop", "https://instagram.com", "IG", "brand")}
              ${socialButton("TikTok", "https://tiktok.com", "TT", "light")}
              ${whatsappButton("הזמנה בוואטסאפ")}
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            ${socialFeedPost(sectionImages.product, "מוצר חדש", "פוסט מוצר שמוביל לרכישה.")}
            ${socialFeedPost(sectionImages.store, "קולקציה", "תמונה מתוך קולקציה חדשה.")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["store", "products", "shop"] }
  ),

  createVariant(
    "social-layout-13",
    kind,
    "סושיאל SaaS",
    "רשתות חברתיות למערכת, מוצר דיגיטלי או Mini SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[64px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
              SaaS Social
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              עדכונים, דמו ותוכן מקצועי בכל הערוצים
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים ל־CRM, תורים, חנות, קורסים, אזור לקוחות, AI ואוטומציות.
            </p>

            <div class="mt-9">
              ${fullSocialButtons("glass")}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${darkFeatureCard("LinkedIn", "עדכונים מקצועיים ו־B2B.", "IN")}
            ${darkFeatureCard("YouTube", "דמו, הדרכות ותוכן עומק.", "YT")}
            ${darkFeatureCard("TikTok", "תוכן קצר שמסביר פיצ׳רים.", "TT")}
            ${darkFeatureCard("WhatsApp", "פניות ושיחות עם לקוחות.", "WA")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "system", "dark"] }
  ),

  createVariant(
    "social-layout-14",
    kind,
    "סושיאל + ניוזלטר",
    "כפתורי סושיאל יחד עם הרשמה לעדכונים.",
    "Subscribe",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">עקבו והצטרפו</p>

          <h2 class="${h2Class}" data-editable-text="true">
            קבלו עדכונים גם ברשתות וגם במייל
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים למועדון לקוחות, השקות, מבצעים, קופונים, קורסים ותוכן מקצועי.
          </p>

          <div class="mt-8">
            ${fullSocialButtons("light")}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            הצטרפות לעדכונים
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            קבלו קופונים, עדכונים ותוכן חדש.
          </p>

          <div class="mt-6">
            ${subscribeForm("הצטרפות")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["subscribe", "newsletter", "social"] }
  ),

  createVariant(
    "social-layout-15",
    kind,
    "סושיאל עם וידאו",
    "וידאו תדמית או רילס לצד כפתורי סושיאל.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">וידאו מהרשתות</p>

        <h2 class="${h2Class}" data-editable-text="true">
          תנו ללקוחות לראות את העסק בפעולה
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לרילס, סרטון תדמית, הדגמת מוצר, מאחורי הקלעים או תוכן יוטיוב.
        </p>

        <div class="mt-8">
          ${fullSocialButtons("light")}
        </div>
      </div>
      `,
      videoBox(),
      false
    ),
    { tags: ["video", "reels", "youtube"] }
  ),

  createVariant(
    "social-layout-16",
    kind,
    "סושיאל מינימליסטי",
    "סקשן קצר, נקי ואלגנטי לרשתות חברתיות.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[820px] text-center">
        <p class="${pillClass}" data-editable-text="true">Follow us</p>

        <h2 class="${h2Class}" data-editable-text="true">
          עקבו אחרינו
        </h2>

        <p class="mx-auto mt-6 max-w-[620px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          נשמח לראות אתכם גם ברשתות החברתיות.
        </p>

        <div class="mt-9 flex justify-center">
          ${floatingSocialStack("light")}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "short"] }
  ),

  createVariant(
    "social-layout-17",
    kind,
    "סושיאל עם מדיה",
    "מבנה עם כפתורי סושיאל ואזור להוספת תמונה או וידאו.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${socialFeedPost(sectionImages.people, "פוסט לדוגמה", "תמונה או סרטון מהרשת החברתית.")}
          ${addMediaBox("הוספת תמונה / וידאו לרשתות")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">סושיאל עם מדיה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו פוסט, רילס, סרטון או תמונה מהרשתות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים להצגת תוכן מהרשתות, צילום מסך, פוסט, סרטון, סטורי או תמונת מוצר.
          </p>

          <div class="mt-8">
            ${fullSocialButtons("light")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "social-layout-18",
    kind,
    "CTA סושיאל וואו",
    "סקשן קצר, צבעוני וממיר שמוביל לרשתות החברתיות.",
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
              בואו לרשתות
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              עקבו, שלחו הודעה והישארו מעודכנים
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              כל הערוצים במקום אחד — אינסטגרם, פייסבוק, טיקטוק, יוטיוב ווואטסאפ.
            </p>
          </div>

          <div class="rounded-[34px] bg-white/12 p-6 backdrop-blur-2xl">
            <div class="grid gap-3 sm:grid-cols-2">
              ${socialButton("Instagram", "https://instagram.com", "IG", "glass")}
              ${socialButton("TikTok", "https://tiktok.com", "TT", "glass")}
              ${socialButton("YouTube", "https://youtube.com", "YT", "glass")}
              ${socialButton("WhatsApp", "https://wa.me/972500000000", "WA", "glass")}
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["cta", "wow", "conversion"] }
  ),
];