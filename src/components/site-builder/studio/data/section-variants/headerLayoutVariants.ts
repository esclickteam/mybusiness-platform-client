import type { SectionLayoutVariant } from "../../types";

/*
  Bizuply Website Studio — Header Layout Variants
  Path: studio/data/section-variants/headerLayoutVariants.ts

  קובץ נפרד רק למבני Header.
  כל מבנה מחזיר <header data-section-kind="header"> כדי ש־GrapesJS יזהה אותו.
  חשוב: בגלל שהקובץ נמצא בתוך data/section-variants, הייבוא ל-types הוא "../../types".
*/

function variant(
  id: string,
  title: string,
  description: string,
  previewLabel: string,
  badge: string,
  html: string
): SectionLayoutVariant {
  return {
    id,
    kind: "header",
    title,
    description,
    previewLabel,
    badge,
    html,
  };
}

function navLinks(light = false) {
  const base = light
    ? "text-white/80 hover:bg-white/15 hover:text-white"
    : "text-slate-500 hover:bg-[var(--biz-secondary,#F3E8FF)] hover:text-[var(--biz-primary,#7C3AED)]";

  return `
    <nav class="hidden items-center gap-2 lg:flex">
      <a class="rounded-full px-4 py-2 text-sm font-black transition ${base}">דף הבית</a>
      <a class="rounded-full px-4 py-2 text-sm font-black transition ${base}">אודות</a>
      <a class="rounded-full px-4 py-2 text-sm font-black transition ${base}">שירותים</a>
      <a class="rounded-full px-4 py-2 text-sm font-black transition ${base}">גלריה</a>
      <a class="rounded-full px-4 py-2 text-sm font-black transition ${base}">צור קשר</a>
    </nav>
  `;
}

function logoBlock({
  dark = false,
  round = "rounded-2xl",
  compact = false,
}: {
  dark?: boolean;
  round?: string;
  compact?: boolean;
} = {}) {
  return `
    <div class="flex items-center gap-3">
      <div class="grid ${compact ? "h-10 w-10" : "h-12 w-12"} place-items-center ${round} bg-gradient-to-br from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-white shadow-xl">
        B
      </div>

      <div>
        <p class="m-0 ${compact ? "text-sm" : "text-base"} font-black leading-5 ${dark ? "text-white" : "text-slate-950"}">שם העסק</p>
        <p class="m-0 mt-1 text-xs font-bold leading-4 ${dark ? "text-white/60" : "text-slate-400"}">תחום העסק</p>
      </div>
    </div>
  `;
}

function headerCta(text = "צור קשר", light = false) {
  return `
    <a class="inline-flex min-h-11 items-center justify-center rounded-2xl ${
      light
        ? "bg-white px-5 text-sm font-black text-slate-950 shadow-xl"
        : "bg-slate-950 px-5 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5 hover:bg-[var(--biz-primary,#7C3AED)]"
    }">
      ${text}
    </a>
  `;
}

function headerMobileButton(light = false) {
  return `
    <button class="grid h-11 w-11 place-items-center rounded-2xl ${
      light
        ? "border border-white/20 bg-white/10 text-xl font-black text-white"
        : "border border-slate-200 bg-white text-xl font-black text-slate-700"
    } lg:hidden">
      ☰
    </button>
  `;
}

