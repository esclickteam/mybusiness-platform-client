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
  statCard,
  subscribeForm,
  testimonialCard,
  textClass,
  videoBox,
  whatsappButton,
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — Store Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/storeLayoutVariants.ts

  סקשן חנות מקצועי בסגנון Shopify.
  מתאים ל:
  - חנות אונליין
  - קולקציות
  - מוצרים
  - מבצעים
  - מוצר מוביל
  - קטגוריות
  - Lookbook
  - Bundle
  - Digital Products
  - הזמנות בוואטסאפ
  - מועדון לקוחות / קופונים
*/

const kind = "store" as const;

function moneyBadge(price: string) {
  return `
<span
  class="inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]"
  data-editable-text="true"
>
  ${price}
</span>
`;
}

function saleBadge(text = "SALE") {
  return `
<span
  class="absolute right-5 top-5 z-10 rounded-full bg-rose-500 px-4 py-2 text-xs font-black text-black shadow-xl"
  data-editable-text="true"
>
  ${text}
</span>
`;
}

function productShopifyCard(
  title: string,
  price: string,
  imageUrl = sectionImages.product,
  badge = "חדש"
) {
  return `
<article
  class="group rounded-[34px] border border-slate-200 bg-white p-4 shadow-[0_24px_80px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_34px_120px_rgba(124,58,237,0.14)]"
  data-bizuply-block="product-card"
  data-editable-card="true"
>
  <div class="relative overflow-hidden rounded-[28px] bg-slate-50" data-media-replaceable="true">
    <span
      class="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-800 shadow-lg"
      data-editable-text="true"
    >
      ${badge}
    </span>

    <img
      src="${imageUrl}"
      alt=""
      class="h-[310px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
      data-editable-image="true"
    />

    <div class="absolute inset-x-4 bottom-4 translate-y-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
      <a
        href="#store"
        class="flex min-h-12 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-xl"
        data-editable-link="true"
      >
        הוספה לסל
      </a>
    </div>
  </div>

  <div class="px-2 pb-2 pt-5">
    <h3 class="text-xl font-black tracking-[-0.02em] text-slate-800" data-editable-text="true">
      ${title}
    </h3>

    <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
      תיאור קצר של המוצר, יתרון מרכזי ולמה כדאי לרכוש.
    </p>

    <div class="mt-5 flex items-center justify-between gap-3">
      ${moneyBadge(price)}

      <a
        href="#store"
        class="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-700"
        data-editable-link="true"
      >
        פרטים
      </a>
    </div>
  </div>
</article>
`;
}

function productLuxuryCard(
  title: string,
  price: string,
  imageUrl = sectionImages.product,
  oldPrice = ""
) {
  return `
<article
  class="group overflow-hidden rounded-[38px] border border-slate-200 bg-white shadow-[0_28px_100px_rgba(15,23,42,0.09)] transition hover:-translate-y-1 hover:shadow-[0_42px_140px_rgba(15,23,42,0.16)]"
  data-bizuply-block="product-card"
  data-editable-card="true"
>
  <div class="relative overflow-hidden bg-slate-100" data-media-replaceable="true">
    ${
      oldPrice
        ? `<span class="absolute right-5 top-5 z-10 rounded-full bg-rose-500 px-4 py-2 text-xs font-black text-black shadow-xl" data-editable-text="true">מבצע</span>`
        : `<span class="absolute right-5 top-5 z-10 rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-800 shadow-xl" data-editable-text="true">Premium</span>`
    }

    <img
      src="${imageUrl}"
      alt=""
      class="h-[390px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
      data-editable-image="true"
    />
  </div>

  <div class="p-7">
    <h3 class="text-2xl font-black tracking-[-0.03em] text-slate-800" data-editable-text="true">
      ${title}
    </h3>

    <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
      מוצר פרימיום עם תיאור קצר, יתרון ברור וחוויית רכישה מקצועית.
    </p>

    <div class="mt-6 flex items-end justify-between gap-4">
      <div>
        ${
          oldPrice
            ? `<p class="text-sm font-black text-slate-400 line-through" data-editable-text="true">${oldPrice}</p>`
            : ""
        }

        <strong class="text-3xl font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          ${price}
        </strong>
      </div>

      <a
        href="#store"
        class="inline-flex min-h-12 items-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-xl"
        data-editable-link="true"
      >
        קנייה
      </a>
    </div>
  </div>
</article>
`;
}

