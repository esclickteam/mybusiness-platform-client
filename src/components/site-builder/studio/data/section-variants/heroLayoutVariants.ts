import type { SectionLayoutVariant } from "../../types";
import {
  actionRow,
  addMediaBox,
  backgroundSection,
  cardClass,
  createVariant,
  darkButton,
  h2Class,
  imageBlock,
  imageGrid,
  pillClass,
  primaryButton,
  secondaryButton,
  sectionImages,
  sectionShell,
  softFeatureCard,
  splitLayout,
  statCard,
  textClass,
  videoBox,
  wideSectionShell,
} from "./shared";

const kind = "hero" as const;

function heroStat(value: string, label: string) {
  return `
<div class="rounded-[26px] border border-slate-200 bg-white p-5 text-center shadow-[0_16px_50px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <strong class="block text-3xl font-black tracking-[-0.05em] text-slate-800" data-editable-text="true">${value}</strong>
  <span class="mt-2 block text-xs font-black text-slate-400" data-editable-text="true">${label}</span>
</div>
`;
}

function heroMiniCard(title: string, text: string, icon = "✦") {
  return `
<div class="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <div class="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] text-sm font-black text-[var(--biz-primary,#7C3AED)]">
    ${icon}
  </div>

  <h3 class="text-xl font-black text-slate-800" data-editable-text="true">${title}</h3>
  <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
</div>
`;
}

