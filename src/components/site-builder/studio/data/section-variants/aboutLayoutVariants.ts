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
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — About Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/aboutLayoutVariants.ts

  סקשן אודות מקצועי.
  מתאים ל:
  - סיפור העסק
  - בעל/ת העסק
  - ניסיון
  - ערכים
  - יתרונות
  - תהליך עבודה
  - אמון
  - מותג אישי
  - עסק יוקרתי
*/

const kind = "about" as const;

export const aboutLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "about-layout-1",
    kind,
    "אודות ממורכז",
    "סקשן אודות נקי וממורכז עם כותרת, טקסט וכפתורי פעולה.",
    "מומלץ",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[940px] text-center">
        <p class="${pillClass}" data-editable-text="true">אודות העסק</p>

        <h2 class="${h2Class}" data-editable-text="true">
          הסיפור שמאחורי העסק שלכם
        </h2>

        <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          כאן מספרים בקצרה מי אתם, מה הניסיון שלכם, מה הערך שאתם נותנים ללקוחות ולמה לבחור דווקא בכם.
        </p>

        <div class="mt-9 flex flex-wrap justify-center gap-4">
          ${primaryButton("יצירת קשר")}
          ${secondaryButton("השירותים שלנו", "#services")}
        </div>
      </div>
      `
    ),
    { featured: true, tags: ["clean", "center", "business"] }
  ),

  createVariant(
    "about-layout-2",
    kind,
    "טקסט + תמונה",
    "אודות קלאסי עם טקסט בצד ותמונה מקצועית בצד השני.",
    "קלאסי",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">מי אנחנו</p>

        <h2 class="${h2Class}" data-editable-text="true">
          עסק מקצועי עם יחס אישי ותוצאה מדויקת
        </h2>

        <p class="${textClass}" data-editable-text="true">
          אנחנו משלבים ניסיון, שירות אישי וחשיבה מקצועית כדי לתת לכל לקוח חוויה נעימה, ברורה ומדויקת.
        </p>

        ${actionRow("לקביעת פגישה", "עוד עלינו")}
      </div>
      `,
      imageBlock(sectionImages.salon),
      false
    ),
    { tags: ["image", "classic", "service"] }
  ),

  createVariant(
    "about-layout-3",
    kind,
    "תמונה + טקסט",
    "מבנה הפוך עם תמונה בצד ימין וטקסט בצד שמאל.",
    "תמונה",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">הדרך שלנו</p>

        <h2 class="${h2Class}" data-editable-text="true">
          כל פרט באתר ובעסק נבנה כדי ליצור אמון
        </h2>

        <p class="${textClass}" data-editable-text="true">
          אנחנו מאמינים בשקיפות, מקצועיות, זמינות וחוויה נעימה — מהרגע הראשון ועד לסיום השירות.
        </p>

        ${actionRow("דברו איתנו", "לצפייה בעבודות")}
      </div>
      `,
      imageBlock(sectionImages.office),
      true
    ),
    { tags: ["reverse", "image", "trust"] }
  ),

  createVariant(
    "about-layout-4",
    kind,
    "אודות עם נתונים",
    "סקשן אודות עם מספרי אמון: לקוחות, ניסיון, דירוג וזמינות.",
    "אמון",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">למה לבחור בנו</p>

          <h2 class="${h2Class}" data-editable-text="true">
            ניסיון שמרגישים בכל שלב
          </h2>

          <p class="${textClass}" data-editable-text="true">
            סקשן שמתאים לעסק שרוצה להציג ניסיון, תוצאות, לקוחות מרוצים ודירוגים בצורה ברורה ומקצועית.
          </p>

          ${actionRow("השארת פרטים", "ביקורות")}
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          ${statCard("500+", "לקוחות מרוצים")}
          ${statCard("7", "שנות ניסיון")}
          ${statCard("98%", "שביעות רצון")}
          ${statCard("24/7", "זמינות אונליין")}
        </div>
      </div>
      `
    ),
    { tags: ["stats", "trust", "business"] }
  ),

  createVariant(
    "about-layout-5",
    kind,
    "אודות כהה יוקרתי",
    "מבנה כהה, יוקרתי ומרשים לעסקים שרוצים מראה פרימיום.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[54px] bg-slate-950 p-8 text-white shadow-[0_44px_150px_rgba(15,23,42,0.25)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              Premium About
            </p>

            <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              עסק שנבנה על מקצועיות, אמון ותוצאה
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים לקליניקות, יועצים, מותגים, נדל״ן, אירועים ועסקים שרוצים להיראות יוקרתיים ומבוססים.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("לתיאום פגישה")}
              ${darkButton("צפייה בשירותים")}
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
    "about-layout-6",
    kind,
    "ערכים בכרטיסים",
    "סקשן אודות שמציג ערכי עסק בשלושה כרטיסים מקצועיים.",
    "ערכים",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "הערכים שמובילים אותנו",
        "כאן אפשר להציג את מה שהעסק מאמין בו — מקצועיות, יחס אישי, שקיפות ותוצאה.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${featureCard("מקצועיות", "עבודה מדויקת, מסודרת וברמה גבוהה.", "✦")}
        ${featureCard("יחס אישי", "כל לקוח מקבל ליווי, הקשבה והתאמה אישית.", "♡")}
        ${featureCard("אמינות", "שקיפות מלאה, זמינות ותיאום ציפיות ברור.", "✓")}
      </div>
      `
    ),
    { tags: ["values", "cards", "clean"] }
  ),

  createVariant(
    "about-layout-7",
    kind,
    "בעלת העסק",
    "סקשן אישי שמציג את בעל/ת העסק עם תמונה, שם ותיאור.",
    "אישי",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="${softCardClass}">
          ${imageBlock(sectionImages.people, "min-h-[500px]", "rounded-[34px]")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">נעים להכיר</p>

          <h2 class="${h2Class}" data-editable-text="true">
            אני כאן כדי לתת לכם שירות מקצועי, אישי ומדויק
          </h2>

          <p class="${textClass}" data-editable-text="true">
            כאן אפשר לכתוב כמה מילים על בעלת העסק, הניסיון, הגישה, ההתמחות והדרך שבה היא מלווה לקוחות.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${softFeatureCard("ניסיון", "שנים של עבודה עם לקוחות.", "✓")}
            ${softFeatureCard("התאמה אישית", "שירות לפי צורך אמיתי.", "✦")}
          </div>

          ${actionRow("לקביעת פגישה", "שליחת הודעה")}
        </div>
      </div>
      `
    ),
    { tags: ["personal", "owner", "profile"] }
  ),

  createVariant(
    "about-layout-8",
    kind,
    "סיפור העסק",
    "מבנה סיפורי עם כותרת, פסקאות וכרטיס הדגשה.",
    "Story",
    sectionShell(
      kind,
      `
      <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div class="${darkCardClass}">
          <p class="text-sm font-black text-white/60" data-editable-text="true">הסיפור שלנו</p>

          <h3 class="mt-4 text-4xl font-black leading-tight text-white" data-editable-text="true">
            הכל התחיל מהרצון לתת ללקוחות חוויה טובה יותר
          </h3>

          <p class="mt-5 text-sm font-bold leading-8 text-white/70" data-editable-text="true">
            כרטיס הדגשה שמתאים למשפט אישי, חזון או התחייבות של העסק.
          </p>
        </div>

        <div class="${softCardClass}">
          <p class="${pillClass}" data-editable-text="true">מאחורי הקלעים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            סיפור עסקי שמייצר חיבור ואמון
          </h2>

          <p class="${textClass}" data-editable-text="true">
            זה המקום לספר איך העסק התחיל, מה הבעיה שאתם פותרים, מה מיוחד בגישה שלכם ואיך אתם עוזרים ללקוחות להגיע לתוצאה.
          </p>

          <p class="mt-5 text-base font-bold leading-8 text-slate-500" data-editable-text="true">
            אפשר להוסיף כאן עוד פסקה קצרה על ניסיון, התמחות, לקוחות, ערכים או תהליך העבודה.
          </p>

          ${actionRow("דברו איתנו", "עוד פרטים")}
        </div>
      </div>
      `
    ),
    { tags: ["story", "brand", "trust"] }
  ),

  createVariant(
    "about-layout-9",
    kind,
    "אודות עם גלריה",
    "סקשן אודות עם גריד תמונות קטן להצגת אווירה, מקום או תהליך.",
    "גלריה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">האווירה שלנו</p>

          <h2 class="${h2Class}" data-editable-text="true">
            תנו ללקוחות לראות את המקום, התהליך והתוצאה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לעסק שרוצה להציג קליניקה, סטודיו, מוצרים, עבודות, אירועים או תמונות לפני/אחרי.
          </p>

          ${actionRow("צפייה בגלריה", "יצירת קשר")}
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
    { tags: ["gallery", "visual", "images"] }
  ),

  createVariant(
    "about-layout-10",
    kind,
    "אודות על תמונת רקע",
    "סקשן מרשים עם תמונת רקע וטקסט לבן מעל.",
    "רקע",
    backgroundSection(
      kind,
      sectionImages.office,
      `
      <div class="max-w-[780px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          אודות העסק
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          עסק מקצועי שמוביל חוויה אחרת
        </h2>

        <p class="mt-6 text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          תמונת רקע חזקה, טקסט קצר וברור וכפתורי פעולה שמובילים את הלקוח להכיר אתכם.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("לקביעת פגישה")}
          ${secondaryButton("צור קשר")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "hero", "luxury"] }
  ),

  createVariant(
    "about-layout-11",
    kind,
    "תהליך עבודה",
    "אודות שמסביר איך העסק עובד בשלבים ברורים.",
    "תהליך",
    sectionShell(
      kind,
      `
      <div class="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">איך אנחנו עובדים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            תהליך ברור שמייצר חוויה בטוחה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            לקוחות אוהבים לדעת מה הולך לקרות. כאן מציגים את שלבי העבודה בצורה פשוטה וברורה.
          </p>

          ${actionRow("התחלת תהליך", "שאלות נפוצות")}
        </div>

        <div class="${softCardClass}">
          <div class="grid gap-6">
            <div class="flex gap-5">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--biz-primary,#7C3AED)] text-sm font-black text-white">1</div>
              <div>
                <h3 class="text-xl font-black text-slate-950" data-editable-text="true">שיחת היכרות</h3>
                <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">מבינים את הצורך, המטרה והציפיות.</p>
              </div>
            </div>

            <div class="flex gap-5">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--biz-primary,#7C3AED)] text-sm font-black text-white">2</div>
              <div>
                <h3 class="text-xl font-black text-slate-950" data-editable-text="true">התאמה אישית</h3>
                <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">בונים פתרון שמתאים ללקוח ולמטרה.</p>
              </div>
            </div>

            <div class="flex gap-5">
              <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--biz-primary,#7C3AED)] text-sm font-black text-white">3</div>
              <div>
                <h3 class="text-xl font-black text-slate-950" data-editable-text="true">ביצוע וליווי</h3>
                <p class="mt-2 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">מוציאים לפועל בצורה מקצועית וברורה.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["process", "steps", "service"] }
  ),

  createVariant(
    "about-layout-12",
    kind,
    "חזון ומשימה",
    "שני כרטיסים גדולים להצגת חזון העסק והמשימה שלו.",
    "חזון",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "חזון, משימה ודרך עבודה",
        "מבנה שמתאים לעסקים שרוצים להציג עומק, ערכים ומסר ברור.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-2">
        <article class="${softCardClass}" data-editable-card="true">
          <p class="${pillClass}" data-editable-text="true">החזון שלנו</p>
          <h3 class="text-3xl font-black text-slate-950" data-editable-text="true">
            להפוך כל חוויה למקצועית, ברורה ונעימה
          </h3>
          <p class="mt-4 text-base font-bold leading-8 text-slate-500" data-editable-text="true">
            כאן כותבים את המטרה הגדולה של העסק ואת ההשפעה שאתם רוצים ליצור אצל הלקוחות.
          </p>
        </article>

        <article class="${darkCardClass}" data-editable-card="true">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-xs font-black text-white" data-editable-text="true">המשימה שלנו</p>
          <h3 class="text-3xl font-black text-white" data-editable-text="true">
            לתת שירות מדויק שמוביל לתוצאה
          </h3>
          <p class="mt-4 text-base font-bold leading-8 text-white/70" data-editable-text="true">
            כאן כותבים איך העסק פועל בפועל כדי להשיג את החזון ולתת ערך אמיתי.
          </p>
        </article>
      </div>
      `
    ),
    { tags: ["vision", "mission", "brand"] }
  ),

  createVariant(
    "about-layout-13",
    kind,
    "אודות עם וידאו",
    "מבנה אודות עם אזור וידאו להצגת העסק או בעל העסק.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">וידאו היכרות</p>

        <h2 class="${h2Class}" data-editable-text="true">
          תציגו את העסק בצורה אישית ואמיתית
        </h2>

        <p class="${textClass}" data-editable-text="true">
          אפשר להוסיף סרטון קצר שבו בעל העסק מציג את עצמו, את השירותים ואת הערך ללקוח.
        </p>

        ${actionRow("צפייה", "יצירת קשר")}
      </div>
      `,
      videoBox(),
      false
    ),
    { tags: ["video", "personal", "trust"] }
  ),

  createVariant(
    "about-layout-14",
    kind,
    "אודות עם המלצה",
    "מבנה שמשלב סיפור העסק עם המלצת לקוח חזקה.",
    "המלצה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">אמון מהלקוח הראשון</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הדרך הכי טובה להכיר אותנו היא דרך הלקוחות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            סקשן אודות שמשלב את המסר של העסק יחד עם הוכחת אמון אמיתית.
          </p>

          ${actionRow("קביעת תור", "כל הביקורות")}
        </div>

        ${testimonialCard(
          "כבר מהרגע הראשון הרגשתי שיש כאן עסק מקצועי, אמין ומדויק. השירות היה מעל הציפיות.",
          "לקוח מרוצה"
        )}
      </div>
      `
    ),
    { tags: ["testimonial", "trust", "reviews"] }
  ),

  createVariant(
    "about-layout-15",
    kind,
    "לקוחות ושותפים",
    "אודות עם לוגואים של לקוחות, מותגים או שותפים.",
    "לקוחות",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[940px] text-center">
        <p class="${pillClass}" data-editable-text="true">לקוחות ושותפים</p>

        <h2 class="${h2Class}" data-editable-text="true">
          עסקים ולקוחות שכבר סומכים עלינו
        </h2>

        <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
          מתאים להצגת לקוחות, שיתופי פעולה, ספקים, מותגים או עסקים שעובדים איתכם.
        </p>
      </div>

      <div class="mt-12">
        ${logoCloud(["Client", "Brand", "Studio", "Pro", "VIP"])}
      </div>
      `
    ),
    { tags: ["clients", "logos", "trust"] }
  ),

  createVariant(
    "about-layout-16",
    kind,
    "אודות עם מדיה להוספה",
    "מבנה עם מקום ברור להוספת תמונה או וידאו.",
    "מדיה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.salon, "min-h-[340px]")}
          ${addMediaBox("הוספת תמונה / וידאו לאודות")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">אודות עם מדיה</p>

          <h2 class="${h2Class}" data-editable-text="true">
            תנו לבעל העסק להוסיף תמונות שמספרות את הסיפור
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים למי שרוצה להציג מקום, תהליך, צוות, לפני/אחרי, לקוחות או סרטון קצר.
          </p>

          ${actionRow("הוספת פנייה", "צפייה בגלריה")}
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "image"] }
  ),

  createVariant(
    "about-layout-17",
    kind,
    "אודות SaaS",
    "סקשן אודות שמתאים למערכת, מוצר דיגיטלי או פלטפורמה.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[54px] bg-slate-950 p-8 text-white shadow-[0_44px_150px_rgba(15,23,42,0.25)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              About the platform
            </p>

            <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              מערכת שנבנתה כדי להפוך עסקים למתקדמים יותר
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים למיני SaaS, מערכת ניהול, מוצר דיגיטלי, CRM, דף נחיתה טכנולוגי או שירות אונליין.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("צפייה במערכת")}
              ${darkButton("פיצ׳רים")}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${darkFeatureCard("ניהול חכם", "כלים שמרכזים את העסק במקום אחד.", "AI")}
            ${darkFeatureCard("לקוחות", "אזור אישי, CRM ולידים.", "👤")}
            ${darkFeatureCard("תשלומים", "חבילות, מנויים וסליקה.", "₪")}
            ${darkFeatureCard("אוטומציות", "תזכורות, הודעות ותהליכים.", "⚙")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "platform", "dark"] }
  ),

  createVariant(
    "about-layout-18",
    kind,
    "אודות קצר",
    "סקשן אודות קומפקטי שמתאים לעמודים קצרים או דפי נחיתה.",
    "קצר",
    sectionShell(
      kind,
      `
      <div class="rounded-[44px] border border-slate-200 bg-white p-8 shadow-[0_28px_100px_rgba(15,23,42,0.08)] md:p-12">
        <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div class="max-w-[720px]">
            <p class="${pillClass}" data-editable-text="true">בקצרה</p>

            <h2 class="text-3xl font-black leading-tight tracking-[-0.04em] text-slate-950 md:text-5xl" data-editable-text="true">
              עסק מקצועי, ברור ונגיש ללקוחות
            </h2>

            <p class="mt-4 text-base font-bold leading-8 text-slate-500" data-editable-text="true">
              משפט קצר שמסביר מי אתם, מה אתם עושים ולמה כדאי ליצור קשר.
            </p>
          </div>

          <div class="flex shrink-0 flex-wrap gap-3">
            ${primaryButton("יצירת קשר")}
            ${secondaryButton("עוד מידע")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["short", "compact", "landing"] }
  ),
];