function categoryTile(title: string, imageUrl: string, count = "12 מוצרים") {
  return `
<a
  href="#store"
  class="group relative min-h-[360px] overflow-hidden rounded-[38px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 p-7 shadow-[0_30px_100px_rgba(15,23,42,0.14)]"
  data-editable-card="true"
  data-media-replaceable="true"
>
  <img
    src="${imageUrl}"
    alt=""
    class="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-[1.04]"
    data-editable-image="true"
  />

  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>

  <div class="relative flex h-full min-h-[300px] flex-col justify-end">
    <span
      class="mb-3 inline-flex w-fit rounded-full bg-white/18 px-4 py-2 text-xs font-black text-black backdrop-blur-xl"
      data-editable-text="true"
    >
      ${count}
    </span>

    <h3 class="text-3xl font-black tracking-[-0.04em] text-white" data-editable-text="true">
      ${title}
    </h3>

    <span class="mt-4 inline-flex text-sm font-black text-black/80" data-editable-text="true">
      צפייה בקולקציה ←
    </span>
  </div>
</a>
`;
}

function miniCartItem(title: string, price: string, imageUrl: string) {
  return `
<div class="flex items-center gap-4 rounded-[24px] bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <img
    src="${imageUrl}"
    alt=""
    class="h-20 w-20 rounded-[18px] object-cover"
    data-editable-image="true"
  />

  <div class="min-w-0 flex-1">
    <h4 class="truncate text-sm font-black text-slate-800" data-editable-text="true">${title}</h4>
    <p class="mt-1 text-xs font-bold text-slate-400" data-editable-text="true">כמות: 1</p>
  </div>

  <strong class="text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
    ${price}
  </strong>
</div>
`;
}

function filterChip(text: string, active = false) {
  return `
<button
  type="button"
  class="rounded-full px-5 py-3 text-xs font-black transition ${
    active
      ? "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-xl"
      : "border border-slate-200 bg-white text-slate-600 shadow-sm"
  }"
  data-editable-text="true"
>
  ${text}
</button>
`;
}

function storeTrustItem(title: string, text: string, icon = "✓") {
  return `
<div class="flex items-start gap-4 rounded-[26px] border border-slate-200 bg-white p-5 shadow-[0_16px_50px_rgba(15,23,42,0.05)]" data-editable-card="true">
  <div class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-sm font-black text-[var(--biz-primary,#7C3AED)]">
    ${icon}
  </div>

  <div>
    <h3 class="text-base font-black text-slate-800" data-editable-text="true">${title}</h3>
    <p class="mt-1 text-sm font-bold leading-6 text-slate-500" data-editable-text="true">${text}</p>
  </div>
</div>
`;
}

function lookbookImage(src: string, title: string, height = "h-[520px]") {
  return `
<div class="group relative overflow-hidden rounded-[38px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_30px_100px_rgba(15,23,42,0.14)]" data-editable-card="true" data-media-replaceable="true">
  <img
    src="${src}"
    alt=""
    class="${height} w-full object-cover opacity-90 transition duration-500 group-hover:scale-[1.04]"
    data-editable-image="true"
  />

  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

  <div class="absolute bottom-6 right-6 left-6">
    <p class="text-2xl font-black text-black" data-editable-text="true">${title}</p>

    <a
      href="#store"
      class="mt-4 inline-flex rounded-full bg-white px-5 py-3 text-xs font-black text-slate-800 shadow-xl"
      data-editable-link="true"
    >
      קנייה מהמראה
    </a>
  </div>
</div>
`;
}

