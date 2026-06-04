/*
  Bizuply Website Studio — Section Layout Variants
  Used by the inline toolbar command: ✨ מבנה
  Replace: studio/data/sectionLayoutVariants.ts
*/

import type { SectionKind, SectionLayoutVariant } from "../types";
export type { SectionKind, SectionLayoutVariant } from "../types";

const img = {
  beauty:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=90",
  hair:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1400&q=90",
  salon:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1400&q=90",
  clinic:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1400&q=90",
  store:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=90",
  product:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1400&q=90",
  office:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=90",
  people:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1400&q=90",
};

const sectionName: Record<SectionKind, string> = {
  header: "הידר",
  hero: "דף הבית",
  about: "אודות",
  services: "שירותים",
  gallery: "גלריה",
  store: "חנות",
  booking: "תיאום תורים",
  reviews: "ביקורות",
  contact: "יצירת קשר",
  club: "מועדון לקוחות",
  basic: "סקשן חופשי",
};

function variant(
  id: string,
  kind: SectionKind,
  title: string,
  description: string,
  previewLabel: string,
  badge: string,
  html: string
): SectionLayoutVariant {
  return {
    id,
    kind,
    title,
    description,
    previewLabel,
    badge,
    html,
  };
}

function imageBlock(src: string, height = "min-h-[420px]") {
  return `
    <div
      class="relative overflow-hidden rounded-[38px] bg-white p-3 shadow-[0_30px_100px_rgba(15,23,42,0.12)]"
      data-editable-image-card="true"
    >
      <img
        src="${src}"
        alt=""
        class="${height} h-full w-full rounded-[28px] object-cover"
        data-editable-image="true"
      />
    </div>
  `;
}

function addImageBox() {
  return `
    <div
      class="flex min-h-[320px] cursor-pointer items-center justify-center rounded-[38px] border-2 border-dashed border-[color:var(--biz-secondary,#F3E8FF)] bg-[var(--biz-secondary,#F3E8FF)]/80 p-10 text-center transition hover:bg-[var(--biz-secondary,#F3E8FF)]"
      data-image-drop-zone="true"
    >
      <div>
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl font-black text-[var(--biz-primary,#7C3AED)] shadow-xl">
          +
        </div>
        <p class="text-xl font-black text-slate-950">הוספת תמונה</p>
        <p class="mt-2 text-sm font-bold leading-6 text-slate-500">
          לחצי כאן להוספת תמונה נוספת לסקשן
        </p>
      </div>
    </div>
  `;
}

function primaryButton(text = "קביעת תור") {
  return `
    <a class="inline-flex min-h-[58px] items-center justify-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-white shadow-xl shadow-[color-mix(in_srgb,var(--biz-primary,#7C3AED)_25%,transparent)]">
      ${text}
    </a>
  `;
}

function secondaryButton(text = "מידע נוסף") {
  return `
    <a class="inline-flex min-h-[58px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-black text-slate-800 shadow-lg">
      ${text}
    </a>
  `;
}

function actions(primary = "קביעת תור", secondary = "צור קשר") {
  return `
    <div class="mt-9 flex flex-wrap gap-4">
      ${primaryButton(primary)}
      ${secondaryButton(secondary)}
    </div>
  `;
}

function sectionShell(kind: SectionKind, inner: string, extra = "") {
  return `
<section
  class="relative mx-auto w-full max-w-[1240px] px-8 py-24 ${extra}"
  data-section-kind="${kind}"
>
  ${inner}
</section>
`;
}

function bgSection(kind: SectionKind, src: string, inner: string) {
  return `
<section
  class="relative mx-auto my-10 min-h-[680px] w-full max-w-[1320px] overflow-hidden rounded-[54px] bg-slate-950 bg-cover bg-center px-10 py-24 shadow-[0_44px_150px_rgba(15,23,42,0.24)]"
  style="background-image:linear-gradient(135deg,rgba(2,6,23,.66),rgba(2,6,23,.24)),url('${src}')"
  data-section-kind="${kind}"
  data-background-editable="true"
>
  ${inner}
</section>
`;
}

