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
  textClass,
  videoBox,
  whatsappButton,
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — Reviews Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/reviewsLayoutVariants.ts

  סקשן ביקורות מקצועי.
  מתאים ל:
  - ביקורות לקוחות
  - דירוגים
  - טופס השארת ביקורת
  - ביקורות Google / Facebook / אתר
  - ביקורות מוצר
  - ביקורות שירות
  - ביקורות לקליניקה
  - ביקורות חנות
  - ביקורות SaaS
  - הוכחת אמון
*/

const kind = "reviews" as const;

function stars(size = "text-xl") {
  return `<div class="${size} text-amber-400" data-editable-text="true">★★★★★</div>`;
}

function reviewCard(
  quote: string,
  name: string,
  meta = "ביקורת מאומתת",
  initials = "ל"
) {
  return `
<article class="${cardClass}" data-bizuply-block="review-card" data-editable-card="true">
  <div class="flex items-center justify-between gap-4">
    ${stars()}

    <span class="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-600" data-editable-text="true">
      מאומת
    </span>
  </div>

  <p class="mt-5 text-base font-bold leading-8 text-slate-600" data-editable-text="true">
    ${quote}
  </p>

  <div class="mt-7 flex items-center gap-4">
    <div class="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-sm font-black text-white">
      ${initials}
    </div>

    <div>
      <p class="text-sm font-black text-slate-950" data-editable-text="true">
        ${name}
      </p>

      <p class="mt-1 text-xs font-bold text-slate-400" data-editable-text="true">
        ${meta}
      </p>
    </div>
  </div>
</article>
`;
}

function compactReview(
  quote: string,
  name: string,
  score = "5.0"
) {
  return `
<div class="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-bizuply-block="review-card" data-editable-card="true">
  <div class="flex items-center justify-between gap-4">
    ${stars("text-lg")}

    <span class="rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-xs font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
      ${score}
    </span>
  </div>

  <p class="mt-4 text-sm font-bold leading-7 text-slate-600" data-editable-text="true">
    ${quote}
  </p>

  <p class="mt-5 text-sm font-black text-slate-950" data-editable-text="true">
    ${name}
  </p>
</div>
`;
}

function darkReviewCard(
  quote: string,
  name: string,
  meta = "Verified review"
) {
  return `
<article class="rounded-[34px] border border-white/10 bg-white/8 p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]" data-bizuply-block="review-card" data-editable-card="true">
  <div class="flex items-center justify-between gap-4">
    <div class="text-xl text-amber-300" data-editable-text="true">★★★★★</div>

    <span class="rounded-full bg-white/10 px-4 py-2 text-xs font-black text-white/70" data-editable-text="true">
      5.0
    </span>
  </div>

  <p class="mt-5 text-base font-bold leading-8 text-white/75" data-editable-text="true">
    ${quote}
  </p>

  <div class="mt-7 flex items-center gap-4">
    <div class="h-12 w-12 rounded-2xl bg-white/12"></div>

    <div>
      <p class="text-sm font-black text-white" data-editable-text="true">${name}</p>
      <p class="mt-1 text-xs font-bold text-white/45" data-editable-text="true">${meta}</p>
    </div>
  </div>
</article>
`;
}

function ratingBar(label: string, value: string, width = "92%") {
  return `
<div data-editable-card="true">
  <div class="mb-2 flex items-center justify-between gap-4">
    <span class="text-sm font-black text-slate-600" data-editable-text="true">${label}</span>
    <span class="text-sm font-black text-slate-400" data-editable-text="true">${value}</span>
  </div>

  <div class="h-3 overflow-hidden rounded-full bg-slate-100">
    <div class="h-full rounded-full bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)]" style="width:${width}"></div>
  </div>
</div>
`;
}

function reviewSummaryCard() {
  return `
<div class="${softCardClass}" data-bizuply-block="reviews-summary" data-editable-card="true">
  <p class="${pillClass}" data-editable-text="true">דירוג לקוחות</p>

  <div class="mt-5 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <strong class="block text-7xl font-black tracking-[-0.08em] text-slate-950" data-editable-text="true">
        4.9
      </strong>

      <div class="mt-3">
        ${stars("text-2xl")}
      </div>

      <p class="mt-3 text-sm font-bold text-slate-500" data-editable-text="true">
        מבוסס על 128 ביקורות
      </p>
    </div>

    <div class="grid gap-3 sm:min-w-[260px]">
      ${ratingBar("5 כוכבים", "112", "92%")}
      ${ratingBar("4 כוכבים", "14", "64%")}
      ${ratingBar("3 כוכבים", "2", "22%")}
    </div>
  </div>
</div>
`;
}

