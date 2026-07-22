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
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — Gallery Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/galleryLayoutVariants.ts

  סקשן גלריה מקצועי.
  מתאים ל:
  - עבודות
  - לפני/אחרי
  - מוצרים
  - קליניקה
  - סטודיו
  - אוכל
  - אירועים
  - נדל״ן
  - תיק עבודות
  - גלריית וידאו
*/

const kind = "gallery" as const;

function galleryImage(src: string, height = "h-72") {
  return `
<div
  class="group relative overflow-hidden rounded-[30px] bg-white p-2 shadow-[0_24px_80px_rgba(15,23,42,0.10)]"
  data-editable-image-card="true"
  data-media-replaceable="true"
>
  <img
    src="${src}"
    alt=""
    class="${height} w-full rounded-[24px] object-cover transition duration-300 group-hover:scale-[1.03]"
    data-editable-image="true"
  />

  <div class="pointer-events-none absolute inset-2 rounded-[24px] bg-gradient-to-t from-slate-950/35 via-transparent to-transparent opacity-0 transition group-hover:opacity-100"></div>
</div>
`;
}

function galleryCaptionCard(
  src: string,
  title: string,
  text: string,
  height = "h-72"
) {
  return `
<article class="${cardClass}" data-editable-card="true">
  ${galleryImage(src, height)}

  <h3 class="mt-6 text-2xl font-black text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>
</article>
`;
}

function beforeAfterCard(beforeSrc: string, afterSrc: string) {
  return `
<div class="grid gap-5 md:grid-cols-2" data-editable-card="true">
  <div>
    ${galleryImage(beforeSrc, "h-80")}
    <p class="mt-4 text-center text-sm font-black text-slate-500" data-editable-text="true">
      לפני
    </p>
  </div>

  <div>
    ${galleryImage(afterSrc, "h-80")}
    <p class="mt-4 text-center text-sm font-black text-slate-500" data-editable-text="true">
      אחרי
    </p>
  </div>
</div>
`;
}

function carouselImage(src: string, title: string) {
  return `
<div class="min-w-[320px] md:min-w-[380px]" data-editable-card="true">
  ${galleryImage(src, "h-80")}
  <h3 class="mt-5 text-xl font-black text-slate-800" data-editable-text="true">
    ${title}
  </h3>
</div>
`;
}

