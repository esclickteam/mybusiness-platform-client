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
  - תבניות עם פינות דינמיות באמצעות CSS variables
  - סליידר רציף ממרובע חד עד עגול
  - פונקציית יצירת variant

  חשוב:
  הקובץ הזה נשאר 100% Tailwind בתוך ה-HTML של התבניות.
  ה-CSS היחיד שקשור ל-GrapesJS Toolbar נשאר ב-initEditor.ts,
  כי ה-toolbar הוא לא חלק מהאתר עצמו.
*/

export type VariantShape = "rounded" | "soft" | "rect" | "sharp";

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

export const shapeTokens: Record<
  VariantShape,
  {
    section: string;
    card: string;
    media: string;
    mediaInner: string;
    button: string;
    icon: string;
    input: string;
    badge: string;
  }
> = {
  rounded: {
    section: "[border-radius:var(--biz-radius,54px)]",
    card: "[border-radius:var(--biz-card-radius,34px)]",
    media: "[border-radius:var(--biz-media-radius,38px)]",
    mediaInner: "[border-radius:var(--biz-image-radius,28px)]",
    button: "[border-radius:var(--biz-button-radius,18px)]",
    icon: "[border-radius:var(--biz-icon-radius,18px)]",
    input: "[border-radius:var(--biz-input-radius,16px)]",
    badge: "[border-radius:var(--biz-badge-radius,999px)]",
  },
  soft: {
    section: "[border-radius:var(--biz-radius,32px)]",
    card: "[border-radius:var(--biz-card-radius,26px)]",
    media: "[border-radius:var(--biz-media-radius,28px)]",
    mediaInner: "[border-radius:var(--biz-image-radius,20px)]",
    button: "[border-radius:var(--biz-button-radius,14px)]",
    icon: "[border-radius:var(--biz-icon-radius,14px)]",
    input: "[border-radius:var(--biz-input-radius,12px)]",
    badge: "[border-radius:var(--biz-badge-radius,999px)]",
  },
  rect: {
    section: "[border-radius:var(--biz-radius,12px)]",
    card: "[border-radius:var(--biz-card-radius,12px)]",
    media: "[border-radius:var(--biz-media-radius,12px)]",
    mediaInner: "[border-radius:var(--biz-image-radius,8px)]",
    button: "[border-radius:var(--biz-button-radius,8px)]",
    icon: "[border-radius:var(--biz-icon-radius,8px)]",
    input: "[border-radius:var(--biz-input-radius,8px)]",
    badge: "[border-radius:var(--biz-badge-radius,6px)]",
  },
  sharp: {
    section: "[border-radius:var(--biz-radius,0px)]",
    card: "[border-radius:var(--biz-card-radius,0px)]",
    media: "[border-radius:var(--biz-media-radius,0px)]",
    mediaInner: "[border-radius:var(--biz-image-radius,0px)]",
    button: "[border-radius:var(--biz-button-radius,0px)]",
    icon: "[border-radius:var(--biz-icon-radius,0px)]",
    input: "[border-radius:var(--biz-input-radius,0px)]",
    badge: "[border-radius:var(--biz-badge-radius,0px)]",
  },
};

function token(shape: VariantShape, key: keyof (typeof shapeTokens)["rounded"]) {
  return shapeTokens[shape][key];
}

export function defaultRadiusForShape(shape: VariantShape = "rounded") {
  if (shape === "sharp") return 0;
  if (shape === "rect") return 12;
  if (shape === "soft") return 26;
  return 38;
}

export function clampRadius(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(64, Math.round(value)));
}

export function getRadiusVars(radius = 38) {
  const safe = clampRadius(radius);
  const card = safe;
  const media = safe;
  const image = Math.max(safe - 8, 0);
  const button = Math.min(safe, 24);
  const icon = Math.min(safe, 24);
  const input = Math.min(safe, 20);
  const badge = safe >= 28 ? 999 : Math.min(safe, 18);

  return [
    `--biz-radius:${safe}px`,
    `--biz-card-radius:${card}px`,
    `--biz-soft-radius:${safe}px`,
    `--biz-media-radius:${media}px`,
    `--biz-image-radius:${image}px`,
    `--biz-button-radius:${button}px`,
    `--biz-icon-radius:${icon}px`,
    `--biz-input-radius:${input}px`,
    `--biz-badge-radius:${badge}px`,
  ].join(";");
}

export function radiusStyle(shapeOrRadius: VariantShape | number = "rounded") {
  const radius =
    typeof shapeOrRadius === "number"
      ? shapeOrRadius
      : defaultRadiusForShape(shapeOrRadius);

  return getRadiusVars(radius);
}

export const baseSectionClass =
  "relative mx-auto w-full max-w-[1240px] px-6 py-20 sm:px-8 lg:px-10";

export const wideSectionClass =
  "relative mx-auto w-full max-w-[1380px] px-6 py-20 sm:px-8 lg:px-10";

export const fullSectionClass =
  "relative w-full px-6 py-20 sm:px-8 lg:px-10";

/*
  ברירת מחדל נשארת עגולה כדי לא לשבור קבצים קיימים.
  למבנים חדשים מרובעים/חדים יש Classes נפרדים בהמשך.
*/
export const cardClass =
  "[border-radius:var(--biz-card-radius,34px)] border border-slate-200 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)]";

export const cardRectClass =
  "[border-radius:var(--biz-card-radius,12px)] border border-slate-200 bg-white p-7 shadow-[0_18px_55px_rgba(15,23,42,0.07)]";

export const cardSharpClass =
  "[border-radius:var(--biz-card-radius,0px)] border border-slate-200 bg-white p-7 shadow-[0_16px_45px_rgba(15,23,42,0.06)]";

