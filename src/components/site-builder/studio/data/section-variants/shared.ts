import type { SectionKind, SectionLayoutVariant } from "../../types";

/*
  Bizuply Website Studio — Shared Section Variant Helpers
  Path: src/components/site-builder/studio/data/section-variants/shared.ts

  קובץ בסיס משותף לכל קבצי התבניות:
  - כפתורים
  - תמונות
  - כרטיסים
  - כותרות
  - טפסים
  - Layout shell
  - פונקציית יצירת variant
*/

export const sectionImages = {
  beauty:
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1600&q=90",
  hair:
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1600&q=90",
  salon:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1600&q=90",
  clinic:
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=90",
  store:
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=90",
  product:
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1600&q=90",
  office:
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=90",
  people:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=90",
  food:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=90",
  fitness:
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=90",
  course:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=90",
  event:
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1600&q=90",
  restaurant:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=90",
  realEstate:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=90",
  darkOffice:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=90",
  social:
    "https://images.unsplash.com/photo-1611162616475-46b635cb6868?auto=format&fit=crop&w=1600&q=90",
};

export const sectionKindLabels: Record<SectionKind, string> = {
  header: "הידר",
  hero: "דף הבית",
  welcome: "Welcome",
  about: "אודות",
  team: "צוות",
  services: "שירותים",
  gallery: "גלריה",
  contact: "יצירת קשר",
  promotion: "מבצע",
  subscribe: "הרשמה",
  testimonials: "המלצות",
  reviews: "ביקורות",
  clients: "לקוחות",
  store: "חנות",
  booking: "תיאום תורים",
  bookings: "תיאום תורים",
  events: "אירועים",
  club: "מועדון לקוחות",
  bot: "בוט חכם",
  social: "רשתות חברתיות",
  course: "קורס דיגיטלי",
  miniSaas: "Mini SaaS",
  basic: "בסיסי",
  text: "טקסט",
  list: "רשימה",
  form: "טופס",
  forms: "טפסים",
  savedSections: "סקשנים שמורים",
};

export const baseSectionClass =
  "relative mx-auto w-full max-w-[1240px] px-6 py-20 sm:px-8 lg:px-10";

export const wideSectionClass =
  "relative mx-auto w-full max-w-[1380px] px-6 py-20 sm:px-8 lg:px-10";

export const fullSectionClass =
  "relative w-full px-6 py-20 sm:px-8 lg:px-10";

export const cardClass =
  "rounded-[34px] border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]";

export const softCardClass =
  "rounded-[38px] border border-white bg-white/86 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur-2xl";

export const darkCardClass =
  "rounded-[38px] border border-white/10 bg-slate-950 p-8 text-white shadow-[0_34px_120px_rgba(15,23,42,0.24)]";

export const titleClass =
  "text-4xl font-black leading-[1.04] tracking-[-0.05em] text-slate-950 md:text-6xl";

export const h2Class =
  "text-3xl font-black leading-[1.06] tracking-[-0.045em] text-slate-950 md:text-5xl";

export const textClass =
  "mt-5 max-w-3xl text-base font-bold leading-8 text-slate-500 md:text-lg";

export const pillClass =
  "mb-4 inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-xs font-black text-[var(--biz-primary,#7C3AED)]";

export function createVariant(
  id: string,
  kind: SectionKind,
  title: string,
  description: string,
  badge: string,
  html: string,
  options: Partial<SectionLayoutVariant> = {}
): SectionLayoutVariant {
  return {
    id,
    kind,
    title,
    description,
    previewLabel: options.previewLabel || title,
    badge,
    html,
    previewImage: options.previewImage,
    tags: options.tags,
    direction: options.direction,
    featured: options.featured,
  };
}

export function sectionShell(
  kind: SectionKind,
  inner: string,
  extraClass = ""
) {
  return `
<section
  class="${baseSectionClass} ${extraClass}"
  data-section-kind="${kind}"
  data-bizuply-editable-section="true"
>
  ${inner}
</section>
`;
}

export function wideSectionShell(
  kind: SectionKind,
  inner: string,
  extraClass = ""
) {
  return `
<section
  class="${wideSectionClass} ${extraClass}"
  data-section-kind="${kind}"
  data-bizuply-editable-section="true"
>
  ${inner}
</section>
`;
}