function sectionTitle(
  kind: SectionKind,
  title = `${sectionName[kind]} מקצועי לעסק`,
  text = "חוויה נקייה, ברורה ומרשימה שמציגה את העסק בצורה מקצועית ומובילה לפניות."
) {
  return `
    <div class="mx-auto max-w-[840px] text-center">
      <p class="mb-4 inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">
        ${sectionName[kind]}
      </p>
      <h2 class="text-5xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950">
        ${title}
      </h2>
      <p class="mt-5 text-lg font-bold leading-9 text-slate-500">
        ${text}
      </p>
    </div>
  `;
}

function featureCard(title: string, text: string, icon = "✦") {
  return `
    <article class="rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      <div class="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-white">
        ${icon}
      </div>
      <h3 class="text-2xl font-black text-slate-950">${title}</h3>
      <p class="mt-3 text-sm font-bold leading-7 text-slate-500">${text}</p>
    </article>
  `;
}


/* =====================================================
   HEADER — 10 מבנים אמיתיים
===================================================== */

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
}: {
  dark?: boolean;
  round?: string;
} = {}) {
  return `
    <div class="flex items-center gap-3">
      <div class="grid h-12 w-12 place-items-center ${round} bg-gradient-to-br from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-white shadow-xl">
        B
      </div>

      <div>
        <p class="m-0 text-base font-black leading-5 ${dark ? "text-white" : "text-slate-950"}">שם העסק</p>
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
>
  ${logoBlock({ round: "rounded-lg" })}

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
>
  <div class="mx-auto flex max-w-[1240px] items-center justify-between gap-5 rounded-[32px] border border-white/70 bg-gradient-to-l from-white/92 to-[var(--biz-secondary,#F3E8FF)]/88 px-5 py-4 shadow-[0_24px_90px_rgba(15,23,42,0.09)] backdrop-blur-2xl">
    ${logoBlock()}
    ${navLinks()}
    <div class="flex items-center gap-2">${headerCta("לתיאום")}${headerMobileButton()}</div>
  </div>
</header>
    `,
  ];

  return layouts[index];
}


/* =====================================================
   HERO — 10 מבנים אמיתיים
===================================================== */