export const cardSoftClass =
  "[border-radius:var(--biz-card-radius,26px)] border border-slate-200 bg-white p-7 shadow-[0_20px_65px_rgba(15,23,42,0.07)]";

export const softCardClass =
  "[border-radius:var(--biz-soft-radius,var(--biz-card-radius,38px))] border border-white bg-white/86 p-8 shadow-[0_30px_100px_rgba(15,23,42,0.10)] backdrop-blur-2xl";

export const softCardRectClass =
  "[border-radius:var(--biz-soft-radius,12px)] border border-white bg-white/88 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.09)] backdrop-blur-2xl";

export const softCardSharpClass =
  "[border-radius:var(--biz-soft-radius,0px)] border border-white bg-white/88 p-8 shadow-[0_20px_65px_rgba(15,23,42,0.08)] backdrop-blur-2xl";

export const darkCardClass =
  "[border-radius:var(--biz-soft-radius,var(--biz-card-radius,38px))] border border-white/10 border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_34px_120px_rgba(15,23,42,0.24)]";

export const darkCardRectClass =
  "[border-radius:var(--biz-soft-radius,12px)] border border-white/10 border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_28px_90px_rgba(15,23,42,0.22)]";

export const darkCardSharpClass =
  "[border-radius:var(--biz-soft-radius,0px)] border border-white/10 border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_24px_80px_rgba(15,23,42,0.18)]";

export const titleClass =
  "text-4xl font-black leading-[1.04] tracking-[-0.05em] text-slate-800 md:text-6xl";

export const h2Class =
  "text-3xl font-black leading-[1.06] tracking-[-0.045em] text-slate-800 md:text-5xl";

export const textClass =
  "mt-5 max-w-3xl text-base font-bold leading-8 text-slate-500 md:text-lg";

export const pillClass =
  "mb-4 inline-flex [border-radius:var(--biz-badge-radius,999px)] bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-xs font-black text-[var(--biz-primary,#7C3AED)]";

export const pillRectClass =
  "mb-4 inline-flex [border-radius:var(--biz-badge-radius,6px)] bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-xs font-black text-[var(--biz-primary,#7C3AED)]";

export const pillSharpClass =
  "mb-4 inline-flex [border-radius:var(--biz-badge-radius,0px)] bg-[var(--biz-secondary,#F3E8FF)] px-5 py-2 text-xs font-black text-[var(--biz-primary,#7C3AED)]";

export const buttonSafeClass =
  "max-w-full shrink-0 whitespace-normal text-center leading-none sm:whitespace-nowrap";

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
  style="${radiusStyle("rounded")}"
  data-section-kind="${kind}"
  data-bizuply-editable-section="true"
  data-bizuply-shape="rounded"
  data-radius-editable="true"
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
  style="${radiusStyle("rounded")}"
  data-section-kind="${kind}"
  data-bizuply-editable-section="true"
  data-bizuply-shape="rounded"
  data-radius-editable="true"
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
  style="${radiusStyle("rounded")}"
  data-section-kind="${kind}"
  data-bizuply-editable-section="true"
  data-bizuply-shape="rounded"
  data-radius-editable="true"
>
  ${inner}
</section>
`;
}

/*
  Shells חדשים למבנים מרובעים / חדים.
  אפשר להשתמש בהם בקבצי layoutVariants החדשים.
*/
export function shapedSectionShell(
  kind: SectionKind,
  inner: string,
  shape: VariantShape = "rounded",
  extraClass = ""
) {
  return `
<section
  class="${baseSectionClass} ${extraClass}"
  style="${radiusStyle(shape)}"
  data-section-kind="${kind}"
  data-bizuply-editable-section="true"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
>
  ${inner}
</section>
`;
}

export function shapedWideSectionShell(
  kind: SectionKind,
  inner: string,
  shape: VariantShape = "rounded",
  extraClass = ""
) {
  return `
<section
  class="${wideSectionClass} ${extraClass}"
  style="${radiusStyle(shape)}"
  data-section-kind="${kind}"
  data-bizuply-editable-section="true"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
>
  ${inner}
</section>
`;
}

export function boxedSectionShell(
  kind: SectionKind,
  inner: string,
  shape: VariantShape = "rect",
  extraClass = ""
) {
  return `
<section
  class="${wideSectionClass} ${extraClass}"
  style="${radiusStyle(shape)}"
  data-section-kind="${kind}"
  data-bizuply-editable-section="true"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
>
  <div class="${token(shape, "section")} border border-slate-200 bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.08)] md:p-12">
    ${inner}
  </div>
</section>
`;
}

export function corporateSectionShell(
  kind: SectionKind,
  inner: string,
  extraClass = ""
) {
  return boxedSectionShell(
    kind,
    inner,
    "rect",
    `bg-slate-50 ${extraClass}`
  );
}

export function sharpSectionShell(
  kind: SectionKind,
  inner: string,
  extraClass = ""
) {
  return boxedSectionShell(kind, inner, "sharp", extraClass);
}

export function backgroundSection(
  kind: SectionKind,
  imageUrl: string,
  inner: string,
  extraClass = ""
) {
  return `
<section
  class="relative mx-auto my-10 min-h-[640px] w-full max-w-[1380px] overflow-hidden [border-radius:var(--biz-radius,54px)] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 bg-cover bg-center px-8 py-24 shadow-[0_44px_150px_rgba(15,23,42,0.24)] sm:px-12 ${extraClass}"
  style="${radiusStyle("rounded")};background-image:linear-gradient(135deg,rgba(2,6,23,.72),rgba(2,6,23,.22)),url('${imageUrl}')"
  data-section-kind="${kind}"
  data-background-editable="true"
  data-bizuply-editable-section="true"
  data-bizuply-shape="rounded"
  data-radius-editable="true"