export const storeLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "store-layout-1",
    kind,
    "Shopify Grid",
    "גריד מוצרים מקצועי בסגנון Shopify עם כרטיסים נקיים, Hover וכפתור רכישה.",
    "מומלץ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "מוצרים נבחרים",
        "הציגו מוצרים בצורה מקצועית, נקייה וממירה — בדיוק כמו חנות אונליין רצינית.",
        "center"
      )}

      <div class="mt-10 flex flex-wrap justify-center gap-3">
        ${filterChip("הכל", true)}
        ${filterChip("חדשים")}
        ${filterChip("מבצעים")}
        ${filterChip("הכי נמכרים")}
        ${filterChip("פרימיום")}
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${productShopifyCard("מוצר ראשון", "₪129", sectionImages.product, "חדש")}
        ${productShopifyCard("מוצר שני", "₪189", sectionImages.store, "Best Seller")}
        ${productShopifyCard("מוצר שלישי", "₪249", sectionImages.beauty, "Premium")}
        ${productShopifyCard("מוצר רביעי", "₪99", sectionImages.food, "מבצע")}
        ${productShopifyCard("מוצר חמישי", "₪349", sectionImages.salon, "חדש")}
        ${productShopifyCard("מוצר שישי", "₪459", sectionImages.realEstate, "VIP")}
      </div>
      `,
      "data-bizuply-block-products"
    ),
    { featured: true, tags: ["shopify", "grid", "products"] }
  ),

  createVariant(
    "store-layout-2",
    kind,
    "Hero קולקציה וואו",
    "פתיחה חזקה לחנות עם קולקציה, תמונה גדולה וכפתורי רכישה.",
    "Hero",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] bg-gradient-to-br from-slate-950 via-violet-950 to-fuchsia-900 p-8 text-white shadow-[0_58px_190px_rgba(76,29,149,0.34)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-400/30 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-violet-400/30 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
              New Collection
            </p>

            <h2 class="text-5xl font-black leading-[0.94] tracking-[-0.065em] text-white md:text-7xl" data-editable-text="true">
              קולקציה חדשה שנראית כמו מותג פרימיום
            </h2>

            <p class="mt-6 max-w-2xl text-xl font-bold leading-10 text-white/75" data-editable-text="true">
              מבנה פתיחה לחנות עם תחושה של Shopify / Luxury Brand — מתאים למוצרים, אופנה, ביוטי, אוכל, דיגיטל ועוד.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("קנייה עכשיו", "#store")}
              ${darkButton("צפייה בקולקציה", "#store")}
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            ${imageBlock(sectionImages.product, "min-h-[520px]", "rounded-[38px]")}
            <div class="grid gap-5">
              ${imageBlock(sectionImages.store, "min-h-[250px]", "rounded-[34px]")}
              ${imageBlock(sectionImages.beauty, "min-h-[250px]", "rounded-[34px]")}
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["hero", "collection", "luxury"] }
  ),

  createVariant(
    "store-layout-3",
    kind,
    "מוצר מוביל גדול",
    "מוצר אחד מרכזי עם תמונה גדולה, מחיר, יתרונות וכפתור רכישה.",
    "Featured",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        ${imageBlock(sectionImages.product, "min-h-[640px]", "rounded-[46px]")}

        <div>
          <p class="${pillClass}" data-editable-text="true">מוצר מוביל</p>

          <h2 class="${h2Class}" data-editable-text="true">
            מוצר אחד שמקבל את כל תשומת הלב
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים למוצר חדש, מוצר הכי נמכר, מוצר פרימיום, חבילת שירות או קולקציה.
          </p>

          <div class="mt-8 flex flex-wrap items-end gap-5">
            <div>
              <p class="text-sm font-black text-slate-400 line-through" data-editable-text="true">₪399</p>
              <strong class="text-6xl font-black tracking-[-0.06em] text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
                ₪249
              </strong>
            </div>

            <span class="rounded-full bg-rose-50 px-5 py-3 text-sm font-black text-rose-600" data-editable-text="true">
              מבצע מוגבל
            </span>
          </div>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${storeTrustItem("משלוח מהיר", "אפשרות למשלוח עד הבית.", "↗")}
            ${storeTrustItem("תשלום מאובטח", "תשלום נוח ובטוח.", "₪")}
            ${storeTrustItem("אחריות שירות", "מענה אחרי הרכישה.", "✓")}
            ${storeTrustItem("מלאי מוגבל", "מוצר זמין עכשיו.", "◈")}
          </div>

          <div class="mt-9 flex flex-wrap gap-4">
            ${primaryButton("הוספה לסל", "#store")}
            ${secondaryButton("שאלה על המוצר", "#contact")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["featured", "product", "conversion"] }
  ),

  createVariant(
    "store-layout-4",
    kind,
    "קולקציות קטגוריות",
    "כרטיסי קטגוריות גדולים כמו עמוד קולקציות בשופיפיי.",
    "Collections",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "קולקציות",
        "ארגנו מוצרים לפי קטגוריות כדי שהלקוח ימצא מהר את מה שהוא מחפש.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${categoryTile("קולקציה ראשונה", sectionImages.store, "24 מוצרים")}
        ${categoryTile("קולקציה שנייה", sectionImages.product, "18 מוצרים")}
        ${categoryTile("קולקציה שלישית", sectionImages.beauty, "12 מוצרים")}
      </div>
      `
    ),
    { tags: ["collections", "categories", "shopify"] }
  ),

  createVariant(
    "store-layout-5",
    kind,
    "חנות כהה פרימיום",
    "גריד מוצרים כהה ויוקרתי שמתאים למותג פרימיום.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative mx-auto max-w-[900px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
            Premium Store
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            חנות שנראית כמו מותג גדול
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים למוצרים יוקרתיים, מותגים, אופנה, ביוטי, תכשיטים, דיגיטל ומוצרי פרימיום.
          </p>
        </div>

        <div class="relative mt-12 grid gap-6 md:grid-cols-3">
          ${productLuxuryCard("Premium Product", "₪349", sectionImages.product)}
          ${productLuxuryCard("Signature Item", "₪499", sectionImages.store)}
          ${productLuxuryCard("Luxury Bundle", "₪699", sectionImages.beauty)}
        </div>

        <div class="relative mt-10 flex justify-center gap-4">
          ${primaryButton("כניסה לחנות", "#store")}
          ${darkButton("שאלה על מוצר", "#contact")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "luxury"] }
  ),

  createVariant(
    "store-layout-6",
    kind,
    "Lookbook Magazine",
    "תצוגת לוקבוק / קטלוג כמו מותג אופנה או Lifestyle.",
    "Lookbook",
    sectionShell(
      kind,
      `
      <div class="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
        <div class="lg:sticky lg:top-10 lg:self-start">
          <p class="${pillClass}" data-editable-text="true">Lookbook</p>

          <h2 class="${h2Class}" data-editable-text="true">
            השראה לקנייה דרך תמונות וסגנון
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לאופנה, ביוטי, עיצוב, חנות מוצרים, אוכל, אירועים וקטלוגים יוקרתיים.
          </p>

          ${actionRow("קנייה מהמראה", "צפייה בכל המוצרים")}
        </div>

        <div class="grid gap-6 md:grid-cols-2">
          ${lookbookImage(sectionImages.beauty, "Look ראשון", "h-[620px]")}
          <div class="grid gap-6">
            ${lookbookImage(sectionImages.product, "Look שני", "h-[300px]")}
            ${lookbookImage(sectionImages.store, "Look שלישי", "h-[300px]")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["lookbook", "fashion", "editorial"] }
  ),

  createVariant(
    "store-layout-7",
    kind,
    "קרוסלת מוצרים",
    "שורת מוצרים נגללת לרוחב כמו חנות מודרנית.",
    "Carousel",
    sectionShell(
      kind,
      `
      <div class="flex flex-col gap-8">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p class="${pillClass}" data-editable-text="true">הכי נמכרים</p>

            <h2 class="${h2Class}" data-editable-text="true">
              מוצרים שאנשים אוהבים
            </h2>

            <p class="${textClass}" data-editable-text="true">
              קרוסלה שמתאימה להצגת מוצרים רבים בלי להעמיס על העמוד.
            </p>
          </div>

          ${primaryButton("כל המוצרים", "#store")}
        </div>

        <div class="flex gap-6 overflow-x-auto pb-5">
          <div class="min-w-[310px] md:min-w-[360px]">
            ${productShopifyCard("מוצר ראשון", "₪129", sectionImages.product, "חדש")}
          </div>
          <div class="min-w-[310px] md:min-w-[360px]">
            ${productShopifyCard("מוצר שני", "₪189", sectionImages.store, "Best")}
          </div>
          <div class="min-w-[310px] md:min-w-[360px]">
            ${productShopifyCard("מוצר שלישי", "₪249", sectionImages.beauty, "VIP")}
          </div>
          <div class="min-w-[310px] md:min-w-[360px]">
            ${productShopifyCard("מוצר רביעי", "₪99", sectionImages.food, "Sale")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["carousel", "products", "mobile"] }
  ),

  createVariant(
    "store-layout-8",
    kind,
    "Sale Collection",
    "סקשן מבצעי חנות עם מחירים קודמים, מחירים חדשים וכרטיסים חזקים.",
    "Sale",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-rose-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="mx-auto max-w-[880px] text-center">
          <p class="${pillClass}" data-editable-text="true">Sale Collection</p>

          <h2 class="${h2Class}" data-editable-text="true">
            מבצע לזמן מוגבל
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
            הציגו מוצרים במבצע בצורה בולטת וממירה.
          </p>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          ${productLuxuryCard("מוצר במבצע", "₪199", sectionImages.product, "₪299")}
          ${productLuxuryCard("חבילת מבצע", "₪349", sectionImages.store, "₪449")}
          ${productLuxuryCard("מוצר פרימיום", "₪499", sectionImages.beauty, "₪699")}
        </div>
      </div>
      `
    ),
    { tags: ["sale", "discount", "products"] }
  ),

  createVariant(
    "store-layout-9",
    kind,
    "מיני סל קניות",
    "תצוגת חנות עם סל קניות צדדי, כאילו האתר כבר עובד.",
    "Cart",
    sectionShell(
      kind,
      `
      <div class="grid items-start gap-10 lg:grid-cols-[1fr_0.42fr]">
        <div>
          <div class="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p class="${pillClass}" data-editable-text="true">Shop Preview</p>

              <h2 class="${h2Class}" data-editable-text="true">
                חנות עם חוויית קנייה מלאה
              </h2>

              <p class="${textClass}" data-editable-text="true">
                גריד מוצרים לצד סל קניות שממחיש לבעל העסק איך החנות תרגיש.
              </p>
            </div>
          </div>

          <div class="grid gap-6 md:grid-cols-2">
            ${productShopifyCard("מוצר ראשון", "₪129", sectionImages.product, "חדש")}
            ${productShopifyCard("מוצר שני", "₪189", sectionImages.store, "Best")}
            ${productShopifyCard("מוצר שלישי", "₪249", sectionImages.beauty, "VIP")}
            ${productShopifyCard("מוצר רביעי", "₪99", sectionImages.food, "Sale")}
          </div>
        </div>

        <aside class="rounded-[38px] border border-slate-200 bg-slate-50 p-6 shadow-[0_30px_100px_rgba(15,23,42,0.10)]" data-editable-card="true">
          <div class="mb-6 flex items-center justify-between">
            <h3 class="text-2xl font-black text-slate-800" data-editable-text="true">הסל שלך</h3>
            <span class="rounded-full border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800" data-editable-text="true">3 פריטים</span>
          </div>

          <div class="grid gap-4">
            ${miniCartItem("מוצר ראשון", "₪129", sectionImages.product)}
            ${miniCartItem("מוצר שני", "₪189", sectionImages.store)}
            ${miniCartItem("מוצר שלישי", "₪249", sectionImages.beauty)}
          </div>

          <div class="mt-6 rounded-[28px] bg-white p-5">
            <div class="flex items-center justify-between">
              <span class="text-sm font-black text-slate-500" data-editable-text="true">סה״כ</span>
              <strong class="text-3xl font-black text-slate-800" data-editable-text="true">₪567</strong>
            </div>

            <a href="#checkout" class="mt-5 flex min-h-14 items-center justify-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-black shadow-xl" data-editable-link="true">
              מעבר לתשלום
            </a>
          </div>
        </aside>
      </div>
      `
    ),
    { tags: ["cart", "shopify", "checkout"] }
  ),

  createVariant(
    "store-layout-10",
    kind,
    "Product Story",
    "מוצר עם סיפור, יתרונות ותמונה גדולה בסגנון מותג.",
    "Story",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">סיפור המוצר</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לא רק מוצר — חוויה שהלקוח רוצה לקבל
          </h2>

          <p class="${textClass}" data-editable-text="true">
            ספרו למה המוצר מיוחד, ממה הוא עשוי, למי הוא מתאים ומה הערך שהוא נותן.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${storeTrustItem("איכות גבוהה", "חומר / שירות ברמה גבוהה.", "✓")}
            ${storeTrustItem("עיצוב מוקפד", "מראה מקצועי ונקי.", "✦")}
            ${storeTrustItem("משלוח מהיר", "מגיע עד הלקוח.", "↗")}
            ${storeTrustItem("תשלום מאובטח", "רכישה נוחה ובטוחה.", "₪")}
          </div>

          <div class="mt-9 flex flex-wrap items-center gap-4">
            ${primaryButton("קנייה עכשיו", "#store")}
            ${moneyBadge("₪249")}
          </div>
        </div>

        ${imageBlock(sectionImages.product, "min-h-[620px]", "rounded-[46px]")}
      </div>
      `
    ),
    { tags: ["story", "product", "brand"] }
  ),

  createVariant(
    "store-layout-11",
    kind,
    "הזמנה בוואטסאפ",
    "חנות שמתאימה לעסקים שרוצים לקבל הזמנות דרך וואטסאפ.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-700" data-editable-text="true">
              הזמנה מהירה
            </p>

            <h2 class="${h2Class}" data-editable-text="true">
              לקוח רואה מוצר ושולח הזמנה בוואטסאפ
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לעסקים שלא רוצים סליקה מלאה בהתחלה ורוצים לקבל פניות והזמנות דרך וואטסאפ.
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              ${storeTrustItem("בחירת מוצר", "הלקוח רואה מוצר באתר.", "1")}
              ${storeTrustItem("שליחת וואטסאפ", "הזמנה ישירה לעסק.", "2")}
              ${storeTrustItem("סגירת פרטים", "מידה, צבע, משלוח ותשלום.", "3")}
              ${storeTrustItem("שירות אישי", "שיחה ישירה ומהירה.", "WA")}
            </div>

            <div class="mt-9 flex flex-wrap gap-4">
              ${whatsappButton("הזמנה בוואטסאפ")}
              ${secondaryButton("צפייה במוצרים", "#store")}
            </div>
          </div>

          <div class="${cardClass}">
            <div class="rounded-[32px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
              <p class="text-sm font-black text-black/60" data-editable-text="true">
                WhatsApp Order
              </p>

              <div class="mt-5 grid gap-4">
                <div class="rounded-[24px] bg-white/10 p-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
                  שלום, אני רוצה להזמין את המוצר הזה.
                </div>

                <div class="mr-auto rounded-[24px] bg-emerald-500 p-4 text-sm font-bold leading-7 text-white" data-editable-text="true">
                  בשמחה! איזה צבע ומידה תרצו?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["whatsapp", "orders", "store"] }
  ),

  createVariant(
    "store-layout-12",
    kind,
    "Bundle / חבילה",
    "חבילת מוצרים או שירותים עם מחיר מיוחד.",
    "Bundle",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">Bundle Deal</p>

            <h2 class="${h2Class}" data-editable-text="true">
              חבילה משתלמת שמעלה את ערך ההזמנה
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לחבילות מוצרים, סטים, שירותים, קורסים, מנויים או ערכות.
            </p>

            <div class="mt-8 grid gap-4">
              ${miniCartItem("מוצר ראשון", "₪129", sectionImages.product)}
              ${miniCartItem("מוצר שני", "₪189", sectionImages.store)}
              ${miniCartItem("מוצר שלישי", "₪249", sectionImages.beauty)}
            </div>
          </div>

          <div class="${softCardClass}">
            <p class="${pillClass}" data-editable-text="true">מחיר חבילה</p>

            <h3 class="text-5xl font-black tracking-[-0.06em] text-slate-800" data-editable-text="true">
              ₪399
            </h3>

            <p class="mt-2 text-sm font-black text-slate-400 line-through" data-editable-text="true">
              במקום ₪567
            </p>

            <p class="mt-5 text-base font-bold leading-8 text-slate-500" data-editable-text="true">
              הצעה שמגדילה סל קנייה ומרגישה משתלמת ללקוח.
            </p>

            <div class="mt-8">
              ${primaryButton("הוספת החבילה לסל", "#store")}
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["bundle", "upsell", "shopify"] }
  ),

  createVariant(
    "store-layout-13",
    kind,
    "חנות + ביקורות",
    "מוצרים לצד ביקורות לקוחות שמחזקות רכישה.",
    "Reviews",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">לקוחות קנו ואהבו</p>

          <h2 class="${h2Class}" data-editable-text="true">
            ביקורות שמחזקות את ההחלטה לקנות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            שילוב מוצרים עם ביקורות מעלה אמון ומשפר המרות.
          </p>

          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            ${productShopifyCard("מוצר מומלץ", "₪249", sectionImages.product, "Best")}
            ${productShopifyCard("מוצר אהוב", "₪189", sectionImages.store, "Top")}
          </div>
        </div>

        <div class="grid gap-5">
          ${testimonialCard(
            "המוצר הגיע מהר, נראה מעולה והאיכות ממש טובה.",
            "לקוחה מרוצה"
          )}
          ${testimonialCard(
            "שירות מצוין ועזרו לי לבחור בדיוק מה שמתאים לי.",
            "לקוח חוזר"
          )}
        </div>
      </div>
      `
    ),
    { tags: ["reviews", "trust", "products"] }
  ),

  createVariant(
    "store-layout-14",
    kind,
    "חנות + ניוזלטר",
    "אזור חנות עם הרשמה לקופונים ועדכוני קולקציות.",
    "Newsletter",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-slate-950 via-violet-950 to-fuchsia-900 p-8 text-white shadow-[0_54px_180px_rgba(76,29,149,0.32)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
              Store Club
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.055em] text-white md:text-6xl" data-editable-text="true">
              קבלו קופונים וקולקציות לפני כולם
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/72" data-editable-text="true">
              מתאים למותגים שרוצים לבנות קהל, מועדון לקוחות ורכישות חוזרות.
            </p>

            <div class="mt-9 rounded-[34px] bg-white/12 p-5 backdrop-blur-2xl">
              ${subscribeForm("קבלת קופון")}
            </div>
          </div>

          <div class="grid gap-5 md:grid-cols-2">
            ${imageBlock(sectionImages.product, "min-h-[260px]", "rounded-[34px]")}
            ${imageBlock(sectionImages.store, "min-h-[260px]", "rounded-[34px]")}
            ${imageBlock(sectionImages.beauty, "min-h-[260px]", "rounded-[34px]")}
            ${imageBlock(sectionImages.food, "min-h-[260px]", "rounded-[34px]")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["newsletter", "club", "store"] }
  ),

  createVariant(
    "store-layout-15",
    kind,
    "Digital Products",
    "חנות לקורסים, קבצים, מדריכים או מוצרים דיגיטליים.",
    "Digital",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">Digital Store</p>

          <h2 class="${h2Class}" data-editable-text="true">
            מכירת קורסים, מדריכים ומוצרים דיגיטליים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים ל־PDF, קורסים, תבניות, קבצים, הדרכות, מנויים ותוכן נעול.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${storeTrustItem("גישה מיידית", "הלקוח מקבל גישה אחרי רכישה.", "↗")}
            ${storeTrustItem("תשלום אונליין", "רכישה מהירה ומאובטחת.", "₪")}
            ${storeTrustItem("תוכן דיגיטלי", "קורס, PDF או קובץ להורדה.", "PDF")}
            ${storeTrustItem("אזור אישי", "אפשר לחבר בהמשך למערכת.", "👤")}
          </div>

          ${actionRow("רכישה עכשיו", "צפייה בתוכן")}
        </div>

        <div class="grid gap-5">
          ${productLuxuryCard("קורס דיגיטלי", "₪499", sectionImages.course)}
          ${productLuxuryCard("מדריך PDF", "₪99", sectionImages.office)}
        </div>
      </div>
      `
    ),
    { tags: ["digital", "course", "download"] }
  ),

  createVariant(
    "store-layout-16",
    kind,
    "חנות עם וידאו",
    "מוצר או קולקציה עם וידאו תדמית ליד המוצרים.",
    "Video",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        ${videoBox()}

        <div>
          <p class="${pillClass}" data-editable-text="true">Product Video</p>

          <h2 class="${h2Class}" data-editable-text="true">
            וידאו שמוכר את המוצר טוב יותר מתמונה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים להסבר מוצר, הדגמה, שימוש, Lookbook, קורס או סרטון תדמית.
          </p>

          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            ${productShopifyCard("מוצר ראשון", "₪129", sectionImages.product, "חדש")}
            ${productShopifyCard("מוצר שני", "₪189", sectionImages.store, "Best")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["video", "product", "demo"] }
  ),

  createVariant(
    "store-layout-17",
    kind,
    "חנות עם מדיה להוספה",
    "מבנה עם מוצרים ואזור ברור להוספת תמונה או וידאו.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${productShopifyCard("מוצר ראשון", "₪129", sectionImages.product, "חדש")}
          ${addMediaBox("הוספת מוצר / תמונה / וידאו")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">הוספת מוצרים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            בעל העסק יכול להוסיף תמונות, וידאו ומוצרים חדשים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לחנות דינמית שבה בעל העסק בונה את הקטלוג שלו לפי מוצרים, קולקציות ומבצעים.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${storeTrustItem("תמונה", "החלפת תמונת מוצר.", "▧")}
            ${storeTrustItem("וידאו", "הוספת סרטון מוצר.", "▶")}
            ${storeTrustItem("מחיר", "עריכת מחיר וכפתור.", "₪")}
            ${storeTrustItem("קישור", "קישור לקנייה / וואטסאפ.", "↗")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "store-layout-18",
    kind,
    "CTA חנות וואו",
    "סקשן קצר וחזק לסוף עמוד שמוביל לרכישה.",
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
              Ready to shop?
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              מצאתם משהו שאהבתם? קנו עכשיו או שאלו אותנו
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              כפתור רכישה, וואטסאפ או מעבר לחנות — הכל ברור וממיר.
            </p>
          </div>

          <div class="rounded-[34px] bg-white/12 p-6 backdrop-blur-2xl">
            <div class="grid gap-3">
              ${miniCartItem("מוצר נבחר", "₪249", sectionImages.product)}
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <a
                href="#store"
                class="inline-flex min-h-14 flex-1 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl"
                data-editable-link="true"
              >
                לקנייה
              </a>

              <a
                href="https://wa.me/972500000000"
                class="inline-flex min-h-14 flex-1 items-center justify-center rounded-2xl bg-white/15 px-8 text-sm font-black text-black ring-1 ring-white/20"
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
    { tags: ["cta", "wow", "shopify"] }
  ),
];