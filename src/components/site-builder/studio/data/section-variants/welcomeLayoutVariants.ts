import type { SectionLayoutVariant } from "../../types";
import {
  actionRow,
  addMediaBox,
  backgroundSection,
  cardClass,
  createVariant,
  darkButton,
  darkCardClass,
  darkFeatureCard,
  featureCard,
  h2Class,
  imageBlock,
  imageGrid,
  leadForm,
  logoCloud,
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
  titleClass,
  videoBox,
  whatsappButton,
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — Welcome Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/welcomeLayoutVariants.ts

  סקשן Welcome / דף פתיחה.
  מתאים ל:
  - פתיחת אתר
  - Hero
  - דף נחיתה
  - עסק יוקרתי
  - SaaS
  - שירות אישי
  - חנות
  - קורס
  - תיאום תורים
*/

const kind = "welcome" as const;

export const welcomeLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "welcome-layout-1",
    kind,
    "טקסט + תמונה",
    "פתיחה קלאסית ומקצועית עם כותרת חזקה, טקסט, כפתורים ותמונה.",
    "מומלץ",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">ברוכים הבאים</p>
        <h1 class="${titleClass}" data-editable-text="true">
          העסק שלך מוצג בצורה מקצועית ומרשימה
        </h1>
        <p class="${textClass}" data-editable-text="true">
          הציגו שירותים, יתרונות, תמונות וכפתורי פעולה שמובילים את הלקוח לפנייה.
        </p>
        ${actionRow("קביעת תור", "צור קשר")}
      </div>
      `,
      imageBlock(sectionImages.beauty),
      false
    ),
    { featured: true, tags: ["classic", "business", "rtl"] }
  ),

  createVariant(
    "welcome-layout-2",
    kind,
    "תמונה + טקסט",
    "מבנה הפוך עם תמונה גדולה בצד וטקסט ברור בצד השני.",
    "תמונה",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">חוויה מקצועית</p>
        <h1 class="${titleClass}" data-editable-text="true">
          עמוד פתיחה שנראה כמו מותג גדול
        </h1>
        <p class="${textClass}" data-editable-text="true">
          מבנה נקי, מאוזן ומרשים שמתאים לעסקים, קליניקות, נותני שירות וחנויות.
        </p>
        ${actionRow("התחילו עכשיו", "לפרטים")}
      </div>
      `,
      imageBlock(sectionImages.salon),
      true
    ),
    { tags: ["image", "service", "clean"] }
  ),

  createVariant(
    "welcome-layout-3",
    kind,
    "תמונת רקע מלאה",
    "פתיחה דרמטית עם תמונת רקע, Overlay וכפתורי פעולה.",
    "רקע",
    backgroundSection(
      kind,
      sectionImages.salon,
      `
      <div class="max-w-[860px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          אתר פרימיום לעסק
        </p>
        <h1 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
          תנו ללקוחות להרגיש את העסק כבר מהרגע הראשון
        </h1>
        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          פתיחה ויזואלית חזקה עם תמונה, מסר ברור וכפתור שמוביל לפנייה.
        </p>
        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("קביעת תור")}
          ${secondaryButton("צפייה בשירותים")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "luxury", "hero"] }
  ),

  createVariant(
    "welcome-layout-4",
    kind,
    "ממורכז נקי",
    "פתיחה מינימליסטית בלי תמונה, עם מסר חד וכפתורים במרכז.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] rounded-[52px] border border-slate-200 bg-white p-10 text-center shadow-[0_36px_120px_rgba(15,23,42,0.10)] md:p-16">
        <p class="${pillClass}" data-editable-text="true">ברוכים הבאים</p>
        <h1 class="text-5xl font-black leading-[0.96] tracking-[-0.06em] text-slate-800 md:text-7xl" data-editable-text="true">
          כותרת חזקה שמסבירה למה לבחור דווקא בכם
        </h1>
        <p class="mx-auto mt-6 max-w-[740px] text-lg font-bold leading-9 text-slate-500 md:text-xl" data-editable-text="true">
          מבנה נקי שמתאים לעסק שרוצה להעביר מסר ברור בלי עומס.
        </p>
        <div class="mt-9 flex flex-wrap justify-center gap-4">
          ${primaryButton("אני רוצה להתחיל")}
          ${secondaryButton("מידע נוסף")}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "center", "clean"] }
  ),

  createVariant(
    "welcome-layout-5",
    kind,
    "שתי תמונות",
    "פתיחה עם טקסט ושתי תמונות לאווירה ותוצאה.",
    "גלריה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">תצוגה ויזואלית</p>
          <h1 class="${titleClass}" data-editable-text="true">
            הציגו את העסק עם תמונות שמייצרות אמון
          </h1>
          <p class="${textClass}" data-editable-text="true">
            מתאים לעסק שרוצה להראות תוצאה, מקום, מוצרים, שירותים או אווירה.
          </p>
          ${actionRow("לתיאום", "גלריה")}
        </div>

        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.beauty, "min-h-[360px]")}
          ${imageBlock(sectionImages.hair, "min-h-[360px]")}
        </div>
      </div>
      `
    ),
    { tags: ["gallery", "visual", "beauty"] }
  ),

  createVariant(
    "welcome-layout-6",
    kind,
    "כהה יוקרתי",
    "מבנה כהה, דרמטי ויוקרתי לעסקים שרוצים להיראות פרימיום.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[54px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_44px_150px_rgba(15,23,42,0.26)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Premium Business
            </p>
            <h1 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              מותג שנראה יוקרתי כבר בכניסה
            </h1>
            <p class="mt-6 text-xl font-bold leading-10 text-white/70" data-editable-text="true">
              מתאים לקליניקות, יועצים, אולמות, נדל״ן, מותגים ועסקים שרוצים מראה חזק.
            </p>
            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("לתיאום פגישה")}
              ${darkButton("צפייה בעבודות")}
            </div>
          </div>

          ${imageBlock(sectionImages.clinic)}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "luxury", "premium"] }
  ),

  createVariant(
    "welcome-layout-7",
    kind,
    "וידאו / מדיה",
    "פתיחה עם אזור וידאו גדול ליד טקסט וכפתורים.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">וידאו תדמית</p>
        <h1 class="${titleClass}" data-editable-text="true">
          תציגו את העסק עם סרטון פתיחה מקצועי
        </h1>
        <p class="${textClass}" data-editable-text="true">
          מתאים לסרטון תדמית, הדרכה קצרה, הצגת מוצר, סטודיו, קליניקה או קורס.
        </p>
        ${actionRow("צפייה", "צור קשר")}
      </div>
      `,
      videoBox(),
      false
    ),
    { tags: ["video", "media", "course"] }
  ),

  createVariant(
    "welcome-layout-8",
    kind,
    "מדיה להוספה",
    "מבנה עם מקום ברור להוספת תמונה או וידאו נוספים.",
    "מדיה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.salon, "min-h-[340px]")}
          ${addMediaBox()}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">הוספת מדיה</p>
          <h1 class="${titleClass}" data-editable-text="true">
            מבנה שמוכן לתמונה, וידאו או גלריה
          </h1>
          <p class="${textClass}" data-editable-text="true">
            בעל העסק יכול להחליף תמונות, להוסיף מדיה חדשה ולבנות פתיחה אישית יותר.
          </p>
          ${actionRow("הזמנת שירות", "עוד פרטים")}
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "image"] }
  ),

  createVariant(
    "welcome-layout-9",
    kind,
    "שירות מרכזי",
    "פתיחה שמדגישה שירות אחד, מחיר וכפתור פעולה.",
    "שירות",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[54px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_44px_150px_rgba(139,92,246,0.28)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              שירות מוביל
            </p>
            <h1 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] md:text-7xl" data-editable-text="true">
              שירות אחד שמוביל את הלקוח לפעולה
            </h1>
            <p class="mt-6 text-xl font-bold leading-10 text-white/80" data-editable-text="true">
              מושלם להצגת טיפול, מוצר, פגישה, קורס, חבילה או הצעה מרכזית.
            </p>

            <div class="mt-9 flex flex-wrap items-center gap-4">
              <a href="#booking" class="rounded-2xl bg-white px-8 py-4 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl" data-editable-link="true">
                קביעת תור
              </a>
              <span class="rounded-full bg-white/20 px-5 py-3 text-sm font-black text-white" data-editable-text="true">
                החל מ־₪350
              </span>
            </div>
          </div>

          ${imageBlock(sectionImages.product)}
        </div>
      </div>
      `
    ),
    { tags: ["service", "price", "cta"] }
  ),

  createVariant(
    "welcome-layout-10",
    kind,
    "כרטיס צד",
    "פתיחה עם תוכן רחב וכרטיס צד להטבה, מחיר או זמינות.",
    "כרטיס",
    sectionShell(
      kind,
      `
      <div class="grid items-stretch gap-8 lg:grid-cols-3">
        <div class="rounded-[46px] bg-white p-10 shadow-[0_32px_110px_rgba(15,23,42,0.10)] lg:col-span-2 md:p-14">
          <p class="${pillClass}" data-editable-text="true">פרטים מהירים</p>
          <h1 class="${titleClass}" data-editable-text="true">
            פתיחה עם כרטיס שמוביל לפנייה
          </h1>
          <p class="${textClass}" data-editable-text="true">
            אפשר להציג הטבה, זמינות, מחיר, תאריך קרוב, שירות פופולרי או סטטוס.
          </p>
          ${actionRow("קביעת תור", "הטבות")}
        </div>

        <div class="${darkCardClass}">
          <p class="text-sm font-black text-white/60" data-editable-text="true">הטבת החודש</p>
          <h3 class="mt-4 text-5xl font-black" data-editable-text="true">VIP</h3>
          <p class="mt-5 text-base font-bold leading-8 text-white/70" data-editable-text="true">
            10% הנחה ללקוחות חדשים או לחברי מועדון.
          </p>
          <div class="mt-8">
            ${primaryButton("מימוש הטבה")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["card", "offer", "business"] }
  ),

  createVariant(
    "welcome-layout-11",
    kind,
    "SaaS מקצועי",
    "פתיחה למערכת, מוצר דיגיטלי או מיני SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[54px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_44px_150px_rgba(15,23,42,0.25)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Mini SaaS / מערכת
            </p>
            <h1 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              אתר שהוא גם מערכת לעסק
            </h1>
            <p class="mt-6 text-xl font-bold leading-10 text-white/70" data-editable-text="true">
              התחברות לקוחות, תשלומים, תורים, טפסים, אזור אישי ומוצר דיגיטלי ממותג.
            </p>
            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("הפעלת מערכת")}
              ${darkButton("צפייה בדמו")}
            </div>
          </div>

          <div class="rounded-[42px] bg-white p-5 text-slate-800">
            <div class="rounded-[32px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
              <div class="mb-5 flex items-center justify-between">
                <p class="text-sm font-black" data-editable-text="true">Dashboard</p>
                <span class="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-300" data-editable-text="true">
                  Active
                </span>
              </div>

              <div class="grid gap-3 md:grid-cols-2">
                ${darkFeatureCard("לקוחות", "ניהול לקוחות ואזור אישי.", "👤")}
                ${darkFeatureCard("תשלומים", "חבילות ומנויים חודשיים.", "₪")}
                <div class="md:col-span-2">
                  ${darkFeatureCard("אוטומציות", "לידים, הודעות, תורים ותזכורות.", "AI")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "dark", "dashboard"] }
  ),

  createVariant(
    "welcome-layout-12",
    kind,
    "חנות / מוצר",
    "פתיחה שמתאימה לחנות, מוצר מוביל או קטלוג.",
    "חנות",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p class="${pillClass}" data-editable-text="true">חנות אונליין</p>
          <h1 class="${titleClass}" data-editable-text="true">
            הציגו מוצר מוביל כבר בפתיחת האתר
          </h1>
          <p class="${textClass}" data-editable-text="true">
            מתאים למותג, חנות, מוצר חדש, קולקציה, מבצע או קטלוג שירותים.
          </p>

          <div class="mt-8 flex flex-wrap items-center gap-4">
            ${primaryButton("קנייה עכשיו", "#store")}
            <span class="rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-5 py-3 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
              משלוח חינם מעל ₪300
            </span>
          </div>
        </div>

        ${imageBlock(sectionImages.store)}
      </div>
      `
    ),
    { tags: ["store", "product", "ecommerce"] }
  ),

  createVariant(
    "welcome-layout-13",
    kind,
    "אמון ומספרים",
    "פתיחה עם סטטיסטיקות, נתוני אמון וכפתורי פעולה.",
    "אמון",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">עסק שאפשר לסמוך עליו</p>
          <h1 class="${titleClass}" data-editable-text="true">
            ניסיון, תוצאות ושירות שמייצרים אמון
          </h1>
          <p class="${textClass}" data-editable-text="true">
            מבנה שמתאים לעסקים שרוצים להציג ותק, לקוחות, הצלחות ודירוגים.
          </p>
          ${actionRow("השארת פרטים", "המלצות")}
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          ${statCard("500+", "לקוחות")}
          ${statCard("98%", "שביעות רצון")}
          ${statCard("7", "שנות ניסיון")}
          ${statCard("24/7", "זמינות אונליין")}
        </div>
      </div>
      `
    ),
    { tags: ["trust", "stats", "business"] }
  ),

  createVariant(
    "welcome-layout-14",
    kind,
    "פתיחה עם המלצה",
    "מבנה פתיחה שמשלב המלצת לקוח ליצירת אמון מהיר.",
    "המלצה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">לקוחות ממליצים</p>
          <h1 class="${titleClass}" data-editable-text="true">
            תנו להמלצות למכור בשבילכם
          </h1>
          <p class="${textClass}" data-editable-text="true">
            פתיחה שמתאימה לעסק עם ביקורות חזקות, לפני/אחרי, הצלחות או סיפורי לקוחות.
          </p>
          ${actionRow("קביעת תור", "כל ההמלצות")}
        </div>

        ${testimonialCard(
          "חוויה מקצועית, נעימה וברורה. כבר מהאתר הבנתי שזה העסק הנכון עבורי.",
          "לקוחה מרוצה"
        )}
      </div>
      `
    ),
    { tags: ["testimonial", "reviews", "trust"] }
  ),

  createVariant(
    "welcome-layout-15",
    kind,
    "לוגואים / לקוחות",
    "פתיחה עם לוגואים של לקוחות, שותפים או מותגים.",
    "לקוחות",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] text-center">
        <p class="${pillClass}" data-editable-text="true">לקוחות ושותפים</p>
        <h1 class="${titleClass}" data-editable-text="true">
          עסקים ולקוחות שכבר סומכים עלינו
        </h1>
        <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          מתאים להצגת לקוחות, מותגים, שיתופי פעולה, ספקים או עסקים שעובדים איתכם.
        </p>
      </div>

      <div class="mt-12">
        ${logoCloud(["Client", "Brand", "Studio", "Pro", "VIP"])}
      </div>

      <div class="mt-10 flex justify-center">
        ${primaryButton("הצטרפות")}
      </div>
      `
    ),
    { tags: ["clients", "logos", "trust"] }
  ),

  createVariant(
    "welcome-layout-16",
    kind,
    "טופס ליד בצד",
    "פתיחה עם טופס ליד שמכניס פניות כבר בראש האתר.",
    "Lead",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">השאירו פרטים</p>
          <h1 class="${titleClass}" data-editable-text="true">
            הפכו כניסות לאתר לפניות אמיתיות
          </h1>
          <p class="${textClass}" data-editable-text="true">
            מתאים לדפי נחיתה, שירותים, ייעוץ, קליניקות, נדל״ן, אירועים וקורסים.
          </p>
          <div class="mt-8 grid gap-4 sm:grid-cols-3">
            ${softFeatureCard("מהיר", "פנייה תוך דקה.", "✓")}
            ${softFeatureCard("ברור", "טופס קצר ונקי.", "✦")}
            ${softFeatureCard("ממיר", "מוביל ל־CRM.", "↗")}
          </div>
        </div>

        <div class="${softCardClass}">
          <h3 class="text-3xl font-black text-slate-800" data-editable-text="true">
            דברו איתנו
          </h3>
          <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
            השאירו פרטים ונחזור אליכם.
          </p>
          <div class="mt-6">
            ${leadForm()}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["lead", "form", "landing"] }
  ),

  createVariant(
    "welcome-layout-17",
    kind,
    "וואטסאפ חזק",
    "פתיחה שמובילה ישירות לשיחת וואטסאפ.",
    "WhatsApp",
    sectionShell(
      kind,
      `
      <div class="rounded-[54px] bg-gradient-to-br from-emerald-50 via-white to-violet-50 p-8 shadow-[0_36px_120px_rgba(15,23,42,0.10)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-emerald-100 px-5 py-2 text-sm font-black text-emerald-700" data-editable-text="true">
              זמינים בוואטסאפ
            </p>
            <h1 class="${titleClass}" data-editable-text="true">
              הלקוח לוחץ ומתחיל שיחה מיד
            </h1>
            <p class="${textClass}" data-editable-text="true">
              מתאים לעסקים שרוצים לקבל פניות מהירות, שאלות, תיאומים והזמנות.
            </p>
            <div class="mt-9 flex flex-wrap gap-4">
              ${whatsappButton("שליחת הודעה")}
              ${secondaryButton("צפייה בשירותים")}
            </div>
          </div>

          <div class="${cardClass}">
            <div class="rounded-[32px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800">
              <p class="text-sm font-black text-white/60" data-editable-text="true">WhatsApp Preview</p>
              <div class="mt-5 grid gap-4">
                <div class="rounded-[24px] bg-white/10 p-4 text-sm font-bold leading-7 text-white/75" data-editable-text="true">
                  שלום, אשמח לקבל פרטים על השירות.
                </div>
                <div class="mr-auto rounded-[24px] bg-emerald-500 p-4 text-sm font-bold leading-7 text-white" data-editable-text="true">
                  בשמחה! אפשר להשאיר שם וטלפון?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["whatsapp", "lead", "contact"] }
  ),

  createVariant(
    "welcome-layout-18",
    kind,
    "קולקציה / תמונות",
    "פתיחה עם גריד תמונות מקצועי למותגים ויזואליים.",
    "Visual",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] text-center">
        <p class="${pillClass}" data-editable-text="true">מותג ויזואלי</p>
        <h1 class="${titleClass}" data-editable-text="true">
          פתיחה עשירה בתמונות שמציגה את האווירה
        </h1>
        <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          מתאים לביוטי, אופנה, אוכל, אירועים, נדל״ן, סטודיו, גלריה או מוצר.
        </p>
        <div class="mt-9 flex justify-center gap-4">
          ${primaryButton("צפייה בגלריה")}
          ${secondaryButton("צור קשר")}
        </div>
      </div>

      <div class="mt-12">
        ${imageGrid(
          [
            sectionImages.beauty,
            sectionImages.salon,
            sectionImages.product,
            sectionImages.food,
            sectionImages.event,
            sectionImages.realEstate,
          ],
          "min-h-[240px]",
          "md:grid-cols-3"
        )}
      </div>
      `
    ),
    { tags: ["visual", "gallery", "brand"] }
  ),
];