>
  ${inner}
</section>
`;
}

export function shapedBackgroundSection(
  kind: SectionKind,
  imageUrl: string,
  inner: string,
  shape: VariantShape = "rect",
  extraClass = ""
) {
  return `
<section
  class="relative mx-auto my-10 min-h-[640px] w-full max-w-[1380px] overflow-hidden ${token(shape, "section")} border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 bg-cover bg-center px-8 py-24 shadow-[0_34px_120px_rgba(15,23,42,0.20)] sm:px-12 ${extraClass}"
  style="${radiusStyle(shape)};background-image:linear-gradient(135deg,rgba(2,6,23,.72),rgba(2,6,23,.22)),url('${imageUrl}')"
  data-section-kind="${kind}"
  data-background-editable="true"
  data-bizuply-editable-section="true"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
>
  ${inner}
</section>
`;
}

export function rectBackgroundSection(
  kind: SectionKind,
  imageUrl: string,
  inner: string,
  extraClass = ""
) {
  return shapedBackgroundSection(kind, imageUrl, inner, "rect", extraClass);
}

export function sharpBackgroundSection(
  kind: SectionKind,
  imageUrl: string,
  inner: string,
  extraClass = ""
) {
  return shapedBackgroundSection(kind, imageUrl, inner, "sharp", extraClass);
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

export function shapedSectionIntro(
  kind: SectionKind,
  title: string,
  text: string,
  align: "center" | "right" | "left" = "center",
  shape: VariantShape = "rect"
) {
  const alignClass =
    align === "center"
      ? "mx-auto text-center"
      : align === "left"
        ? "text-left"
        : "text-right";

  const badgeClass =
    shape === "sharp" ? pillSharpClass : shape === "rect" ? pillRectClass : pillClass;

  return `
<div class="${alignClass} max-w-[880px]">
  <p class="${badgeClass}" data-editable-text="true">${sectionKindLabels[kind]}</p>
  <h2 class="${h2Class}" data-editable-text="true">${title}</h2>
  <p class="${textClass} ${align === "center" ? "mx-auto" : ""}" data-editable-text="true">${text}</p>
</div>
`;
}

export function imageBlock(
  src: string,
  height = "min-h-[420px]",
  rounded = "[border-radius:var(--biz-media-radius,38px)]"
) {
  const mediaRadiusClass = rounded.includes("rounded")
    ? "[border-radius:var(--biz-media-radius,38px)]"
    : rounded || "[border-radius:var(--biz-media-radius,38px)]";

  return `
<div
  class="relative overflow-hidden ${mediaRadiusClass} bg-white p-3 shadow-[0_30px_100px_rgba(15,23,42,0.12)]"
  data-editable-image-card="true"
  data-media-replaceable="true"
  data-radius-editable="true"
>
  <img
    src="${src}"
    alt=""
    class="${height} h-full w-full [border-radius:var(--biz-image-radius,28px)] object-cover"
    data-editable-image="true"
  />
</div>
`;
}

export function shapedImageBlock(
  src: string,
  height = "min-h-[420px]",
  shape: VariantShape = "rect"
) {
  return `
<div
  class="relative overflow-hidden ${token(shape, "media")} bg-white p-3 shadow-[0_24px_80px_rgba(15,23,42,0.10)]"
  data-editable-image-card="true"
  data-media-replaceable="true"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
>
  <img
    src="${src}"
    alt=""
    class="${height} h-full w-full ${token(shape, "mediaInner")} object-cover"
    data-editable-image="true"
  />
</div>
`;
}

export function rectImageBlock(src: string, height = "min-h-[420px]") {
  return shapedImageBlock(src, height, "rect");
}

export function sharpImageBlock(src: string, height = "min-h-[420px]") {
  return shapedImageBlock(src, height, "sharp");
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

export function shapedImageGrid(
  images: string[],
  height = "min-h-[260px]",
  columns = "md:grid-cols-3",
  shape: VariantShape = "rect"
) {
  return `
<div class="grid gap-5 ${columns}">
  ${images
    .map((src) => shapedImageBlock(src, height, shape))
    .join("")}
</div>
`;
}

export function addMediaBox(text = "הוספת תמונה / וידאו") {
  return `
<div
  class="grid min-h-[320px] cursor-pointer place-items-center [border-radius:var(--biz-media-radius,38px)] border-2 border-dashed border-[color:var(--biz-secondary,#F3E8FF)] bg-[var(--biz-secondary,#F3E8FF)]/70 p-8 text-center transition hover:bg-[var(--biz-secondary,#F3E8FF)]"
  data-image-drop-zone="true"
  data-media-drop-zone="true"
  data-media-replaceable="true"
  data-radius-editable="true"
>
  <div>
    <div class="mx-auto mb-4 grid h-16 w-16 place-items-center [border-radius:var(--biz-icon-radius,24px)] bg-white text-3xl font-black text-[var(--biz-primary,#7C3AED)] shadow-xl">
      +
    </div>
    <p class="text-xl font-black text-slate-800" data-editable-text="true">${text}</p>
    <p class="mt-2 text-sm font-bold leading-6 text-slate-500" data-editable-text="true">
      לחצי כדי להחליף, להוסיף או לערוך מדיה.
    </p>
  </div>
</div>
`;
}

export function shapedAddMediaBox(
  text = "הוספת תמונה / וידאו",
  shape: VariantShape = "rect"
) {
  return `