export function fullSectionShell(
  kind: SectionKind,
  inner: string,
  extraClass = ""
) {
  return `
<section
  class="${fullSectionClass} ${extraClass}"
  data-section-kind="${kind}"
  data-bizuply-editable-section="true"
>
  ${inner}
</section>
`;
}

export function backgroundSection(
  kind: SectionKind,
  imageUrl: string,
  inner: string,
  extraClass = ""
) {
  return `
<section
  class="relative mx-auto my-10 min-h-[640px] w-full max-w-[1380px] overflow-hidden rounded-[54px] bg-slate-950 bg-cover bg-center px-8 py-24 shadow-[0_44px_150px_rgba(15,23,42,0.24)] sm:px-12 ${extraClass}"
  style="background-image:linear-gradient(135deg,rgba(2,6,23,.72),rgba(2,6,23,.22)),url('${imageUrl}')"
  data-section-kind="${kind}"
  data-background-editable="true"
  data-bizuply-editable-section="true"
>
  ${inner}
</section>
`;
}

export function sectionIntro(
  kind: SectionKind,
  title: string,
  text: string,
  align: "center" | "right" | "left" = "center"
) {
  const alignClass =
    align === "center"
      ? "mx-auto text-center"
      : align === "left"
        ? "text-left"
        : "text-right";

  return `
<div class="${alignClass} max-w-[880px]">
  <p class="${pillClass}" data-editable-text="true">${sectionKindLabels[kind]}</p>
  <h2 class="${h2Class}" data-editable-text="true">${title}</h2>
  <p class="${textClass} ${align === "center" ? "mx-auto" : ""}" data-editable-text="true">${text}</p>
</div>
`;
}