export const heroLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "hero-layout-1",
    kind,
    "Hero תמונה וטקסט",
    "פתיחת אתר מקצועית עם טקסט, כפתורים ותמונה גדולה.",
    "מומלץ",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">עסק מקצועי</p>

          <h1 class="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.065em] text-slate-800 md:text-7xl" data-editable-text="true">
            אתר עסקי שנראה כמו מותג גדול
          </h1>

          <p class="${textClass}" data-editable-text="true">
            הציגו את העסק, השירותים, התמונות והפעולות החשובות בצורה ברורה ומרשימה.
          </p>

          ${actionRow("קביעת תור", "צור קשר")}

          <div class="mt-10 grid gap-4 sm:grid-cols-3">
            ${heroStat("500+", "לקוחות")}
            ${heroStat("4.9", "דירוג")}
            ${heroStat("24/7", "זמינות")}
          </div>
        </div>

        ${imageBlock(sectionImages.beauty, "min-h-[620px]", "rounded-[46px]")}
      </div>
      `
    ),
    { featured: true, tags: ["hero", "image", "business"] }
  ),

  createVariant(
    "hero-layout-2",
    kind,
    "Hero תמונה משמאל",
    "אותו מבנה מקצועי, רק עם תמונה בצד השני.",
    "Image",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">Welcome</p>

        <h1 class="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.065em] text-slate-800 md:text-7xl" data-editable-text="true">
          כותרת ראשית חזקה לעסק שלכם
        </h1>

        <p class="${textClass}" data-editable-text="true">
          משפט קצר שמסביר מה העסק נותן, למי הוא מתאים ולמה כדאי לפנות עכשיו.
        </p>

        ${actionRow("התחילו עכשיו", "מידע נוסף")}
      </div>
      `,
      imageBlock(sectionImages.people, "min-h-[600px]", "rounded-[46px]"),
      true
    ),
    { tags: ["hero", "reverse", "image"] }
  ),

  createVariant(
    "hero-layout-3",
    kind,
    "Hero רקע מלא",
    "תמונת רקע גדולה עם שכבת כהות, כותרת וכפתורים.",
    "Background",
    backgroundSection(
      kind,
      sectionImages.salon,
      `
      <div class="max-w-[900px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          Premium Business
        </p>

        <h1 class="text-5xl font-black leading-[0.95] tracking-[-0.065em] text-white md:text-7xl" data-editable-text="true">
          העסק שלכם מוצג בצורה יוקרתית ומרשימה
        </h1>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          תמונת אווירה חזקה, מסר ברור וכפתורי פעולה שמובילים לפנייה.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("קביעת תור")}
          ${secondaryButton("צפייה בגלריה")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "wow", "premium"] }
  ),

  createVariant(
    "hero-layout-4",
    kind,
    "Hero ממורכז נקי",
    "פתיחה נקייה בלי תמונה, עם כותרת ענקית וכפתורים.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[1040px] rounded-[58px] border border-slate-200 bg-white p-8 text-center shadow-[0_34px_120px_rgba(15,23,42,0.08)] md:p-16">
        <p class="${pillClass}" data-editable-text="true">Bizuply Website</p>

        <h1 class="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.065em] text-slate-800 md:text-7xl" data-editable-text="true">
          כותרת ראשית נקייה, ברורה ומקצועית
        </h1>

        <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          מתאים לעסקים שרוצים מסר חד בלי עומס, עם כפתורים ברורים לפעולה.
        </p>

        <div class="mt-9 flex flex-wrap justify-center gap-4">
          ${primaryButton("פעולה ראשית")}
          ${secondaryButton("פעולה משנית")}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "center", "clean"] }
  ),

  createVariant(
    "hero-layout-5",
    kind,
    "Hero גלריית תמונות",
    "פתיחה עם טקסט וגריד תמונות יפה.",
    "Gallery",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">גלריה בראש האתר</p>

          <h1 class="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.065em] text-slate-800 md:text-7xl" data-editable-text="true">
            תנו לתמונות להציג את העסק
          </h1>

          <p class="${textClass}" data-editable-text="true">
            מתאים לעסקים ויזואליים, קליניקות, חנויות, אירועים, עיצוב, יופי ושירותים.
          </p>

          ${actionRow("צפייה בעבודות", "צור קשר")}
        </div>

        ${imageGrid(
          [
            sectionImages.beauty,
            sectionImages.salon,
            sectionImages.product,
            sectionImages.people,
          ],
          "min-h-[260px]",
          "md:grid-cols-2"
        )}
      </div>
      `
    ),
    { tags: ["gallery", "visual", "images"] }
  ),

  createVariant(
    "hero-layout-6",
    kind,
    "Hero כהה פרימיום",
    "פתיחה כהה ויוקרתית בסגנון SaaS / מותג גדול.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[64px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_58px_190px_rgba(15,23,42,0.40)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Premium Hero
            </p>

            <h1 class="text-5xl font-black leading-[0.95] tracking-[-0.065em] text-white md:text-7xl" data-editable-text="true">
              אתר שנראה חזק כבר מהרגע הראשון
            </h1>

            <p class="mt-6 max-w-2xl text-xl font-bold leading-10 text-white/72" data-editable-text="true">
              עיצוב כהה, יוקרתי ומודרני שמתאים לעסקים, SaaS, חנויות, קורסים וקליניקות.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("התחילו עכשיו")}
              ${darkButton("צפייה בדמו")}
            </div>
          </div>

          ${imageBlock(sectionImages.office, "min-h-[560px]", "rounded-[42px]")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "saas"] }
  ),

  createVariant(
    "hero-layout-7",
    kind,
    "Hero וידאו",
    "פתיחה עם וידאו או קאבר וידאו לצד טקסט.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">וידאו בראש האתר</p>

        <h1 class="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.065em] text-slate-800 md:text-7xl" data-editable-text="true">
          הציגו את העסק דרך סרטון קצר
        </h1>

        <p class="${textClass}" data-editable-text="true">
          מתאים לסרטון תדמית, רילס, הדגמת מוצר, הסבר שירות או פתיחה שיווקית חזקה.
        </p>

        ${actionRow("צפייה", "קבלת פרטים")}
      </div>
      `,
      videoBox(),
      false
    ),
    { tags: ["video", "media", "hero"] }
  ),

  createVariant(
    "hero-layout-8",
    kind,
    "Hero עם אזור מדיה",
    "מבנה עם תמונה קיימת ואזור להוספת עוד תמונה או וידאו.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.product, "min-h-[340px]")}
          ${addMediaBox("הוספת תמונה / וידאו")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">מדיה גמישה</p>

          <h1 class="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.065em] text-slate-800 md:text-7xl" data-editable-text="true">
            בעל העסק יכול להוסיף תמונות וסרטונים
          </h1>

          <p class="${textClass}" data-editable-text="true">
            מתאים לבונה אתרים שבו בעל העסק בוחר תמונות, וידאו, קאבר או גלריה.
          </p>

          ${actionRow("הוספת מדיה", "צפייה")}
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "hero-layout-9",
    kind,
    "Hero שירות מוביל",
    "פתיחה שמתמקדת בשירות או מוצר אחד מרכזי.",
    "Service",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">שירות מוביל</p>

            <h1 class="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.065em] text-slate-800 md:text-7xl" data-editable-text="true">
              הציגו שירות אחד בצורה שמובילה לפנייה
            </h1>

            <p class="${textClass}" data-editable-text="true">
              מתאים לטיפול, מוצר, קורס, חבילה, פגישה, ייעוץ או שירות עיקרי.
            </p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              ${softFeatureCard("ברור", "הלקוח מבין מיד מה מוצע.", "✓")}
              ${softFeatureCard("ממיר", "כפתור פעולה בולט.", "↗")}
            </div>

            <div class="mt-9 flex flex-wrap items-center gap-4">
              ${primaryButton("קביעת תור")}
              <span class="rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-lg" data-editable-text="true">
                החל מ־₪250
              </span>
            </div>
          </div>

          ${imageBlock(sectionImages.product, "min-h-[560px]", "rounded-[42px]")}
        </div>
      </div>
      `
    ),
    { tags: ["service", "product", "conversion"] }
  ),

  createVariant(
    "hero-layout-10",
    kind,
    "Hero כרטיס צד",
    "פתיחה עם כרטיס מידע צדדי כמו מחיר, הטבה או שעות.",
    "Card",
    sectionShell(
      kind,
      `
      <div class="grid items-stretch gap-8 lg:grid-cols-[1fr_0.42fr]">
        <div class="rounded-[54px] border border-slate-200 bg-white p-8 shadow-[0_34px_120px_rgba(15,23,42,0.08)] md:p-14">
          <p class="${pillClass}" data-editable-text="true">Business Hero</p>

          <h1 class="mt-5 text-5xl font-black leading-[0.95] tracking-[-0.065em] text-slate-800 md:text-7xl" data-editable-text="true">
            פתיחה עם כרטיס צד מקצועי
          </h1>

          <p class="${textClass}" data-editable-text="true">
            הציגו מסר מרכזי לצד מחיר, הטבה, שעות פעילות, קופון או נתון חשוב.
          </p>

          ${actionRow("פעולה ראשית", "מידע נוסף")}
        </div>

        <aside class="rounded-[54px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_34px_120px_rgba(15,23,42,0.18)]" data-editable-card="true">
          <p class="text-sm font-black text-white/55" data-editable-text="true">הטבת החודש</p>
          <h3 class="mt-4 text-5xl font-black tracking-[-0.06em] text-white" data-editable-text="true">VIP</h3>
          <p class="mt-5 text-base font-bold leading-8 text-white/70" data-editable-text="true">
            הטבה, מחיר, קופון או הודעה חשובה ללקוחות.
          </p>

          <div class="mt-8">
            ${primaryButton("מימוש הטבה")}
          </div>
        </aside>
      </div>
      `
    ),
    { tags: ["side-card", "offer", "hero"] }
  ),
];