<div
  class="grid min-h-[320px] cursor-pointer place-items-center ${token(shape, "media")} border-2 border-dashed border-[color:var(--biz-secondary,#F3E8FF)] bg-[var(--biz-secondary,#F3E8FF)]/70 p-8 text-center transition hover:bg-[var(--biz-secondary,#F3E8FF)]"
  data-image-drop-zone="true"
  data-media-drop-zone="true"
  data-media-replaceable="true"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
>
  <div>
    <div class="mx-auto mb-4 grid h-16 w-16 place-items-center ${token(shape, "icon")} bg-white text-3xl font-black text-[var(--biz-primary,#7C3AED)] shadow-xl">
      +
    </div>
    <p class="text-xl font-black text-slate-800" data-editable-text="true">${text}</p>
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
  class="relative overflow-hidden [border-radius:var(--biz-media-radius,38px)] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 p-3 shadow-[0_30px_100px_rgba(15,23,42,0.14)]"
  data-editable-video-card="true"
  data-media-replaceable="true"
  data-radius-editable="true"
>
  ${
    src
      ? `<video src="${src}" class="min-h-[420px] h-full w-full [border-radius:var(--biz-image-radius,28px)] object-cover" controls playsinline data-editable-video="true"></video>`
      : `<div class="grid min-h-[420px] w-full place-items-center [border-radius:var(--biz-image-radius,28px)] bg-gradient-to-br from-slate-950 via-slate-900 to-[var(--biz-primary,#7C3AED)] text-center text-white">
          <div>
            <div class="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-white/15 text-3xl shadow-2xl">▶</div>
            <p class="text-2xl font-black" data-editable-text="true">אזור וידאו</p>
            <p class="mt-2 text-sm font-bold text-black/70" data-editable-text="true">אפשר להחליף לסרטון / תמונת קאבר</p>
          </div>
        </div>`
  }
</div>
`;
}

export function shapedVideoBox(src = "", shape: VariantShape = "rect") {
  return `
<div
  class="relative overflow-hidden ${token(shape, "media")} border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 p-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
  data-editable-video-card="true"
  data-media-replaceable="true"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
>
  ${
    src
      ? `<video src="${src}" class="min-h-[420px] h-full w-full ${token(shape, "mediaInner")} object-cover" controls playsinline data-editable-video="true"></video>`
      : `<div class="grid min-h-[420px] w-full place-items-center ${token(shape, "mediaInner")} bg-gradient-to-br from-slate-950 via-slate-900 to-[var(--biz-primary,#7C3AED)] text-center text-white">
          <div>
            <div class="mx-auto mb-5 grid h-20 w-20 place-items-center ${token(shape, "icon")} bg-white/15 text-3xl shadow-2xl">▶</div>
            <p class="text-2xl font-black" data-editable-text="true">אזור וידאו</p>
            <p class="mt-2 text-sm font-bold text-black/70" data-editable-text="true">אפשר להחליף לסרטון / תמונת קאבר</p>
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
  class="${buttonSafeClass} inline-flex min-h-[56px] items-center justify-center [border-radius:var(--biz-button-radius,18px)] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-black shadow-xl shadow-[color-mix(in_srgb,var(--biz-primary,#7C3AED)_24%,transparent)] transition hover:-translate-y-0.5"
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
  class="${buttonSafeClass} inline-flex min-h-[56px] items-center justify-center [border-radius:var(--biz-button-radius,18px)] border border-slate-200 bg-white px-8 text-sm font-black text-slate-800 shadow-lg transition hover:-translate-y-0.5 hover:border-[var(--biz-primary,#7C3AED)] hover:text-[var(--biz-primary,#7C3AED)]"
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
  class="${buttonSafeClass} inline-flex min-h-[56px] items-center justify-center [border-radius:var(--biz-button-radius,18px)] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-xl transition hover:-translate-y-0.5"
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
  class="${buttonSafeClass} inline-flex min-h-[56px] items-center justify-center gap-2 [border-radius:var(--biz-button-radius,18px)] bg-emerald-500 px-8 text-sm font-black text-black shadow-xl shadow-emerald-100 transition hover:-translate-y-0.5"
  data-editable-link="true"
  data-bot-action="whatsapp"
>
  <span>${text}</span>
  <span>↗</span>
</a>
`;
}

export function shapedPrimaryButton(
  text = "קביעת תור",
  href = "#contact",
  shape: VariantShape = "rect"
) {
  return `
<a
  href="${href}"
  class="${buttonSafeClass} inline-flex min-h-[56px] items-center justify-center ${token(shape, "button")} bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-black shadow-xl transition hover:-translate-y-0.5"
  data-editable-link="true"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
>
  ${text}
</a>
`;
}

export function shapedSecondaryButton(
  text = "מידע נוסף",
  href = "#about",
  shape: VariantShape = "rect"
) {
  return `
<a
  href="${href}"
  class="${buttonSafeClass} inline-flex min-h-[56px] items-center justify-center ${token(shape, "button")} border border-slate-200 bg-white px-8 text-sm font-black text-slate-800 shadow-lg transition hover:-translate-y-0.5 hover:border-[var(--biz-primary,#7C3AED)] hover:text-[var(--biz-primary,#7C3AED)]"
  data-editable-link="true"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
>
  ${text}
</a>
`;
}

export function shapedDarkButton(
  text = "לפרטים",
  href = "#contact",
  shape: VariantShape = "rect"
) {
  return `
<a
  href="${href}"
  class="${buttonSafeClass} inline-flex min-h-[56px] items-center justify-center ${token(shape, "button")} border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-xl transition hover:-translate-y-0.5"
  data-editable-link="true"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
>
  ${text}
</a>
`;
}

