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
  Bizuply Website Studio — Team Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/teamLayoutVariants.ts

  סקשן צוות מקצועי.
  מתאים ל:
  - צוות העסק
  - בעל/ת העסק
  - אנשי מקצוע
  - מומחים
  - קליניקה
  - משרד
  - סוכנות
  - SaaS
  - יועצים
*/

const kind = "team" as const;

function teamMemberCard(
  name: string,
  role: string,
  imageUrl = sectionImages.people,
  text = "תיאור קצר על ניסיון, התמחות, יחס אישי והערך שאיש הצוות נותן ללקוחות."
) {
  return `
<article class="${cardClass} text-center" data-editable-card="true">
  ${imageBlock(imageUrl, "min-h-[300px]", "rounded-[30px]")}
  <h3 class="mt-6 text-2xl font-black text-slate-800" data-editable-text="true">${name}</h3>
  <p class="mt-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">${role}</p>
  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">${text}</p>
</article>
`;
}

function compactMemberCard(name: string, role: string, initials: string) {
  return `
<article class="flex items-center gap-4 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <div class="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-black">
    ${initials}
  </div>
  <div>
    <h3 class="text-lg font-black text-slate-800" data-editable-text="true">${name}</h3>
    <p class="mt-1 text-sm font-bold text-slate-500" data-editable-text="true">${role}</p>
  </div>
</article>
`;
}

function expertBadge(text: string) {
  return `
<span class="inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-xs font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
  ${text}
</span>
`;
}

