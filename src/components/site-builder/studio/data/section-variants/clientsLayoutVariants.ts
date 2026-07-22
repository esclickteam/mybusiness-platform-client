import type { SectionLayoutVariant } from "../../types";
import {
  backgroundSection,
  cardClass,
  createVariant,
  darkButton,
  darkFeatureCard,
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
  whatsappButton,
  wideSectionShell,
} from "./shared";

/*
  Bizuply Website Studio — Clients Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/clientsLayoutVariants.ts

  סקשן לקוחות / שותפים / מותגים.
  מתאים ל:
  - לוגואים של לקוחות
  - שותפים עסקיים
  - מותגים
  - לקוחות מרוצים
  - עסקים שעובדים איתנו
  - הוכחת אמון
  - SaaS
  - חנות
  - שירותים
  - דפי נחיתה
*/

const kind = "clients" as const;

function clientLogoCard(name: string, subtitle = "Client") {
  return `
<div class="grid min-h-28 place-items-center rounded-[28px] border border-slate-200 bg-white px-6 text-center shadow-[0_18px_55px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(124,58,237,0.14)]" data-editable-card="true">
  <div>
    <span class="block text-xl font-black tracking-[-0.03em] text-slate-400" data-editable-text="true">
      ${name}
    </span>
    <span class="mt-2 block text-xs font-bold text-slate-300" data-editable-text="true">
      ${subtitle}
    </span>
  </div>
</div>
`;
}

function partnerCard(title: string, text: string, icon = "✦") {
  return `
<article class="${cardClass}" data-editable-card="true">
  <div class="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-white">
    ${icon}
  </div>

  <h3 class="text-2xl font-black text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>
</article>
`;
}

function darkClientLogo(name: string) {
  return `
<div class="grid min-h-28 place-items-center rounded-[28px] border border-white/10 bg-white/8 px-6 text-center shadow-[0_18px_55px_rgba(0,0,0,0.12)]" data-editable-card="true">
  <span class="text-xl font-black tracking-[-0.03em] text-white/55" data-editable-text="true">
    ${name}
  </span>
</div>
`;
}

function caseStudyCard(
  title: string,
  text: string,
  result: string,
  imageUrl = sectionImages.office
) {
  return `
<article class="${cardClass}" data-editable-card="true">
  ${imageBlock(imageUrl, "min-h-[260px]", "rounded-[30px]")}

  <p class="mt-6 inline-flex rounded-full bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2 text-xs font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
    Case Study
  </p>

  <h3 class="mt-4 text-2xl font-black text-slate-800" data-editable-text="true">
    ${title}
  </h3>

  <p class="mt-3 text-sm font-bold leading-7 text-slate-500" data-editable-text="true">
    ${text}
  </p>

  <div class="mt-6 rounded-[24px] bg-slate-50 p-5">
    <strong class="block text-3xl font-black text-slate-800" data-editable-text="true">
      ${result}
    </strong>
    <span class="mt-1 block text-xs font-bold text-slate-400" data-editable-text="true">
      תוצאה מרכזית
    </span>
  </div>
</article>
`;
}

function clientQuote(name: string, quote: string) {
  return `
<div class="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,0.06)]" data-editable-card="true">
  <div class="text-lg text-amber-400" data-editable-text="true">★★★★★</div>

  <p class="mt-4 text-sm font-bold leading-7 text-slate-600" data-editable-text="true">
    ${quote}
  </p>

  <p class="mt-5 text-sm font-black text-slate-800" data-editable-text="true">
    ${name}
  </p>
</div>
`;
}