export function shapedWhatsappButton(
  text = "וואטסאפ",
  phone = "972500000000",
  shape: VariantShape = "rect"
) {
  return `
<a
  href="https://wa.me/${phone}"
  class="${buttonSafeClass} inline-flex min-h-[56px] items-center justify-center gap-2 ${token(shape, "button")} bg-emerald-500 px-8 text-sm font-black text-black shadow-xl shadow-emerald-100 transition hover:-translate-y-0.5"
  data-editable-link="true"
  data-bot-action="whatsapp"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
>
  <span>${text}</span>
  <span>↗</span>
</a>
`;
}

export function primaryButtonRect(text = "קביעת תור", href = "#contact") {
  return shapedPrimaryButton(text, href, "rect");
}

export function secondaryButtonRect(text = "מידע נוסף", href = "#about") {
  return shapedSecondaryButton(text, href, "rect");
}

export function darkButtonRect(text = "לפרטים", href = "#contact") {
  return shapedDarkButton(text, href, "rect");
}

export function primaryButtonSharp(text = "קביעת תור", href = "#contact") {
  return shapedPrimaryButton(text, href, "sharp");
}

export function secondaryButtonSharp(text = "מידע נוסף", href = "#about") {
  return shapedSecondaryButton(text, href, "sharp");
}