export const teamLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "team-layout-1",
    kind,
    "צוות בכרטיסים",
    "גריד צוות קלאסי עם שלושה אנשי צוות, תמונות, תפקידים ותיאור קצר.",
    "מומלץ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "הכירו את הצוות שלנו",
        "אנשים מקצועיים, שירותיים ומנוסים שמלווים את הלקוחות בצורה אישית וברורה.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${teamMemberCard("שם איש צוות", "תפקיד בעסק", sectionImages.people)}
        ${teamMemberCard("שם איש צוות", "מומחה/ית", sectionImages.office)}
        ${teamMemberCard("שם איש צוות", "שירות לקוחות", sectionImages.salon)}
      </div>
      `
    ),
    { featured: true, tags: ["team", "cards", "classic"] }
  ),

  createVariant(
    "team-layout-2",
    kind,
    "בעל/ת העסק",
    "סקשן אישי שמציג את בעל/ת העסק בצורה מקצועית וממותגת.",
    "אישי",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">נעים להכיר</p>

        <h2 class="${h2Class}" data-editable-text="true">
          מאחורי העסק עומד אדם שמוביל מקצועיות, יחס אישי ותוצאה
        </h2>

        <p class="${textClass}" data-editable-text="true">
          כאן אפשר להציג את בעלת העסק, הסיפור האישי, הניסיון, ההתמחות והגישה שמייחדת את השירות.
        </p>

        <div class="mt-8 flex flex-wrap gap-3">
          ${expertBadge("7 שנות ניסיון")}
          ${expertBadge("500+ לקוחות")}
          ${expertBadge("התאמה אישית")}
        </div>

        ${actionRow("לקביעת פגישה", "שליחת הודעה")}
      </div>
      `,
      imageBlock(sectionImages.people, "min-h-[520px]"),
      false
    ),
    { tags: ["owner", "personal", "profile"] }
  ),

  createVariant(
    "team-layout-3",
    kind,
    "תמונה + צוות",
    "תמונה גדולה בצד וגריד אנשי צוות בצד השני.",
    "תמונה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        ${imageBlock(sectionImages.office, "min-h-[560px]")}

        <div>
          <p class="${pillClass}" data-editable-text="true">הצוות המקצועי</p>

          <h2 class="${h2Class}" data-editable-text="true">
            כל אחד בצוות מביא מומחיות אחרת
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הציגו אנשי צוות, תפקידים, מומחיות וניסיון בצורה נקייה וברורה.
          </p>

          <div class="mt-8 grid gap-4">
            ${compactMemberCard("שם איש צוות", "ניהול מקצועי", "א")}
            ${compactMemberCard("שם איש צוות", "שירות לקוחות", "ב")}
            ${compactMemberCard("שם איש צוות", "מומחה/ית תחום", "ג")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["image", "team", "compact"] }
  ),

  createVariant(
    "team-layout-4",
    kind,
    "צוות כהה יוקרתי",
    "עיצוב כהה ויוקרתי לצוות מקצועי, קליניקה, משרד או סוכנות.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[54px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_44px_150px_rgba(15,23,42,0.25)] md:p-14">
        <div class="mx-auto max-w-[880px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
            Professional Team
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            צוות מקצועי שמוביל את העסק קדימה
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים לעסקים שרוצים להציג רמה גבוהה, מומחיות, ניסיון ואמון.
          </p>
        </div>

        <div class="mt-12 grid gap-6 md:grid-cols-3">
          ${darkFeatureCard("שם איש צוות", "מנהל/ת מקצועי/ת עם ניסיון רחב ויחס אישי.", "01")}
          ${darkFeatureCard("שם איש צוות", "אחראי/ת לקוחות, תיאומים ושירות.", "02")}
          ${darkFeatureCard("שם איש צוות", "מומחה/ית בתחום עם התמחות ייחודית.", "03")}
        </div>

        <div class="mt-10 flex justify-center gap-4">
          ${primaryButton("דברו איתנו")}
          ${darkButton("עוד על הצוות")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "luxury", "premium"] }
  ),

  createVariant(
    "team-layout-5",
    kind,
    "צוות עם נתונים",
    "הצגת צוות לצד מספרי אמון כמו ניסיון, לקוחות ודירוג.",
    "אמון",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">האנשים שמאחורי השירות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            צוות קטן, מקצועי ומדויק
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מבנה שמתאים לעסק שרוצה להראות שהוא לא רק שירות — אלא צוות אמיתי שעומד מאחורי הלקוחות.
          </p>

          ${actionRow("קביעת שיחה", "הכירו אותנו")}
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
          ${statCard("5+", "אנשי צוות")}
          ${statCard("500+", "לקוחות")}
          ${statCard("7", "שנות ניסיון")}
          ${statCard("98%", "שביעות רצון")}
        </div>
      </div>
      `
    ),
    { tags: ["stats", "trust", "team"] }
  ),

  createVariant(
    "team-layout-6",
    kind,
    "צוות בגריד 4",
    "גריד רחב של ארבעה אנשי צוות עם תמונות ותפקידים.",
    "Grid",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "הכירו את האנשים שלנו",
        "תצוגת צוות רחבה שמתאימה לעסק עם כמה אנשי מקצוע או מחלקות.",
        "center"
      )}

      <div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        ${teamMemberCard("שם איש צוות", "מנכ״ל/ית", sectionImages.people, "כמה מילים על האדם, הניסיון והאחריות שלו בצוות.")}
        ${teamMemberCard("שם איש צוות", "מנהל/ת לקוחות", sectionImages.office, "כמה מילים על האדם, הניסיון והאחריות שלו בצוות.")}
        ${teamMemberCard("שם איש צוות", "מומחה/ית", sectionImages.salon, "כמה מילים על האדם, הניסיון והאחריות שלו בצוות.")}
        ${teamMemberCard("שם איש צוות", "תפעול", sectionImages.clinic, "כמה מילים על האדם, הניסיון והאחריות שלו בצוות.")}
      </div>
      `
    ),
    { tags: ["grid", "team", "four"] }
  ),

  createVariant(
    "team-layout-7",
    kind,
    "צוות קומפקטי",
    "רשימת צוות קומפקטית שמתאימה לאזור קצר באתר.",
    "קצר",
    sectionShell(
      kind,
      `
      <div class="rounded-[44px] border border-slate-200 bg-white p-8 shadow-[0_28px_100px_rgba(15,23,42,0.08)] md:p-12">
        <div class="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p class="${pillClass}" data-editable-text="true">הצוות</p>

            <h2 class="text-3xl font-black leading-tight tracking-[-0.04em] text-slate-800 md:text-5xl" data-editable-text="true">
              צוות מקצועי, זמין ושירותי
            </h2>

            <p class="mt-4 text-base font-bold leading-8 text-slate-500" data-editable-text="true">
              תצוגה קצרה ונקייה לצוות, מתאימה לדפי נחיתה ולעמודים עם הרבה סקשנים.
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-2">
            ${compactMemberCard("שם איש צוות", "ניהול", "א")}
            ${compactMemberCard("שם איש צוות", "שירות", "ב")}
            ${compactMemberCard("שם איש צוות", "מקצועי", "ג")}
            ${compactMemberCard("שם איש צוות", "תפעול", "ד")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["compact", "short", "landing"] }
  ),

  createVariant(
    "team-layout-8",
    kind,
    "צוות על תמונת רקע",
    "סקשן צוות עם תמונת רקע חזקה וטקסט לבן.",
    "רקע",
    backgroundSection(
      kind,
      sectionImages.office,
      `
      <div class="max-w-[820px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          הצוות שלנו
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          אנשים מקצועיים שמייצרים תוצאה
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          סקשן מרשים לצוות, משרד, קליניקה, סוכנות או עסק עם נראות מקצועית.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("הצטרפו אלינו")}
          ${secondaryButton("דברו איתנו")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "team", "hero"] }
  ),

  createVariant(
    "team-layout-9",
    kind,
    "מומחים לפי תחום",
    "כרטיסי מומחיות במקום כרטיסי אנשים — מתאים לעסקים שנותנים כמה שירותים.",
    "מומחים",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "מומחים בכל תחום",
        "הציגו תחומי התמחות, מחלקות או אנשי מקצוע לפי השירות שהם נותנים.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${featureCard("מומחה/ית שירות", "אחראי/ת על התאמה אישית, תהליך ושירות לקוחות.", "✦")}
        ${featureCard("מומחה/ית מקצועי/ת", "אחראי/ת על הביצוע, המקצועיות והתוצאה.", "✓")}
        ${featureCard("מנהל/ת לקוחות", "אחראי/ת על זמינות, תיאום, ליווי וחוויית לקוח.", "♡")}
      </div>
      `
    ),
    { tags: ["experts", "services", "cards"] }
  ),

  createVariant(
    "team-layout-10",
    kind,
    "צוות עם המלצה",
    "צוות לצד המלצת לקוח ליצירת אמון מהיר.",
    "המלצה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">צוות שאפשר לסמוך עליו</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הלקוחות מרגישים את המקצועיות של הצוות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לעסק שרוצה לשלב צוות עם הוכחת אמון — ביקורת, סיפור לקוח או המלצה.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${softFeatureCard("שירות אישי", "ליווי בגובה העיניים.", "♡")}
            ${softFeatureCard("מקצועיות", "ביצוע מדויק וברור.", "✓")}
          </div>

          ${actionRow("קביעת פגישה", "כל הביקורות")}
        </div>

        ${testimonialCard(
          "הצוות היה מקצועי, סבלני וזמין. הרגשתי שיש לי על מי לסמוך לאורך כל הדרך.",
          "לקוחה מרוצה"
        )}
      </div>
      `
    ),
    { tags: ["testimonial", "trust", "team"] }
  ),

  createVariant(
    "team-layout-11",
    kind,
    "צוות עם וידאו",
    "סקשן צוות עם וידאו היכרות או סרטון מאחורי הקלעים.",
    "Video",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">וידאו היכרות</p>

        <h2 class="${h2Class}" data-editable-text="true">
          הכירו את הצוות דרך סרטון קצר
        </h2>

        <p class="${textClass}" data-editable-text="true">
          אפשר להוסיף סרטון של הצוות, בעל העסק, המקום, תהליך העבודה או מאחורי הקלעים.
        </p>

        ${actionRow("צפייה", "יצירת קשר")}
      </div>
      `,
      videoBox(),
      false
    ),
    { tags: ["video", "team", "personal"] }
  ),

  createVariant(
    "team-layout-12",
    kind,
    "צוות עם גלריה",
    "סקשן צוות עם תמונות אווירה מהעסק.",
    "גלריה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">מאחורי הקלעים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הצוות, המקום והאווירה
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מבנה שמתאים להצגת צוות בתמונות, יום עבודה, קליניקה, סטודיו, משרד או אירוע.
          </p>

          ${actionRow("צפייה בגלריה", "דברו איתנו")}
        </div>

        ${imageGrid(
          [
            sectionImages.people,
            sectionImages.office,
            sectionImages.salon,
            sectionImages.clinic,
          ],
          "min-h-[230px]",
          "md:grid-cols-2"
        )}
      </div>
      `
    ),
    { tags: ["gallery", "images", "team"] }
  ),

  createVariant(
    "team-layout-13",
    kind,
    "צוות SaaS",
    "מבנה צוות שמתאים למערכת, סטארטאפ או מוצר דיגיטלי.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[54px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_44px_150px_rgba(15,23,42,0.25)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-black" data-editable-text="true">
              Product Team
            </p>

            <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              צוות שמחבר מוצר, שירות וטכנולוגיה
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים למיני SaaS, מוצר דיגיטלי, CRM, אוטומציות או פלטפורמה עסקית.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("צפייה במוצר")}
              ${darkButton("הצוות שלנו")}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${darkFeatureCard("Product", "ניהול מוצר וחוויית משתמש.", "P")}
            ${darkFeatureCard("Design", "עיצוב ממשק, מותג וחוויית לקוח.", "D")}
            ${darkFeatureCard("Support", "שירות, ליווי ותמיכה לעסקים.", "S")}
            ${darkFeatureCard("Automation", "AI, תהליכים ואוטומציות.", "AI")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["saas", "product", "dark"] }
  ),

  createVariant(
    "team-layout-14",
    kind,
    "צוות עם מדיה להוספה",
    "מבנה עם אזור להוספת תמונה או וידאו של הצוות.",
    "מדיה",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.people, "min-h-[340px]")}
          ${addMediaBox("הוספת תמונת צוות / וידאו")}
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">תמונות צוות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו תמונות אמיתיות של הצוות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            בעל העסק יכול להחליף תמונות, להעלות סרטון, להוסיף תמונת עובדים או גלריית אווירה.
          </p>

          ${actionRow("הוספת פנייה", "צפייה בגלריה")}
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "team"] }
  ),

  createVariant(
    "team-layout-15",
    kind,
    "צוות מינימליסטי",
    "סקשן נקי מאוד עם שמות ותפקידים בלי תמונות.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px]">
        <div class="text-center">
          <p class="${pillClass}" data-editable-text="true">הצוות שלנו</p>

          <h2 class="${h2Class}" data-editable-text="true">
            אנשים טובים. עבודה מקצועית.
          </h2>

          <p class="mx-auto mt-6 max-w-[720px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
            תצוגה מינימליסטית שמתאימה לעסק שרוצה לשמור על מראה נקי, רגוע ויוקרתי.
          </p>
        </div>

        <div class="mt-12 grid gap-4 md:grid-cols-2">
          ${compactMemberCard("שם איש צוות", "מנהל/ת מקצועי/ת", "א")}
          ${compactMemberCard("שם איש צוות", "מנהל/ת לקוחות", "ב")}
          ${compactMemberCard("שם איש צוות", "מומחה/ית", "ג")}
          ${compactMemberCard("שם איש צוות", "תפעול ושירות", "ד")}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "compact"] }
  ),

  createVariant(
    "team-layout-16",
    kind,
    "צוות עם מחלקות",
    "הצגת מחלקות במקום אנשי צוות — מתאים לעסקים גדולים יותר.",
    "מחלקות",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "המחלקות שלנו",
        "מבנה שמתאים לעסק עם צוותים, תחומי פעילות או כמה מחלקות מקצועיות.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${softFeatureCard("שירות לקוחות", "מענה, תיאום, ליווי וזמינות.", "☎")}
        ${softFeatureCard("צוות מקצועי", "ביצוע, מומחיות ואיכות השירות.", "✦")}
        ${softFeatureCard("ניהול ותפעול", "סדר, תהליכים ואחריות על החוויה.", "⚙")}
      </div>

      <div class="mt-10 flex justify-center gap-4">
        ${primaryButton("יצירת קשר")}
        ${secondaryButton("עוד עלינו")}
      </div>
      `
    ),
    { tags: ["departments", "business", "cards"] }
  ),

  createVariant(
    "team-layout-17",
    kind,
    "צוות עם פרופיל מודגש",
    "איש צוות מוביל גדול לצד אנשי צוות נוספים.",
    "Featured",
    sectionShell(
      kind,
      `
      <div class="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <article class="${softCardClass}" data-editable-card="true">
          ${imageBlock(sectionImages.people, "min-h-[420px]", "rounded-[32px]")}

          <div class="mt-7">
            <p class="${pillClass}" data-editable-text="true">Founder / Owner</p>

            <h3 class="text-4xl font-black text-slate-800" data-editable-text="true">
              שם בעל/ת העסק
            </h3>

            <p class="mt-3 text-base font-bold leading-8 text-slate-500" data-editable-text="true">
              פרופיל מרכזי לבעלת העסק, מנהלת מקצועית או מומחה מוביל.
            </p>

            ${actionRow("לתיאום פגישה", "שליחת הודעה")}
          </div>
        </article>

        <div class="grid content-start gap-4">
          <p class="${pillClass}" data-editable-text="true">עוד בצוות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            אנשים נוספים שמובילים את השירות
          </h2>

          <div class="mt-4 grid gap-4">
            ${compactMemberCard("שם איש צוות", "ניהול לקוחות", "א")}
            ${compactMemberCard("שם איש צוות", "מומחה/ית", "ב")}
            ${compactMemberCard("שם איש צוות", "תפעול", "ג")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["featured", "owner", "team"] }
  ),

  createVariant(
    "team-layout-18",
    kind,
    "צוות קצר עם CTA",
    "סקשן צוות קצר עם קריאה לפעולה בסוף.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="rounded-[52px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_34px_120px_rgba(15,23,42,0.09)] md:p-14">
        <div class="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p class="${pillClass}" data-editable-text="true">הצוות שלנו</p>

            <h2 class="${h2Class}" data-editable-text="true">
              צוות שנותן לכם מענה מקצועי ומהיר
            </h2>

            <p class="${textClass}" data-editable-text="true">
              סקשן קצר, מעוצב וממיר שמתאים לסוף עמוד או אחרי סקשן שירותים.
            </p>

            <div class="mt-8 flex flex-wrap gap-4">
              ${primaryButton("דברו עם הצוות")}
              ${secondaryButton("קביעת תור")}
            </div>
          </div>

          <div class="grid gap-4">
            ${compactMemberCard("שם איש צוות", "שירות לקוחות", "א")}
            ${compactMemberCard("שם איש צוות", "מקצועי", "ב")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["cta", "short", "team"] }
  ),
];