function reviewFormCard(buttonText = "שליחת ביקורת") {
  return `
<div class="${softCardClass}" data-bizuply-block="review-form" data-editable-card="true">
  <h3 class="text-3xl font-black text-slate-950" data-editable-text="true">
    השאירו ביקורת
  </h3>

  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ספרו לנו איך הייתה החוויה שלכם.
  </p>

  <div class="mt-6 flex gap-2 text-3xl text-amber-400" data-editable-text="true">
    ★★★★★
  </div>

  <form class="mt-7 grid gap-4" data-bizuply-block="review-form-fields">
    <input
      class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
      placeholder="שם מלא"
      data-editable-input="true"
    />

    <input
      class="min-h-14 w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
      placeholder="אימייל / טלפון"
      data-editable-input="true"
    />

    <textarea
      class="min-h-[130px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:border-[var(--biz-primary,#7C3AED)] focus:bg-white"
      placeholder="כתבו ביקורת..."
      data-editable-input="true"
    ></textarea>

    <button
      type="button"
      class="inline-flex min-h-[56px] items-center justify-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] px-8 text-sm font-black text-white shadow-xl"
      data-editable-text="true"
    >
      ${buttonText}
    </button>
  </form>
</div>
`;
}

function platformReview(platform: string, score: string, text: string) {
  return `
<div class="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <div class="flex items-center justify-between gap-4">
    <h3 class="text-xl font-black text-slate-950" data-editable-text="true">${platform}</h3>
    <span class="rounded-full bg-amber-50 px-4 py-2 text-xs font-black text-amber-600" data-editable-text="true">${score}</span>
  </div>

  <div class="mt-4">
    ${stars()}
  </div>

  <p class="mt-4 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>
</div>
`;
}

function reviewFilterChip(text: string, active = false) {
  return `
<button
  type="button"
  class="rounded-full px-5 py-3 text-xs font-black transition ${
    active
      ? "bg-slate-950 text-white shadow-xl"
      : "border border-slate-200 bg-white text-slate-600 shadow-sm"
  }"
  data-editable-text="true"
>
  ${text}
</button>
`;
}