function heroLayout(index: number) {
  const layouts = [
    sectionShell(
      "hero",
      `
      <div class="grid items-center gap-14 lg:grid-cols-2">
        <div class="rounded-[46px] border border-white bg-white/95 p-14 shadow-[0_36px_120px_rgba(15,23,42,0.12)] backdrop-blur-2xl">
          <p class="mb-4 inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">עסק פרימיום</p>
          <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">העסק שלך מוצג בצורה מקצועית ומרשימה</h1>
          <p class="mt-6 text-xl font-bold leading-10 text-slate-500">תוכן ברור, תמונות איכותיות וכפתורי פעולה שמובילים לפניות.</p>
          ${actions("קביעת תור", "שליחת הודעה")}
        </div>
        ${imageBlock(img.beauty)}
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="grid items-center gap-14 lg:grid-cols-2">
        ${imageBlock(img.hair)}
        <div class="rounded-[46px] border border-white bg-white/95 p-14 shadow-[0_36px_120px_rgba(15,23,42,0.12)]">
          <p class="mb-4 inline-flex rounded-full bg-fuchsia-50 px-5 py-2 text-sm font-black text-fuchsia-700">שירות אישי</p>
          <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">עמוד עסקי שמרגיש כמו מותג גדול</h1>
          <p class="mt-6 text-xl font-bold leading-10 text-slate-500">חוויה נקייה וברורה מהרגע הראשון ועד יצירת הקשר.</p>
          ${actions("לתיאום פגישה", "לגלריה")}
        </div>
      </div>
      `
    ),

    bgSection(
      "hero",
      img.salon,
      `
      <div class="max-w-[850px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">תמונת רקע מלאה</p>
        <h1 class="text-7xl font-black leading-[0.95] tracking-[-0.06em] text-white">העסק שלך מוצג כמו מותג פרימיום</h1>
        <p class="mt-6 text-xl font-bold leading-10 text-white/85">תצוגת פתיחה מרשימה עם תמונת אווירה, מסר ברור וכפתורי פעולה.</p>
        ${actions("קביעת תור", "צור קשר")}
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="mx-auto max-w-[1020px] rounded-[52px] border border-slate-200 bg-white p-16 text-center shadow-[0_36px_120px_rgba(15,23,42,0.10)]">
        <p class="mx-auto mb-4 inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">עסק מקצועי</p>
        <h1 class="text-7xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">כותרת חזקה במרכז</h1>
        <p class="mx-auto mt-6 max-w-[720px] text-xl font-bold leading-10 text-slate-500">מבנה נקי בלי תמונה, מתאים למסר חד וברור.</p>
        <div class="flex justify-center">${actions("אני רוצה להתחיל", "מידע נוסף")}</div>
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="mb-4 inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">גלריה בראש העמוד</p>
          <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">הצגה ויזואלית חזקה לעסק</h1>
          <p class="mt-6 text-xl font-bold leading-10 text-slate-500">שתי תמונות שמציגות אווירה, תהליך ותוצאה.</p>
          ${actions("קביעת תור", "צפייה בעבודות")}
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(img.beauty, "min-h-[360px]")}
          ${imageBlock(img.hair, "min-h-[360px]")}
        </div>
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="rounded-[52px] bg-slate-950 p-12 shadow-[0_44px_150px_rgba(15,23,42,0.25)]">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white">Premium</p>
            <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-white">מותג שנראה יוקרתי כבר בכניסה</h1>
            <p class="mt-6 text-xl font-bold leading-10 text-white/70">מבנה כהה, דרמטי ומרשים לעסקים שרוצים להיראות יוקרתיים.</p>
            ${actions("לתיאום", "לפרטים")}
          </div>
          ${imageBlock(img.clinic)}
        </div>
      </div>
      `
    ),

    bgSection(
      "hero",
      img.beauty,
      `
      <div class="grid min-h-[520px] place-items-center text-center">
        <div>
          <p class="mx-auto mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">מדיה / וידאו</p>
          <h1 class="text-7xl font-black leading-[0.95] tracking-[-0.06em] text-white">חוויה ויזואלית מלאה</h1>
          <p class="mx-auto mt-6 max-w-[740px] text-xl font-bold leading-10 text-white/85">מבנה שמתאים לוידאו, תמונת אווירה או סליידר.</p>
          <div class="flex justify-center">${actions("צפייה", "יצירת קשר")}</div>
        </div>
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(img.salon, "min-h-[360px]")}
          ${addImageBox()}
        </div>
        <div>
          <p class="mb-4 inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">תמונות נוספות</p>
          <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">מבנה עם מקום להוספת תמונה</h1>
          <p class="mt-6 text-xl font-bold leading-10 text-slate-500">מתאים לעסק שרוצה להציג כמה תמונות כבר בחלק העליון.</p>
          ${actions("הזמנת שירות", "צור קשר")}
        </div>
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="rounded-[52px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] p-16 text-white shadow-[0_44px_150px_rgba(139,92,246,0.28)]">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white">שירות מוביל</p>
            <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em]">שירות מרכזי שמוביל לפנייה</h1>
            <p class="mt-6 text-xl font-bold leading-10 text-white/80">מתאים להצגת שירות אחד חזק עם מחיר וכפתור פעולה.</p>
            <div class="mt-9 flex flex-wrap items-center gap-4">
              <a class="rounded-2xl bg-white px-8 py-4 text-sm font-black text-[var(--biz-primary,#7C3AED)]">קביעת תור</a>
              <span class="rounded-full bg-white/20 px-5 py-3 text-sm font-black text-white">החל מ־₪350</span>
            </div>
          </div>
          ${imageBlock(img.product)}
        </div>
      </div>
      `
    ),

    sectionShell(
      "hero",
      `
      <div class="grid items-stretch gap-8 lg:grid-cols-3">
        <div class="rounded-[46px] bg-white p-14 shadow-[0_32px_110px_rgba(15,23,42,0.10)] lg:col-span-2">
          <p class="mb-4 inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">פרטים מהירים</p>
          <h1 class="text-6xl font-black leading-[0.95] tracking-[-0.06em] text-slate-950">עמוד פתיחה עם כרטיס צד</h1>
          <p class="mt-6 text-xl font-bold leading-10 text-slate-500">מושלם להצגת תועלת מרכזית לצד מחיר, שעות או הטבה.</p>
          ${actions("קביעת תור", "הטבות")}
        </div>
        <div class="rounded-[46px] bg-slate-950 p-8 text-white">
          <p class="text-sm font-black text-white/60">הטבת החודש</p>
          <h3 class="mt-4 text-4xl font-black">VIP</h3>
          <p class="mt-5 text-white/70">10% הנחה ללקוחות מועדון.</p>
        </div>
      </div>
      `
    ),
  ];

  return layouts[index];
}