export const clientsLayoutVariants: SectionLayoutVariant[] = [
  createVariant(
    "clients-layout-1",
    kind,
    "לוגואים קלאסי",
    "סקשן לוגואים נקי ומקצועי להצגת לקוחות, שותפים או מותגים.",
    "מומלץ",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "לקוחות ושותפים שסומכים עלינו",
        "הציגו לוגואים של לקוחות, עסקים, מותגים או שיתופי פעולה שמחזקים אמון.",
        "center"
      )}

      <div class="mt-12">
        ${logoCloud(["Client", "Brand", "Studio", "Agency", "VIP"])}
      </div>
      `
    ),
    { featured: true, tags: ["logos", "trust", "classic"] }
  ),

  createVariant(
    "clients-layout-2",
    kind,
    "גריד לוגואים גדול",
    "תצוגת לוגואים רחבה עם 10 לקוחות.",
    "Grid",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "הלקוחות שלנו",
        "מתאים להצגת הרבה לקוחות בצורה מסודרת, נקייה וברורה.",
        "center"
      )}

      <div class="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
        ${clientLogoCard("Client 01", "Business")}
        ${clientLogoCard("Client 02", "Store")}
        ${clientLogoCard("Client 03", "Agency")}
        ${clientLogoCard("Client 04", "Clinic")}
        ${clientLogoCard("Client 05", "Brand")}
        ${clientLogoCard("Client 06", "SaaS")}
        ${clientLogoCard("Client 07", "Studio")}
        ${clientLogoCard("Client 08", "Service")}
        ${clientLogoCard("Client 09", "Pro")}
        ${clientLogoCard("Client 10", "VIP")}
      </div>
      `
    ),
    { tags: ["many", "logos", "grid"] }
  ),

  createVariant(
    "clients-layout-3",
    kind,
    "לקוחות + טקסט",
    "טקסט שמסביר את האמון לצד לוגואים של לקוחות.",
    "טקסט",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">אמון של לקוחות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            עסקים ולקוחות שכבר בחרו לעבוד איתנו
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הצגת לקוחות ושותפים עוזרת ללקוח חדש להבין שהוא נמצא במקום מקצועי, אמין ובעל ניסיון.
          </p>

          <div class="mt-8 flex flex-wrap gap-4">
            ${primaryButton("הצטרפות ללקוחות")}
            ${secondaryButton("צפייה בהמלצות")}
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          ${clientLogoCard("Client", "Retail")}
          ${clientLogoCard("Brand", "Fashion")}
          ${clientLogoCard("Studio", "Creative")}
          ${clientLogoCard("Pro", "Business")}
          ${clientLogoCard("VIP", "Premium")}
          ${clientLogoCard("Agency", "Partner")}
        </div>
      </div>
      `
    ),
    { tags: ["text", "logos", "trust"] }
  ),

  createVariant(
    "clients-layout-4",
    kind,
    "לוגואים כהה פרימיום",
    "סקשן כהה ויוקרתי להצגת לקוחות גדולים או שותפים.",
    "Dark",
    wideSectionShell(
      kind,
      `
      <div class="relative overflow-hidden rounded-[60px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_54px_180px_rgba(15,23,42,0.38)] md:p-14">
        <div class="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div class="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl"></div>

        <div class="relative mx-auto max-w-[900px] text-center">
          <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
            Trusted By
          </p>

          <h2 class="text-4xl font-black leading-[1.05] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
            מותגים ועסקים שבוחרים ברמה גבוהה
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-white/70" data-editable-text="true">
            מתאים להצגת שותפים, לקוחות אסטרטגיים, חברות או מותגים.
          </p>
        </div>

        <div class="relative mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          ${darkClientLogo("Client")}
          ${darkClientLogo("Brand")}
          ${darkClientLogo("Studio")}
          ${darkClientLogo("Agency")}
          ${darkClientLogo("VIP")}
          ${darkClientLogo("SaaS")}
          ${darkClientLogo("Pro")}
          ${darkClientLogo("Partner")}
          ${darkClientLogo("Store")}
          ${darkClientLogo("Clinic")}
        </div>
      </div>
      `
    ),
    { tags: ["dark", "premium", "logos"] }
  ),

  createVariant(
    "clients-layout-5",
    kind,
    "לקוחות עם מספרים",
    "לוגואים ונתוני אמון יחד באותו סקשן.",
    "אמון",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">אמון במספרים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לקוחות, מותגים ועסקים שכבר איתנו
          </h2>

          <p class="${textClass}" data-editable-text="true">
            שלבו בין שמות לקוחות לנתוני אמון כדי ליצור תחושה חזקה של ניסיון והצלחה.
          </p>

          <div class="mt-8 grid gap-5 sm:grid-cols-2">
            ${statCard("500+", "לקוחות")}
            ${statCard("120+", "עסקים")}
            ${statCard("98%", "שביעות רצון")}
            ${statCard("7", "שנות ניסיון")}
          </div>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          ${clientLogoCard("Client 01")}
          ${clientLogoCard("Client 02")}
          ${clientLogoCard("Client 03")}
          ${clientLogoCard("Client 04")}
        </div>
      </div>
      `
    ),
    { tags: ["stats", "trust", "clients"] }
  ),

  createVariant(
    "clients-layout-6",
    kind,
    "שותפים עסקיים",
    "כרטיסים שמציגים סוגי שותפים או שיתופי פעולה.",
    "Partners",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "השותפים שלנו",
        "הציגו שיתופי פעולה, ספקים, מותגים או עסקים שעובדים איתכם.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${partnerCard("שותף אסטרטגי", "תיאור קצר של שיתוף הפעולה והערך שהוא נותן ללקוחות.", "01")}
        ${partnerCard("מותג מוביל", "תיאור קצר של המותג, השירות או התמיכה שהוא מספק.", "02")}
        ${partnerCard("ספק מקצועי", "תיאור קצר של החיבור העסקי והאמון בין הצדדים.", "03")}
      </div>
      `
    ),
    { tags: ["partners", "cards", "business"] }
  ),

  createVariant(
    "clients-layout-7",
    kind,
    "Case Studies",
    "כרטיסי לקוחות עם תוצאה מרכזית לכל לקוח.",
    "Cases",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "סיפורי לקוחות",
        "הציגו דוגמאות אמיתיות של לקוחות, פרויקטים ותוצאות.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${caseStudyCard(
          "לקוח ראשון",
          "תיאור קצר של האתגר, השירות שניתן והתוצאה שהתקבלה.",
          "+42%",
          sectionImages.office
        )}
        ${caseStudyCard(
          "לקוח שני",
          "תיאור קצר של תהליך העבודה והערך שהלקוח קיבל.",
          "3x",
          sectionImages.people
        )}
        ${caseStudyCard(
          "לקוח שלישי",
          "תיאור קצר של ההצלחה, השיפור או התוצאה העסקית.",
          "98%",
          sectionImages.store
        )}
      </div>
      `
    ),
    { tags: ["case-study", "results", "clients"] }
  ),

  createVariant(
    "clients-layout-8",
    kind,
    "לקוחות + המלצות",
    "לוגואים לצד המלצות קצרות של לקוחות.",
    "Review",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">לקוחות ממליצים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לא רק לוגואים — גם מילים טובות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            הציגו לקוחות וצרפו ביקורות קצרות כדי לחזק אמון ולהראות תוצאה אמיתית.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${clientLogoCard("Client A")}
            ${clientLogoCard("Client B")}
            ${clientLogoCard("Client C")}
            ${clientLogoCard("Client D")}
          </div>
        </div>

        <div class="grid gap-5">
          ${clientQuote(
            "לקוחה מרוצה",
            "השירות היה מקצועי, מהיר וברור. קיבלנו בדיוק את מה שהיינו צריכים."
          )}
          ${clientQuote(
            "בעל עסק",
            "הכל היה מסודר, נוח ומדויק. הרגשנו שיש לנו על מי לסמוך."
          )}
        </div>
      </div>
      `
    ),
    { tags: ["reviews", "logos", "trust"] }
  ),

  createVariant(
    "clients-layout-9",
    kind,
    "לקוחות על תמונת רקע",
    "סקשן לקוחות דרמטי עם רקע גדול וטקסט לבן.",
    "רקע",
    backgroundSection(
      kind,
      sectionImages.office,
      `
      <div class="max-w-[860px]">
        <p class="mb-4 inline-flex rounded-full bg-white/90 px-5 py-2 text-sm font-black text-[var(--biz-primary,#7C3AED)]" data-editable-text="true">
          Trusted Clients
        </p>

        <h2 class="text-5xl font-black leading-[1] tracking-[-0.05em] text-white md:text-7xl" data-editable-text="true">
          עסקים ולקוחות שבחרו ללכת איתנו קדימה
        </h2>

        <p class="mt-6 max-w-3xl text-xl font-bold leading-10 text-white/85" data-editable-text="true">
          הציגו אמון, ניסיון ושיתופי פעולה בצורה חזקה ומרשימה.
        </p>

        <div class="mt-9 flex flex-wrap gap-4">
          ${primaryButton("הצטרפות ללקוחות")}
          ${secondaryButton("צפייה בסיפורים")}
        </div>
      </div>
      `
    ),
    { tags: ["background", "hero", "clients"] }
  ),

  createVariant(
    "clients-layout-10",
    kind,
    "לקוחות עם תמונות",
    "תמונות לקוחות / פרויקטים לצד לוגואים.",
    "Visual",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p class="${pillClass}" data-editable-text="true">לקוחות ופרויקטים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הציגו את הלקוחות דרך תמונות, פרויקטים ותוצאות
          </h2>

          <p class="${textClass}" data-editable-text="true">
            מתאים לעסקים שמציגים פרויקטים, אירועים, עבודות, לקוחות או שיתופי פעולה ויזואליים.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${clientLogoCard("Client")}
            ${clientLogoCard("Partner")}
          </div>
        </div>

        ${imageGrid(
          [
            sectionImages.office,
            sectionImages.people,
            sectionImages.store,
            sectionImages.event,
          ],
          "min-h-[230px]",
          "md:grid-cols-2"
        )}
      </div>
      `
    ),
    { tags: ["visual", "projects", "images"] }
  ),

  createVariant(
    "clients-layout-11",
    kind,
    "לקוחות SaaS",
    "סקשן לקוחות שמתאים למערכת, מוצר דיגיטלי או SaaS.",
    "SaaS",
    wideSectionShell(
      kind,
      `
      <div class="rounded-[60px] border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800 shadow-[0_54px_180px_rgba(15,23,42,0.38)] md:p-14">
        <div class="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/10 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              SaaS Customers
            </p>

            <h2 class="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-white md:text-7xl" data-editable-text="true">
              עסקים שמנהלים יותר טוב בזכות המערכת
            </h2>

            <p class="mt-6 text-lg font-bold leading-9 text-white/70" data-editable-text="true">
              מתאים ל־CRM, תורים, Mini SaaS, ניהול לקוחות, קורסים ומנויים.
            </p>

            <div class="mt-9 flex flex-wrap gap-4">
              ${primaryButton("בקשת דמו")}
              ${darkButton("סיפורי לקוחות")}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            ${darkFeatureCard("CRM", "ניהול לקוחות ולידים.", "CRM")}
            ${darkFeatureCard("Booking", "תיאום תורים וזמינות.", "◷")}
            ${darkFeatureCard("Automation", "תהליכים חכמים.", "AI")}
            ${darkFeatureCard("Payments", "חבילות ותשלומים.", "₪")}
          </div>
        </div>

        <div class="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          ${darkClientLogo("Client")}
          ${darkClientLogo("Brand")}
          ${darkClientLogo("Studio")}
          ${darkClientLogo("Agency")}
          ${darkClientLogo("VIP")}
        </div>
      </div>
      `
    ),
    { tags: ["saas", "dark", "customers"] }
  ),

  createVariant(
    "clients-layout-12",
    kind,
    "לקוחות לחנות",
    "סקשן לקוחות שמתאים לחנות, מותג או קהילה.",
    "Store",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-8 shadow-[0_40px_140px_rgba(15,23,42,0.10)] md:p-14">
        <div class="mx-auto max-w-[900px] text-center">
          <p class="${pillClass}" data-editable-text="true">קהילת לקוחות</p>

          <h2 class="${h2Class}" data-editable-text="true">
            לקוחות שאוהבים את המותג וחוזרים שוב
          </h2>

          <p class="mx-auto mt-6 max-w-[760px] text-lg font-bold leading-9 text-slate-500" data-editable-text="true">
            מתאים לחנויות, מותגים, מוצרים, קולקציות ומועדוני לקוחות.
          </p>
        </div>

        <div class="mt-12 grid gap-5 md:grid-cols-3">
          ${testimonialCard(
            "המשלוח היה מהיר והמוצר הגיע בדיוק כמו בתמונה.",
            "לקוחה מרוצה"
          )}
          ${testimonialCard(
            "שירות מעולה, מוצר איכותי וחוויה מאוד נוחה.",
            "לקוח חוזר"
          )}
          ${testimonialCard(
            "קיבלתי מענה בוואטסאפ ועזרו לי לבחור נכון.",
            "לקוחה חדשה"
          )}
        </div>

        <div class="mt-10 flex justify-center gap-4">
          ${primaryButton("מעבר לחנות", "#store")}
          ${whatsappButton("שאלה על מוצר")}
        </div>
      </div>
      `
    ),
    { tags: ["store", "community", "reviews"] }
  ),

  createVariant(
    "clients-layout-13",
    kind,
    "לקוחות מינימליסטי",
    "סקשן לוגואים קצר ואלגנטי בלי עומס.",
    "Minimal",
    sectionShell(
      kind,
      `
      <div class="mx-auto max-w-[980px] text-center">
        <p class="${pillClass}" data-editable-text="true">Trusted by</p>

        <h2 class="${h2Class}" data-editable-text="true">
          לקוחות שכבר איתנו
        </h2>

        <div class="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          ${clientLogoCard("Client")}
          ${clientLogoCard("Brand")}
          ${clientLogoCard("Studio")}
          ${clientLogoCard("Pro")}
          ${clientLogoCard("VIP")}
        </div>
      </div>
      `
    ),
    { tags: ["minimal", "clean", "logos"] }
  ),

  createVariant(
    "clients-layout-14",
    kind,
    "לקוחות עם CTA",
    "סקשן לקוחות שמסתיים בקריאה לפעולה.",
    "CTA",
    sectionShell(
      kind,
      `
      <div class="rounded-[58px] bg-gradient-to-l from-[var(--biz-primary,#7C3AED)] via-fuchsia-600 to-[var(--biz-accent,#EC4899)] p-8 text-white shadow-[0_44px_150px_rgba(139,92,246,0.30)] md:p-14">
        <div class="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p class="mb-4 inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-black text-white" data-editable-text="true">
              הצטרפו ללקוחות שלנו
            </p>

            <h2 class="text-4xl font-black leading-[1.03] tracking-[-0.05em] text-white md:text-6xl" data-editable-text="true">
              רוצים שגם העסק שלכם יופיע כאן?
            </h2>

            <p class="mt-5 text-lg font-bold leading-9 text-white/82" data-editable-text="true">
              השאירו פרטים ונראה איך אפשר לעזור לכם להצטרף לרשימת הלקוחות המרוצים.
            </p>
          </div>

          <div class="rounded-[34px] bg-white/12 p-6 backdrop-blur-2xl">
            <div class="grid gap-3 sm:grid-cols-2">
              ${darkClientLogo("Client")}
              ${darkClientLogo("Brand")}
              ${darkClientLogo("Studio")}
              ${darkClientLogo("VIP")}
            </div>

            <div class="mt-6 flex flex-wrap gap-3">
              <a href="#contact" class="inline-flex min-h-14 flex-1 items-center justify-center rounded-2xl bg-white px-8 text-sm font-black text-[var(--biz-primary,#7C3AED)] shadow-xl" data-editable-link="true">
                השארת פרטים
              </a>
            </div>
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["cta", "wow", "conversion"] }
  ),

  createVariant(
    "clients-layout-15",
    kind,
    "לקוחות עם תמונת מותג",
    "לוגואים לצד תמונת מותג גדולה.",
    "Brand",
    splitLayout(
      kind,
      `
      <div>
        <p class="${pillClass}" data-editable-text="true">מותגים ולקוחות</p>

        <h2 class="${h2Class}" data-editable-text="true">
          נראות מקצועית שמייצרת אמון
        </h2>

        <p class="${textClass}" data-editable-text="true">
          מתאים להצגת לקוחות עם תמונת מותג, תמונת משרד, צוות, מוצר או פרויקט.
        </p>

        <div class="mt-8 grid gap-4 sm:grid-cols-2">
          ${clientLogoCard("Client")}
          ${clientLogoCard("Brand")}
          ${clientLogoCard("Studio")}
          ${clientLogoCard("Partner")}
        </div>
      </div>
      `,
      imageBlock(sectionImages.darkOffice, "min-h-[560px]"),
      false
    ),
    { tags: ["brand", "image", "logos"] }
  ),

  createVariant(
    "clients-layout-16",
    kind,
    "לקוחות עם תעשיות",
    "הצגת סוגי לקוחות לפי תחומים.",
    "Industries",
    sectionShell(
      kind,
      `
      ${sectionIntro(
        kind,
        "אנחנו עובדים עם מגוון תחומים",
        "הציגו את סוגי הלקוחות או התעשיות שהעסק נותן להם שירות.",
        "center"
      )}

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        ${softFeatureCard("קליניקות ויופי", "עסקים שמנהלים לקוחות, תורים ושירותים.", "✦")}
        ${softFeatureCard("חנויות ומותגים", "מוצרים, קטלוגים, חנות ומועדון לקוחות.", "◈")}
        ${softFeatureCard("יועצים ונותני שירות", "לידים, הצעות, תיאומים ותהליכי לקוח.", "✓")}
        ${softFeatureCard("אירועים והפקות", "אישורי הגעה, לקוחות, תיאומים ומידע.", "♛")}
        ${softFeatureCard("קורסים ודיגיטל", "תוכן, הרשמות, תשלומים ואזור אישי.", "▶")}
        ${softFeatureCard("SaaS ומערכות", "מוצר, דמו, מנויים ואוטומציות.", "AI")}
      </div>
      `
    ),
    { tags: ["industries", "segments", "cards"] }
  ),

  createVariant(
    "clients-layout-17",
    kind,
    "לקוחות עם מדיה",
    "סקשן לקוחות עם אזור להוספת תמונה או וידאו.",
    "Media",
    sectionShell(
      kind,
      `
      <div class="grid items-center gap-12 lg:grid-cols-2">
        <div class="grid gap-5 md:grid-cols-2">
          ${imageBlock(sectionImages.people, "min-h-[340px]")}
          <div class="grid min-h-[340px] cursor-pointer place-items-center rounded-[38px] border-2 border-dashed border-[color:var(--biz-secondary,#F3E8FF)] bg-[var(--biz-secondary,#F3E8FF)]/70 p-8 text-center transition hover:bg-[var(--biz-secondary,#F3E8FF)]" data-image-drop-zone="true" data-media-drop-zone="true" data-media-replaceable="true">
            <div>
              <div class="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-white text-3xl font-black text-[var(--biz-primary,#7C3AED)] shadow-xl">
                +
              </div>
              <p class="text-xl font-black text-slate-800" data-editable-text="true">הוספת תמונת לקוח / וידאו</p>
              <p class="mt-2 text-sm font-bold leading-6 text-slate-500" data-editable-text="true">
                מתאים לסיפור לקוח, פרויקט או עדות וידאו.
              </p>
            </div>
          </div>
        </div>

        <div>
          <p class="${pillClass}" data-editable-text="true">לקוחות אמיתיים</p>

          <h2 class="${h2Class}" data-editable-text="true">
            הוסיפו תמונות או סרטונים שמראים אמון אמיתי
          </h2>

          <p class="${textClass}" data-editable-text="true">
            בעל העסק יכול להוסיף תמונת לקוח, וידאו המלצה, פרויקט או סיפור הצלחה.
          </p>

          <div class="mt-8 grid gap-4 sm:grid-cols-2">
            ${clientLogoCard("Client")}
            ${clientLogoCard("Partner")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["media", "editable", "upload"] }
  ),

  createVariant(
    "clients-layout-18",
    kind,
    "רצועת לוגואים",
    "רצועת לוגואים קצרה שמתאימה בין סקשנים.",
    "Strip",
    sectionShell(
      kind,
      `
      <div class="rounded-[38px] border border-slate-200 bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <div class="flex flex-col items-center justify-between gap-6 lg:flex-row">
          <p class="text-sm font-black text-slate-500" data-editable-text="true">
            עסקים ולקוחות שכבר סומכים עלינו
          </p>

          <div class="grid w-full flex-1 gap-3 sm:grid-cols-2 md:grid-cols-5">
            ${clientLogoCard("Client")}
            ${clientLogoCard("Brand")}
            ${clientLogoCard("Studio")}
            ${clientLogoCard("Pro")}
            ${clientLogoCard("VIP")}
          </div>
        </div>
      </div>
      `
    ),
    { tags: ["strip", "short", "logos"] }
  ),
];