function headerLayout(index: number) {
  const layouts = [
    `
<header
  class="sticky top-0 z-40 mx-auto mt-4 flex w-[min(1240px,calc(100%-32px))] items-center justify-between gap-5 rounded-[28px] border border-white/70 bg-white/90 px-5 py-4 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl"
  data-section-kind="header"
  data-header-style="floating-rounded"
>
  ${logoBlock()}
  ${navLinks()}
  <div class="flex items-center gap-2">${headerCta("קביעת תור")}${headerMobileButton()}</div>
</header>
    `,

    `
<header
  class="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 px-8 py-4 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-2xl"
  data-section-kind="header"
  data-header-style="top-rectangle"
>
  <div class="mx-auto flex max-w-[1280px] items-center justify-between gap-5">
    ${logoBlock({ round: "rounded-xl" })}
    ${navLinks()}
    <div class="flex items-center gap-2">${headerCta("דברו איתנו")}${headerMobileButton()}</div>
  </div>
</header>
    `,

    `
<header
  class="sticky top-5 z-40 mx-auto flex w-[min(1180px,calc(100%-40px))] items-center justify-between gap-5 rounded-full border border-white/80 bg-white/80 px-5 py-3 shadow-[0_24px_90px_rgba(15,23,42,0.10)] backdrop-blur-2xl"
  data-section-kind="header"
  data-header-style="floating-pill"
>
  ${logoBlock({ round: "rounded-full" })}
  ${navLinks()}
  <div class="flex items-center gap-2">${headerCta("התחלה")}${headerMobileButton()}</div>
</header>
    `,

    `
<header
  class="absolute left-1/2 top-6 z-40 flex w-[min(1240px,calc(100%-40px))] -translate-x-1/2 items-center justify-between gap-5 rounded-[30px] border border-white/25 bg-white/12 px-5 py-4 text-white shadow-[0_24px_90px_rgba(15,23,42,0.20)] backdrop-blur-2xl"
  data-section-kind="header"
  data-header-style="transparent-over-hero"
>
  ${logoBlock({ dark: true })}
  ${navLinks(true)}
  <div class="flex items-center gap-2">${headerCta("קביעת תור", true)}${headerMobileButton(true)}</div>
</header>
    `,

    `
<header
  class="sticky top-0 z-40 bg-slate-950 px-8 py-4 text-white shadow-[0_20px_80px_rgba(15,23,42,0.22)]"
  data-section-kind="header"
  data-header-style="dark-premium"
>
  <div class="mx-auto flex max-w-[1280px] items-center justify-between gap-5">
    ${logoBlock({ dark: true })}
    ${navLinks(true)}
    <div class="flex items-center gap-2">${headerCta("צור קשר", true)}${headerMobileButton(true)}</div>
  </div>
</header>
    `,

    `
<header
  class="sticky top-4 z-40 mx-auto grid w-[min(1180px,calc(100%-36px))] gap-4 rounded-[34px] border border-slate-200 bg-white p-4 shadow-[0_24px_90px_rgba(15,23,42,0.10)]"
  data-section-kind="header"
  data-header-style="two-rows"
>
  <div class="flex items-center justify-between gap-5">
    ${logoBlock()}
    <div class="flex items-center gap-2">${headerCta("קביעת תור")}${headerMobileButton()}</div>
  </div>
  <div class="hidden border-t border-slate-100 pt-3 lg:block">${navLinks()}</div>
</header>
    `,

    `
<header
  class="sticky top-0 z-40 border-b border-slate-200 bg-white px-8 py-3"
  data-section-kind="header"
  data-header-style="announcement-bar"
>
  <div class="mx-auto mb-3 flex max-w-[1280px] items-center justify-between gap-5 rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2">
    <p class="m-0 text-xs font-black text-[var(--biz-primary,#7C3AED)]">מבצע החודש · קביעת תור אונליין</p>
    <p class="m-0 text-xs font-black text-slate-500">050-0000000</p>
  </div>

  <div class="mx-auto flex max-w-[1280px] items-center justify-between gap-5">
    ${logoBlock({ round: "rounded-xl" })}
    ${navLinks()}
    <div class="flex items-center gap-2">${headerCta("צור קשר")}${headerMobileButton()}</div>
  </div>
</header>
    `,

    `
<header
  class="sticky top-0 z-40 mx-auto flex w-full items-center justify-between gap-5 border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-2xl"
  data-section-kind="header"
  data-header-style="full-width"
>
  <div class="flex items-center gap-8">
    ${logoBlock({ round: "rounded-xl" })}
    ${navLinks()}
  </div>

  <div class="flex items-center gap-2">
    <a class="hidden text-sm font-black text-slate-500 md:inline-flex">050-0000000</a>
    ${headerCta("קביעת תור")}
    ${headerMobileButton()}
  </div>
</header>
    `,

    `
<header
  class="sticky top-6 z-40 mx-auto flex w-[min(1120px,calc(100%-44px))] items-center justify-between gap-5 rounded-[24px] border border-slate-200 bg-white px-4 py-3 shadow-[0_16px_55px_rgba(15,23,42,0.08)]"
  data-section-kind="header"
  data-header-style="compact-minimal"
>
  ${logoBlock({ round: "rounded-lg", compact: true })}

  <div class="hidden rounded-2xl bg-slate-50 p-1 lg:flex">
    <a class="rounded-xl px-4 py-2 text-sm font-black text-slate-700 hover:bg-white hover:text-[var(--biz-primary,#7C3AED)]">בית</a>
    <a class="rounded-xl px-4 py-2 text-sm font-black text-slate-700 hover:bg-white hover:text-[var(--biz-primary,#7C3AED)]">שירותים</a>
    <a class="rounded-xl px-4 py-2 text-sm font-black text-slate-700 hover:bg-white hover:text-[var(--biz-primary,#7C3AED)]">גלריה</a>
    <a class="rounded-xl px-4 py-2 text-sm font-black text-slate-700 hover:bg-white hover:text-[var(--biz-primary,#7C3AED)]">צור קשר</a>
  </div>

  <div class="flex items-center gap-2">${headerCta("התחלה")}${headerMobileButton()}</div>
</header>
    `,

    `
<header
  class="sticky top-0 z-40 bg-transparent px-6 py-5"
  data-section-kind="header"
  data-header-style="soft-gradient"
>
  <div class="mx-auto flex max-w-[1240px] items-center justify-between gap-5 rounded-[32px] border border-white/70 bg-gradient-to-l from-white/92 to-[var(--biz-secondary,#F3E8FF)]/88 px-5 py-4 shadow-[0_24px_90px_rgba(15,23,42,0.09)] backdrop-blur-2xl">
    ${logoBlock()}
    ${navLinks()}
    <div class="flex items-center gap-2">${headerCta("לתיאום")}${headerMobileButton()}</div>
  </div>
</header>
    `,
  ];

  return layouts[index] || layouts[0];
}