/* =====================================================
   GENERIC — 10 מבנים לכל סקשן
===================================================== */

function genericLayout(kind: SectionKind, index: number) {
  const name = sectionName[kind];

  const layouts = [
    sectionShell(
      kind,
      sectionTitle(
        kind,
        `${name} לעסק שלך`,
        "מידע מסודר וברור שמציג את הערך של העסק בצורה מקצועית."
      )
    ),

    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div>
          ${sectionTitle(kind, `${name} עם תמונה`, "שילוב של טקסט ותמונה ליצירת אמון והבנה מהירה.")}
          ${actions("לפרטים", "יצירת קשר")}
        </div>
        ${imageBlock(img.salon)}
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        ${imageBlock(img.beauty)}
        <div>
          ${sectionTitle(kind, `${name} במבנה הפוך`, "תמונה בצד אחד ותוכן בצד השני, מתאים להצגת אווירה או מוצר.")}
          ${actions("המשך", "צור קשר")}
        </div>
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      ${sectionTitle(kind, `${name} בכרטיסים`, "מבנה שמציג מידע קצר וברור בכמה כרטיסיות.")}
      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${featureCard(`${name} ראשון`, "תיאור קצר ומקצועי שמציג יתרון או שירות.", "1")}
        ${featureCard(`${name} שני`, "תיאור קצר ומקצועי שמציג יתרון או שירות.", "2")}
        ${featureCard(`${name} שלישי`, "תיאור קצר ומקצועי שמציג יתרון או שירות.", "3")}
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      <div class="grid items-center gap-8 lg:grid-cols-2">
        <div>
          ${sectionTitle(kind, `${name} עם שתי תמונות`, "מבנה שמציג גם תוכן וגם גלריית תמונות קטנה.")}
        </div>
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(img.beauty, "min-h-[320px]")}
          ${imageBlock(img.hair, "min-h-[320px]")}
        </div>
      </div>
      `
    ),

    bgSection(
      kind,
      img.salon,
      `
      <div class="max-w-[780px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">${name}</p>
        <h2 class="text-6xl font-black leading-[1] tracking-[-0.05em] text-white">${name} עם תמונת רקע</h2>
        <p class="mt-6 text-xl font-bold leading-10 text-white/85">מבנה אווירה עם תמונה גדולה ברקע וטקסט ברור מעל.</p>
        ${actions("לפרטים", "צור קשר")}
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      <div class="rounded-[52px] bg-slate-950 p-14 text-white shadow-[0_44px_150px_rgba(15,23,42,0.24)]">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white">${name}</p>
            <h2 class="text-5xl font-black leading-[1.05] tracking-[-0.04em]">${name} בעיצוב כהה</h2>
            <p class="mt-5 text-lg font-bold leading-9 text-white/70">מבנה יוקרתי ומודגש שמתאים להצגת מידע חשוב.</p>
          </div>
          ${imageBlock(img.clinic)}
        </div>
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      ${sectionTitle(kind, `${name} בקרוסלה`, "מבנה נגלל שמתאים לכרטיסים, מוצרים, ביקורות או תמונות.")}
      <div class="mt-12 flex gap-6 overflow-x-auto pb-5">
        <div class="min-w-[340px]">${featureCard(`${name} 1`, "תיאור קצר.", "✦")}</div>
        <div class="min-w-[340px]">${featureCard(`${name} 2`, "תיאור קצר.", "✦")}</div>
        <div class="min-w-[340px]">${featureCard(`${name} 3`, "תיאור קצר.", "✦")}</div>
        <div class="min-w-[340px]">${featureCard(`${name} 4`, "תיאור קצר.", "✦")}</div>
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      <div class="rounded-[52px] bg-gradient-to-br from-violet-50 to-white p-14 shadow-[0_30px_110px_rgba(15,23,42,0.08)]">
        ${sectionTitle(kind, `${name} עם אזור תמונה`, "מבנה עם מקום ברור להוספת תמונה חדשה.")}
        <div class="mt-10">${addImageBox()}</div>
      </div>
      `
    ),

    sectionShell(
      kind,
      `
      <div class="grid gap-7 lg:grid-cols-2">
        <div class="rounded-[44px] bg-white p-10 shadow-[0_30px_100px_rgba(15,23,42,0.09)]">
          <p class="mb-4 inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">${name}</p>
          <h2 class="text-5xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950">תוכן מרכזי</h2>
          <p class="mt-5 text-lg font-bold leading-9 text-slate-500">מבנה שני טורים שמאפשר להציג מידע מרכזי לצד כרטיס פעולה.</p>
        </div>
        <div class="rounded-[44px] bg-slate-950 p-10 text-white">
          <h3 class="text-3xl font-black">כרטיס פעולה</h3>
          <p class="mt-4 text-white/70">כאן אפשר להציג מחיר, שעות, קופון, טופס או קריאה לפעולה.</p>
          ${actions("פעולה", "פרטים")}
        </div>
      </div>
      `
    ),
  ];

  return layouts[index];
}

/* =====================================================
   STORE
===================================================== */

function productCard(title: string, price: string, src: string) {
  return `
    <article class="rounded-[36px] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
      ${imageBlock(src, "min-h-[260px]")}
      <h3 class="mt-6 text-2xl font-black text-slate-950">${title}</h3>
      <p class="mt-2 text-sm font-bold leading-7 text-slate-500">תיאור קצר של המוצר, יתרון מרכזי ולמה כדאי לרכוש.</p>
      <div class="mt-6 flex items-center justify-between gap-3">
        <a class="rounded-2xl bg-[var(--biz-primary,#7C3AED)] px-5 py-3 text-xs font-black text-white">הוספה לסל</a>
        <span class="rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">${price}</span>
      </div>
    </article>
  `;
}

function storeLayout(index: number) {
  const custom = [
    sectionShell(
      "store",
      `
      ${sectionTitle("store", "מוצרים לרכישה", "מוצרים נבחרים מהעסק, עם מחיר וכפתור רכישה.")}
      <div class="mt-12 grid gap-6 md:grid-cols-3" data-bizuply-block="products">
        ${productCard("מוצר ראשון", "₪129", img.product)}
        ${productCard("מוצר שני", "₪99", img.store)}
        ${productCard("מוצר שלישי", "₪249", img.hair)}
      </div>
      `
    ),

    sectionShell(
      "store",
      `
      <div class="grid items-center gap-12 lg:grid-cols-2" data-bizuply-block="products">
        ${imageBlock(img.product)}
        <div>
          <p class="mb-4 inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]">מוצר מוביל</p>
          <h2 class="text-5xl font-black leading-[1.05] tracking-[-0.04em] text-slate-950">מוצר פרימיום לעסק</h2>
          <p class="mt-5 text-lg font-bold leading-9 text-slate-500">הצגת מוצר אחד בצורה בולטת עם מחיר, תיאור וכפתור רכישה.</p>
          <div class="mt-8 flex items-center gap-4">
            <a class="rounded-2xl bg-[var(--biz-primary,#7C3AED)] px-8 py-4 text-sm font-black text-white">הוספה לסל</a>
            <span class="rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-3 text-sm font-black text-[var(--biz-primary,#7C3AED)]">₪249</span>
          </div>
        </div>
      </div>
      `
    ),
  ];

  return custom[index] || genericLayout("store", index);
}

/* =====================================================
   BOOKING
===================================================== */

function bookingTimes() {
  return ["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"]
    .map(
      (time) =>
        `<button class="rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] px-5 py-4 text-sm font-black text-[var(--biz-primary,#7C3AED)] transition hover:bg-[var(--biz-primary,#7C3AED)] hover:text-white">${time}</button>`
    )
    .join("");
}

function bookingLayout(index: number) {
  const custom = [
    sectionShell(
      "booking",
      `
      ${sectionTitle("booking", "בחרו שעה פנויה", "הלקוחות יכולים לבחור שירות, תאריך ושעה פנויה ישירות מהאתר.")}
      <div class="mx-auto mt-12 max-w-[860px] rounded-[40px] bg-white p-8 shadow-[0_28px_100px_rgba(15,23,42,0.10)]" data-bizuply-block="booking">
        <div class="grid gap-4 sm:grid-cols-3">
          ${bookingTimes()}
        </div>
      </div>
      `
    ),

    sectionShell(
      "booking",
      `
      <div class="rounded-[52px] bg-slate-950 p-14 text-white" data-bizuply-block="booking">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white">מחובר ליומן</p>
            <h2 class="text-5xl font-black leading-[1.05] tracking-[-0.04em]">קובעים תור אונליין</h2>
            <p class="mt-5 text-lg font-bold leading-9 text-white/70">בחירת שירות, תאריך ושעה פנויה בצורה פשוטה ומהירה.</p>
          </div>
          <div class="rounded-[36px] bg-white p-7">
            <div class="grid gap-4 sm:grid-cols-2">
              ${bookingTimes()}
            </div>
          </div>
        </div>
      </div>
      `
    ),
  ];

  return custom[index] || genericLayout("booking", index);
}

/* =====================================================
   EXPORT
===================================================== */

const kinds: SectionKind[] = [
  "header",
  "hero",
  "about",
  "services",
  "gallery",
  "store",
  "booking",
  "reviews",
  "contact",
  "club",
  "basic",
];

const titles: Record<SectionKind, string[]> = {
  header: [
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
  ],
  hero: [
    "טקסט + תמונה",
    "תמונה + טקסט",
    "תמונת רקע מלאה",
    "ממורכז נקי",
    "שתי תמונות",
    "כהה יוקרתי",
    "וידאו / מדיה",
    "הוספת תמונה",
    "מוצר / שירות",
    "כרטיס צד",
  ],
  about: [
    "אודות ממורכז",
    "אודות עם תמונה",
    "תמונה + טקסט",
    "3 כרטיסים",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך + תמונה",
    "שני טורים",
  ],
  services: [
    "שירותים ממורכז",
    "שירותים עם תמונה",
    "תמונה + שירותים",
    "3 כרטיסים",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "שני טורים",
  ],
  gallery: [
    "גלריה ממורכזת",
    "גלריה עם תמונה",
    "תמונה + גלריה",
    "גריד",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "Featured",
  ],
  store: [
    "גריד מוצרים",
    "מוצר מרכזי",
    "חנות עם תמונה",
    "3 מוצרים",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "מבצע",
  ],
  booking: [
    "שעות פנויות",
    "יומן כהה",
    "תורים עם תמונה",
    "כרטיסי תורים",
    "2 אזורים",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "טופס תור",
  ],
  reviews: [
    "ביקורות ממורכז",
    "ביקורות עם תמונה",
    "תמונה + ביקורות",
    "3 ביקורות",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "שני טורים",
  ],
  contact: [
    "טופס מרכזי",
    "טופס עם תמונה",
    "תמונה + טופס",
    "כרטיסי קשר",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "טופס רחב",
  ],
  club: [
    "מועדון ממורכז",
    "מועדון עם תמונה",
    "תמונה + מועדון",
    "הטבות",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "קופון",
  ],
  basic: [
    "בסיסי ממורכז",
    "בסיסי עם תמונה",
    "תמונה + טקסט",
    "כרטיסים",
    "2 תמונות",
    "תמונה כרקע",
    "כהה",
    "קרוסלה",
    "רקע רך",
    "שני טורים",
  ],
};

export const sectionLayoutVariants: SectionLayoutVariant[] = kinds.flatMap(
  (kind) =>
    Array.from({ length: 10 }, (_, index) => {
      const html =
        kind === "header"
          ? headerLayout(index)
          : kind === "hero"
            ? heroLayout(index)
            : kind === "store"
            ? storeLayout(index)
            : kind === "booking"
              ? bookingLayout(index)
              : genericLayout(kind, index);

      return variant(
        `${kind}-layout-${index + 1}`,
        kind,
        titles[kind][index],
        `מבנה ${index + 1} מתוך 10 עבור ${sectionName[kind]}`,
        titles[kind][index],
        index === 0
          ? "מומלץ"
          : index === 5
            ? "רקע"
            : index === 7
              ? "קרוסלה"
              : index === 8
                ? "תמונה"
                : "מבנה",
        html
      );
    })
);

export function getSectionLayoutVariants(kind: SectionKind) {
  return sectionLayoutVariants.filter((variant) => variant.kind === kind);
}