export const galleryLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "gallery-layout-1",
    kind,
    "גלריית גריד",
    "גלריית תמונות קלאסית, מסודרת ונקייה.",
    "מומלץ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "גלריית עבודות",
        "הציגו תמונות של עבודות, מוצרים, תוצאות, מקום, אירועים או השראה.",
        "center"
      )}

      <div class="mt-12 grid gap-5 md:grid-cols-3">
        ${galleryImage(sectionImages.beauty)}
        ${galleryImage(sectionImages.salon)}
        ${galleryImage(sectionImages.product)}
        ${galleryImage(sectionImages.office)}
        ${galleryImage(sectionImages.clinic)}
        ${galleryImage(sectionImages.food)}
      </div>
      `
    ),
    { featured: true, tags: ["grid", "images", "classic"] }
  ),

  createVariant(
    "gallery-layout-2",
    kind,
    "גלריה עם כותרות",
    "תמונות עם כותרת ותיאור קצר לכל עבודה.",
    "כרטיסים",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "עבודות נבחרות",
        "הציגו כל תמונה עם שם, תיאור קצר ותחושה מקצועית.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${galleryCaptionCard(
          sectionImages.beauty,
          "עבודה ראשונה",
          "תיאור קצר של העבודה, השירות או התוצאה."
        )}
        ${galleryCaptionCard(
          sectionImages.salon,
          "עבודה שנייה",
          "תיאור קצר שמסביר מה רואים בתמונה."
        )}
        ${galleryCaptionCard(
          sectionImages.product,
          "עבודה שלישית",
          "תיאור קצר שמחזק אמון ומוביל לפנייה."
        )}
      </div>
      `
    ),
    { tags: ["cards", "caption", "portfolio"] }
  ),

  createVariant(
    "gallery-layout-3",
    kind,
    "גלריית Masonry",
    "גלריה עם גבהים שונים, מראה דינמי ויוקרתי.",
    "Masonry",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "גלריה מעוצבת",
        "מבנה שמרגיש כמו תיק עבודות מקצועי עם תמונות בגבהים שונים.",
        "center"
      )}

      <div class="mt-12 grid gap-5 md:grid-cols-3">
        ${galleryImage(sectionImages.beauty, "h-96")}
        <div class="md:pt-16">
          ${galleryImage(sectionImages.salon, "h-64")}
        </div>
        ${galleryImage(sectionImages.product, "h-[430px]")}
        ${galleryImage(sectionImages.office, "h-72")}
        ${galleryImage(sectionImages.clinic, "h-96")}
        <div class="md:pt-10">
          ${galleryImage(sectionImages.food, "h-72")}
        </div>
      </div>
      `
    ),
    { tags: ["masonry", "visual", "portfolio"] }
  ),

  createVariant(
    "gallery-layout-4",
    kind,
    "תמונה גדולה + קטנות",
    "תמונה ראשית גדולה לצד תמונות קטנות.",
    "Featured",
    sectionShell(
      kind,
      `
      <div class="grid items-start gap-8 lg:grid-cols-[1.25fr_0.75fr]">
        <div>
          ${galleryImage(sectionImages.beauty, "h-[620px]")}
        </div>

        <div class="grid gap-5">
          <div>
            <p class="${pillClass}" data-editable-text="true">Featured Gallery</p>

            <h2 class="${h2Class}" data-editable-text="true">
              תמונה מרכזית שמושכת את העין
            </h2>

            <p class="${textClass}" data-editable-text="true">
              מתאים להצגת עבודה מובילה, מוצר מרכזי, לפני/אחרי או תמונת אווירה חזקה.
            </p>
          </div>

          ${galleryImage(sectionImages.salon, "h-48")}
          ${galleryImage(sectionImages.product, "h-48")}
        </div>
      </div>
      `
    ),
    { tags: ["featured", "gallery", "image"] }
  ),

  createVariant(
    "gallery-layout-5",
    kind,
    "לפני / אחרי",
    "תצוגת לפני ואחרי שמתאימה לביוטי, שיפוצים, עיצוב, בריאות ועוד.",
    "Before",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "לפני ואחרי",
        "הציגו תוצאה ברורה שמשכנעת את הלקוח דרך תמונות לפני ואחרי.",
        "center"
      )}

      <div class="mx-auto mt-12 max-w-[1100px]">
        ${beforeAfterCard(sectionImages.beauty, sectionImages.salon)}
      </div>

      <div class="mt-10 flex justify-center gap-4">
        ${primaryButton("אני רוצה תוצאה כזו")}
        ${secondaryButton("צור קשר")}
      </div>
      `
    ),
    { tags: ["before-after", "beauty", "trust"] }
  ),

  createVariant(
    "gallery-layout-6",
    kind,
    "גלריה כהה יוקרתית",
    "גלריה כהה עם מראה פרימיום.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[54px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_44px_150px_rgba(15,23,42,0.25)] md:p-14">
        <div class="mx-auto max-w-[880px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
            Premium Gallery
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            תצוגת עבודות יוקרתית ומרשימה
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים למותגים, קליניקות, נדל״ן, אולמות, סטודיו ואירועים.
          </p>
        </div>

        <div class="mt-12 grid gap-5 md:grid-cols-3">
          ${galleryImage(sectionImages.clinic)}
          ${galleryImage(sectionImages.office)}
          ${galleryImage(sectionImages.realEstate)}
          ${galleryImage(sectionImages.event)}
          ${galleryImage(sectionImages.salon)}
          ${galleryImage(sectionImages.product)}
        </div>

        <div class="mt-10 flex justify-center gap-4">
          ${primaryButton("לתיאום פגישה")}
          ${darkButton("כל העבודות")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "luxury"] }
  ),

  createVariant(
    "gallery-layout-7",
    kind,
    "קרוסלת תמונות",
    "גלריה נגללת לרוחב, מתאימה למובייל ולתיק עבודות.",
    "קרוסלה",
    sectionShell(
      kind,
      `
      <div class="flex flex-col gap-8">
        <div class="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p class="${pillClass}" data-editable-text="true">גלריה נגללת</p>

            <h2 class="${h2Class}" data-editable-text="true">
              הציגו הרבה תמונות בלי להעמיס על העמוד
            </h2>

            <p class="${textClass}" data-editable-text="true">
              קרוסלה נקייה שמתאימה למוצרים, עבודות, המלצות, פרויקטים או תמונות אווירה.
            </p>
          </div>

          ${primaryButton("צפייה בגלריה")}
        </div>

        <div class="flex gap-5 overflow-x-auto pb-5">
          ${carouselImage(sectionImages.beauty, "עבודה 1")}
          ${carouselImage(sectionImages.salon, "עבודה 2")}
          ${carouselImage(sectionImages.product, "עבודה 3")}
          ${carouselImage(sectionImages.clinic, "עבודה 4")}
          ${carouselImage(sectionImages.event, "עבודה 5")}
        </div>
      </div>
      `
    ),
    { tags: ["carousel", "mobile", "scroll"] }
  ),

  createVariant(
    "gallery-layout-8",
    kind,
    "גלריה עם טקסט בצד",
    "טקסט הסבר בצד וגלריית תמונות בצד השני.",
    "טקסט",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">העבודות שלנו</p>

          <h2 class="${h2Class}" data-editable-text="true">
            תנו לתמונות לספר את הסיפור של העסק
          </h2>

          <p class="${textClass}" data-editable-text="true">
            אפשר להשתמש בגלריה להצגת תוצאות, מקום, מוצרים, אירועים, או תהליך עבודה.
          </p>

          ${actionRow("צפייה בעוד", "צור קשר")}
        </div>

        ${imageGrid(
          [
            sectionImages.beauty,
            sectionImages.salon,
            sectionImages.product,
            sectionImages.office,
          ],
          "min-h-[230px]",
          "md:grid-cols-2"
        )}
      </div>
      `
    ),
    { tags: ["text", "gallery", "business"] }
  ),

  createVariant(
    "gallery-layout-9",
    kind,
    "גלריה על תמונת רקע",
    "סקשן גלריה עם רקע גדול וטקסט לבן.",
    "רקע",
    backgroundSection(
      kind,
      sectionImages.salon,
      `
      <div class="max-w-[820px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          גלריית עבודות
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          הצצה לתוצאות, לאווירה ולחוויה
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          סקשן מרשים שמתאים לגלריה חזקה בראש העמוד או באמצע האתר.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("צפייה בגלריה")}
          ${secondaryButton("יצירת קשר")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "hero", "visual"] }
  ),

  createVariant(
    "gallery-layout-10",
    kind,
    "גלריה עם מדיה להוספה",
    "מבנה עם תמונות קיימות ואזור להוספת תמונה/וידאו.",
    "מדיה",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "הוסיפו תמונות וסרטונים",
        "בעל העסק יכול להעלות תמונות, סרטונים, תוצאות, עבודות או גלריית אווירה.",
        "center"
      )}

      <div class="mt-12 grid gap-5 md:grid-cols-3">
        ${galleryImage(sectionImages.beauty)}
        ${galleryImage(sectionImages.salon)}
        ${addMediaBox("הוספת תמונה / וידאו לגלריה")}
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "gallery-layout-11",
    kind,
    "גלריית וידאו",
    "סקשן גלריה שמציג סרטון מרכזי ותמונות ליד.",
    "Video",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        ${videoBox()}

        <div>
          <p class="${pillClass}" data-editable-text="true">וידאו וגלריה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הציגו סרטון תדמית לצד תמונות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים להצגת תהליך, סיור במקום, מוצר, קורס, אירוע או סטודיו.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${galleryImage(sectionImages.product, "h-48")}
            ${galleryImage(sectionImages.office, "h-48")}
          </div>

          ${actionRow("צפייה", "צור קשר")}
        </div>
      </div>
      `
    ),
    { tags: ["video", "media", "gallery"] }
  ),

  createVariant(
    "gallery-layout-12",
    kind,
    "גלריית מוצרים",
    "גלריה שמתאימה למותג, חנות או קולקציה.",
    "חנות",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "קולקציה נבחרת",
        "הציגו מוצרים, קולקציות, פריטים או קטלוג בצורה ויזואלית ומקצועית.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${galleryCaptionCard(
          sectionImages.product,
          "מוצר ראשון",
          "תיאור קצר של המוצר או הקולקציה.",
          "h-80"
        )}
        ${galleryCaptionCard(
          sectionImages.store,
          "מוצר שני",
          "תיאור קצר של הפריט, המחיר או היתרון.",
          "h-80"
        )}
        ${galleryCaptionCard(
          sectionImages.beauty,
          "מוצר שלישי",
          "תיאור קצר שמוביל לרכישה או פנייה.",
          "h-80"
        )}
      </div>

      <div class="mt-10 flex justify-center">
        ${primaryButton("מעבר לחנות", "#store")}
      </div>
      `
    ),
    { tags: ["store", "products", "ecommerce"] }
  ),

  createVariant(
    "gallery-layout-13",
    kind,
    "גלריית אירועים",
    "גלריה לאולמות, אירועים, הפקות, מסיבות או כנסים.",
    "אירועים",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">רגעים מהאירועים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            תמונות שמציגות חוויה, אווירה ורגש
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לאולמות, מפיקים, צלמים, דיג׳יי, עיצוב אירועים, קייטרינג או הזמנות.
          </p>

          ${actionRow("בקשת הצעת מחיר", "צפייה באירועים")}
        </div>

        ${imageGrid(
          [
            sectionImages.event,
            sectionImages.food,
            sectionImages.salon,
            sectionImages.people,
          ],
          "min-h-[230px]",
          "md:grid-cols-2"
        )}
      </div>
      `
    ),
    { tags: ["events", "gallery", "experience"] }
  ),

  createVariant(
    "gallery-layout-14",
    kind,
    "גלריית נדל״ן",
    "גלריה לפרויקטים, נכסים, אדריכלות ועיצוב פנים.",
    "נדל״ן",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "פרויקטים ונכסים",
        "הציגו נכסים, פרויקטים, עיצוב פנים, חללים או עבודות בנייה בצורה מקצועית.",
        "center"
      )}

      <div class="mt-12 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        ${galleryImage(sectionImages.realEstate, "h-[560px]")}

        <div class="grid gap-5">
          ${galleryImage(sectionImages.office, "h-[270px]")}
          ${galleryImage(sectionImages.darkOffice, "h-[270px]")}
        </div>
      </div>

      <div class="mt-10 flex justify-center gap-4">
        ${primaryButton("לתיאום סיור")}
        ${secondaryButton("כל הפרויקטים")}
      </div>
      `
    ),
    { tags: ["real-estate", "architecture", "projects"] }
  ),

  createVariant(
    "gallery-layout-15",
    kind,
    "גלריית ביוטי",
    "גלריה שמתאימה לקליניקות, יופי, איפור, שיער וטיפולים.",
    "Beauty",
    sectionShell(
      kind,
      `
      <div class="rounded-[54px] bg-gradient-to-br from-fuchsia-50 via-white to-violet-50 p-8 shadow-[0_34px_120px_rgba(15,23,42,0.09)] md:p-14">
        <div class="mx-auto max-w-[880px] text-center">
          <p class="${pillClass}" data-editable-text="true">Beauty Gallery</p>

          <h2 class="${h2Class}" data-editable-text="true">
            תוצאות, השראה ועבודות נבחרות
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
            מתאים לאיפור קבוע, שיער, טיפולי פנים, ציפורניים, קוסמטיקה וסטודיו.
          </p>
        </div>

        <div class="mt-12 grid gap-5 md:grid-cols-3">
          ${galleryImage(sectionImages.beauty)}
          ${galleryImage(sectionImages.hair)}
          ${galleryImage(sectionImages.salon)}
          ${galleryImage(sectionImages.product)}
          ${galleryImage(sectionImages.clinic)}
          ${addMediaBox("הוספת עבודת ביוטי")}
        </div>
      </div>
      `
    ),
    { tags: ["beauty", "salon", "clinic"] }
  ),

  createVariant(
    "gallery-layout-16",
    kind,
    "גלריה עם אמון",
    "גלריה עם נתונים שמחזקים אמון.",
    "אמון",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">תוצאות שמדברות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            גלריה שמראה ניסיון ותוצאה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            שלבו תמונות עם מספרים כדי להראות ניסיון, לקוחות, שביעות רצון ופעילות.
          </p>

          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            ${statCard("500+", "לקוחות")}
            ${statCard("98%", "שביעות רצון")}
            ${statCard("120+", "עבודות")}
            ${statCard("7", "שנות ניסיון")}
          </div>
        </div>

        <div class="grid gap-5">
          ${galleryImage(sectionImages.beauty, "h-64")}
          ${galleryImage(sectionImages.salon, "h-64")}
        </div>
      </div>
      `
    ),
    { tags: ["trust", "stats", "gallery"] }
  ),

  createVariant(
    "gallery-layout-17",
    kind,
    "גלריה עם המלצה",
    "תמונה גדולה לצד המלצת לקוח.",
    "המלצה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        ${galleryImage(sectionImages.salon, "h-[560px]")}

        <div>
          <p class="${pillClass}" data-editable-text="true">עבודה נבחרת</p>

          <h2 class="${h2Class}" data-editable-text="true">
            תמונה אחת חזקה עם הוכחת אמון
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים להצגת עבודה מרכזית יחד עם המלצת לקוח או סיפור הצלחה.
          </p>

          <div class="mt-8">
            ${testimonialCard(
              "התוצאה יצאה מדויקת ומקצועית. השירות היה נעים, סבלני וברמה גבוהה.",
              "לקוחה מרוצה"
            )}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["testimonial", "featured", "trust"] }
  ),

  createVariant(
    "gallery-layout-18",
    kind,
    "גלריה קצרה עם CTA",
    "סקשן גלריה קצר שמוביל לפנייה או צפייה בעוד עבודות.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="rounded-[52px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_34px_120px_rgba(15,23,42,0.09)] md:p-14">
        <div class="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">גלריה קצרה</p>

            <h2 class="${h2Class}" data-editable-text="true">
              אהבתם את הסגנון? בואו נדבר
            </h2>

            <p class="${textClass}" data-editable-text="true">
              סקשן קצר שמתאים לסוף עמוד, אחרי שירותים או ליד טופס יצירת קשר.
            </p>

            <div class="mt-8 flex flex-wrap gap-4">
              ${primaryButton("יצירת קשר")}
              ${secondaryButton("עוד עבודות")}
            </div>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            ${galleryImage(sectionImages.beauty, "h-52")}
            ${galleryImage(sectionImages.product, "h-52")}
            ${galleryImage(sectionImages.salon, "h-52")}
            ${galleryImage(sectionImages.office, "h-52")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["cta", "short", "conversion"] }
  ),
];