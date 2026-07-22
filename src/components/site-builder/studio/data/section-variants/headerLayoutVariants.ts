import type { SectionLayoutVariant } from "../../types";

/*
  Bizuply Website Studio — Professional Header Layout Variants
  Path: src/components/site-builder/studio/data/section-variants/headerLayoutVariants.ts

  מה הקובץ הזה נותן:
  - 15 תבניות Header מקצועיות עם HTML אמיתי לתצוגה בקנבס.
  - כל אזור חשוב מסומן לעריכה: Header, Logo, שם עסק, סלוגן, תפריט, לינקים, CTA, התחברות/התנתקות, טלפון, חיפוש.
  - תמיכה RTL/LTR.
  - צבעים נשלטים דרך CSS variables כדי שה־Inspector יוכל לערוך רקע, טקסט, כפתורים וכו׳.
  - הכפתורים לא עולים אחד על השני: שימוש ב־flex-wrap, gap, hidden לפי breakpoint ו־min-width נכון.
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

function headerVars({
  bg = "rgba(255,255,255,0.94)",
  text = "#0f172a",
  muted = "#64748b",
  border = "rgba(226,232,240,0.9)",
  buttonBg = "var(--biz-primary,#7C3AED)",
  buttonText = "#ffffff",
  accent = "var(--biz-accent,#EC4899)",
}: {
  bg?: string;
  text?: string;
  muted?: string;
  border?: string;
  buttonBg?: string;
  buttonText?: string;
  accent?: string;
} = {}) {
  return `--header-bg:${bg};--header-text:${text};--header-muted:${muted};--header-border:${border};--header-button-bg:${buttonBg};--header-button-text:${buttonText};--header-accent:${accent};`;
}

function editableAttrs(name: string) {
  return `data-editable="true" data-editable-type="${name}" data-studio-select="${name}"`;
}

function pageLinks({
  light = false,
  compact = false,
  english = false,
  align = "center",
}: {
  light?: boolean;
  compact?: boolean;
  english?: boolean;
  align?: "start" | "center" | "end";
} = {}) {
  const spacing = compact ? "px-3 py-2" : "px-4 py-2.5";
  const justify = align === "start" ? "justify-start" : align === "end" ? "justify-end" : "justify-center";
  const color = light
    ? "text-white/75 hover:bg-white/12 hover:text-white"
    : "text-[color:var(--header-muted,#64748b)] hover:bg-[var(--biz-secondary,#F3E8FF)] hover:text-[var(--biz-primary,#7C3AED)]";

  const links = english
    ? [
        ["home", "Home"],
        ["about", "About"],
        ["services", "Services"],
        ["gallery", "Gallery"],
        ["contact", "Contact"],
      ]
    : [
        ["home", "דף הבית"],
        ["about", "אודות"],
        ["services", "שירותים"],
        ["gallery", "גלריה"],
        ["contact", "צור קשר"],
      ];

  return `
    <nav class="hidden min-w-0 flex-1 flex-wrap items-center ${justify} gap-1.5 lg:flex" data-header-nav="true" ${editableAttrs("header-navigation")}>
      ${links
        .map(
          ([key, label]) => `
            <a href="#${key}" class="rounded-full ${spacing} text-sm font-black transition ${color}" data-header-link="${key}" ${editableAttrs("header-link")}>${label}</a>
          `
        )
        .join("")}
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
    <a href="#home" class="flex min-w-0 shrink-0 items-center gap-3 ${center ? "justify-center text-center" : ""}" data-header-brand="true" ${editableAttrs("header-brand")}>
      <div
        class="grid ${logoSize} shrink-0 place-items-center ${round} bg-gradient-to-br from-[var(--biz-primary,#7C3AED)] to-[var(--header-accent,#EC4899)] text-lg font-black text-black shadow-xl"
        data-header-logo-slot="true"
        ${editableAttrs("header-logo")}
      >
        <span data-header-logo-placeholder="true">B</span>
      </div>
      <div class="min-w-0">
        <p class="m-0 truncate ${brandSize} font-black leading-5 ${textColor}" data-header-business-name="true" ${editableAttrs("header-business-name")}>${brand}</p>
        <p class="m-0 mt-1 truncate text-xs font-bold leading-4 ${mutedColor}" data-header-business-tagline="true" ${editableAttrs("header-business-tagline")}>${tagline}</p>
      </div>
    </a>
  `;
}

function ctaButton(text = "קביעת תור") {
  return `
    <a
      href="#contact"
      class="inline-flex min-h-11 shrink-0 items-center justify-center whitespace-nowrap rounded-2xl px-5 text-sm font-black shadow-xl transition hover:-translate-y-0.5"
      style="background:var(--header-button-bg,var(--biz-primary,#7C3AED));color:var(--header-button-text,#ffffff);"
      data-header-cta="true"
      ${editableAttrs("header-cta")}
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
    <div class="hidden shrink-0 flex-wrap items-center gap-2 md:flex" data-header-auth="true" ${editableAttrs("header-auth-buttons")}>
      <a href="/login" class="whitespace-nowrap rounded-2xl border px-4 py-3 text-xs font-black transition ${base}" data-header-login="true" ${editableAttrs("header-login-button")}>התחברות</a>
      <a href="/logout" class="whitespace-nowrap rounded-2xl border px-4 py-3 text-xs font-black transition ${base}" data-header-logout="true" ${editableAttrs("header-logout-button")}>התנתקות</a>
    </div>
  `;
}

function mobileButton(light = false) {
  return `
    <button
      type="button"
      class="grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
        light
          ? "border border-white/20 bg-white/10 text-xl font-black text-black"
          : "border border-slate-200 bg-white text-xl font-black text-slate-700"
      } lg:hidden"
      data-header-mobile-menu="true"
      ${editableAttrs("header-mobile-button")}
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
      class="hidden shrink-0 whitespace-nowrap rounded-2xl ${light ? "bg-white/10 text-white" : "bg-slate-100 text-slate-600"} px-4 py-3 text-xs font-black xl:inline-flex"
      data-header-phone="true"
      ${editableAttrs("header-phone")}
    >
      050-0000000
    </a>
  `;
}

function iconButton(label: string, light = false, attr = "header-icon-button") {
  return `
    <button
      type="button"
      class="hidden h-11 w-11 shrink-0 place-items-center rounded-2xl border text-sm font-black transition md:grid ${
        light ? "border-white/20 bg-white/10 text-white hover:bg-white/18" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
      }"
      data-header-icon-button="true"
      ${editableAttrs(attr)}
    >${label}</button>
  `;
}

function actions(html: string) {
  return `<div class="flex shrink-0 flex-wrap items-center justify-end gap-2" data-header-actions="true" ${editableAttrs("header-actions")}>${html}</div>`;
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
  style="${style}background:var(--header-bg,rgba(255,255,255,0.94));border-color:var(--header-border,rgba(226,232,240,0.9));"
  data-section-kind="header"
  data-header-style="${dataStyle}"
  data-header-editable="true"
  ${editableAttrs("header-section")}
>
  ${html}
</header>
  `;
}

function headerLayout(index: number) {
  const layouts = [
    headerShell({
      dataStyle: "floating-rounded-rtl",
      className:
        "sticky top-0 z-40 mx-auto mt-4 flex w-[min(1240px,calc(100%-32px))] flex-wrap items-center justify-between gap-4 rounded-[28px] border px-5 py-4 shadow-[0_18px_70px_rgba(15,23,42,0.08)] backdrop-blur-2xl",
      html: `
        ${logoBlock()}
        ${pageLinks()}
        ${actions(`${authButtons()}${ctaButton("קביעת תור")}${mobileButton()}`)}
      `,
    }),

    headerShell({
      dataStyle: "top-rectangle-rtl",
      className:
        "sticky top-0 z-40 w-full border-b px-4 py-4 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-2xl sm:px-8",
      html: `
        <div class="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
          ${logoBlock({ round: "rounded-xl", brand: "שם העסק" })}
          ${pageLinks()}
          ${actions(`${authButtons()}${ctaButton("דברו איתנו")}${mobileButton()}`)}
        </div>
      `,
    }),

    headerShell({
      dataStyle: "dark-modern-rtl",
      className:
        "sticky top-0 z-40 mx-auto mt-4 flex w-[min(1240px,calc(100%-32px))] flex-wrap items-center justify-between gap-4 rounded-[24px] border px-5 py-4 shadow-[0_22px_85px_rgba(15,23,42,0.16)]",
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
        ${pageLinks({ light: true })}
        ${actions(`${authButtons(true)}${ctaButton("התחברות")}${mobileButton(true)}`)}
      `,
    }),

    headerShell({
      dataStyle: "ltr-clean",
      dir: "ltr",
      className:
        "sticky top-0 z-40 w-full border-b px-4 py-4 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-2xl sm:px-8",
      html: `
        <div class="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
          ${logoBlock({ round: "rounded-xl", brand: "BrandCo", tagline: "Business Studio" })}
          ${pageLinks({ english: true })}
          ${actions(`${authButtons()}${ctaButton("Book now")}${mobileButton()}`)}
        </div>
      `,
    }),

    headerShell({
      dataStyle: "transparent-over-hero",
      className:
        "absolute left-1/2 top-6 z-40 flex w-[min(1240px,calc(100%-40px))] -translate-x-1/2 flex-wrap items-center justify-between gap-4 rounded-[30px] border px-5 py-4 text-white shadow-[0_24px_90px_rgba(15,23,42,0.20)] backdrop-blur-2xl",
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
        ${pageLinks({ light: true })}
        ${actions(`${authButtons(true)}${ctaButton("קביעת תור")}${mobileButton(true)}`)}
      `,
    }),

    headerShell({
      dataStyle: "two-rows-rtl",
      className:
        "sticky top-4 z-40 mx-auto grid w-[min(1180px,calc(100%-36px))] gap-4 rounded-[34px] border p-4 shadow-[0_24px_90px_rgba(15,23,42,0.10)]",
      html: `
        <div class="flex flex-wrap items-center justify-between gap-4">
          ${logoBlock()}
          ${actions(`${authButtons()}${ctaButton("קביעת תור")}${mobileButton()}`)}
        </div>
        <div class="hidden border-t border-slate-100 pt-3 lg:flex">${pageLinks({ compact: true })}</div>
      `,
    }),

    headerShell({
      dataStyle: "icons-actions",
      className:
        "sticky top-0 z-40 w-full border-b px-4 py-4 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-2xl sm:px-6",
      html: `
        <div class="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
          ${logoBlock({ compact: true })}
          ${pageLinks()}
          ${actions(`${phonePill()}${iconButton("⌕", false, "header-search")}${authButtons()}${mobileButton()}`)}
        </div>
      `,
    }),

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
        <div class="flex flex-wrap items-center justify-between gap-4 rounded-[26px] bg-white/82 px-5 py-4">
          ${logoBlock({ round: "rounded-xl" })}
          ${pageLinks()}
          ${actions(`${authButtons()}${ctaButton("צור קשר")}${mobileButton()}`)}
        </div>
      `,
    }),

    headerShell({
      dataStyle: "announcement-bar",
      className:
        "sticky top-0 z-40 border-b px-4 py-3 shadow-[0_10px_40px_rgba(15,23,42,0.04)] sm:px-8",
      html: `
        <div class="mx-auto mb-3 flex max-w-[1280px] flex-wrap items-center justify-between gap-2 rounded-2xl bg-[var(--biz-secondary,#F3E8FF)] px-4 py-2">
          <p class="m-0 text-xs font-black text-[var(--biz-primary,#7C3AED)]" data-header-announcement="true" ${editableAttrs("header-announcement")}>מבצע החודש · קביעת תור אונליין</p>
          <p class="m-0 text-xs font-black text-[color:var(--header-muted,#64748b)]" data-header-announcement-phone="true" ${editableAttrs("header-phone")}>050-0000000</p>
        </div>
        <div class="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
          ${logoBlock({ round: "rounded-xl" })}
          ${pageLinks()}
          ${actions(`${authButtons()}${ctaButton("צור קשר")}${mobileButton()}`)}
        </div>
      `,
    }),

    headerShell({
      dataStyle: "center-logo",
      className:
        "sticky top-0 z-40 border-b px-4 py-5 shadow-[0_10px_40px_rgba(15,23,42,0.04)] sm:px-8",
      html: `
        <div class="mx-auto grid max-w-[1280px] gap-4">
          <div class="flex justify-center">${logoBlock({ center: true, brand: "שם העסק" })}</div>
          <div class="flex flex-wrap items-center justify-center gap-3">
            ${pageLinks({ compact: true })}
            ${actions(`${authButtons()}${mobileButton()}`)}
          </div>
        </div>
      `,
    }),

    headerShell({
      dataStyle: "split-three-zones",
      className:
        "sticky top-0 z-40 border-b px-4 py-4 shadow-[0_10px_40px_rgba(15,23,42,0.05)] sm:px-8",
      html: `
        <div class="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <div class="flex justify-center lg:justify-start">${ctaButton("צור קשר")}</div>
          <div class="flex justify-center">${logoBlock({ center: true, compact: true })}</div>
          <div class="flex justify-center lg:justify-end">${pageLinks({ compact: true, align: "end" })}${mobileButton()}</div>
        </div>
      `,
    }),

    headerShell({
      dataStyle: "minimal-mobile-first",
      className: "sticky top-0 z-40 border-b px-4 py-3",
      html: `
        <div class="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
          ${logoBlock({ compact: true, round: "rounded-xl" })}
          <div class="hidden min-w-0 flex-1 justify-center lg:flex">${pageLinks({ compact: true })}</div>
          ${actions(`<a href="#contact" class="hidden whitespace-nowrap rounded-xl bg-[var(--biz-primary,#7C3AED)] px-4 py-3 text-xs font-black text-black sm:inline-flex" data-header-cta="true" ${editableAttrs("header-cta")}>תור</a>${mobileButton()}`)}
        </div>
      `,
    }),

    headerShell({
      dataStyle: "premium-side-cta",
      className:
        "sticky top-4 z-40 mx-auto flex w-[min(1220px,calc(100%-34px))] flex-wrap items-center justify-between gap-4 rounded-[26px] border px-5 py-4 shadow-[0_22px_85px_rgba(15,23,42,0.10)]",
      html: `
        <div class="flex min-w-0 flex-wrap items-center gap-8">
          ${logoBlock()}
          ${pageLinks({ compact: true, align: "start" })}
        </div>
        ${actions(`${phonePill()}${authButtons()}${ctaButton("שיחה עכשיו")}${mobileButton()}`)}
      `,
    }),

    headerShell({
      dataStyle: "soft-gradient",
      className: "sticky top-0 z-40 bg-transparent px-4 py-5 sm:px-6",
      style: headerVars({
        bg: "transparent",
        text: "#0f172a",
        muted: "#64748b",
      }),
      html: `
        <div class="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-4 rounded-[32px] border border-white/70 bg-gradient-to-l from-white/92 to-[var(--biz-secondary,#F3E8FF)]/88 px-5 py-4 shadow-[0_24px_90px_rgba(15,23,42,0.09)] backdrop-blur-2xl">
          ${logoBlock()}
          ${pageLinks()}
          ${actions(`${authButtons()}${ctaButton("לתיאום")}${mobileButton()}`)}
        </div>
      `,
    }),

    headerShell({
      dataStyle: "ltr-dark-saas",
      dir: "ltr",
      className:
        "sticky top-0 z-40 border-b px-4 py-4 shadow-[0_20px_80px_rgba(15,23,42,0.22)] sm:px-8",
      style: headerVars({
        bg: "#020617",
        text: "#ffffff",
        muted: "rgba(255,255,255,.66)",
        border: "rgba(255,255,255,.10)",
        buttonBg: "#A855F7",
        buttonText: "#ffffff",
      }),
      html: `
        <div class="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
          ${logoBlock({ light: true, brand: "Brand", tagline: "Client Portal" })}
          ${pageLinks({ light: true, english: true })}
          ${actions(`${authButtons(true)}${ctaButton("Start now")}${mobileButton(true)}`)}
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
  "שקוף מעל Hero",
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