export const reviewsLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "reviews-layout-1",
    kind,
    "ביקורות בכרטיסים",
    "גריד ביקורות מקצועי עם כוכבים, טקסט ושם לקוח.",
    "מומלץ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "ביקורות לקוחות",
        "הציגו ביקורות אמיתיות שמחזקות אמון ועוזרות ללקוחות חדשים לפנות.",
        "center"
      )}

      <div class="mt-10 flex flex-wrap justify-center gap-3">
        ${reviewFilterChip("הכל", true)}
        ${reviewFilterChip("5 כוכבים")}
        ${reviewFilterChip("שירות")}
        ${reviewFilterChip("מוצרים")}
        ${reviewFilterChip("תורים")}
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${reviewCard(
          "שירות מקצועי, נעים וברור. קיבלתי מענה מדויק והרגשתי שיש על מי לסמוך.",
          "לקוחה מרוצה",
          "ביקורת מאומתת",
          "ד"
        )}
        ${reviewCard(
          "הכל היה מסודר, מהיר וברמה גבוהה. ממליצה בחום לכל מי שמחפש שירות אמין.",
          "לקוח מרוצה",
          "לקוח חוזר",
          "א"
        )}
        ${reviewCard(
          "חוויה מעולה מההתחלה ועד הסוף. האתר נתן לי ביטחון לפנות ולקבוע.",
          "לקוחה חדשה",
          "פנייה מהאתר",
          "מ"
        )}
      </div>
      `
    ),
    { featured: true, tags: ["cards", "reviews", "trust"] }
  ),

  createVariant(
    "reviews-layout-2",
    kind,
    "סיכום דירוגים",
    "דירוג ממוצע, כוכבים והתפלגות ביקורות.",
    "Rating",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">אמון לקוחות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            דירוג גבוה שמראה ללקוח שהוא בידיים טובות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            סקשן שמציג ממוצע ביקורות, כמות ביקורות והתפלגות כוכבים בצורה מקצועית.
          </p>

          ${actionRow("השארת ביקורת", "כל הביקורות")}
        </div>

        ${reviewSummaryCard()}
      </div>
      `
    ),
    { tags: ["rating", "summary", "score"] }
  ),

  createVariant(
    "reviews-layout-3",
    kind,
    "ביקורות + טופס",
    "ביקורות בצד אחד וטופס השארת ביקורת בצד השני.",
    "Form",
    sectionShell(
      kind,
      `
      <div class="grid items-start gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">מה הלקוחות אומרים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            קראו ביקורות והשאירו גם אתם חוות דעת
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מבנה מושלם לעמוד עסקי שמאפשר גם להציג ביקורות וגם לאסוף ביקורות חדשות.
          </p>

          <div class="mt-8 grid gap-4">
            ${compactReview(
              "שירות מצוין, מקצועי ומהיר. הרגשתי בידיים טובות.",
              "לקוחה מרוצה"
            )}
            ${compactReview(
              "קיבלתי מענה מדויק והכל היה מסודר וברור.",
              "לקוח חוזר"
            )}
          </div>
        </div>

        ${reviewFormCard()}
      </div>
      `
    ),
    { tags: ["form", "review-form", "conversion"] }
  ),

  createVariant(
    "reviews-layout-4",
    kind,
    "ביקורות כהה פרימיום",
    "סקשן ביקורות כהה, יוקרתי וממותג.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] bg-slate-950 p-8 text-white shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative mx-auto max-w-[900px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
            Premium Reviews
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            ביקורות שנראות כמו מותג גדול
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים לקליניקות, יועצים, חנויות, SaaS, משרדים ושירותי פרימיום.
          </p>
        </div>

        <div class="relative mt-12 grid gap-6 md:grid-cols-3">
          ${darkReviewCard(
            "שירות יוקרתי, מקצועי ומדויק. כל שלב היה ברור.",
            "לקוחה מרוצה",
            "VIP Review"
          )}
          ${darkReviewCard(
            "חוויה ברמה גבוהה מאוד. קיבלתי מענה מהיר ותוצאה מצוינת.",
            "לקוח מרוצה",
            "Verified"
          )}
          ${darkReviewCard(
            "הרגשתי שיש כאן עסק רציני שאפשר לסמוך עליו.",
            "לקוחה חדשה",
            "From website"
          )}
        </div>

        <div class="relative mt-10 flex justify-center gap-4">
          ${primaryButton("השארת ביקורת")}
          ${darkButton("כל הביקורות")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "luxury"] }
  ),

  createVariant(
    "reviews-layout-5",
    kind,
    "קרוסלת ביקורות",
    "שורת ביקורות נגללת לרוחב, מתאימה להרבה ביקורות.",
    "Carousel",
    sectionShell(
      kind,
      `
      <div class="flex flex-col gap-8">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p class="${pillClass}" data-editable-text="true">ביקורות אחרונות</p>

            <h2 class="${h2Class}" data-editable-text="true">
              עוד ועוד לקוחות מדרגים וממליצים
            </h2>

            <p class="${textClass}" data-editable-text="true">
              קרוסלה נקייה שמאפשרת להציג הרבה ביקורות בלי להעמיס על העמוד.
            </p>
          </div>

          ${primaryButton("השארת ביקורת")}
        </div>

        <div class="flex gap-5 overflow-x-auto pb-5">
          <div class="min-w-[330px] md:min-w-[420px]">
            ${reviewCard("שירות מקצועי, נעים וברור.", "לקוחה מרוצה", "5 כוכבים", "ד")}
          </div>

          <div class="min-w-[330px] md:min-w-[420px]">
            ${reviewCard("הכל היה מסודר וברמה גבוהה מאוד.", "לקוח מרוצה", "לקוח חוזר", "א")}
          </div>

          <div class="min-w-[330px] md:min-w-[420px]">
            ${reviewCard("קיבלתי מענה מדויק ומהיר לכל שאלה.", "לקוחה חדשה", "פנייה מהאתר", "מ")}
          </div>

          <div class="min-w-[330px] md:min-w-[420px]">
            ${reviewCard("החוויה הייתה מעבר למה שציפיתי.", "לקוח חוזר", "Verified", "י")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["carousel", "scroll", "many"] }
  ),

  createVariant(
    "reviews-layout-6",
    kind,
    "ביקורות לפי פלטפורמות",
    "הצגת ביקורות Google, Facebook, אתר ועוד.",
    "Platforms",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "ביקורות מכל הערוצים",
        "הציגו דירוגים מפלטפורמות שונות כדי לחזק אמון ממקורות שונים.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${platformReview("Google Reviews", "4.9", "ביקורות מלקוחות שחיפשו את העסק והגיעו דרך Google.")}
        ${platformReview("Facebook", "5.0", "תגובות והמלצות מלקוחות ברשתות החברתיות.")}
        ${platformReview("Website", "4.8", "ביקורות שנאספו ישירות דרך האתר או העמוד העסקי.")}
      </div>
      `
    ),
    { tags: ["google", "facebook", "platforms"] }
  ),

  createVariant(
    "reviews-layout-7",
    kind,
    "ביקורות + תמונה",
    "תמונה גדולה לצד ביקורות קצרות.",
    "Image",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">לקוחות מרוצים</p>

        <h2 class="${h2Class}" data-editable-text="true">
          ביקורות שמראות את החוויה האמיתית
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לעסק שרוצה להציג גם אווירה, מקום, שירות או תוצאה — יחד עם ביקורות.
        </p>

        <div class="mt-8 grid gap-4">
          ${compactReview("חוויה נעימה, מקצועית וברורה.", "לקוחה מרוצה")}
          ${compactReview("מענה מהיר ושירות ברמה גבוהה.", "לקוח חוזר")}
        </div>
      </div>
      `,
      imageBlock(sectionImages.people, "min-h-[560px]"),
      false
    ),
    { tags: ["image", "reviews", "trust"] }
  ),

  createVariant(
    "reviews-layout-8",
    kind,
    "ביקורות על תמונת רקע",
    "ביקורת מרכזית על תמונת רקע גדולה.",
    "Background",
    backgroundSection(
      kind,
      sectionImages.people,
      `
      <div class="max-w-[860px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          ביקורת לקוח
        </p>

        <div class="mb-6 text-3xl text-amber-300" data-editable-text="true">
          ★★★★★
        </div>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          “השירות היה מקצועי, ברור ומדויק”
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          לקוחה מרוצה · ביקורת מאומתת
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("השארת ביקורת")}
          ${secondaryButton("כל הביקורות")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "hero", "quote"] }
  ),

  createVariant(
    "reviews-layout-9",
    kind,
    "ביקורות מוצר",
    "ביקורות שמתאימות לחנות ומוצרים.",
    "Store",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">ביקורות מוצר</p>

            <h2 class="${h2Class}" data-editable-text="true">
              לקוחות שקנו מספרים איך הייתה החוויה
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לחנויות, מוצרים, קולקציות, משלוחים ושירות לקוחות.
            </p>

            <div class="mt-8 grid gap-4">
              ${compactReview("המוצר הגיע מהר ונראה בדיוק כמו בתמונה.", "לקוחה מרוצה")}
              ${compactReview("איכות מעולה ושירות לקוחות מצוין.", "לקוח חוזר")}
            </div>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("מעבר לחנות", "#store")}
              ${whatsappButton("שאלה על מוצר")}
            </div>
          </div>

          ${imageGrid(
            [
              sectionImages.product,
              sectionImages.store,
              sectionImages.beauty,
              sectionImages.food,
            ],
            "min-h-[230px]",
            "md:grid-cols-2"
          )}
        </div>
      </div>
      `
    ),
    { tags: ["store", "products", "ecommerce"] }
  ),

  createVariant(
    "reviews-layout-10",
    kind,
    "ביקורות שירות",
    "ביקורות שמתאימות לשירותים, תורים וקליניקות.",
    "Service",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">ביקורות על השירות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לקוחות מספרים על היחס, התהליך והתוצאה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לקליניקות, יועצים, מאמנים, טיפולים, שיעורים ושירותים אישיים.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${softFeatureCard("יחס אישי", "חוויה נעימה ומקצועית.", "♡")}
            ${softFeatureCard("תוצאה ברורה", "הלקוח מבין מה קיבל.", "✓")}
            ${softFeatureCard("מענה מהיר", "שירות זמין וברור.", "↗")}
            ${softFeatureCard("אמון", "ביקורות מחזקות החלטה.", "★")}
          </div>
        </div>

        <div class="grid gap-5">
          ${reviewCard(
            "קיבלתי שירות מדויק, סבלני ומקצועי. ממליצה בחום.",
            "לקוחה מרוצה",
            "שירות אישי",
            "ש"
          )}
          ${reviewCard(
            "התהליך היה ברור והתוצאה הייתה בדיוק מה שחיפשתי.",
            "לקוח מרוצה",
            "תוצאה מעולה",
            "ת"
          )}
        </div>
      </div>
      `
    ),
    { tags: ["service", "clinic", "booking"] }
  ),

  createVariant(
    "reviews-layout-11",
    kind,
    "ביקורות + נתונים",
    "ביקורות לצד מספרים שמחזקים אמון.",
    "Stats",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">אמון מוכח</p>

          <h2 class="${h2Class}" data-editable-text="true">
            המספרים והביקורות מספרים את אותו הסיפור
          </h2>

          <p class="${textClass}" data-editable-text="true">
            שלבו דירוגים, ביקורות ונתונים כדי להראות ניסיון, תוצאות ושביעות רצון.
          </p>

          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            ${statCard("4.9", "דירוג ממוצע")}
            ${statCard("128", "ביקורות")}
            ${statCard("98%", "שביעות רצון")}
            ${statCard("500+", "לקוחות")}
          </div>
        </div>

        ${reviewSummaryCard()}
      </div>
      `
    ),
    { tags: ["stats", "trust", "rating"] }
  ),

  createVariant(
    "reviews-layout-12",
    kind,
    "ביקורות SaaS",
    "ביקורות למערכת, מוצר דיגיטלי או Mini SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[64px] bg-slate-950 p-8 text-white shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              SaaS Reviews
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              עסקים שממליצים על המערכת
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים ל־CRM, תיאום תורים, חנות, קורסים, אזור לקוחות, אוטומציות ו־AI.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("בקשת דמו")}
              ${darkButton("צפייה בפיצ׳רים")}
            </div>
          </div>

          <div class="grid gap-4">
            ${darkReviewCard(
              "המערכת עשתה לנו סדר בלידים, תורים והלקוחות. הכל הרבה יותר נוח.",
              "בעל עסק",
              "CRM + Booking"
            )}
            ${darkReviewCard(
              "חסכנו זמן, קיבלנו יותר פניות והלקוחות מבינים בדיוק מה לעשות.",
              "מנהלת עסק",
              "Mini SaaS"
            )}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "system", "dark"] }
  ),

  createVariant(
    "reviews-layout-13",
    kind,
    "ביקורות עם וידאו",
    "וידאו ביקורת / עדות לקוח לצד ביקורות.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">וידאו ביקורת</p>

        <h2 class="${h2Class}" data-editable-text="true">
          תנו ללקוחות לספר את החוויה בקול שלהם
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לסרטון המלצה, Case Study, ביקורת לקוח, תוצאה או עדות אמון.
        </p>

        <div class="mt-8">
          ${reviewCard(
            "הסרטון הזה מסביר בדיוק למה בחרתי בעסק הזה — מקצועיות, יחס אישי ותוצאה.",
            "לקוחה מרוצה",
            "וידאו ביקורת",
            "ו"
          )}
        </div>
      </div>
      `,
      videoBox(),
      false
    ),
    { tags: ["video", "review", "trust"] }
  ),

  createVariant(
    "reviews-layout-14",
    kind,
    "ביקורות + ליד",
    "ביקורות שמובילות לטופס פנייה.",
    "Lead",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">לקוחות כבר בחרו</p>

          <h2 class="${h2Class}" data-editable-text="true">
            קראו ביקורות והשאירו פרטים לקבלת מענה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מבנה שמחבר בין אמון להמרה — קודם ביקורות, ואז טופס ליד.
          </p>

          <div class="mt-8 grid gap-4">
            ${compactReview("שירות מדהים, ברור ומקצועי.", "לקוחה מרוצה")}
            ${compactReview("הכל היה מסודר, מהיר ומדויק.", "לקוח מרוצה")}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-950" data-editable-text="true">
            רוצים גם לקבל שירות כזה?
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            השאירו פרטים ונחזור אליכם.
          </p>

          <div class="mt-6">
            ${leadForm("שליחת פרטים")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["lead", "form", "conversion"] }
  ),

  createVariant(
    "reviews-layout-15",
    kind,
    "ביקורות Beauty",
    "ביקורות שמתאימות לקליניקות, יופי, טיפולים ואיפור.",
    "Beauty",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-fuchsia-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">ביקורות לקוחות</p>

            <h2 class="${h2Class}" data-editable-text="true">
              החוויה, היחס והתוצאה — הכל בביקורות
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לאיפור קבוע, שיער, טיפולי פנים, ציפורניים, קוסמטיקה, סטודיו וקליניקות.
            </p>

            ${imageBlock(sectionImages.beauty, "min-h-[340px]", "rounded-[34px]")}
          </div>

          <div class="grid gap-5">
            ${reviewCard(
              "היחס היה אישי והתוצאה יצאה טבעית ומדויקת.",
              "לקוחה מרוצה",
              "טיפול יופי",
              "י"
            )}
            ${reviewCard(
              "הרגשתי בטוחה לאורך כל התהליך. הכל היה מקצועי.",
              "לקוחה חדשה",
              "קליניקה",
              "ק"
            )}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["beauty", "clinic", "salon"] }
  ),

  createVariant(
    "reviews-layout-16",
    kind,
    "ביקורות מינימליסטי",
    "סקשן ביקורות קצר, נקי ואלגנטי.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px]">
        <div class="text-center">
          <p class="${pillClass}" data-editable-text="true">ביקורות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            מילים קצרות. אמון גדול.
          </h2>

          <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
            סקשן נקי שמתאים לאתרים אלגנטיים שרוצים להציג ביקורות בלי עומס.
          </p>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          ${compactReview("שירות מעולה וברור.", "לקוחה מרוצה")}
          ${compactReview("הכל היה מקצועי.", "לקוח מרוצה")}
          ${compactReview("ממליצה בחום.", "לקוחה חדשה")}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "short"] }
  ),

  createVariant(
    "reviews-layout-17",
    kind,
    "ביקורות עם מדיה",
    "סקשן ביקורות עם אזור להוספת תמונה או וידאו.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${reviewCard(
            "החוויה הייתה מקצועית והתוצאה יצאה מעולה.",
            "לקוחה מרוצה",
            "Review",
            "ר"
          )}
          ${addMediaBox("הוספת תמונת ביקורת / וידאו")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">ביקורות עם מדיה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו תמונה, וידאו או צילום מסך של ביקורת
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לצילומי מסך מוואטסאפ, ביקורות Google, וידאו לקוח או תמונות תוצאה.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${softFeatureCard("צילום מסך", "ביקורת מלקוח אמיתי.", "▧")}
            ${softFeatureCard("וידאו", "עדות לקוח חזקה.", "▶")}
            ${softFeatureCard("תוצאה", "לפני/אחרי או מוצר.", "✓")}
            ${softFeatureCard("אמון", "הוכחה חזקה לפנייה.", "★")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "reviews-layout-18",
    kind,
    "CTA ביקורות וואו",
    "סקשן קצר, צבעוני וממיר אחרי אזור ביקורות.",
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
              גם אתם יכולים להצטרף ללקוחות המרוצים
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              מוכנים לקבל שירות שמקבל ביקורות כאלה?
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              השאירו פרטים, שלחו וואטסאפ או קבעו תור.
            </p>
          </div>

          <div class="flex shrink-0 flex-wrap gap-4">
            <a
              href="#contact"
              class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl"
              data-editable-link="true"
            >
              השארת פרטים
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
    { tags: ["cta", "wow", "conversion"] }
  ),
];