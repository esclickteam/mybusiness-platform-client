import type { SectionLayoutVariant } from "../../types";

/*
  Bizuply Website Studio — Header Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/headerLayoutVariants.ts

  קובץ נפרד רק למבני Header.
  כולל 15 מבני Header שונים, עם:
  - אזור לוגו שניתן להחלפה
  - שם עסק שניתן לעריכה
  - שמות עמודים שניתנים לעריכה
  - כפתורי התחברות / התנתקות
  - מבני RTL וגם LTR
  - צבעי Header / טקסט / כפתור דרך CSS variables
  - ללא לוגו Bizuply אמיתי. הטקסט Brand הוא רק placeholder של העסק.
*/

function variant(
  id: string,
  title: string,
  description: string,
  previewLabel: string,
  badge: string,
  html: string
): SectionLayoutVariant {
  return {
    id,
    kind: "header",
    title,
    description,
    previewLabel,
    badge,
    html,
  };
}

/* =====================================================
   SHARED PARTS
===================================================== */

function headerVars({
  bg = "rgba(255,255,255,0.94)",
  text = "#0f172a",
  muted = "#64748b",
  border = "rgba(226,232,240,0.85)",
  buttonBg = "var(--biz-primary,#7C3AED)",
  buttonText = "#ffffff",
}: {
  bg?: string;
  text?: string;
  muted?: string;
  border?: string;
  buttonBg?: string;
  buttonText?: string;
} = {}) {
  return `--header-bg:${bg};--header-text:${text};--header-muted:${muted};--header-border:${border};--header-button-bg:${buttonBg};--header-button-text:${buttonText};`;
}

function pageLinks(light = false, compact = false) {
  const spacing = compact ? "px-3 py-2" : "px-4 py-2.5";
  const color = light
    ? "text-white/78 hover:bg-white/15 hover:text-white"
    : "text-[color:var(--header-muted,#64748b)] hover:bg-[var(--biz-secondary,#F3E8FF)] hover:text-[var(--biz-primary,#7C3AED)]";

  return `
    <nav class="hidden items-center gap-1.5 lg:flex" data-header-nav="true">
      <a href="#home" class="rounded-full ${spacing} text-sm font-black transition ${color}" data-header-link="home">דף הבית</a>
      <a href="#about" class="rounded-full ${spacing} text-sm font-black transition ${color}" data-header-link="about">אודות</a>
      <a href="#services" class="rounded-full ${spacing} text-sm font-black transition ${color}" data-header-link="services">שירותים</a>
      <a href="#gallery" class="rounded-full ${spacing} text-sm font-black transition ${color}" data-header-link="gallery">גלריה</a>
      <a href="#contact" class="rounded-full ${spacing} text-sm font-black transition ${color}" data-header-link="contact">צור קשר</a>
    </nav>
  `;
}

function logoBlock({
  light = false,
  compact = false,
  center = false,
  round = "rounded-2xl",
  brand = "שם העסק",
  tagline = "תחום העסק",
}: {
  light?: boolean;
  compact?: boolean;
  center?: boolean;
  round?: string;
  brand?: string;
  tagline?: string;
} = {}) {
  const logoSize = compact ? "h-10 w-10" : "h-12 w-12";
  const brandSize = compact ? "text-sm" : "text-base";
  const textColor = light ? "text-white" : "text-[color:var(--header-text,#0f172a)]";
  const mutedColor = light ? "text-white/62" : "text-[color:var(--header-muted,#64748b)]";

  return `
    <a href="#home" class="flex min-w-0 items-center gap-3 ${center ? "justify-center text-center" : ""}" data-header-brand="true">
      <div
        class="grid ${logoSize} shrink-0 place-items-center ${round} bg-gradient-to-br from-[var(--biz-primary,#7C3AED)] to-[var(--biz-accent,#EC4899)] text-lg font-black text-white shadow-xl"
        data-header-logo-slot="true"
      >
        <span data-header-logo-placeholder="true">B</span>
      </div>

      <div class="min-w-0">
        <p class="m-0 truncate ${brandSize} font-black leading-5 ${textColor}" data-header-business-name="true">${brand}</p>
        <p class="m-0 mt-1 truncate text-xs font-bold leading-4 ${mutedColor}" data-header-business-tagline="true">${tagline}</p>
      </div>
    </a>
  `;
}

