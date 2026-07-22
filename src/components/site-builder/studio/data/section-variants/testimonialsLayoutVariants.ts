import type { SectionLayoutVariant } from "../../types";
import {
  backgroundSection,
  cardClass,
  createVariant,
  darkButton,
  darkCardClass,
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
  testimonialCard,
  textClass,
  videoBox,
  whatsappButton,
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — Testimonials Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/testimonialsLayoutVariants.ts

  סקשן המלצות מקצועי.
  מתאים ל:
  - המלצות לקוחות
  - סיפורי הצלחה
  - ביקורות אמון
  - לפני/אחרי
  - SaaS
  - חנות
  - קליניקה
  - שירותים
  - דפי נחיתה
*/

const kind = "testimonials" as const;

function stars() {
  return `<div class="text-xl text-amber-400" data-editable-text="true">★★★★★</div>`;
}

function testimonialAvatarCard(
  quote: string,
  name: string,
  role = "לקוחה מרוצה",
  initials = "ל"
) {
  return `
<article class="${cardClass}" data-editable-card="true">
  ${stars()}

  <p class="mt-5 text-base font-bold leading-8 text-slate-600" data-editable-text="true">
    ${quote}
  </p>

  <div class="mt-7 flex items-center gap-4">
    <div class="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-sm font-black text-black">
      ${initials}
    </div>

    <div>
      <p class="text-sm font-black text-slate-800" data-editable-text="true">${name}</p>
      <p class="mt-1 text-xs font-bold text-slate-400" data-editable-text="true">${role}</p>
    </div>
  </div>
</article>
`;
}

function darkTestimonialCard(
  quote: string,
  name: string,
  role = "לקוח מרוצה"
) {
  return `
<article class="rounded-[34px] border border-white/10 bg-white/8 p-7 text-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]" data-editable-card="true">
  <div class="text-xl text-amber-300" data-editable-text="true">★★★★★</div>

  <p class="mt-5 text-base font-bold leading-8 text-white/75" data-editable-text="true">
    ${quote}
  </p>

  <div class="mt-7 flex items-center gap-4">
    <div class="h-12 w-12 rounded-2xl bg-white/12"></div>

    <div>
      <p class="text-sm font-black text-black" data-editable-text="true">${name}</p>
      <p class="mt-1 text-xs font-bold text-black/45" data-editable-text="true">${role}</p>
    </div>
  </div>
</article>
`;
}

function compactTestimonial(
  quote: string,
  name: string,
  initials = "ל"
) {
  return `
<div class="flex gap-5 rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <div class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-sm font-black text-[var(--biz-primary,#7C3AED)]">
    ${initials}
  </div>

  <div>
    ${stars()}

    <p class="mt-3 text-sm font-bold leading-7 text-slate-600" data-editable-text="true">
      ${quote}
    </p>

    <p class="mt-4 text-sm font-black text-slate-800" data-editable-text="true">
      ${name}
    </p>
  </div>
</div>
`;
}

function bigQuoteCard(
  quote: string,
  name: string,
  role = "לקוחה מרוצה"
) {
  return `
<article class="rounded-[48px] border border-slate-200 bg-white p-8 shadow-[0_36px_120px_rgba(15,23,42,0.10)] md:p-12" data-editable-card="true">
  <div class="mb-6 text-6xl font-black leading-none text-[var(--biz-primary,#7C3AED)]/20">
    ”
  </div>

  <p class="text-2xl font-black leading-10 tracking-[-0.03em] text-slate-800 md:text-4xl md:leading-[1.25]" data-editable-text="true">
    ${quote}
  </p>

  <div class="mt-8 flex items-center gap-4">
    <div class="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-sm font-black text-black">
      ★
    </div>

    <div>
      <p class="text-base font-black text-slate-800" data-editable-text="true">${name}</p>
      <p class="mt-1 text-sm font-bold text-slate-400" data-editable-text="true">${role}</p>
    </div>
  </div>
</article>
`;
}

function testimonialCarouselItem(quote: string, name: string) {
  return `
<div class="min-w-[330px] md:min-w-[420px]">
  ${testimonialAvatarCard(quote, name)}
</div>
`;
}

function beforeAfterProofCard() {
  return `
<div class="${softCardClass}" data-editable-card="true">
  <div class="grid gap-5 md:grid-cols-2">
    ${imageBlock(sectionImages.beauty, "min-h-[300px]", "rounded-[30px]")}
    ${imageBlock(sectionImages.salon, "min-h-[300px]", "rounded-[30px]")}
  </div>

  <div class="mt-7">
    ${stars()}

    <h3 class="mt-4 text-3xl font-black text-slate-800" data-editable-text="true">
      התוצאה הייתה מעל הציפיות
    </h3>

    <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
      שילוב של תמונות והמלצה יוצר אמון חזק ומראה ללקוח מה הוא יכול לקבל.
    </p>
  </div>
</div>
`;
}

export const testimonialsLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "testimonials-layout-1",
    kind,
    "המלצות בכרטיסים",
    "גריד קלאסי של שלוש המלצות עם כוכבים, טקסט ושם לקוח.",
    "מומלץ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "מה הלקוחות אומרים",
        "המלצות אמיתיות מחזקות אמון ועוזרות ללקוח להחליט להשאיר פרטים.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${testimonialAvatarCard(
          "שירות מקצועי, נעים וברור. קיבלתי מענה מדויק והרגשתי שיש על מי לסמוך.",
          "לקוחה מרוצה",
          "ביקורת מאומתת",
          "ד"
        )}
        ${testimonialAvatarCard(
          "הכל היה מסודר, מהיר וברמה גבוהה. ממליצה בחום לכל מי שמחפש שירות אמין.",
          "לקוח מרוצה",
          "לקוח חוזר",
          "א"
        )}
        ${testimonialAvatarCard(
          "חוויה מעולה מההתחלה ועד הסוף. האתר נתן לי ביטחון לפנות ולקבוע.",
          "לקוחה חדשה",
          "פנייה מהאתר",
          "מ"
        )}
      </div>
      `
    ),
    { featured: true, tags: ["cards", "trust", "classic"] }
  ),

  createVariant(
    "testimonials-layout-2",
    kind,
    "המלצה מרכזית גדולה",
    "ציטוט גדול ומרשים שמציג המלצה אחת חזקה.",
    "Featured",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[1080px]">
        <div class="mb-10 text-center">
          <p class="${pillClass}" data-editable-text="true">המלצת לקוח</p>

          <h2 class="${h2Class}" data-editable-text="true">
            משפט אחד טוב יכול למכור יותר מכל הסבר
          </h2>
        </div>

        ${bigQuoteCard(
          "כבר מהרגע הראשון הרגשתי שהגעתי למקום מקצועי. השירות היה סבלני, ברור ומדויק, והתוצאה הייתה בדיוק מה שרציתי.",
          "לקוחה מרוצה",
          "שירות פרימיום"
        )}
      </div>
      `
    ),
    { tags: ["featured", "big", "quote"] }
  ),

  createVariant(
    "testimonials-layout-3",
    kind,
    "המלצות עם תמונה",
    "טקסט הסבר בצד אחד והמלצות בצד השני עם תמונה.",
    "תמונה",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">אמון מהלקוחות</p>

        <h2 class="${h2Class}" data-editable-text="true">
          לקוחות מספרים למה הם בחרו בנו
        </h2>

        <p class="${textClass}" data-editable-text="true">
          סקשן מושלם לעסקים שרוצים להציג מקצועיות, יחס אישי ותוצאות אמיתיות.
        </p>

        <div class="mt-8 grid gap-4">
          ${compactTestimonial(
            "שירות מדהים, מקצועי ומהיר. הכל היה ברור ונעים.",
            "לקוחה מרוצה",
            "ל"
          )}
          ${compactTestimonial(
            "קיבלתי מענה מדויק והרגשתי שליוו אותי באמת.",
            "לקוח מרוצה",
            "א"
          )}
        </div>
      </div>
      `,
      imageBlock(sectionImages.people, "min-h-[560px]"),
      false
    ),
    { tags: ["image", "compact", "trust"] }
  ),

  createVariant(
    "testimonials-layout-4",
    kind,
    "המלצות כהה פרימיום",
    "סקשן המלצות כהה, יוקרתי וממותג.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[60px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_54px_180px_rgba(15,23,42,0.38)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative mx-auto max-w-[880px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
            Premium Reviews
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            לקוחות שמדברים על חוויה ברמה גבוהה
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים למותגים, קליניקות, משרדים, SaaS, אירועים ושירותי פרימיום.
          </p>
        </div>

        <div class="relative mt-12 grid gap-6 md:grid-cols-3">
          ${darkTestimonialCard(
            "שירות יוקרתי, מקצועי ומדויק. כל שלב היה ברור.",
            "לקוחה מרוצה",
            "VIP"
          )}
          ${darkTestimonialCard(
            "חוויה ברמה גבוהה מאוד. קיבלתי מענה מהיר ותוצאה מצוינת.",
            "לקוח מרוצה",
            "לקוח עסקי"
          )}
          ${darkTestimonialCard(
            "הרגשתי שיש כאן עסק רציני שאפשר לסמוך עליו.",
            "לקוחה חדשה",
            "פנייה מהאתר"
          )}
        </div>

        <div class="relative mt-10 flex justify-center gap-4">
          ${primaryButton("השארת פרטים")}
          ${darkButton("כל ההמלצות")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "luxury", "premium"] }
  ),

  createVariant(
    "testimonials-layout-5",
    kind,
    "קרוסלת המלצות",
    "שורת המלצות נגללת לרוחב, מתאימה להרבה ביקורות.",
    "קרוסלה",
    sectionShell(
      kind,
      `
      <div class="flex flex-col gap-8">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p class="${pillClass}" data-editable-text="true">ביקורות לקוחות</p>

            <h2 class="${h2Class}" data-editable-text="true">
              עוד ועוד לקוחות ממליצים
            </h2>

            <p class="${textClass}" data-editable-text="true">
              קרוסלה נקייה שמאפשרת להציג הרבה המלצות בלי להעמיס על העמוד.
            </p>
          </div>

          ${primaryButton("הצטרפות ללקוחות")}
        </div>

        <div class="flex gap-5 overflow-x-auto pb-5">
          ${testimonialCarouselItem(
            "שירות מקצועי, נעים וברור. ממליצה בחום.",
            "לקוחה מרוצה"
          )}
          ${testimonialCarouselItem(
            "הכל היה מסודר וברמה גבוהה מאוד.",
            "לקוח מרוצה"
          )}
          ${testimonialCarouselItem(
            "קיבלתי מענה מדויק ומהיר לכל שאלה.",
            "לקוחה חדשה"
          )}
          ${testimonialCarouselItem(
            "החוויה הייתה הרבה מעבר למה שציפיתי.",
            "לקוח חוזר"
          )}
        </div>
      </div>
      `
    ),
    { tags: ["carousel", "scroll", "many"] }
  ),

  createVariant(
    "testimonials-layout-6",
    kind,
    "המלצות + מספרים",
    "המלצות לצד סטטיסטיקות אמון.",
    "אמון",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">אמון מוכח</p>

          <h2 class="${h2Class}" data-editable-text="true">
            המספרים והלקוחות מספרים את אותו הסיפור
          </h2>

          <p class="${textClass}" data-editable-text="true">
            שילוב של המלצות ונתונים יוצר אמון חזק ומעודד את הלקוח לפעול.
          </p>

          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            ${statCard("500+", "לקוחות")}
            ${statCard("98%", "שביעות רצון")}
            ${statCard("120+", "ביקורות")}
            ${statCard("7", "שנות ניסיון")}
          </div>
        </div>

        <div class="grid gap-5">
          ${testimonialAvatarCard(
            "שירות מצוין, מקצועי ומהיר. הרגשתי בידיים טובות.",
            "לקוחה מרוצה",
            "ביקורת מאומתת",
            "ד"
          )}
          ${testimonialAvatarCard(
            "אחד השירותים הכי טובים שקיבלתי. הכל היה ברור.",
            "לקוח מרוצה",
            "לקוח חוזר",
            "א"
          )}
        </div>
      </div>
      `
    ),
    { tags: ["stats", "trust", "proof"] }
  ),

  createVariant(
    "testimonials-layout-7",
    kind,
    "לפני / אחרי + המלצה",
    "מבנה שמחבר תמונות תוצאה עם המלצת לקוח.",
    "תוצאה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        ${beforeAfterProofCard()}

        <div>
          <p class="${pillClass}" data-editable-text="true">סיפור הצלחה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            המלצה שמגובה בתוצאה אמיתית
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לביוטי, שיפוצים, עיצוב, כושר, נדל״ן וכל עסק שמציג תוצאות ויזואליות.
          </p>

          <div class="mt-8">
            ${bigQuoteCard(
              "לא האמנתי כמה שינוי אפשר לראות. השירות היה מדויק והתוצאה יצאה מושלמת.",
              "לקוחה מרוצה",
              "תוצאה אמיתית"
            )}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["before-after", "result", "beauty"] }
  ),

  createVariant(
    "testimonials-layout-8",
    kind,
    "המלצות על רקע תמונה",
    "סקשן המלצה מרשים עם תמונת רקע וטקסט לבן.",
    "רקע",
    backgroundSection(
      kind,
      sectionImages.people,
      `
      <div class="max-w-[860px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          לקוחות ממליצים
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          החוויה של הלקוחות היא ההוכחה הכי חזקה
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          “השירות היה מקצועי, ברור ומדויק. הרגשתי שיש כאן עסק שאפשר לסמוך עליו.”
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("השארת פרטים")}
          ${secondaryButton("כל ההמלצות")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "quote", "hero"] }
  ),

  createVariant(
    "testimonials-layout-9",
    kind,
    "וידאו המלצה",
    "סקשן עם וידאו המלצה וטקסט תומך.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">וידאו המלצה</p>

        <h2 class="${h2Class}" data-editable-text="true">
          תנו ללקוחות לספר את הסיפור בקול שלהם
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים לעדות לקוח, סיפור הצלחה, לפני/אחרי, Case Study או סרטון ביקורת.
        </p>

        <div class="mt-8">
          ${testimonialAvatarCard(
            "הסרטון הזה מסביר בדיוק למה בחרתי בעסק הזה — מקצועיות, יחס אישי ותוצאה.",
            "לקוחה מרוצה",
            "וידאו המלצה",
            "ו"
          )}
        </div>
      </div>
      `,
      videoBox(),
      false
    ),
    { tags: ["video", "testimonial", "trust"] }
  ),

  createVariant(
    "testimonials-layout-10",
    kind,
    "המלצות קומפקטיות",
    "רשימת המלצות קצרה ונקייה.",
    "קצר",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px]">
        <div class="text-center">
          <p class="${pillClass}" data-editable-text="true">לקוחות מספרים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            ביקורות קצרות שמייצרות אמון
          </h2>

          <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
            מתאים לדפי נחיתה, עמודים ארוכים או אזור אמון קצר.
          </p>
        </div>

        <div class="mt-12 grid gap-4">
          ${compactTestimonial(
            "שירות מדהים, ברור ומקצועי.",
            "לקוחה מרוצה",
            "ד"
          )}
          ${compactTestimonial(
            "קיבלתי מענה מהיר ותוצאה מעולה.",
            "לקוח מרוצה",
            "א"
          )}
          ${compactTestimonial(
            "החוויה הייתה נעימה ומדויקת.",
            "לקוחה חדשה",
            "מ"
          )}
        </div>
      </div>
      `
    ),
    { tags: ["compact", "short", "landing"] }
  ),

  createVariant(
    "testimonials-layout-11",
    kind,
    "המלצות לחנות",
    "המלצות לקוחות על מוצרים, משלוחים ושירות.",
    "Store",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="mx-auto max-w-[880px] text-center">
          <p class="${pillClass}" data-editable-text="true">לקוחות החנות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            מה אומרים על המוצרים שלנו
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
            מתאים לחנויות, מוצרים, קולקציות, משלוחים ושירות לקוחות.
          </p>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          ${testimonialAvatarCard(
            "המוצר הגיע מהר, איכות מעולה ושירות מצוין.",
            "לקוחה מרוצה",
            "רכישה באתר",
            "ר"
          )}
          ${testimonialAvatarCard(
            "הכל היה מסודר, ברור ונוח. בהחלט אזמין שוב.",
            "לקוח חוזר",
            "חנות אונליין",
            "ח"
          )}
          ${testimonialAvatarCard(
            "השירות בוואטסאפ היה מהיר ועזר לי לבחור נכון.",
            "לקוחה חדשה",
            "שירות לקוחות",
            "ש"
          )}
        </div>

        <div class="mt-10 flex justify-center gap-4">
          ${primaryButton("מעבר לחנות", "#store")}
          ${whatsappButton("שאלה על מוצר")}
        </div>
      </div>
      `
    ),
    { tags: ["store", "products", "reviews"] }
  ),

  createVariant(
    "testimonials-layout-12",
    kind,
    "המלצות SaaS",
    "Case studies ועדויות למערכת או מוצר דיגיטלי.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[60px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_54px_180px_rgba(15,23,42,0.38)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
              Customer Stories
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              עסקים שמנהלים יותר טוב בזכות המערכת
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים ל־SaaS, CRM, מערכת תורים, אזור לקוחות, מוצר דיגיטלי או פלטפורמה.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("בקשת דמו")}
              ${darkButton("סיפורי לקוחות")}
            </div>
          </div>

          <div class="grid gap-4">
            ${darkTestimonialCard(
              "המערכת עשתה לנו סדר בלידים, תורים והלקוחות. הכל הפך פשוט יותר.",
              "בעל עסק",
              "CRM + תורים"
            )}
            ${darkTestimonialCard(
              "חסכנו זמן, קיבלנו יותר פניות והלקוחות מבינים בדיוק מה לעשות.",
              "מנהלת עסק",
              "Mini SaaS"
            )}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "case-study", "dark"] }
  ),

  createVariant(
    "testimonials-layout-13",
    kind,
    "המלצות עם טופס ליד",
    "המלצות בצד אחד וטופס פנייה בצד השני.",
    "Lead",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">רוצים גם תוצאה כזאת?</p>

          <h2 class="${h2Class}" data-editable-text="true">
            קראו מה לקוחות אומרים והשאירו פרטים
          </h2>

          <p class="${textClass}" data-editable-text="true">
            סקשן שמחבר אמון והמרה — קודם המלצות, ואז טופס פנייה.
          </p>

          <div class="mt-8 grid gap-4">
            ${compactTestimonial(
              "קיבלתי שירות מעולה ותוצאה מדויקת.",
              "לקוחה מרוצה",
              "ד"
            )}
            ${compactTestimonial(
              "הכל היה ברור, מהיר ומקצועי.",
              "לקוח מרוצה",
              "א"
            )}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            השאירו פרטים
          </h3>

          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            נחזור אליכם עם כל הפרטים.
          </p>

          <div class="mt-6">
            ${leadForm("שליחת פנייה")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["lead", "form", "conversion"] }
  ),

  createVariant(
    "testimonials-layout-14",
    kind,
    "המלצות עם לוגואים",
    "המלצות + לקוחות / מותגים / שותפים.",
    "לוגואים",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] text-center">
        <p class="${pillClass}" data-editable-text="true">לקוחות ושותפים</p>

        <h2 class="${h2Class}" data-editable-text="true">
          עסקים ולקוחות שכבר סומכים עלינו
        </h2>

        <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          מתאים להצגת לקוחות, מותגים, חברות, שותפים או סיפורי הצלחה.
        </p>
      </div>

      <div class="mt-12 grid gap-6 md:grid-cols-2">
        ${testimonialAvatarCard(
          "החוויה הייתה מקצועית וברורה מההתחלה.",
          "לקוח עסקי",
          "Business client",
          "B"
        )}
        ${testimonialAvatarCard(
          "העבודה הייתה מדויקת, מהירה ועם שירות מצוין.",
          "מותג שותף",
          "Partner",
          "P"
        )}
      </div>

      <div class="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        ${["Client", "Brand", "Studio", "Pro", "VIP"]
          .map(
            (name) => `
            <div class="grid min-h-24 place-items-center rounded-[24px] border border-slate-200 bg-white px-6 text-center shadow-[0_16px_50px_rgba(15,23,42,0.05)]">
              <span class="text-sm font-black tracking-[-0.02em] text-slate-400" data-editable-text="true">${name}</span>
            </div>
          `
          )
          .join("")}
      </div>
      `
    ),
    { tags: ["logos", "clients", "trust"] }
  ),

  createVariant(
    "testimonials-layout-15",
    kind,
    "המלצות Beauty",
    "סקשן המלצות שמתאים לקליניקה, איפור, יופי וטיפולים.",
    "Beauty",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-fuchsia-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">לקוחות מספרות</p>

            <h2 class="${h2Class}" data-editable-text="true">
              החוויה, היחס והתוצאה — הכל במקום אחד
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לאיפור קבוע, טיפולי פנים, שיער, ציפורניים, קוסמטיקה, סטודיו וקליניקות.
            </p>

            ${imageBlock(sectionImages.beauty, "min-h-[340px]", "rounded-[34px]")}
          </div>

          <div class="grid gap-5">
            ${testimonialAvatarCard(
              "היחס היה אישי והתוצאה יצאה טבעית ומדויקת.",
              "לקוחה מרוצה",
              "טיפול יופי",
              "י"
            )}
            ${testimonialAvatarCard(
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
    "testimonials-layout-16",
    kind,
    "המלצות מינימליסטי",
    "סקשן נקי מאוד עם ציטוטים קצרים.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px]">
        <div class="text-center">
          <p class="${pillClass}" data-editable-text="true">לקוחות ממליצים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            מילים קצרות. אמון גדול.
          </h2>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          <blockquote class="rounded-[34px] bg-slate-50 p-7 text-center" data-editable-card="true">
            ${stars()}
            <p class="mt-5 text-base font-bold leading-8 text-slate-600" data-editable-text="true">“שירות מעולה וברור.”</p>
            <p class="mt-5 text-sm font-black text-slate-800" data-editable-text="true">לקוחה מרוצה</p>
          </blockquote>

          <blockquote class="rounded-[34px] bg-slate-50 p-7 text-center" data-editable-card="true">
            ${stars()}
            <p class="mt-5 text-base font-bold leading-8 text-slate-600" data-editable-text="true">“הכל היה מקצועי.”</p>
            <p class="mt-5 text-sm font-black text-slate-800" data-editable-text="true">לקוח מרוצה</p>
          </blockquote>

          <blockquote class="rounded-[34px] bg-slate-50 p-7 text-center" data-editable-card="true">
            ${stars()}
            <p class="mt-5 text-base font-bold leading-8 text-slate-600" data-editable-text="true">“ממליצה בחום.”</p>
            <p class="mt-5 text-sm font-black text-slate-800" data-editable-text="true">לקוחה חדשה</p>
          </blockquote>
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "short"] }
  ),

  createVariant(
    "testimonials-layout-17",
    kind,
    "המלצות + וואטסאפ",
    "סקשן המלצות שמוביל לשיחה מהירה בוואטסאפ.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-700" data-editable-text="true">
              שאלו לקוחות כמוכם
            </p>

            <h2 class="${h2Class}" data-editable-text="true">
              ראיתם המלצה שאהבתם? דברו איתנו עכשיו
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים לעסקים שמקבלים פניות מהירות ורוצים לסגור לקוחות בשיחה.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${whatsappButton("שליחת הודעה")}
              ${secondaryButton("כל ההמלצות")}
            </div>
          </div>

          ${testimonialAvatarCard(
            "שלחתי הודעה וקיבלתי מענה תוך דקות. השירות היה מקצועי ומהיר.",
            "לקוחה מרוצה",
            "פנייה בוואטסאפ",
            "W"
          )}
        </div>
      </div>
      `
    ),
    { tags: ["whatsapp", "lead", "fast"] }
  ),

  createVariant(
    "testimonials-layout-18",
    kind,
    "CTA המלצות וואו",
    "סקשן קצר, צבעוני וממיר אחרי אזור המלצות.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[58px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] via-fuchsia-600 to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_44px_150px_rgba(139,92,246,0.30)] md:p-14">
        <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/15 blur-3xl"></div>

        <div class="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div class="max-w-[780px]">
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
              גם אתם יכולים להצטרף ללקוחות המרוצים
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              מוכנים להתחיל?
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              השאירו פרטים ונחזור אליכם עם כל מה שצריך.
            </p>
          </div>

          <div class="flex shrink-0 flex-wrap gap-4">
            <a href="#contact" class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl" data-editable-link="true">
              השארת פרטים
            </a>

            <a href="https://wa.me/972500000000" class="inline-flex min-h-14 items-center justify-center rounded-2xl bg-white/15 px-8 text-sm font-black text-black ring-1 ring-white/20" data-editable-link="true">
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