export function imageBlock(
  src: string,
  height = "min-h-[420px]",
  rounded = "rounded-[38px]"
) {
  return `
<div
  class="relative overflow-hidden ${rounded} bg-white p-3 shadow-[0_30px_100px_rgba(15,23,42,0.12)]"
  data-editable-image-card="true"
  data-media-replaceable="true"
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

export function imageGrid(
  images: string[],
  height = "min-h-[260px]",
  columns = "md:grid-cols-3"
) {
  return `
<div class="grid gap-5 ${columns}">
  ${images
    .map((src) => imageBlock(src, height, "rounded-[30px]"))
    .join("")}
</div>
`;
}

export function addMediaBox(text = "הוספת תמונה / וידאו") {
  return `
<div
  class="grid min-h-[320px] cursor-pointer place-items-center rounded-[38px] border-2 border-dashed border-[color:var(--biz-secondary,#F3E8FF)] bg-[var(--biz-secondary,#F3E8FF)]/70 p-8 text-center transition hover:bg-[var(--biz-secondary,#F3E8FF)]"
  data-image-drop-zone="true"
  data-media-drop-zone="true"
  data-media-replaceable="true"
>
  <div>
    <div class="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-white text-3xl font-black text-[var(--biz-primary,#7C3AED)] shadow-xl">
      +
    </div>
    <p class="text-xl font-black text-slate-950" data-editable-text="true">${text}</p>
    <p class="mt-2 text-sm font-bold leading-6 text-slate-500" data-editable-text="true">
      לחצי כדי להחליף, להוסיף או לערוך מדיה.
    </p>
  </div>
</div>
`;
}

export function videoBox(src = "") {
  return `
<div
  class="relative overflow-hidden rounded-[38px] bg-slate-950 p-3 shadow-[0_30px_100px_rgba(15,23,42,0.14)]"
  data-editable-video-card="true"
  data-media-replaceable="true"
>
  ${
    src
      ? `<video src="${src}" class="min-h-[420px] h-full w-full rounded-[28px] object-cover" controls playsinline data-editable-video="true"></video>`
      : `<div class="grid min-h-[420px] w-full place-items-center rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-[var(--biz-primary,#7C3AED)] text-center text-white">
          <div>
            <div class="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-white/15 text-3xl shadow-2xl">▶</div>
            <p class="text-2xl font-black" data-editable-text="true">אזור וידאו</p>
            <p class="mt-2 text-sm font-bold text-white/70" data-editable-text="true">אפשר להחליף לסרטון / תמונת קאבר</p>
          </div>
        </div>`
  }
</div>
`;
}

export function primaryButton(text = "קביעת תור", href = "#contact") {
  return `
<a
  href="${href}"
  class="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-white shadow-xl shadow-[color-mix(in_srgb,var(--biz-primary,#7C3AED)_24%,transparent)] transition hover:-translate-y-0.5"
  data-editable-link="true"
>
  ${text}
</a>
`;
}

export function secondaryButton(text = "מידע נוסף", href = "#about") {
  return `
<a
  href="${href}"
  class="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-8 text-sm font-black text-slate-800 shadow-lg transition hover:-translate-y-0.5 hover:border-[var(--biz-primary,#7C3AED)] hover:text-[var(--biz-primary,#7C3AED)]"
  data-editable-link="true"
>
  ${text}
</a>
`;
}

export function darkButton(text = "לפרטים", href = "#contact") {
  return `
<a
  href="${href}"
  class="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-slate-950 px-8 text-sm font-black text-white shadow-xl transition hover:-translate-y-0.5"
  data-editable-link="true"
>
  ${text}
</a>
`;
}

export function whatsappButton(text = "וואטסאפ", phone = "972500000000") {
  return `
<a
  href="https://wa.me/${phone}"
  class="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 text-sm font-black text-white shadow-xl shadow-emerald-100 transition hover:-translate-y-0.5"
  data-editable-link="true"
  data-bot-action="whatsapp"
>
  <span>${text}</span>
  <span>↗</span>
</a>
`;
}

export function actionRow(
  primary = "קביעת תור",
  secondary = "צור קשר",
  align: "right" | "center" | "left" = "right"
) {
  const alignClass =
    align === "center"
      ? "justify-center"
      : align === "left"
        ? "justify-start"
        : "justify-start";

  return `
<div class="mt-9 flex flex-wrap gap-4 ${alignClass}">
  ${primaryButton(primary)}
  ${secondaryButton(secondary)}
</div>
`;
}

export function featureCard(title: string, text: string, icon = "✦") {
  return `
<article class="${cardClass}" data-editable-card="true">
  <div class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-white">
    ${icon}
  </div>
  <h3 class="text-2xl font-black text-slate-950" data-editable-text="true">${title}</h3>
  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
</article>
`;
}

export function softFeatureCard(title: string, text: string, icon = "✓") {
  return `
<article class="rounded-[30px] border border-slate-200 bg-slate-50 p-6" data-editable-card="true">
  <div class="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-sm">
    ${icon}
  </div>
  <h3 class="text-xl font-black text-slate-950" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
</article>
`;
}

export function darkFeatureCard(title: string, text: string, icon = "✦") {
  return `
<article class="rounded-[30px] border border-white/10 bg-white/8 p-6 text-white" data-editable-card="true">
  <div class="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-white/12 text-sm font-black text-white">
    ${icon}
  </div>
  <h3 class="text-xl font-black text-white" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-white/65" data-editable-text="true">${text}</p>
</article>
`;
}

export function statCard(value: string, label: string) {
  return `
<div class="rounded-[28px] border border-slate-200 bg-white p-6 text-center shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <strong class="block text-4xl font-black text-slate-950" data-editable-text="true">${value}</strong>
  <p class="mt-2 text-sm font-bold text-slate-500" data-editable-text="true">${label}</p>
</div>
`;
}

export function testimonialCard(
  quote = "שירות מדהים, מקצועי ומדויק. ממליצה בחום.",
  name = "לקוחה מרוצה"
) {
  return `
<article class="${cardClass}" data-editable-card="true">
  <div class="text-xl text-amber-400">★★★★★</div>
  <p class="mt-4 text-base font-bold leading-8 text-slate-600" data-editable-text="true">
    ${quote}
  </p>
  <div class="mt-6 flex items-center gap-3">
    <div class="h-12 w-12 rounded-full bg-[var(--biz-secondary,#F3E8FF)]"></div>
    <div>
      <p class="text-sm font-black text-slate-950" data-editable-text="true">${name}</p>
      <p class="text-xs font-bold text-slate-400" data-editable-text="true">ביקורת מאומתת</p>
    </div>
  </div>
</article>
`;
}

export function priceCard(
  title: string,
  price: string,
  text: string,
  highlighted = false
) {
  return `
<article class="${cardClass} ${highlighted ? "ring-2 ring-[var(--biz-primary,#7C3AED)]" : ""}" data-editable-card="true">
  <h3 class="text-2xl font-black text-slate-950" data-editable-text="true">${title}</h3>
  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
  <div class="mt-7 flex items-end justify-between gap-4">
    <span class="text-sm font-bold text-slate-400" data-editable-text="true">החל מ־</span>
    <strong class="text-4xl font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">${price}</strong>
  </div>
  <div class="mt-7">${highlighted ? primaryButton("בחירת חבילה") : secondaryButton("בחירת חבילה")}</div>
</article>
`;
}

export function productCard(
  title: string,
  price: string,
  imageUrl = sectionImages.product
) {
  return `
<article class="${cardClass}" data-bizuply-block="product-card" data-editable-card="true">
  ${imageBlock(imageUrl, "min-h-[250px]", "rounded-[28px]")}
  <h3 class="mt-6 text-2xl font-black text-slate-950" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    תיאור קצר של המוצר, יתרון מרכזי ולמה כדאי לרכוש.
  </p>
  <div class="mt-6 flex items-center justify-between gap-3">
    ${primaryButton("הוספה לסל", "#store")}
    <span class="rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">${price}</span>
  </div>
</article>
`;
}

export function leadForm(buttonText = "שליחת פרטים") {
  return `
<form class="grid gap-4" data-bizuply-block="lead-form">
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
  <input
    class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
    placeholder="אימייל"
    data-editable-input="true"
  />
  <textarea
    class="min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
    placeholder="במה אפשר לעזור?"
    data-editable-input="true"
  ></textarea>
  <button
    class="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-white shadow-xl"
    type="button"
  >
    ${buttonText}
  </button>
</form>
`;
}

export function subscribeForm(buttonText = "הרשמה") {
  return `
<form class="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row" data-bizuply-block="subscribe-form">
  <input
    class="min-h-14 flex-1 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)]"
    placeholder="כתובת אימייל"
    data-editable-input="true"
  />
  <button
    class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-[var(--biz-primary,#7C3AED)] px-8 text-sm font-black text-white shadow-xl"
    type="button"
  >
    ${buttonText}
  </button>
</form>
`;
}

export function faqItem(question: string, answer: string, open = false) {
  return `
<details class="${cardClass}" ${open ? "open" : ""}>
  <summary class="cursor-pointer text-lg font-black text-slate-950" data-editable-text="true">${question}</summary>
  <p class="mt-4 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${answer}</p>
</details>
`;
}

export function timelineItem(number: string, title: string, text: string) {
  return `
<div class="flex gap-5" data-editable-card="true">
  <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--biz-primary,#7C3AED)] text-sm font-black text-white">
    ${number}
  </div>
  <div>
    <h3 class="text-xl font-black text-slate-950" data-editable-text="true">${title}</h3>
    <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
  </div>
</div>
`;
}

export function logoCloud(names: string[] = ["Client", "Brand", "Studio", "Pro", "VIP"]) {
  return `
<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
  ${names
    .map(
      (name) => `
      <div class="grid min-h-24 place-items-center rounded-[24px] border border-slate-200 bg-white px-6 text-center shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
        <span class="text-sm font-black tracking-[-0.02em] text-slate-400" data-editable-text="true">${name}</span>
      </div>
    `
    )
    .join("")}
</div>
`;
}

export function bookingTimes() {
  return ["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"]
    .map(
      (time) => `
      <button
        type="button"
        class="rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] px-5 py-4 text-sm font-black text-[var(--biz-primary,#7C3AED)] transition hover:bg-[var(--biz-primary,#7C3AED)] hover:text-white"
      >
        ${time}
      </button>
    `
    )
    .join("");
}

export function socialIcon(label: string, icon: string, className: string) {
  return `
<a
  href="#"
  class="grid h-14 w-14 place-items-center rounded-2xl ${className} text-lg font-black shadow-lg transition hover:-translate-y-1"
  data-social-link="${label.toLowerCase()}"
  data-editable-link="true"
>
  ${icon}
</a>
`;
}

export function simpleList(items: string[]) {
  return `
<ul class="${cardClass} grid gap-4 text-base font-bold text-slate-700" style="list-style:none;">
  ${items.map((item) => `<li data-editable-text="true">✓ ${item}</li>`).join("")}
</ul>
`;
}

export function splitLayout(
  kind: SectionKind,
  textSide: string,
  mediaSide: string,
  reverse = false
) {
  return sectionShell(
    kind,
    `
<div class="grid items-center gap-12 lg:grid-cols-2">
  ${reverse ? mediaSide : textSide}
  ${reverse ? textSide : mediaSide}
</div>
`
  );
}