function ctaButton(text = "קביעת תור", light = false) {
  return `
    <a
      href="#contact"
      class="inline-flex min-h-11 items-center justify-center rounded-2xl px-5 text-sm font-black shadow-xl transition hover:-translate-y-0.5"
      style="background:var(--header-button-bg,var(--biz-primary,#7C3AED));color:var(--header-button-text,#ffffff);"
      data-header-cta="true"
    >
      ${text}
    </a>
  `;
}

function authButtons(light = false) {
  const base = light
    ? "border-white/20 bg-white/10 text-white hover:bg-white/18"
    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-[var(--biz-primary,#7C3AED)]";

  return `
    <div class="hidden items-center gap-2 md:flex" data-header-auth="true">
      <a href="/login" class="rounded-2xl border px-4 py-3 text-xs font-black transition ${base}" data-header-login="true">התחברות</a>
      <a href="/logout" class="rounded-2xl border px-4 py-3 text-xs font-black transition ${base}" data-header-logout="true">התנתקות</a>
    </div>
  `;
}

function mobileButton(light = false) {
  return `
    <button
      type="button"
      class="grid h-11 w-11 place-items-center rounded-2xl ${
        light
          ? "border border-white/20 bg-white/10 text-xl font-black text-white"
          : "border border-slate-200 bg-white text-xl font-black text-slate-700"
      } lg:hidden"
      data-header-mobile-menu="true"
      aria-label="פתיחת תפריט"
    >
      ☰
    </button>
  `;
}

function phonePill(light = false) {
  return `
    <a
      href="tel:0500000000"
      class="hidden rounded-2xl ${
        light ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"
      } px-4 py-3 text-xs font-black md:inline-flex"
      data-header-phone="true"
    >
      050-0000000
    </a>
  `;
}

function headerShell({
  html,
  dir = "rtl",
  className,
  style = headerVars(),
  dataStyle,
}: {
  html: string;
  dir?: "rtl" | "ltr";
  className: string;
  style?: string;
  dataStyle: string;
}) {
  return `
<header
  dir="${dir}"
  class="${className}"
  style="${style}"
  data-section-kind="header"
  data-header-style="${dataStyle}"
  data-header-editable="true"
>
  ${html}
</header>
  `;
}

/* =====================================================
   15 HEADER LAYOUTS
===================================================== */

function headerLayout(index: number) {
  const layouts = [
    /* 1 */
    headerShell({
      dataStyle: "floating-rounded-rtl",
      className:
        "sticky top-0 z-40 mx-auto mt-4 flex w-[min(1240px,calc(100%-32px))] items-center justify-between gap-5 rounded-[28px] border px-5 py-4 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl",
      html: `
        ${logoBlock()}
        ${pageLinks()}
        <div class="flex items-center gap-2">${authButtons()}${ctaButton("קביעת תור")}${mobileButton()}</div>
      `,
    }),

    /* 2 */
    headerShell({
      dataStyle: "top-rectangle-rtl",
      className:
        "sticky top-0 z-40 w-full border-b px-8 py-4 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-2xl",
      html: `
        <div class="mx-auto flex max-w-[1280px] items-center justify-between gap-5">
          ${logoBlock({ round: "rounded-xl", brand: "BrandCo" })}
          ${pageLinks()}
          <div class="flex items-center gap-2">${authButtons()}${ctaButton("דברו איתנו")}${mobileButton()}</div>
        </div>
      `,
    }),

    /* 3 */
    headerShell({
      dataStyle: "dark-modern-rtl",
      className:
        "sticky top-0 z-40 mx-auto mt-4 flex w-[min(1240px,calc(100%-32px))] items-center justify-between gap-5 rounded-[22px] border px-5 py-4 shadow-[0_22px_85px_rgba(15,23,42,0.16)]",
      style: headerVars({
        bg: "#0f172a",
        text: "#ffffff",
        muted: "rgba(255,255,255,.66)",
        border: "rgba(255,255,255,.12)",
        buttonBg: "#ffffff",
        buttonText: "#0f172a",
      }),
      html: `
        ${logoBlock({ light: true })}
        ${pageLinks(true)}
        <div class="flex items-center gap-2">${authButtons(true)}${ctaButton("התחברות", true)}${mobileButton(true)}</div>
      `,
    }),

    /* 4 */
    headerShell({
      dataStyle: "ltr-clean",
      dir: "ltr",
      className:
        "sticky top-0 z-40 w-full border-b px-8 py-4 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-2xl",
      html: `
        <div class="mx-auto flex max-w-[1280px] items-center justify-between gap-5">
          ${logoBlock({ round: "rounded-xl", brand: "BrandCo", tagline: "Business Studio" })}
          <nav class="hidden items-center gap-1.5 lg:flex" data-header-nav="true">
            <a href="#home" class="rounded-full px-4 py-2.5 text-sm font-black text-[color:var(--header-muted,#64748b)] transition hover:bg-[var(--biz-secondary,#F3E8FF)] hover:text-[var(--biz-primary,#7C3AED)]" data-header-link="home">Home</a>
            <a href="#about" class="rounded-full px-4 py-2.5 text-sm font-black text-[color:var(--header-muted,#64748b)] transition hover:bg-[var(--biz-secondary,#F3E8FF)] hover:text-[var(--biz-primary,#7C3AED)]" data-header-link="about">About</a>
            <a href="#services" class="rounded-full px-4 py-2.5 text-sm font-black text-[color:var(--header-muted,#64748b)] transition hover:bg-[var(--biz-secondary,#F3E8FF)] hover:text-[var(--biz-primary,#7C3AED)]" data-header-link="services">Services</a>
            <a href="#contact" class="rounded-full px-4 py-2.5 text-sm font-black text-[color:var(--header-muted,#64748b)] transition hover:bg-[var(--biz-secondary,#F3E8FF)] hover:text-[var(--biz-primary,#7C3AED)]" data-header-link="contact">Contact</a>
          </nav>
          <div class="flex items-center gap-2">${authButtons()}${ctaButton("Book now")}${mobileButton()}</div>
        </div>
      `,
    }),

    /* 5 */
    headerShell({
      dataStyle: "transparent-over-hero",
      className:
        "absolute left-1/2 top-6 z-40 flex w-[min(1240px,calc(100%-40px))] -translate-x-1/2 items-center justify-between gap-5 rounded-[30px] border px-5 py-4 text-white shadow-[0_24px_90px_rgba(15,23,42,0.20)] backdrop-blur-2xl",
      style: headerVars({
        bg: "rgba(255,255,255,.12)",
        text: "#ffffff",
        muted: "rgba(255,255,255,.76)",
        border: "rgba(255,255,255,.24)",
        buttonBg: "#ffffff",
        buttonText: "#0f172a",
      }),
      html: `
        ${logoBlock({ light: true })}
        ${pageLinks(true)}
        <div class="flex items-center gap-2">${authButtons(true)}${ctaButton("קביעת תור", true)}${mobileButton(true)}</div>
      `,
    }),

    /* 6 */
    headerShell({
      dataStyle: "two-rows-rtl",
      className:
        "sticky top-4 z-40 mx-auto grid w-[min(1180px,calc(100%-36px))] gap-4 rounded-[34px] border p-4 shadow-[0_24px_90px_rgba(15,23,42,0.10)]",
      html: `
        <div class="flex items-center justify-between gap-5">
          ${logoBlock()}
          <div class="flex items-center gap-2">${authButtons()}${ctaButton("קביעת תור")}${mobileButton()}</div>
        </div>
        <div class="hidden border-t border-slate-100 pt-3 lg:flex lg:justify-center">${pageLinks()}</div>
      `,
    }),

    /* 7 */
    headerShell({
      dataStyle: "icons-actions",
      className:
        "sticky top-0 z-40 w-full border-b px-6 py-4 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-2xl",
      html: `
        <div class="mx-auto flex max-w-[1280px] items-center justify-between gap-5">
          ${logoBlock({ compact: true })}
          ${pageLinks()}
          <div class="flex items-center gap-2">
            ${phonePill()}
            <a class="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-slate-600" data-header-search="true">⌕</a>
            ${authButtons()}
            ${mobileButton()}
          </div>
        </div>
      `,
    }),

    /* 8 */
    headerShell({
      dataStyle: "glass-stripe",
      className:
        "sticky top-5 z-40 mx-auto w-[min(1220px,calc(100%-40px))] rounded-[34px] border p-2 shadow-[0_26px_100px_rgba(15,23,42,0.14)] backdrop-blur-2xl",
      style: headerVars({
        bg: "rgba(255,255,255,.45)",
        text: "#0f172a",
        muted: "#64748b",
        border: "rgba(255,255,255,.65)",
      }),
      html: `
        <div class="flex items-center justify-between gap-5 rounded-[26px] bg-white/82 px-5 py-4">
          ${logoBlock({ round: "rounded-xl" })}
          ${pageLinks()}
          <div class="flex items-center gap-2">${authButtons()}${ctaButton("צור קשר")}${mobileButton()}</div>
        </div>
      `,
    }),

    /* 9 */
    headerShell({
      dataStyle: "announcement-bar",
      className:
        "sticky top-0 z-40 border-b px-8 py-3 shadow-[0_10px_40px_rgba(15,23,42,0.04)]",
      html: `
        <div class="mx-auto mb-3 flex max-w-[1280px] items-center justify-between gap-5 rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2">
          <p class="m-0 text-xs font-black text-[var(--biz-primary,#7C3AED)]" data-header-announcement="true">מבצע החודש · קביעת תור אונליין</p>
          <p class="m-0 text-xs font-black text-[color:var(--header-muted,#64748b)]">050-0000000</p>
        </div>
        <div class="mx-auto flex max-w-[1280px] items-center justify-between gap-5">
          ${logoBlock({ round: "rounded-xl" })}
          ${pageLinks()}
          <div class="flex items-center gap-2">${authButtons()}${ctaButton("צור קשר")}${mobileButton()}</div>
        </div>
      `,
    }),

    /* 10 */
    headerShell({
      dataStyle: "center-logo",
      className:
        "sticky top-0 z-40 border-b px-8 py-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)]",
      html: `
        <div class="mx-auto grid max-w-[1280px] gap-4">
          <div class="flex justify-center">${logoBlock({ center: true, brand: "שם העסק" })}</div>
          <div class="flex items-center justify-center gap-3">
            ${pageLinks(false, true)}
            <div class="flex items-center gap-2">${authButtons()}${mobileButton()}</div>
          </div>
        </div>
      `,
    }),

    /* 11 */
    headerShell({
      dataStyle: "split-three-zones",
      className:
        "sticky top-0 z-40 border-b px-8 py-4 shadow-[0_10px_40px_rgba(15,23,42,0.05)]",
      html: `
        <div class="mx-auto grid max-w-[1280px] grid-cols-[1fr_auto_1fr] items-center gap-5">
          <div class="flex justify-start">${ctaButton("צור קשר")}</div>
          <div class="flex justify-center">${logoBlock({ center: true, compact: true })}</div>
          <div class="flex justify-end">${pageLinks(false, true)}${mobileButton()}</div>
        </div>
      `,
    }),

    /* 12 */
    headerShell({
      dataStyle: "minimal-mobile-first",
      className:
        "sticky top-0 z-40 border-b px-4 py-3",
      html: `
        <div class="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
          ${logoBlock({ compact: true, round: "rounded-xl" })}
          <div class="hidden flex-1 justify-center lg:flex">${pageLinks(false, true)}</div>
          <div class="flex items-center gap-2">
            <a href="#contact" class="hidden rounded-xl bg-[var(--biz-primary,#7C3AED)] px-4 py-3 text-xs font-black text-white sm:inline-flex" data-header-cta="true">תור</a>
            ${mobileButton()}
          </div>
        </div>
      `,
    }),

    /* 13 */
    headerShell({
      dataStyle: "premium-side-cta",
      className:
        "sticky top-4 z-40 mx-auto flex w-[min(1220px,calc(100%-34px))] items-center justify-between gap-5 rounded-[26px] border px-5 py-4 shadow-[0_22px_85px_rgba(15,23,42,0.10)]",
      html: `
        <div class="flex items-center gap-8">
          ${logoBlock()}
          ${pageLinks(false, true)}
        </div>
        <div class="flex items-center gap-2">
          ${phonePill()}
          ${authButtons()}
          ${ctaButton("שיחה עכשיו")}
          ${mobileButton()}
        </div>
      `,
    }),

    /* 14 */
    headerShell({
      dataStyle: "soft-gradient",
      className:
        "sticky top-0 z-40 bg-transparent px-6 py-5",
      style: headerVars({
        bg: "transparent",
        text: "#0f172a",
        muted: "#64748b",
      }),
      html: `
        <div class="mx-auto flex max-w-[1240px] items-center justify-between gap-5 rounded-[32px] border border-white/70 bg-gradient-to-l from-white/92 to-[var(--biz-secondary,#F3E8FF)]/88 px-5 py-4 shadow-[0_24px_90px_rgba(15,23,42,0.09)] backdrop-blur-2xl">
          ${logoBlock()}
          ${pageLinks()}
          <div class="flex items-center gap-2">${authButtons()}${ctaButton("לתיאום")}${mobileButton()}</div>
        </div>
      `,
    }),

    /* 15 */
    headerShell({
      dataStyle: "ltr-dark-saas",
      dir: "ltr",
      className:
        "sticky top-0 z-40 border-b px-8 py-4 shadow-[0_20px_80px_rgba(15,23,42,0.22)]",
      style: headerVars({
        bg: "#020617",
        text: "#ffffff",
        muted: "rgba(255,255,255,.66)",
        border: "rgba(255,255,255,.10)",
        buttonBg: "#A855F7",
        buttonText: "#ffffff",
      }),
      html: `
        <div class="mx-auto flex max-w-[1280px] items-center justify-between gap-5">
          ${logoBlock({ light: true, brand: "Brand", tagline: "Client Portal" })}
          <nav class="hidden items-center gap-1.5 lg:flex" data-header-nav="true">
            <a href="#home" class="rounded-full px-4 py-2.5 text-sm font-black text-white/70 transition hover:bg-white/10 hover:text-white" data-header-link="home">Home</a>
            <a href="#features" class="rounded-full px-4 py-2.5 text-sm font-black text-white/70 transition hover:bg-white/10 hover:text-white" data-header-link="features">Features</a>
            <a href="#pricing" class="rounded-full px-4 py-2.5 text-sm font-black text-white/70 transition hover:bg-white/10 hover:text-white" data-header-link="pricing">Pricing</a>
            <a href="#contact" class="rounded-full px-4 py-2.5 text-sm font-black text-white/70 transition hover:bg-white/10 hover:text-white" data-header-link="contact">Contact</a>
          </nav>
          <div class="flex items-center gap-2">${authButtons(true)}${ctaButton("Start now", true)}${mobileButton(true)}</div>
        </div>
      `,
    }),
  ];

  return layouts[index] || layouts[0];
}

const headerTitles = [
  "מעוגל צף RTL",
  "מלבני עליון",
  "כהה מודרני",
  "LTR נקי",
  "שקוף מעל תמונה",
  "שתי שורות",
  "עם אייקונים",
  "זכוכית / Glass",
  "פס הודעה",
  "לוגו במרכז",
  "שלושה אזורים",
  "מובייל ראשון",
  "CTA צד פרימיום",
  "Gradient רך",
  "LTR כהה SaaS",
];

const headerDescriptions = [
  "הידר צף, מעוגל, עם לוגו, עמודים, התחברות וכפתור פעולה.",
  "הידר עליון מלבני, נקי וברור לכל סוג עסק.",
  "הידר כהה עם ניגוד גבוה וכפתורי התחברות.",
  "מבנה משמאל לימין לעסקים באנגלית או SaaS.",
  "הידר שקוף מעל Hero או תמונת רקע.",
  "לוגו וכפתורים בשורה ראשונה, ניווט בשורה שנייה.",
  "הידר עם טלפון, חיפוש ואזור פעולות.",
  "הידר זכוכית שקוף עם רקע מטושטש.",
  "פס הודעה עליון + הידר מלא.",
  "לוגו במרכז ושורת ניווט מתחת.",
  "כפתור בצד, לוגו במרכז וניווט בצד.",
  "הידר נקי שמתאים קודם כל למובייל.",
  "הידר עסקי עם CTA חזק וטלפון.",
  "הידר עם גרדיאנט רך לפי צבעי המותג.",
  "הידר LTR כהה שמתאים למיני SaaS.",
];

const headerBadges = [
  "RTL",
  "נקי",
  "כהה",
  "LTR",
  "שקוף",
  "שורות",
  "אייקונים",
  "Glass",
  "הודעה",
  "מרכז",
  "Split",
  "מובייל",
  "CTA",
  "Gradient",
  "SaaS",
];

export const headerLayoutVariants: SectionLayoutVariant[] = Array.from(
  { length: 15 },
  (_, index) =>
    variant(
      `header-layout-${index + 1}`,
      headerTitles[index],
      headerDescriptions[index],
      headerTitles[index],
      headerBadges[index],
      headerLayout(index)
    )
);