export function darkButtonSharp(text = "לפרטים", href = "#contact") {
  return shapedDarkButton(text, href, "sharp");
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
<div class="mt-9 flex max-w-full flex-wrap gap-4 ${alignClass}" data-bizuply-action-row="true">
  ${primaryButton(primary)}
  ${secondaryButton(secondary)}
</div>
`;
}

export function shapedActionRow(
  primary = "קביעת תור",
  secondary = "צור קשר",
  align: "right" | "center" | "left" = "right",
  shape: VariantShape = "rect"
) {
  const alignClass =
    align === "center"
      ? "justify-center"
      : align === "left"
        ? "justify-start"
        : "justify-start";

  return `
<div class="mt-9 flex max-w-full flex-wrap gap-4 ${alignClass}" data-bizuply-action-row="true" data-bizuply-shape="${shape}">
  ${shapedPrimaryButton(primary, "#contact", shape)}
  ${shapedSecondaryButton(secondary, "#about", shape)}
</div>
`;
}

export function featureCard(title: string, text: string, icon = "✦") {
  return `
<article class="${cardClass}" data-editable-card="true">
  <div class="mb-6 grid h-14 w-14 place-items-center [border-radius:var(--biz-button-radius,18px)] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-black">
    ${icon}
  </div>
  <h3 class="text-2xl font-black text-slate-800" data-editable-text="true">${title}</h3>
  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
</article>
`;
}

export function shapedFeatureCard(
  title: string,
  text: string,
  icon = "✦",
  shape: VariantShape = "rect"
) {
  return `
<article class="${token(shape, "card")} border border-slate-200 bg-white p-7 shadow-[0_20px_65px_rgba(15,23,42,0.07)]" data-editable-card="true" data-bizuply-shape="${shape}">
  <div class="mb-6 grid h-14 w-14 place-items-center ${token(shape, "icon")} bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-black">
    ${icon}
  </div>
  <h3 class="text-2xl font-black text-slate-800" data-editable-text="true">${title}</h3>
  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
</article>
`;
}

export function softFeatureCard(title: string, text: string, icon = "✓") {
  return `
<article class="[border-radius:var(--biz-card-radius,30px)] border border-slate-200 bg-slate-50 p-6" data-editable-card="true">
  <div class="mb-4 grid h-12 w-12 place-items-center [border-radius:var(--biz-icon-radius,18px)] bg-white text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-sm">
    ${icon}
  </div>
  <h3 class="text-xl font-black text-slate-800" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
</article>
`;
}

export function shapedSoftFeatureCard(
  title: string,
  text: string,
  icon = "✓",
  shape: VariantShape = "rect"
) {
  return `
<article class="${token(shape, "card")} border border-slate-200 bg-slate-50 p-6" data-editable-card="true" data-bizuply-shape="${shape}">
  <div class="mb-4 grid h-12 w-12 place-items-center ${token(shape, "icon")} bg-white text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-sm">
    ${icon}
  </div>
  <h3 class="text-xl font-black text-slate-800" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
</article>
`;
}

export function darkFeatureCard(title: string, text: string, icon = "✦") {
  return `
<article class="[border-radius:var(--biz-card-radius,30px)] border border-white/10 bg-white/8 p-6 text-white" data-editable-card="true">
  <div class="mb-4 grid h-12 w-12 place-items-center [border-radius:var(--biz-icon-radius,18px)] bg-white/12 text-sm font-black text-black">
    ${icon}
  </div>
  <h3 class="text-xl font-black text-black" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-white/65" data-editable-text="true">${text}</p>
</article>
`;
}

export function shapedDarkFeatureCard(
  title: string,
  text: string,
  icon = "✦",
  shape: VariantShape = "rect"
) {
  return `
<article class="${token(shape, "card")} border border-white/10 bg-white/8 p-6 text-white" data-editable-card="true" data-bizuply-shape="${shape}">
  <div class="mb-4 grid h-12 w-12 place-items-center ${token(shape, "icon")} bg-white/12 text-sm font-black text-black">
    ${icon}
  </div>
  <h3 class="text-xl font-black text-black" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-white/65" data-editable-text="true">${text}</p>
</article>
`;
}

export function statCard(value: string, label: string) {
  return `
<div class="[border-radius:var(--biz-card-radius,28px)] border border-slate-200 bg-white p-6 text-center shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <strong class="block text-4xl font-black text-slate-800" data-editable-text="true">${value}</strong>
  <p class="mt-2 text-sm font-bold text-slate-500" data-editable-text="true">${label}</p>
</div>
`;
}

export function shapedStatCard(
  value: string,
  label: string,
  shape: VariantShape = "rect"
) {
  return `
<div class="${token(shape, "card")} border border-slate-200 bg-white p-6 text-center shadow-[0_16px_50px_rgba(15,23,42,0.06)]" data-editable-card="true" data-bizuply-shape="${shape}">
  <strong class="block text-4xl font-black text-slate-800" data-editable-text="true">${value}</strong>
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
    <div class="h-12 w-12 [border-radius:var(--biz-badge-radius,999px)] bg-[var(--biz-secondary,#F3E8FF)]"></div>
    <div>
      <p class="text-sm font-black text-slate-800" data-editable-text="true">${name}</p>
      <p class="text-xs font-bold text-slate-400" data-editable-text="true">ביקורת מאומתת</p>
    </div>
  </div>
</article>
`;
}

export function shapedTestimonialCard(
  quote = "שירות מדהים, מקצועי ומדויק. ממליצה בחום.",
  name = "לקוחה מרוצה",
  shape: VariantShape = "rect"
) {
  return `
<article class="${token(shape, "card")} border border-slate-200 bg-white p-7 shadow-[0_20px_65px_rgba(15,23,42,0.07)]" data-editable-card="true" data-bizuply-shape="${shape}">
  <div class="text-xl text-amber-400">★★★★★</div>
  <p class="mt-4 text-base font-bold leading-8 text-slate-600" data-editable-text="true">
    ${quote}
  </p>
  <div class="mt-6 flex items-center gap-3">
    <div class="h-12 w-12 ${token(shape, "icon")} bg-[var(--biz-secondary,#F3E8FF)]"></div>
    <div>
      <p class="text-sm font-black text-slate-800" data-editable-text="true">${name}</p>
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
  <h3 class="text-2xl font-black text-slate-800" data-editable-text="true">${title}</h3>
  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
  <div class="mt-7 flex items-end justify-between gap-4">
    <span class="text-sm font-bold text-slate-400" data-editable-text="true">החל מ־</span>
    <strong class="text-4xl font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">${price}</strong>
  </div>
  <div class="mt-7">${highlighted ? primaryButton("בחירת חבילה") : secondaryButton("בחירת חבילה")}</div>
</article>
`;
}

export function shapedPriceCard(
  title: string,
  price: string,
  text: string,
  highlighted = false,
  shape: VariantShape = "rect"
) {
  return `
<article class="${token(shape, "card")} border border-slate-200 bg-white p-7 shadow-[0_20px_65px_rgba(15,23,42,0.07)] ${highlighted ? "ring-2 ring-[var(--biz-primary,#7C3AED)]" : ""}" data-editable-card="true" data-bizuply-shape="${shape}">
  <h3 class="text-2xl font-black text-slate-800" data-editable-text="true">${title}</h3>
  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
  <div class="mt-7 flex items-end justify-between gap-4">
    <span class="text-sm font-bold text-slate-400" data-editable-text="true">החל מ־</span>
    <strong class="text-4xl font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">${price}</strong>
  </div>
  <div class="mt-7">${highlighted ? shapedPrimaryButton("בחירת חבילה", "#contact", shape) : shapedSecondaryButton("בחירת חבילה", "#about", shape)}</div>
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
  <h3 class="mt-6 text-2xl font-black text-slate-800" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    תיאור קצר של המוצר, יתרון מרכזי ולמה כדאי לרכוש.
  </p>
  <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
    ${primaryButton("הוספה לסל", "#store")}
    <span class="[border-radius:var(--biz-badge-radius,999px)] bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">${price}</span>
  </div>
</article>
`;
}

export function shapedProductCard(
  title: string,
  price: string,
  imageUrl = sectionImages.product,
  shape: VariantShape = "rect"
) {
  return `
<article class="${token(shape, "card")} border border-slate-200 bg-white p-7 shadow-[0_20px_65px_rgba(15,23,42,0.07)]" data-bizuply-block="product-card" data-editable-card="true" data-bizuply-shape="${shape}">
  ${shapedImageBlock(imageUrl, "min-h-[250px]", shape)}
  <h3 class="mt-6 text-2xl font-black text-slate-800" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    תיאור קצר של המוצר, יתרון מרכזי ולמה כדאי לרכוש.
  </p>
  <div class="mt-6 flex flex-wrap items-center justify-between gap-3">
    ${shapedPrimaryButton("הוספה לסל", "#store", shape)}
    <span class="${token(shape, "badge")} bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">${price}</span>
  </div>
</article>
`;
}

export function inputClass(shape: VariantShape = "rounded") {
  return `min-h-14 w-full ${token(shape, "input")} border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white`;
}

export function textareaClass(shape: VariantShape = "rounded") {
  return `min-h-32 w-full ${token(shape, "input")} border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white`;
}

function leadFormFieldSlot(
  id: string,
  label: string,
  controlHtml: string,
) {
  return `
  <div
    class="w-full"
    data-bizuply-form-field-wrapper="true"
    data-bizuply-form-field-id="${id}"
    data-visual-editable="true"
    data-visual-edit-id="lead.${id}"
    data-visual-edit-type="box"
    data-visual-edit-label="${label}"
  >
    ${controlHtml}
  </div>`;
}

export function leadForm(buttonText = "שליחת פרטים") {
  return `
<form class="relative grid gap-4 overflow-visible" data-bizuply-block="lead-form" data-bizuply-form-id="lead-form">
  ${leadFormFieldSlot(
    "name",
    "שדה שם מלא",
    `<input class="${inputClass("rounded")}" placeholder="שם מלא" data-editable-input="true" data-visual-editable="true" data-visual-edit-type="input" />`,
  )}
  ${leadFormFieldSlot(
    "phone",
    "שדה טלפון",
    `<input class="${inputClass("rounded")}" placeholder="טלפון" data-editable-input="true" data-visual-editable="true" data-visual-edit-type="input" />`,
  )}
  ${leadFormFieldSlot(
    "email",
    "שדה אימייל",
    `<input class="${inputClass("rounded")}" placeholder="אימייל" data-editable-input="true" data-visual-editable="true" data-visual-edit-type="input" />`,
  )}
  ${leadFormFieldSlot(
    "message",
    "שדה הודעה",
    `<textarea class="${textareaClass("rounded")}" placeholder="במה אפשר לעזור?" data-editable-input="true" data-visual-editable="true" data-visual-edit-type="input"></textarea>`,
  )}
  ${leadFormFieldSlot(
    "submit",
    "כפתור שליחה",
    `<button class="${buttonSafeClass} inline-flex min-h-[56px] w-full items-center justify-center [border-radius:var(--biz-button-radius,18px)] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-black shadow-xl" type="button" data-editable="button" data-visual-editable="true" data-visual-edit-type="button">${buttonText}</button>`,
  )}
</form>
`;
}

export function shapedLeadForm(
  buttonText = "שליחת פרטים",
  shape: VariantShape = "rect"
) {
  return `
<form class="relative grid gap-4 overflow-visible" data-bizuply-block="lead-form" data-bizuply-form-id="lead-form" data-bizuply-shape="${shape}">
  ${leadFormFieldSlot(
    "name",
    "שדה שם מלא",
    `<input class="${inputClass(shape)}" placeholder="שם מלא" data-editable-input="true" data-visual-editable="true" data-visual-edit-type="input" />`,
  )}
  ${leadFormFieldSlot(
    "phone",
    "שדה טלפון",
    `<input class="${inputClass(shape)}" placeholder="טלפון" data-editable-input="true" data-visual-editable="true" data-visual-edit-type="input" />`,
  )}
  ${leadFormFieldSlot(
    "email",
    "שדה אימייל",
    `<input class="${inputClass(shape)}" placeholder="אימייל" data-editable-input="true" data-visual-editable="true" data-visual-edit-type="input" />`,
  )}
  ${leadFormFieldSlot(
    "message",
    "שדה הודעה",
    `<textarea class="${textareaClass(shape)}" placeholder="במה אפשר לעזור?" data-editable-input="true" data-visual-editable="true" data-visual-edit-type="input"></textarea>`,
  )}
  ${leadFormFieldSlot(
    "submit",
    "כפתור שליחה",
    `<button class="${buttonSafeClass} inline-flex min-h-[56px] w-full items-center justify-center ${token(shape, "button")} bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-black shadow-xl" type="button" data-editable="button" data-visual-editable="true" data-visual-edit-type="button">${buttonText}</button>`,
  )}
</form>
`;
}

export function subscribeForm(buttonText = "הרשמה") {
  return `
<form class="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row" data-bizuply-block="subscribe-form">
  <input
    class="min-h-14 flex-1 [border-radius:var(--biz-button-radius,18px)] border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)]"
    placeholder="כתובת אימייל"
    data-editable-input="true"
  />
  <button
    class="${buttonSafeClass} inline-flex min-h-14 items-center justify-center [border-radius:var(--biz-icon-radius,18px)] bg-[var(--biz-primary,#7C3AED)] px-8 text-sm font-black text-black shadow-xl"
    type="button"
  >
    ${buttonText}
  </button>
</form>
`;
}

export function shapedSubscribeForm(
  buttonText = "הרשמה",
  shape: VariantShape = "rect"
) {
  return `
<form class="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row" data-bizuply-block="subscribe-form" data-bizuply-shape="${shape}">
  <input
    class="min-h-14 flex-1 ${token(shape, "input")} border border-slate-200 bg-white px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)]"
    placeholder="כתובת אימייל"
    data-editable-input="true"
  />
  <button
    class="${buttonSafeClass} inline-flex min-h-14 items-center justify-center ${token(shape, "button")} bg-[var(--biz-primary,#7C3AED)] px-8 text-sm font-black text-black shadow-xl"
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
  <summary class="cursor-pointer text-lg font-black text-slate-800" data-editable-text="true">${question}</summary>
  <p class="mt-4 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${answer}</p>
</details>
`;
}

export function shapedFaqItem(
  question: string,
  answer: string,
  open = false,
  shape: VariantShape = "rect"
) {
  return `
<details class="${token(shape, "card")} border border-slate-200 bg-white p-7 shadow-[0_20px_65px_rgba(15,23,42,0.07)]" ${open ? "open" : ""} data-bizuply-shape="${shape}">
  <summary class="cursor-pointer text-lg font-black text-slate-800" data-editable-text="true">${question}</summary>
  <p class="mt-4 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${answer}</p>
</details>
`;
}

export function timelineItem(number: string, title: string, text: string) {
  return `
<div class="flex gap-5" data-editable-card="true">
  <div class="grid h-12 w-12 shrink-0 place-items-center [border-radius:var(--biz-icon-radius,18px)] bg-[var(--biz-primary,#7C3AED)] text-sm font-black text-black">
    ${number}
  </div>
  <div>
    <h3 class="text-xl font-black text-slate-800" data-editable-text="true">${title}</h3>
    <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
  </div>
</div>
`;
}

export function shapedTimelineItem(
  number: string,
  title: string,
  text: string,
  shape: VariantShape = "rect"
) {
  return `
<div class="flex gap-5" data-editable-card="true" data-bizuply-shape="${shape}">
  <div class="grid h-12 w-12 shrink-0 place-items-center ${token(shape, "icon")} bg-[var(--biz-primary,#7C3AED)] text-sm font-black text-black">
    ${number}
  </div>
  <div>
    <h3 class="text-xl font-black text-slate-800" data-editable-text="true">${title}</h3>
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
      <div class="grid min-h-24 place-items-center [border-radius:var(--biz-card-radius,24px)] border border-slate-200 bg-white px-6 text-center shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
        <span class="text-sm font-black tracking-[-0.02em] text-slate-400" data-editable-text="true">${name}</span>
      </div>
    `
    )
    .join("")}
</div>
`;
}

export function shapedLogoCloud(
  names: string[] = ["Client", "Brand", "Studio", "Pro", "VIP"],
  shape: VariantShape = "rect"
) {
  return `
<div class="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
  ${names
    .map(
      (name) => `
      <div class="grid min-h-24 place-items-center ${token(shape, "card")} border border-slate-200 bg-white px-6 text-center shadow-[0_14px_45px_rgba(15,23,42,0.05)]" data-bizuply-shape="${shape}">
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
        class="${buttonSafeClass} [border-radius:var(--biz-button-radius,18px)] bg-[var(--biz-secondary,#F3E8FF)] px-5 py-4 text-sm font-black text-[var(--biz-primary,#7C3AED)] transition hover:bg-[var(--biz-primary,#7C3AED)] hover:text-white"
      >
        ${time}
      </button>
    `
    )
    .join("");
}

export function shapedBookingTimes(shape: VariantShape = "rect") {
  return ["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"]
    .map(
      (time) => `
      <button
        type="button"
        class="${buttonSafeClass} ${token(shape, "button")} bg-[var(--biz-secondary,#F3E8FF)] px-5 py-4 text-sm font-black text-[var(--biz-primary,#7C3AED)] transition hover:bg-[var(--biz-primary,#7C3AED)] hover:text-white"
        data-bizuply-shape="${shape}"
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
  class="grid h-14 w-14 place-items-center [border-radius:var(--biz-button-radius,18px)] ${className} text-lg font-black shadow-lg transition hover:-translate-y-1"
  data-social-link="${label.toLowerCase()}"
  data-editable-link="true"
>
  ${icon}
</a>
`;
}

export function shapedSocialIcon(
  label: string,
  icon: string,
  className: string,
  shape: VariantShape = "rect"
) {
  return `
<a
  href="#"
  class="grid h-14 w-14 place-items-center ${token(shape, "button")} ${className} text-lg font-black shadow-lg transition hover:-translate-y-1"
  data-social-link="${label.toLowerCase()}"
  data-editable-link="true"
  data-bizuply-shape="${shape}"
  data-radius-editable="true"
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

export function shapedSimpleList(items: string[], shape: VariantShape = "rect") {
  return `
<ul class="${token(shape, "card")} grid gap-4 border border-slate-200 bg-white p-7 text-base font-bold text-slate-700 shadow-[0_20px_65px_rgba(15,23,42,0.07)]" style="list-style:none;" data-bizuply-shape="${shape}">
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

export function shapedSplitLayout(
  kind: SectionKind,
  textSide: string,
  mediaSide: string,
  reverse = false,
  shape: VariantShape = "rect"
) {
  return shapedSectionShell(
    kind,
    `
<div class="grid items-center gap-12 lg:grid-cols-2">
  ${reverse ? mediaSide : textSide}
  ${reverse ? textSide : mediaSide}
</div>
`,
    shape
  );
}

/*
  Helpers מוכנים למבנים Corporate / Rect / Sharp.
  אפשר לקרוא להם בקבצי הסקשנים כדי להוסיף תבניות לא-עגולות.
*/

export function corporateFeatureGrid(
  kind: SectionKind,
  title: string,
  text: string
) {
  return corporateSectionShell(
    kind,
    `
    ${shapedSectionIntro(kind, title, text, "center", "rect")}

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      ${shapedFeatureCard("מבנה מקצועי", "כרטיס מרובע בסגנון Corporate.", "01", "rect")}
      ${shapedFeatureCard("נראה נקי", "פחות עגול, יותר עסקי ומדויק.", "02", "rect")}
      ${shapedFeatureCard("עריכה מלאה", "טקסטים, צבעים, תמונות וכפתורים.", "03", "rect")}
    </div>
    `,
    "rect"
  );
}

export function sharpFeatureGrid(
  kind: SectionKind,
  title: string,
  text: string
) {
  return sharpSectionShell(
    kind,
    `
    ${shapedSectionIntro(kind, title, text, "center", "sharp")}

    <div class="mt-12 grid gap-6 md:grid-cols-3">
      ${shapedFeatureCard("חד ומינימליסטי", "מבנה ללא פינות עגולות.", "01", "sharp")}
      ${shapedFeatureCard("מותג עסקי", "מתאים לעורכי דין, יועצים, נדל״ן, SaaS ועוד.", "02", "sharp")}
      ${shapedFeatureCard("ברור ונקי", "עיצוב שלא נראה כמו כל התבניות הרגילות.", "03", "sharp")}
    </div>
    `
  );
}


/*
  Helper לעורך הצדדי / GrapesJS Inspector:
  קוראים לפונקציה הזו על הקומפוננטה שנבחרה כדי לשנות את הזווית בסליידר.
  value 0 = מרובע חד, value 64 = עגול מאוד.
*/
export function getRadiusStyleForEditor(value: number) {
  return getRadiusVars(value);
}