const headerTitles = [
  "מעוגל צף",
  "מלבני עליון",
  "קפסולה צפה",
  "שקוף מעל תמונה",
  "כהה פרימיום",
  "שתי שורות",
  "בר עליון + הידר",
  "מלא ורחב",
  "מינימל קומפקטי",
  "Gradient רך",
];

const headerDescriptions = [
  "Header צף, מעוגל, מודרני ומתאים לאתרי פרימיום.",
  "Header מלבני עליון, נקי וברור כמו מערכת מקצועית.",
  "Header קפסולה צפה, רך, יוקרתי ומתאים לעמודי תדמית.",
  "Header שקוף מעל Hero או תמונת רקע.",
  "Header כהה, יוקרתי, דרמטי וחזק.",
  "Header עם שתי שורות: לוגו וכפתור למעלה, ניווט למטה.",
  "Header עם בר הודעה עליון למבצע, טלפון או עדכון.",
  "Header רחב לכל המסך עם ניווט וטלפון.",
  "Header מינימליסטי, קומפקטי וברור.",
  "Header עם גרדיאנט רך לפי צבעי המותג.",
];

const headerBadges = [
  "מומלץ",
  "מבנה",
  "מבנה",
  "שקוף",
  "כהה",
  "מבנה",
  "מבנה",
  "מבנה",
  "מבנה",
  "מבנה",
];

export const headerLayoutVariants: SectionLayoutVariant[] = Array.from(
  { length: 10 },
  (_, index) =>
    variant(
      `header-layout-${index + 1}`,
      headerTitles[index],
      headerDescriptions[index],
      headerTitles[index],
      headerBadges[index],
      headerLayout(index)
    )
);
