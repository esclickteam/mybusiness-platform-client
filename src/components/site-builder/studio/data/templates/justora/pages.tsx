import React, { useEffect, useMemo, useState } from "react";
import { justoraDefaultData } from "./defaultData";
import {
  resolveTemplatePageId,
  useTemplatePageNavigation,
} from "../shared/useTemplatePageNavigation";
import { useVisualLibraryPage } from "../../../../runtime/visualLibraryPage";
import {
  buildNavTreeFromSitePages,
  type SiteNavTreeItem,
} from "../../../visual-editor/utils/syncNavWithSitePages";
import { NavSubmenuChevron } from "../../../visual-editor/utils/NavSubmenuChevron";

export const justoraPages = [
  { id: "home", label: "בית", slug: "/" },
  { id: "about", label: "אודות", slug: "/about" },
  { id: "practice", label: "תחומי התמחות", slug: "/practice" },
  { id: "lawyers", label: "עורכי דין", slug: "/lawyers" },
  { id: "cases", label: "תיקים", slug: "/cases" },
  { id: "blog", label: "מאמרים", slug: "/blog" },
  { id: "contact", label: "יצירת קשר", slug: "/contact" },
];

type JustoraPagesProps = {
  initialPage?: string;
  initialPageId?: string;
  page?: string;
  pageId?: string;
  activePageId?: string;
  currentPageId?: string;
  mode?: "preview" | "edit" | "published";
  data?: Record<string, any>;
  onPageChange?: (pageId: string) => void;
  isPublic?: boolean;
  viewMode?: string;
  runtimeMode?: string;
};

type JustoraCaseItem = {
  title: string;
  text: string;
  amount: string;
  tag: string;
  number: string;
  challenge: string;
  solution: string;
  result: string;
};

const justoraAllowedPages = [
  "home",
  "about",
  "practice",
  "lawyers",
  "cases",
  "blog",
  "contact",
];

const justoraPageSlugs: Record<string, string> = {
  home: "/",
  about: "/about",
  practice: "/practice",
  lawyers: "/lawyers",
  cases: "/cases",
  blog: "/blog",
  contact: "/contact",
};

function getJustoraHref(pageId: string) {
  return justoraPageSlugs[pageId] || "/";
}

function getCaseItems(data: Record<string, any>): JustoraCaseItem[] {
  return [
    {
      title: getValue(data, "caseOneTitle"),
      text: getValue(data, "caseOneText"),
      amount: "₪275K",
      tag: "דיני משפחה",
      number: "01",
      challenge:
        "ניהול מחלוקת משפחתית רגישה שכללה אינטרסים אישיים, כלכליים ומשפטיים.",
      solution:
        "בניית אסטרטגיית משא ומתן, ניסוח הסכם יציב והובלת הצדדים לפתרון שמגן על שני הצדדים.",
      result:
        "הושג הסכם ברור, יציב ומכבד, תוך צמצום משמעותי של זמן ההליך והפחתת מתחים.",
    },
    {
      title: getValue(data, "caseTwoTitle"),
      text: getValue(data, "caseTwoText"),
      amount: "₪380K",
      tag: "מסחרי",
      number: "02",
      challenge:
        "סכסוך עסקי שכלל חשיפה כספית גבוהה, חוזים מורכבים ולחץ לסגירת ההליך במהירות.",
      solution:
        "ניתוח מסמכים, זיהוי נקודות סיכון, בניית קו משפטי וניהול משא ומתן ממוקד.",
      result:
        "החשיפה הכספית צומצמה, ההליך נסגר בצורה מבוקרת והלקוח קיבל ודאות עסקית.",
    },
  ];
}

function getCaseFromUrl(data: Record<string, any>) {
  if (typeof window === "undefined") return null;

  const caseNumber = new URLSearchParams(window.location.search).get("case");
  if (!caseNumber) return null;

  return getCaseItems(data).find((item) => item.number === caseNumber) || null;
}

function shouldUseNativeJustoraNavigation() {
  /*
    תמיד ניווט SPA פנימי של התבנית (preventDefault + goTo).
    ניווט native באתר הציבורי גרם ל-App לטעון מחדש את האתר, React מחק
    סקשנים שהוכנסו מהעורך, והדף "קפץ" לתוכן אחר (למשל אודות/קביעת פגישה).
  */
  return false;
}



const FALLBACK_LAWYER_HERO_IMAGE =
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=90";

function getValue(data: Record<string, any>, key: string) {
  return data?.[key] ?? (justoraDefaultData as Record<string, any>)[key] ?? "";
}

function hasEnglish(value: string) {
  return /[A-Za-z]/.test(value);
}

function getHebrewValue(data: Record<string, any>, key: string, fallback: string) {
  const value = String(getValue(data, key) || "").trim();

  if (!value || hasEnglish(value)) {
    return fallback;
  }

  return value;
}

function getHeroImage(data: Record<string, any>) {
  const image = String(getValue(data, "heroImage") || "").trim();

  const isStatueImage =
    image.includes("1589829545856") ||
    image.toLowerCase().includes("statue") ||
    image.toLowerCase().includes("justice");

  if (!image || isStatueImage) {
    return FALLBACK_LAWYER_HERO_IMAGE;
  }

  return image;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function normalizeJustoraNavKey(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

function findJustoraNavTreeItem(
  tree: SiteNavTreeItem[],
  pageId: string,
  label: string,
): SiteNavTreeItem | null {
  const idKey = normalizeJustoraNavKey(pageId);
  const labelKey = String(label || "")
    .trim()
    .toLowerCase();

  return (
    tree.find((item) => {
      const itemId = normalizeJustoraNavKey(item.id);
      const itemSlug = normalizeJustoraNavKey(item.slug);
      const itemTitle = String(item.title || "")
        .trim()
        .toLowerCase();
      return (
        itemId === idKey ||
        itemSlug === idKey ||
        (labelKey && itemTitle === labelKey)
      );
    }) || null
  );
}

function buildJustoraHeaderNav(data: Record<string, any>) {
  const builtins: Array<[string, string]> = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["practice", getValue(data, "navPractice")],
    ["lawyers", getValue(data, "navLawyers")],
    ["cases", getValue(data, "navCases")],
    ["blog", getValue(data, "navBlog")],
    ["contact", getValue(data, "navContact")],
  ];

  const tree = Array.isArray(data.__navTree)
    ? (data.__navTree as SiteNavTreeItem[])
    : buildNavTreeFromSitePages(data.__sitePages);

  const matchedIds = new Set<string>();
  const items = builtins.map(([id, label]) => {
    const treeItem = findJustoraNavTreeItem(tree, id, label);
    if (treeItem?.id) matchedIds.add(String(treeItem.id));
    return {
      id,
      label: String(treeItem?.title || label || id),
      href: getJustoraHref(id),
      isBuiltin: true,
      subpages: Array.isArray(treeItem?.subpages) ? treeItem.subpages : [],
    };
  });

  tree.forEach((item) => {
    if (matchedIds.has(String(item.id))) return;
    const slug = normalizeJustoraNavKey(item.slug || item.id);
    if (justoraAllowedPages.includes(slug)) return;
    items.push({
      id: String(item.id),
      label: String(item.title || item.slug || item.id),
      href: String(item.href || `/${item.slug || item.id}`),
      isBuiltin: false,
      subpages: Array.isArray(item.subpages) ? item.subpages : [],
    });
  });

  return items;
}

function getPageTitle(data: Record<string, any>, type: string) {
  if (type === "about") return getValue(data, "navAbout");
  if (type === "practice") return getValue(data, "navPractice");
  if (type === "lawyers") return getValue(data, "navLawyers");
  if (type === "cases") return getValue(data, "navCases");
  if (type === "blog") return getValue(data, "navBlog");
  if (type === "contact") return getValue(data, "navContact");
  return getValue(data, "brandName");
}

function SectionTitle({
  eyebrow,
  title,
  text,
  center = false,
  light = false,
}: {
  eyebrow: string;
  title: string;
  text?: string;
  center?: boolean;
  light?: boolean;
}) {
  return (
    <div className={cx("max-w-3xl", center ? "mx-auto text-center" : "text-right")}>
      <p
        className={cx(
          "mb-4 inline-flex rounded-full px-4 py-2 text-sm font-semibold",
          light
            ? "border border-white/15 bg-white/10 text-[#f8efe0]/80"
            : "border border-[#2b1b1d]/12 bg-white/70 text-[#b45c3a]",
        )}
      >
        {eyebrow}
      </p>

      <h2
        className={cx(
          "text-4xl font-semibold leading-[1.03] tracking-[-0.055em] md:text-6xl",
          light ? "!text-[#fff6e9]" : "!text-[#2b1b1d]",
        )}
      >
        {title}
      </h2>

      {text ? (
        <p
          className={cx(
            "mt-5 text-lg leading-8",
            light ? "!text-[#fff6e9]/70" : "text-[#6d5f55]",
          )}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}

function JustoraButtonTextFix() {
  return (
    <style>{`
      [data-template-id^="justora"] a,
      [data-template-id^="justora"] button {
        opacity: 1 !important;
        text-decoration: none !important;
      }

      [data-template-id^="justora"] header a {
        color: rgba(255, 246, 233, 0.78) !important;
      }

      [data-template-id^="justora"] header a:hover {
        color: #fff6e9 !important;
      }

      /* Nested Site Menu: cream panel under the header link, dark readable text */
      [data-template-id^="justora"] header,
      [data-template-id^="justora"] header nav {
        overflow: visible !important;
      }

      [data-template-id^="justora"] header [data-bizuply-nav-item] {
        position: relative;
        display: inline-flex;
        align-items: center;
      }

      [data-template-id^="justora"] header [data-bizuply-nav-item] > a {
        display: inline-flex !important;
        align-items: center;
        gap: 0.4em;
      }

      [data-template-id^="justora"] header [data-bizuply-nav-chevron="true"] {
        color: inherit;
        opacity: 0.95;
      }

      [data-template-id^="justora"] header [data-bizuply-nav-chevron="true"] svg {
        stroke: currentColor;
      }

      [data-template-id^="justora"] header [data-bizuply-nav-submenu="true"] {
        position: absolute !important;
        inset-inline-start: 0;
        top: 100% !important;
        z-index: 220 !important;
        min-width: 12rem;
        padding: 0.45rem 0 0 !important;
        background: transparent !important;
        border: 0 !important;
        box-shadow: none !important;
        pointer-events: auto !important;
      }

      [data-template-id^="justora"] header [data-bizuply-nav-submenu-panel="true"] {
        padding: 0.4rem !important;
        background: #fff6e9 !important;
        border: 1px solid rgba(43, 27, 29, 0.12) !important;
        border-radius: 1rem !important;
        box-shadow: 0 16px 36px rgba(23, 16, 15, 0.22) !important;
        pointer-events: auto !important;
      }

      [data-template-id^="justora"] header [data-bizuply-nav-submenu="true"] a,
      [data-template-id^="justora"] header [data-bizuply-nav-submenu="true"] button,
      [data-template-id^="justora"] header [data-bizuply-nav-submenu="true"] a:hover,
      [data-template-id^="justora"] header [data-bizuply-nav-submenu="true"] button:hover,
      [data-template-id^="justora"] header [data-bizuply-nav-submenu="true"] a *,
      [data-template-id^="justora"] header [data-bizuply-nav-submenu="true"] button * {
        color: #2b1b1d !important;
        -webkit-text-fill-color: #2b1b1d !important;
        opacity: 1 !important;
        pointer-events: auto !important;
      }

      [data-template-id^="justora"] header [data-bizuply-nav-submenu="true"] a:hover,
      [data-template-id^="justora"] header [data-bizuply-nav-submenu="true"] button:hover {
        background: rgba(43, 27, 29, 0.08) !important;
      }

      [data-template-id^="justora"] header a[class*="bg-[#fff6e9]"],
      [data-template-id^="justora"] header a[class*="bg-white"] {
        color: #2b1b1d !important;
      }

      [data-template-id^="justora"] button[class*="bg-[#2b1b1d]"],
      [data-template-id^="justora"] a[class*="bg-[#2b1b1d]"],
      [data-template-id^="justora"] button[class*="bg-[#17100f]"],
      [data-template-id^="justora"] a[class*="bg-[#17100f]"] {
        color: #fff6e9 !important;
      }

      [data-template-id^="justora"] button[class*="bg-[#b45c3a]"],
      [data-template-id^="justora"] a[class*="bg-[#b45c3a]"] {
        color: #ffffff !important;
      }

      [data-template-id^="justora"] button[class*="bg-white"],
      [data-template-id^="justora"] a[class*="bg-white"],
      [data-template-id^="justora"] button[class*="bg-[#fff6e9]"],
      [data-template-id^="justora"] a[class*="bg-[#fff6e9]"] {
        color: #2b1b1d !important;
      }

      [data-template-id^="justora"] button[class*="bg-transparent"],
      [data-template-id^="justora"] a[class*="bg-transparent"] {
        color: #2b1b1d !important;
      }

      [data-template-id^="justora"] button[class*="hover:bg-[#2b1b1d]"]:hover,
      [data-template-id^="justora"] a[class*="hover:bg-[#2b1b1d]"]:hover {
        color: #fff6e9 !important;
      }

      [data-template-id^="justora"] button > *,
      [data-template-id^="justora"] a > * {
        opacity: 1 !important;
      }
    `}</style>
  );
}

function Header({
  data,
  currentPage,
  setCurrentPage,
  openConsultation,
}: {
  data: Record<string, any>;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openConsultation: () => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = useMemo(() => buildJustoraHeaderNav(data), [data]);

  function handleNavigate(id: string) {
    setCurrentPage(id);
    setMobileOpen(false);
  }

  function renderNavLink(
    item: {
      id: string;
      label: string;
      href: string;
      isBuiltin: boolean;
      subpages: SiteNavTreeItem[];
    },
    opts?: { mobile?: boolean },
  ) {
    const mobile = Boolean(opts?.mobile);
    const isActive = currentPage === item.id;
    const hasSubpages = item.subpages.length > 0;
    const trigger = (
      <a
        href={item.href}
        onClick={(event) => {
          if (shouldUseNativeJustoraNavigation()) return;
          if (!item.isBuiltin && item.href && item.href !== "#") {
            setMobileOpen(false);
            return;
          }
          event.preventDefault();
          handleNavigate(item.id);
        }}
        className={cx(
          "inline-flex items-center gap-1.5",
          mobile
            ? "rounded-2xl px-4 py-3 text-right text-sm font-semibold transition"
            : "rounded-full px-4 py-2 text-sm font-semibold transition duration-300",
          isActive
            ? mobile
              ? "bg-[#fff6e9] !text-[#2b1b1d]"
              : "bg-[#fff6e9] !text-[#2b1b1d] shadow-md"
            : mobile
              ? "!text-[#fff6e9] hover:bg-white/10"
              : "!text-[#fff6e9] hover:bg-white/10 hover:!text-white",
        )}
        aria-haspopup={hasSubpages ? "true" : undefined}
        aria-expanded={hasSubpages ? "false" : undefined}
        data-site-page-id={item.id}
      >
        <span>{item.label}</span>
        {hasSubpages ? <NavSubmenuChevron /> : null}
      </a>
    );

    if (!hasSubpages) {
      return <React.Fragment key={item.id}>{trigger}</React.Fragment>;
    }

    return (
      <div
        key={item.id}
        data-bizuply-nav-item="react"
        className={mobile ? "relative" : undefined}
      >
        {trigger}
        <div data-bizuply-nav-submenu="true" role="menu">
          <div data-bizuply-nav-submenu-panel="true">
            {item.subpages.map((child) => {
              const childHref =
                String(child.href || "").trim() ||
                `/${child.slug || child.id}`;
              const childId = String(child.id || child.slug || "");
              const childSlug = normalizeJustoraNavKey(child.slug || child.id);
              const isBuiltinChild = justoraAllowedPages.includes(childSlug);
              return (
                <a
                  key={childId}
                  href={childHref}
                  role="menuitem"
                  data-site-page-id={childId}
                  data-visual-link-href={childHref}
                  data-bizuply-public-href={childHref}
                  data-link-url={childHref}
                  data-bizuply-public-link="true"
                  onMouseDown={(event) => {
                    // Keep click for navigation; don't let editor drag/select steal it
                    event.stopPropagation();
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    setMobileOpen(false);
                    if (isBuiltinChild) {
                      event.preventDefault();
                      handleNavigate(childSlug);
                      return;
                    }
                    // Custom / library Site Pages — navigate by page id in editor/SPA
                    event.preventDefault();
                    handleNavigate(childId || childSlug);
                  }}
                  style={{
                    color: "#2b1b1d",
                    WebkitTextFillColor: "#2b1b1d",
                    opacity: 1,
                    pointerEvents: "auto",
                    cursor: "pointer",
                  }}
                >
                  {child.title || child.slug || child.id}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="sticky top-0 z-50 overflow-visible border-b border-white/10 bg-[#2b1b1d]/96 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-[1380px] items-center justify-between gap-4 overflow-visible px-5 py-4 lg:px-8">
        <a
          href={getJustoraHref("home")}
          onClick={(event) => {
            if (shouldUseNativeJustoraNavigation()) return;
            event.preventDefault();
            handleNavigate("home");
          }}
          className="group flex items-center gap-3 text-right"
        >
          <span className="grid h-11 w-11 place-items-center rounded-full bg-[#b45c3a] text-lg font-semibold !text-white shadow-lg shadow-[#b45c3a]/25 transition duration-300 group-hover:scale-105">
            {getValue(data, "logoText")}
          </span>

          <span className="text-xl font-semibold tracking-[-0.04em] !text-white">
            {getValue(data, "brandName")}
          </span>
        </a>

        <nav className="hidden items-center gap-1 overflow-visible rounded-full border border-white/12 bg-white/10 p-1 shadow-sm backdrop-blur-xl lg:flex">
          {nav.map((item) => renderNavLink(item))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openConsultation}
            className="hidden bg-[#b45c3a] px-5 py-3 text-sm font-semibold !text-white shadow-lg shadow-[#b45c3a]/20 transition duration-300 hover:-translate-y-0.5 hover:bg-[#c66a45] sm:inline-flex"
          >
            לקביעת ייעוץ
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 !text-white shadow-sm lg:hidden"
          >
            {mobileOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-white/10 bg-[#2b1b1d]/98 px-5 pb-5 backdrop-blur-2xl lg:hidden">
          <div className="grid gap-2 rounded-[28px] border border-white/10 bg-white/8 p-2 shadow-xl">
            {nav.map((item) => renderNavLink(item, { mobile: true }))}

            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                openConsultation();
              }}
              className="rounded-2xl bg-[#b45c3a] px-4 py-3 text-sm font-semibold !text-white"
            >
              לקביעת ייעוץ
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

function ConsultationModal({
  data,
  open,
  onClose,
}: {
  data: Record<string, any>;
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-[#17100f]/72 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/15 bg-[#fbf3e8] shadow-2xl shadow-black/30">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-xl font-semibold !text-[#2b1b1d] shadow-sm transition hover:scale-105"
        >
          ×
        </button>

        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative overflow-hidden bg-[#2b1b1d] p-8 !text-white lg:p-11">
            <div className="absolute left-8 top-8 h-40 w-40 rounded-full bg-[#b45c3a]/25 blur-3xl" />
            <div className="absolute bottom-8 right-8 h-52 w-52 rounded-full bg-[#8b744f]/18 blur-3xl" />

            <div className="relative z-10">
              <p className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                בדיקת תיק ראשונית
              </p>

              <h3 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-[-0.055em] md:text-5xl">
                השאירו פרטים ונחזור עם כיוון פעולה ברור.
              </h3>

              <p className="mt-5 text-base leading-7 !text-[#fff6e9]">
                טופס ייעוץ קצר, דיסקרטי וברור שמוריד חיכוך ומוביל לפנייה איכותית.
              </p>

              <div className="mt-9 grid gap-3">
                {["בדיקת התאמה", "שיחת ייעוץ ראשונית", "בניית כיוון משפטי"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold backdrop-blur"
                    >
                      ✓ {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>

          <form
            className="p-6 lg:p-10"
            onSubmit={(event) => {
              event.preventDefault();
              onClose();
            }}
          >
            <div className="grid gap-4">
              <input
                className="rounded-2xl border border-[#2b1b1d]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b45c3a]"
                placeholder="שם מלא"
              />
              <input
                className="rounded-2xl border border-[#2b1b1d]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b45c3a]"
                placeholder="טלפון"
              />
              <input
                className="rounded-2xl border border-[#2b1b1d]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b45c3a]"
                placeholder="אימייל"
              />
              <select className="rounded-2xl border border-[#2b1b1d]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b45c3a]">
                <option>תחום משפטי</option>
                <option>דיני משפחה</option>
                <option>משפט מסחרי</option>
                <option>נדל״ן ומקרקעין</option>
                <option>ליטיגציה וייצוג</option>
              </select>
              <textarea
                className="min-h-32 rounded-2xl border border-[#2b1b1d]/10 bg-white/85 px-5 py-4 text-right outline-none transition focus:border-[#b45c3a]"
                placeholder="כמה מילים על המקרה"
              />

              <button
                type="submit"
                className="bg-[#b45c3a] px-7 py-4 text-base font-semibold !text-white shadow-lg shadow-[#b45c3a]/20 transition hover:-translate-y-0.5 hover:bg-[#c66a45]"
              >
                שליחת פרטים
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Hero({
  data,
  goTo,
  openConsultation,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openConsultation: () => void;
}) {
  const stats = [
    ["275+", "תיקים שטופלו"],
    ["157+", "לקוחות מרוצים"],
    ["50M", "שווי תיקים"],
  ];

  return (
    <section className="relative overflow-hidden bg-[#2b1b1d]">
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[#efe2d2]" />
      <div className="absolute left-[8%] top-[18%] h-72 w-72 rounded-full bg-[#b45c3a]/18 blur-3xl" />
      <div className="absolute right-[18%] top-[12%] h-80 w-80 rounded-full bg-[#8b744f]/18 blur-3xl" />

      <div className="relative mx-auto grid min-h-[760px] max-w-[1380px] items-end gap-8 px-5 pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:pt-20 lg:[direction:ltr]">
        <div className="relative z-30 pb-48 text-right lg:pb-64 lg:[direction:rtl]">
          <p className="mb-7 text-xs font-semibold tracking-[0.18em] text-[#d8b88f]">
            המשרד המשפטי שלך
          </p>

          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.03] tracking-[-0.065em] !text-white md:text-7xl lg:text-[78px]">
            {getHebrewValue(data, "heroTitle", "מומחיות משפטית שאפשר לסמוך עליה.")}
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 !text-[#fff6e9]">
            {getHebrewValue(
              data,
              "heroSubtitle",
              "משרד עורכי דין שמעניק ייעוץ, אסטרטגיה וייצוג מקצועי לכל צורך משפטי — בדיסקרטיות, בהירות וזמינות.",
            )}
          </p>

          <div className="mt-10 flex flex-wrap justify-end gap-4">
            <button
              type="button"
              onClick={openConsultation}
              className="bg-[#b45c3a] px-8 py-4 text-sm font-semibold !text-white shadow-xl shadow-[#b45c3a]/25 transition duration-300 hover:-translate-y-0.5 hover:bg-[#c66a45]"
            >
              לקביעת ייעוץ
            </button>

            <button
              type="button"
              onClick={() => goTo("practice")}
              className="border border-white/45 px-8 py-4 text-sm font-semibold !text-white transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:!text-[#2b1b1d]"
            >
              תחומי התמחות
            </button>
          </div>
        </div>

        <div className="relative z-20 min-h-[660px] lg:min-h-[720px]">
          <div className="absolute bottom-0 right-2 h-[600px] w-[410px] rounded-t-full bg-[#5a3a2f]/70 lg:h-[700px] lg:w-[520px]" />
          <div className="absolute bottom-[220px] right-[150px] z-20 h-[190px] w-[190px] rounded-tl-full bg-[#b45c3a] lg:bottom-[250px] lg:right-[235px] lg:h-[245px] lg:w-[245px]" />
          <div className="absolute bottom-[70px] right-[40px] z-10 h-[180px] w-[180px] rounded-full bg-[#8b744f]/45 blur-2xl" />

          <div className="absolute bottom-0 right-0 z-30 w-[470px] max-w-[92vw] lg:right-8 lg:w-[570px]">
            <img
              src={getHeroImage(data)}
              alt=""
              className="h-[650px] w-full object-cover object-top lg:h-[720px]"
            />
          </div>
        </div>
      </div>

      <div className="relative z-40 mx-auto -mt-28 max-w-[1280px] px-5 lg:px-8">
        <div className="grid bg-[#b45c3a] !text-white shadow-2xl shadow-[#17100f]/20 md:grid-cols-3">
          {stats.map(([num, label], index) => (
            <div
              key={label}
              className={cx(
                "relative p-9 text-center md:p-12",
                index !== 2 && "border-b border-white/15 md:border-b-0 md:border-l",
              )}
            >
              <div className="text-6xl font-semibold tracking-[-0.08em] md:text-7xl">
                {num}
              </div>
              <div className="mt-3 text-sm font-semibold tracking-[0.08em] !text-[#fff6e9]">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PracticeAreasSection({
  data,
  openConsultation,
  goTo,
}: {
  data: Record<string, any>;
  openConsultation: () => void;
  goTo: (page: string) => void;
}) {
  const practice = [
    {
      title: getValue(data, "practiceOneTitle"),
      text: getValue(data, "practiceOneText"),
      tag: "דיני משפחה",
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
          <path
            d="M24 8 9 18v22h30V18L24 8Z"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path
            d="M17 30c0-3.4 2.2-5.8 5.4-5.8s5.4 2.4 5.4 5.8"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path
            d="M22.4 20.5a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path
            d="M31.5 31c0-2.8 1.9-4.6 4.7-4.6"
            stroke="#b45c3a"
            strokeWidth="2.4"
          />
        </svg>
      ),
    },
    {
      title: getValue(data, "practiceTwoTitle"),
      text: getValue(data, "practiceTwoText"),
      tag: "מסחרי",
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
          <path d="M9 40h30V17H9v23Z" stroke="currentColor" strokeWidth="2.4" />
          <path d="M17 17V9h14v8" stroke="currentColor" strokeWidth="2.4" />
          <path d="M16 25h8M16 31h16" stroke="#b45c3a" strokeWidth="2.4" />
          <path d="M34 22v18" stroke="currentColor" strokeWidth="2.4" />
        </svg>
      ),
    },
    {
      title: getValue(data, "practiceFourTitle"),
      text: getValue(data, "practiceFourText"),
      tag: "ליטיגציה",
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
          <path
            d="M24 7 38 13v11c0 9-6 15-14 18-8-3-14-9-14-18V13l14-6Z"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path d="M18 25h12M24 19v12" stroke="#b45c3a" strokeWidth="2.4" />
        </svg>
      ),
    },
    {
      title: "דיני עבודה",
      text: "ייעוץ וליווי בסכסוכי עבודה, חוזים, פיטורין, זכויות עובדים ומעסיקים.",
      tag: "עבודה",
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
          <path d="M13 9h22v30H13V9Z" stroke="currentColor" strokeWidth="2.4" />
          <path d="M18 17h12M18 24h9M18 31h13" stroke="currentColor" strokeWidth="2.4" />
          <path d="m34 28 5 5-5 5" stroke="#b45c3a" strokeWidth="2.4" />
        </svg>
      ),
    },
    {
      title: "נזקי גוף",
      text: "ייצוג וליווי בתביעות נזיקין, תאונות, רשלנות ופגיעות משמעותיות.",
      tag: "נזיקין",
      icon: (
        <svg viewBox="0 0 48 48" className="h-12 w-12" fill="none">
          <path
            d="M25 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
            stroke="currentColor"
            strokeWidth="2.4"
          />
          <path d="M20 18h8l5 10h6" stroke="currentColor" strokeWidth="2.4" />
          <path d="M19 18 15 33h13" stroke="currentColor" strokeWidth="2.4" />
          <path
            d="M36 42a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"
            stroke="#b45c3a"
            strokeWidth="2.4"
          />
        </svg>
      ),
    },
  ];

  const rightColumn = [practice[0], practice[2], practice[4]];
  const leftColumn = [practice[1], practice[3]];

  function PracticeCard({
    item,
    index,
  }: {
    item: (typeof practice)[number];
    index: number;
  }) {
    return (
      <article className="group relative overflow-hidden border border-[#2b1b1d]/10 bg-white p-7 shadow-xl shadow-[#2b1b1d]/6 transition duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#2b1b1d]/10 md:p-9">
        <div className="absolute right-0 top-1/2 h-14 w-[3px] -translate-y-1/2 bg-[#b45c3a]" />

        <div className="grid gap-6 md:grid-cols-[72px_1fr] md:items-start">
          <div className="flex h-16 w-16 items-center justify-center !text-[#2b1b1d] transition duration-500 group-hover:text-[#b45c3a]">
            {item.icon}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold text-[#b45c3a]">
                {item.tag}
              </span>

              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#2b1b1d] text-xs font-semibold !text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <h3 className="text-3xl font-semibold tracking-[-0.045em] !text-[#2b1b1d]">
              {item.title}
            </h3>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6d5f55]">
              {item.text}
            </p>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section className="bg-[#e9ddcc] px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-14 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="text-right">
            <p className="mb-6 text-sm font-semibold text-[#b45c3a]">
              תחומי התמחות
            </p>

            <h2 className="max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-0.065em] !text-[#2b1b1d] md:text-7xl">
              מגוון רחב של תחומי התמחות משפטיים
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-8 text-[#6d5f55] lg:mr-auto">
            כל תחום מוצג בצורה ברורה, מסודרת ונגישה — כדי שהלקוח יבין מהר
            האם המשרד מתאים למקרה שלו וימשיך לפעולה.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="grid gap-6">
            {rightColumn.map((item, index) => (
              <PracticeCard key={item.title} item={item} index={index * 2} />
            ))}
          </div>

          <div className="grid gap-6 lg:pt-20">
            {leftColumn.map((item, index) => (
              <PracticeCard key={item.title} item={item} index={index * 2 + 1} />
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={openConsultation}
            className="border border-[#2b1b1d] bg-transparent px-10 py-4 text-sm font-semibold !text-[#2b1b1d] transition duration-300 hover:-translate-y-0.5 hover:bg-[#2b1b1d] hover:!text-white"
          >
            לקביעת ייעוץ
          </button>

          <a
            href={getJustoraHref("practice")}
            onClick={(event) => {
              if (shouldUseNativeJustoraNavigation()) return;
              event.preventDefault();
              goTo("practice");
            }}
            className="bg-[#2b1b1d] px-10 py-4 text-sm font-semibold !text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[#3a2628]"
          >
            לכל תחומי ההתמחות
          </a>
        </div>
      </div>
    </section>
  );
}

function BookNowSection({
  data,
  openConsultation,
}: {
  data: Record<string, any>;
  openConsultation: () => void;
}) {
  return (
    <section className="px-5 py-8 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-[1380px] overflow-hidden rounded-[46px] bg-[#2b1b1d] !text-white shadow-2xl shadow-[#2b1b1d]/25 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative min-h-[430px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1300&q=85"
            alt=""
            className="h-full min-h-[430px] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-[#2b1b1d]/82 via-[#2b1b1d]/25 to-transparent" />
        </div>

        <div className="relative p-8 lg:p-12">
          <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-[#b45c3a]/20 blur-3xl" />

          <div className="relative z-10">
            <p className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              קביעת פגישה
            </p>

            <h2 className="max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.055em] md:text-6xl">
              קבעו פגישה פרונטלית או ייעוץ משפטי אונליין.
            </h2>

            <p className="mt-5 max-w-2xl text-lg leading-8 !text-[#fff6e9]">
              בלוק ברור שמוביל לפעולה אחת — קביעת ייעוץ בלי הסחות דעת.
            </p>

            <button
              type="button"
              onClick={openConsultation}
              className="mt-9 bg-white px-8 py-4 text-base font-semibold !text-[#2b1b1d] transition hover:-translate-y-0.5"
            >
              לקביעת ייעוץ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function LawyersSection({ data }: { data: Record<string, any> }) {
  const lawyers = [
    [getValue(data, "lawyerOneName"), getValue(data, "lawyerOneRole"), getValue(data, "lawyerOneImage")],
    [getValue(data, "lawyerTwoName"), getValue(data, "lawyerTwoRole"), getValue(data, "lawyerTwoImage")],
    [getValue(data, "lawyerThreeName"), getValue(data, "lawyerThreeRole"), getValue(data, "lawyerThreeImage")],
  ];

  const points = [
    "בניית אסטרטגיה משפטית כבר מהשיחה הראשונה.",
    "ניהול מסמכים, ראיות ולוחות זמנים בצורה מסודרת.",
    "עדכונים ברורים ושקיפות לאורך כל הדרך.",
    "שמירה על דיסקרטיות מלאה ויחס אישי.",
    "חשיבה משפטית שמחברת בין סיכון, זמן ותוצאה.",
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionTitle
              eyebrow="הצוות המשפטי"
              title="עזרה משפטית מקצועית שמובילה לתוצאה טובה יותר."
              text="שילוב של ערך, נקודות מקצועיות ותמונות אמינות של עורכי דין."
            />

            <div className="mt-10 grid gap-4">
              {points.map((point, index) => (
                <div
                  key={point}
                  className="group flex items-center gap-4 rounded-[26px] border border-[#2b1b1d]/10 bg-white/70 p-4 shadow-lg shadow-[#2b1b1d]/5 transition hover:-translate-y-1 hover:bg-white"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#2b1b1d] text-sm font-semibold !text-white">
                    {index + 1}
                  </span>
                  <p className="font-semibold leading-7 text-[#5d5048]">{point}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {lawyers.map(([name, role, image], index) => (
              <article
                key={name}
                className={cx(
                  "group overflow-hidden rounded-[36px] border border-white/80 bg-white/70 p-3 shadow-2xl shadow-[#2b1b1d]/10 transition duration-500 hover:-translate-y-3",
                  index === 0 && "md:col-span-2",
                  index === 2 && "md:translate-y-8",
                )}
              >
                <div className="relative overflow-hidden rounded-[28px]">
                  <img
                    src={image}
                    alt=""
                    className={cx(
                      "w-full rounded-[28px] object-cover transition duration-700 group-hover:scale-105",
                      index === 0 ? "h-[430px]" : "h-[330px]",
                    )}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17100f]/72 via-transparent to-transparent" />
                  <div className="absolute inset-x-4 bottom-4 rounded-3xl border border-white/15 bg-[#2b1b1d]/78 p-5 !text-white backdrop-blur-md">
                    <h3 className="text-2xl font-semibold tracking-[-0.05em]">{name}</h3>
                    <p className="mt-1 text-sm !text-[#f4e6d8]">{role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CasesSection({
  data,
  onOpenCase,
  onViewAllCases,
}: {
  data: Record<string, any>;
  onOpenCase: (item: JustoraCaseItem) => void;
  onViewAllCases: () => void;
}) {
  const cases = getCaseItems(data);

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow="תיקים והצלחות"
            title="סיפורי הצלחה משפטיים"
            text="כרטיסי תיקים גדולים עם סכום, תחום ותיאור — כדי להראות ניסיון בלי להעמיס."
          />

          <a
            href={getJustoraHref("cases")}
            onClick={(event) => {
              if (shouldUseNativeJustoraNavigation()) return;
              event.preventDefault();
              onViewAllCases();
            }}
            className="w-fit rounded-full border border-[#2b1b1d]/15 bg-white/70 px-6 py-4 text-sm font-semibold !text-[#2b1b1d] transition hover:bg-white"
          >
            כל התיקים
          </a>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {cases.map((item) => (
            <article
              key={item.number}
              className="group overflow-hidden rounded-[40px] border border-[#2b1b1d]/10 bg-white/70 shadow-2xl shadow-[#2b1b1d]/10 transition duration-500 hover:-translate-y-2 hover:bg-white"
            >
              <div className="grid h-full lg:grid-cols-[0.8fr_1.2fr]">
                <div className="relative min-h-[300px] bg-[#2b1b1d] p-7 !text-white">
                  <div className="absolute left-5 top-5 h-28 w-28 rounded-full bg-[#b45c3a]/25 blur-2xl" />

                  <div className="relative z-10 flex h-full flex-col justify-between">
                    <div>
                      <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                        {item.tag}
                      </span>
                      <div className="mt-10 text-6xl font-semibold tracking-[-0.08em] text-[#d8b88f]">
                        {item.amount}
                      </div>
                    </div>

                    <p className="text-sm !text-[#ead9c5]">תיק {item.number}</p>
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="text-3xl font-semibold tracking-[-0.05em] !text-[#2b1b1d]">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-8 text-[#6d5f55]">{item.text}</p>

                  <a
                    href={`/cases?case=${item.number}`}
                    onClick={(event) => {
                      if (shouldUseNativeJustoraNavigation()) return;
                      event.preventDefault();
                      onOpenCase(item);
                    }}
                    className="mt-8 inline-flex bg-[#2b1b1d] px-6 py-4 text-sm font-semibold !text-[#fff6e9] transition hover:-translate-y-0.5"
                    style={{ color: "#fff6e9" }}
                  >
                    קריאת מקרה
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseDetailPage({
  data,
  item,
  onBack,
  openConsultation,
}: {
  data: Record<string, any>;
  item: JustoraCaseItem;
  onBack: () => void;
  openConsultation: () => void;
}) {
  return (
    <>
      <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1380px]">
          <button
            type="button"
            onClick={onBack}
            className="mb-8 rounded-full border border-[#2b1b1d]/15 bg-white/70 px-6 py-3 text-sm font-semibold !text-[#2b1b1d] transition hover:bg-white"
          >
            חזרה לתיקים
          </button>

          <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr]">
            <div className="rounded-[46px] border border-[#2b1b1d]/10 bg-white/74 p-8 shadow-2xl shadow-[#2b1b1d]/10 lg:p-12">
              <p className="mb-5 inline-flex rounded-full bg-[#b45c3a]/12 px-4 py-2 text-sm font-semibold text-[#b45c3a]">
                {item.tag} · תיק {item.number}
              </p>

              <h1 className="max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.07em] !text-[#2b1b1d] md:text-7xl">
                {item.title}
              </h1>

              <p className="mt-7 max-w-3xl text-xl leading-9 text-[#6d5f55]">
                {item.text}
              </p>

              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {[
                  ["האתגר", item.challenge],
                  ["הפתרון", item.solution],
                  ["התוצאה", item.result],
                ].map(([title, text]) => (
                  <article
                    key={title}
                    className="rounded-[30px] border border-[#2b1b1d]/10 bg-[#fbf3e8] p-6"
                  >
                    <h3 className="text-xl font-semibold !text-[#2b1b1d]">
                      {title}
                    </h3>
                    <p className="mt-4 leading-8 text-[#6d5f55]">{text}</p>
                  </article>
                ))}
              </div>
            </div>

            <aside className="relative overflow-hidden rounded-[46px] bg-[#2b1b1d] p-8 !text-white shadow-2xl shadow-[#2b1b1d]/20 lg:p-10">
              <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-between">
                <div>
                  <span className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
                    סכום / ערך תיק
                  </span>

                  <div className="mt-10 text-7xl font-semibold tracking-[-0.08em] text-[#d8b88f]">
                    {item.amount}
                  </div>

                  <p className="mt-5 text-lg leading-8 !text-[#f4e6d8]">
                    פירוט מקרה לדוגמה שמציג ללקוח את דרך העבודה, החשיבה
                    המשפטית והערך שהמשרד יודע לייצר.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openConsultation}
                  className="mt-10 bg-white px-7 py-4 text-sm font-semibold !text-[#2b1b1d] transition hover:-translate-y-0.5"
                >
                  לבדוק מקרה דומה
                </button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer
        data={data}
        goTo={(pageId) => {
          onBack();
          if (pageId !== "cases") {
            window.setTimeout(() => {
              if (typeof window !== "undefined") {
                window.history.pushState({}, "", getJustoraHref(pageId));
              }
            }, 0);
          }
        }}
        openConsultation={openConsultation}
      />
    </>
  );
}

function TestimonialsSection({ data }: { data: Record<string, any> }) {
  const testimonials = [
    ["מקצועיים ומסורים", getValue(data, "testimonialOneText"), getValue(data, "testimonialOneName")],
    ["שירות יוצא דופן", getValue(data, "testimonialTwoText"), getValue(data, "testimonialTwoName")],
    ["ממליצים מאוד", getValue(data, "testimonialThreeText"), getValue(data, "testimonialThreeName")],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto grid max-w-[1380px] gap-12 lg:grid-cols-[0.86fr_1.14fr]">
        <div className="h-fit lg:sticky lg:top-28">
          <SectionTitle
            eyebrow="לקוחות מספרים"
            title="מה לקוחות אומרים?"
            text="המלצות ברורות ואמינות שמחזקות את תחושת הביטחון לפני הפנייה."
          />
        </div>

        <div className="grid gap-5">
          {testimonials.map(([title, text, name], index) => (
            <article
              key={title}
              className="rounded-[34px] border border-[#2b1b1d]/10 bg-white/72 p-7 shadow-xl shadow-[#2b1b1d]/8 transition duration-500 hover:-translate-y-2 hover:bg-white"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.04em] !text-[#2b1b1d]">
                    “{title}”
                  </h3>
                  <p className="mt-4 text-lg leading-8 text-[#6d5f55]">"{text}"</p>
                </div>

                <div className="hidden rounded-full bg-[#2b1b1d] px-4 py-2 text-sm font-semibold !text-white sm:block">
                  0{index + 1}
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between border-t border-[#2b1b1d]/10 pt-5">
                <p className="font-semibold !text-[#2b1b1d]">{name}</p>
                <p className="text-[#b45c3a]">★★★★★</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FreeReviewSection({
  openConsultation,
}: {
  data: Record<string, any>;
  openConsultation: () => void;
}) {
  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[48px] bg-[#2b1b1d] p-7 !text-white shadow-2xl shadow-[#2b1b1d]/25 lg:p-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              בדיקת תיק ראשונית
            </p>

            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.03] tracking-[-0.055em] md:text-6xl">
              קבלו בדיקת תיק ראשונית לפני שמקבלים החלטה משפטית.
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 !text-[#fff6e9]">
              בלוק פעולה גדול, ממוקד וברור שמוביל לפנייה בלי עומס ובלי בלבול.
            </p>

            <button
              type="button"
              onClick={openConsultation}
              className="mt-9 bg-white px-8 py-4 text-base font-semibold !text-[#2b1b1d] transition hover:-translate-y-0.5"
            >
              לקביעת ייעוץ
            </button>
          </div>

          <div className="grid gap-4">
            {["בדיקת סיכונים", "איסוף פרטים", "כיוון פעולה", "הערכת המשך טיפול"].map(
              (item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10"
                >
                  <span className="font-semibold">{item}</span>
                  <span className="text-[#d8b88f]">0{index + 1}</span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function BlogSection({
  data,
  goTo,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
}) {
  const posts = [
    [getValue(data, "postOneTitle"), getValue(data, "postOneText"), "חוזים", "20 ביוני 2024"],
    [getValue(data, "postTwoTitle"), getValue(data, "postTwoText"), "ייעוץ", "20 ביוני 2024"],
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px]">
        <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionTitle
            eyebrow="מאמרים"
            title="ידע משפטי שמחזק אמון לפני שיחת הייעוץ."
            text="שני מאמרים גדולים, תגית, תאריך וטקסט קצר — כדי לתת ערך ולא רק למכור."
          />

          <a
            href={getJustoraHref("blog")}
            onClick={(event) => {
              if (shouldUseNativeJustoraNavigation()) return;
              event.preventDefault();
              goTo("blog");
            }}
            className="w-fit rounded-full border border-[#2b1b1d]/15 bg-white/70 px-6 py-4 text-sm font-semibold !text-[#2b1b1d] transition hover:bg-white"
          >
            כל המאמרים
          </a>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {posts.map(([title, text, tag, date], index) => (
            <article
              key={title}
              className="group rounded-[38px] border border-[#2b1b1d]/10 bg-white/72 p-7 shadow-xl shadow-[#2b1b1d]/8 transition duration-500 hover:-translate-y-2 hover:bg-white"
            >
              <div className="mb-10 flex items-center justify-between">
                <span className="rounded-full bg-[#2b1b1d] px-4 py-2 text-sm font-semibold !text-white">
                  {tag}
                </span>
                <span className="text-sm font-semibold text-[#b45c3a]">{date}</span>
              </div>

              <h3 className="max-w-xl text-3xl font-semibold leading-tight tracking-[-0.05em] !text-[#2b1b1d]">
                {title}
              </h3>

              <p className="mt-4 max-w-xl leading-8 text-[#6d5f55]">{text}</p>

              <a
                href={getJustoraHref("blog")}
                onClick={(event) => {
                  if (shouldUseNativeJustoraNavigation()) return;
                  event.preventDefault();
                  goTo("blog");
                }}
                className="mt-9 inline-flex rounded-full border border-[#2b1b1d]/15 px-6 py-4 text-sm font-semibold !text-[#2b1b1d] transition hover:bg-[#2b1b1d] hover:!text-white"
              >
                לקריאה
              </a>

              <div className="mt-8 h-1.5 w-full overflow-hidden rounded-full bg-[#2b1b1d]/10">
                <div
                  className={cx(
                    "h-full rounded-full bg-[#b45c3a] transition duration-700 group-hover:w-full",
                    index === 0 ? "w-[70%]" : "w-[52%]",
                  )}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialFeedSection({ data }: { data: Record<string, any> }) {
  const images = [
    getValue(data, "lawyerOneImage"),
    getValue(data, "lawyerTwoImage"),
    getValue(data, "lawyerThreeImage"),
    getHeroImage(data),
    getValue(data, "aboutImage"),
    "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1528747008803-f9f5ccbc0852?auto=format&fit=crop&w=900&q=85",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=85",
  ];

  return (
    <section className="px-5 py-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-[1380px]">
        <SectionTitle
          center
          eyebrow="גלריית משרד"
          title="תמונות שמייצרות אמון ותחושת משרד פעיל."
          text="אזור תמונות רחב שנותן חיים, אמינות ותחושה מקצועית."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className={cx(
                "group overflow-hidden rounded-[30px] border border-white/80 bg-white/60 p-2 shadow-xl shadow-[#2b1b1d]/8 transition duration-500 hover:-translate-y-2",
                index === 0 && "md:row-span-2",
                index === 3 && "md:row-span-2",
              )}
            >
              <img
                src={image}
                alt=""
                className={cx(
                  "w-full rounded-[24px] object-cover transition duration-700 group-hover:scale-105",
                  index === 0 || index === 3 ? "h-[420px]" : "h-[200px]",
                )}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data }: { data: Record<string, any> }) {
  const [open, setOpen] = useState(0);

  const faqs = [
    [getValue(data, "faqOneQuestion"), getValue(data, "faqOneAnswer")],
    [getValue(data, "faqTwoQuestion"), getValue(data, "faqTwoAnswer")],
    [getValue(data, "faqThreeQuestion"), getValue(data, "faqThreeAnswer")],
  ];

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1380px] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionTitle
          eyebrow="שאלות נפוצות"
          title={getHebrewValue(data, "faqTitle", "לפני שקובעים ייעוץ — כל מה שחשוב לדעת.")}
          text="שאלות נפוצות לפני שיחת ייעוץ ראשונית."
        />

        <div className="space-y-4">
          {faqs.map(([question, answer], index) => {
            const isOpen = open === index;

            return (
              <div
                key={question}
                className="overflow-hidden rounded-[30px] border border-[#2b1b1d]/10 bg-white/72 shadow-xl shadow-[#2b1b1d]/6 transition hover:bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 p-6 text-right"
                >
                  <span className="text-xl font-semibold tracking-[-0.04em] !text-[#2b1b1d]">
                    {question}
                  </span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2b1b1d] text-lg !text-white">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div
                  className={cx(
                    "grid transition-all duration-500 ease-out",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 text-base leading-7 text-[#6d5f55]">
                      {answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ContactSection({
  data,
  openConsultation,
}: {
  data: Record<string, any>;
  openConsultation: () => void;
}) {
  const infoCards = [
    ["כתובת המשרד", getValue(data, "address")],
    ["אימייל", getValue(data, "email")],
    ["טלפון", getValue(data, "phone")],
  ];

  return (
    <section className="px-5 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-[1380px] overflow-hidden rounded-[48px] border border-[#2b1b1d]/10 bg-[#2b1b1d] !text-white shadow-2xl shadow-[#2b1b1d]/20 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative p-8 lg:p-12">
          <div className="absolute left-8 top-8 h-32 w-32 rounded-full bg-[#b45c3a]/20 blur-2xl" />

          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              יצירת קשר
            </p>

            <h2 className="text-4xl font-semibold leading-[1.06] tracking-[-0.055em] md:text-6xl">
              {getHebrewValue(data, "contactTitle", "צריכים ייעוץ משפטי? נשמח לבדוק איך אפשר לעזור.")}
            </h2>

            <p className="mt-5 text-lg leading-8 !text-[#fff6e9]">
              {getValue(data, "contactText")}
            </p>

            <div className="mt-10 grid gap-3">
              {infoCards.map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-[26px] border border-white/10 bg-white/5 px-4 py-4 backdrop-blur-sm transition duration-300 hover:bg-white/10"
                >
                  <div className="text-xs font-semibold !text-[#ead9c5]">{label}</div>
                  <div className="mt-1 text-base font-semibold !text-white">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={openConsultation}
              className="mt-8 bg-white px-7 py-4 text-sm font-semibold !text-[#2b1b1d] transition duration-300 hover:-translate-y-0.5"
            >
              לפתיחת חלון ייעוץ מהיר
            </button>
          </div>
        </div>

        <form
          className="m-4 rounded-[40px] bg-[#fbf3e8] p-5 !text-[#2b1b1d] shadow-inner lg:m-6 lg:p-7"
          onSubmit={(event) => {
            event.preventDefault();
            openConsultation();
          }}
        >
          <div className="grid gap-4">
            <input
              className="rounded-2xl border border-[#2b1b1d]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b45c3a]"
              placeholder="שם מלא"
            />
            <input
              className="rounded-2xl border border-[#2b1b1d]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b45c3a]"
              placeholder="טלפון"
            />
            <input
              className="rounded-2xl border border-[#2b1b1d]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b45c3a]"
              placeholder="אימייל"
            />
            <textarea
              className="min-h-36 rounded-2xl border border-[#2b1b1d]/10 bg-white px-5 py-4 text-right outline-none transition duration-300 focus:border-[#b45c3a]"
              placeholder="מה תרצו לשאול?"
            />

            <button
              type="submit"
              className="bg-[#b45c3a] px-7 py-4 text-base font-semibold !text-white shadow-lg shadow-[#b45c3a]/20 transition duration-300 hover:-translate-y-0.5"
            >
              שליחת פרטים
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

function Footer({
  data,
  goTo,
  openConsultation,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openConsultation: () => void;
}) {
  const nav = [
    ["home", getValue(data, "navHome")],
    ["about", getValue(data, "navAbout")],
    ["practice", getValue(data, "navPractice")],
    ["cases", getValue(data, "navCases")],
    ["blog", getValue(data, "navBlog")],
    ["lawyers", getValue(data, "navLawyers")],
    ["contact", getValue(data, "navContact")],
  ];

  return (
    <footer className="px-5 pb-10 lg:px-8">
      <div className="mx-auto max-w-[1380px] overflow-hidden rounded-[48px] bg-[#17100f] !text-white shadow-2xl shadow-[#2b1b1d]/25">
        <div className="grid gap-10 p-8 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.9fr] lg:p-12">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[#b45c3a] text-lg font-semibold !text-white">
                {getValue(data, "logoText")}
              </span>
              <span className="text-2xl font-semibold tracking-[-0.04em]">
                {getValue(data, "brandName")}
              </span>
            </div>

            <p className="mt-6 max-w-sm leading-8 !text-[#f4e6d8]">
              {getValue(data, "ctaText")}
            </p>

            <button
              type="button"
              onClick={openConsultation}
              className="mt-7 bg-white px-7 py-4 text-sm font-semibold !text-[#2b1b1d] transition hover:-translate-y-0.5"
            >
              לקביעת ייעוץ
            </button>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold">ניווט</h4>
            <div className="grid gap-3">
              {nav.map(([id, label]) => (
                <a
                  key={id}
                  href={getJustoraHref(id)}
                  onClick={(event) => {
                    if (shouldUseNativeJustoraNavigation()) return;
                    event.preventDefault();
                    goTo(id);
                  }}
                  className="w-fit text-sm font-semibold !text-[#f4e6d8] transition hover:text-[#d8b88f]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold">עמודים</h4>
            <div className="grid gap-3 text-sm font-semibold !text-[#f4e6d8]">
              <span>מאמרים</span>
              <span>עמוד מאמר</span>
              <span>תחומי התמחות</span>
              <span>עורכי דין</span>
              <span>תיקים</span>
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-lg font-semibold">יצירת קשר</h4>
            <div className="grid gap-4 text-sm font-semibold !text-[#f4e6d8]">
              <span>{getValue(data, "address")}</span>
              <span>{getValue(data, "email")}</span>
              <span>{getValue(data, "phone")}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-8 py-6 text-sm !text-[#d8c6b4] lg:px-12">
          © {new Date().getFullYear()} {getValue(data, "brandName")} · תבנית משפטית
        </div>
      </div>
    </footer>
  );
}

function HomePage({
  data,
  goTo,
  openConsultation,
  onOpenCase,
}: {
  data: Record<string, any>;
  goTo: (page: string) => void;
  openConsultation: () => void;
  onOpenCase: (item: JustoraCaseItem) => void;
}) {
  return (
    <>
      <Hero data={data} goTo={goTo} openConsultation={openConsultation} />
      <PracticeAreasSection data={data} openConsultation={openConsultation} goTo={goTo} />
      <BookNowSection data={data} openConsultation={openConsultation} />
      <LawyersSection data={data} />
      <CasesSection data={data} onOpenCase={onOpenCase} onViewAllCases={() => goTo("cases")} />
      <TestimonialsSection data={data} />
      <FreeReviewSection data={data} openConsultation={openConsultation} />
      <BlogSection data={data} goTo={goTo} />
      <SocialFeedSection data={data} />
      <FaqSection data={data} />
      <ContactSection data={data} openConsultation={openConsultation} />
      <Footer data={data} goTo={goTo} openConsultation={openConsultation} />
    </>
  );
}

function SimplePage({
  data,
  type,
  goTo,
  openConsultation,
  onOpenCase,
}: {
  data: Record<string, any>;
  type: string;
  goTo: (page: string) => void;
  openConsultation: () => void;
  onOpenCase: (item: JustoraCaseItem) => void;
}) {
  const pageMap: Record<string, React.ReactNode> = {
    about: (
      <>
        <BookNowSection data={data} openConsultation={openConsultation} />
        <LawyersSection data={data} />
        <TestimonialsSection data={data} />
      </>
    ),
    practice: (
      <>
        <PracticeAreasSection data={data} openConsultation={openConsultation} goTo={goTo} />
        <FreeReviewSection data={data} openConsultation={openConsultation} />
      </>
    ),
    lawyers: <LawyersSection data={data} />,
    cases: (
      <>
        <CasesSection data={data} onOpenCase={onOpenCase} onViewAllCases={() => goTo("cases")} />
        <TestimonialsSection data={data} />
      </>
    ),
    blog: <BlogSection data={data} goTo={goTo} />,
    contact: <ContactSection data={data} openConsultation={openConsultation} />,
  };

  return (
    <>
      <section className="relative overflow-hidden px-5 py-20 lg:px-8 lg:py-28">
        <div className="absolute left-[10%] top-10 h-56 w-56 rounded-full bg-[#b45c3a]/20 blur-3xl" />
        <div className="absolute right-[12%] bottom-10 h-56 w-56 rounded-full bg-[#2b1b1d]/10 blur-3xl" />

        <div className="relative mx-auto max-w-[1380px] text-center">
          <p className="mb-4 inline-flex rounded-full border border-[#2b1b1d]/15 bg-white/70 px-4 py-2 text-sm font-semibold text-[#b45c3a] shadow-sm">
            {getValue(data, "brandName")}
          </p>

          <h1 className="mx-auto max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-0.07em] !text-[#2b1b1d] md:text-7xl">
            {getPageTitle(data, type)}
          </h1>
        </div>
      </section>

      {pageMap[type] ?? null}

      <Footer data={data} goTo={goTo} openConsultation={openConsultation} />
    </>
  );
}

export default function JustoraPages({
  initialPage = "home",
  initialPageId,
  page,
  pageId,
  activePageId,
  currentPageId,
  mode = "preview",
  data,
  onPageChange,
  isPublic,
  viewMode,
  runtimeMode,
}: JustoraPagesProps) {
  const mergedData = useMemo(
    () => ({
      ...justoraDefaultData,
      ...(data ?? {}),
    }),
    [data],
  );

  const navProps = {
    page,
    pageId,
    initialPage,
    initialPageId,
    activePageId,
    currentPageId,
    onPageChange,
    isPublic,
    viewMode,
    runtimeMode,
  };

  const { currentPage, goTo: navigateToPage, isPublicRuntime } =
    useTemplatePageNavigation(navProps, {
      allowedPages: justoraAllowedPages,
      fallbackPage: "home",
      scrollOnNavigate: false,
    });
  const libraryPage = useVisualLibraryPage();
  const isLibraryPage = Boolean(libraryPage?.isLibraryPage);

  const [consultationOpen, setConsultationOpen] = useState(false);

  const [selectedCase, setSelectedCase] = useState<JustoraCaseItem | null>(() =>
    isPublic || viewMode === "public" || runtimeMode === "public"
      ? getCaseFromUrl({
          ...justoraDefaultData,
          ...(data ?? {}),
        })
      : null,
  );

  useEffect(() => {
    if (!isPublicRuntime) {
      setSelectedCase(null);
      return;
    }

    function syncFromBrowserUrl() {
      const nextCase = getCaseFromUrl(mergedData);
      setSelectedCase(nextCase);
    }

    syncFromBrowserUrl();

    if (typeof window === "undefined") return undefined;

    window.addEventListener("popstate", syncFromBrowserUrl);

    return () => {
      window.removeEventListener("popstate", syncFromBrowserUrl);
    };
  }, [isPublicRuntime, mergedData]);

  function pushPublishedUrl(nextPage: string, caseNumber?: string) {
    if (!isPublicRuntime || typeof window === "undefined") return;

    const nextPath = getJustoraHref(nextPage);
    const nextUrl = caseNumber ? `${nextPath}?case=${caseNumber}` : nextPath;

    if (window.location.pathname + window.location.search !== nextUrl) {
      window.history.pushState({}, "", nextUrl);
    }
  }

  function scrollToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function goTo(nextPage: string) {
    const raw = String(nextPage || "").trim() || "home";
    const isBuiltin = justoraAllowedPages.includes(raw);
    const resolvedPage = isBuiltin
      ? resolveTemplatePageId(
          { page: raw },
          justoraAllowedPages,
          "home",
        )
      : raw;

    setSelectedCase(null);
    navigateToPage(resolvedPage);
    if (isBuiltin) {
      pushPublishedUrl(resolvedPage);
    } else if (typeof window !== "undefined") {
      const nextPath = raw.startsWith("/") ? raw : `/${raw}`;
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, "", nextPath);
      }
    }
    scrollToTop();
  }

  function openCase(item: JustoraCaseItem) {
    navigateToPage("cases");
    setSelectedCase(item);
    pushPublishedUrl("cases", item.number);
    scrollToTop();
  }

  function backToCases() {
    setSelectedCase(null);
    navigateToPage("cases");
    pushPublishedUrl("cases");
    scrollToTop();
  }

  /*
    Keep-alive: לא עושים unmount לדפי התבנית בניווט.
    בעבר החלפת HomePage/SimplePage מחקה סקשנים/מדיה שהעורך הזריק ל-DOM,
    והאתר הציבורי נראה שונה מהעורך. הדפים נשארים בעץ; רק מוסתרים.
  */
  const showHome = !isLibraryPage && !selectedCase && currentPage === "home";
  const showCaseDetail = !isLibraryPage && Boolean(selectedCase);

  return (
    <div
      dir="rtl"
      data-template-id={mode === "preview" ? "justora-preview" : "justora"}
      data-template-page-id={
        isLibraryPage ? libraryPage?.rawPageId || currentPage : currentPage
      }
      data-bizuply-library-page={isLibraryPage ? "true" : undefined}
      className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,#efe2d2_0%,#fbf3e8_42%,#f1e5d6_100%)] font-sans !text-[#2b1b1d]"
    >
      <JustoraButtonTextFix />

      <Header
        data={mergedData}
        currentPage={currentPage}
        setCurrentPage={goTo}
        openConsultation={() => setConsultationOpen(true)}
      />

      <div data-visual-page-stack="true">
        <div
          data-visual-page-panel="home"
          hidden={!showHome}
          aria-hidden={!showHome}
        >
          <HomePage
            data={mergedData}
            goTo={goTo}
            openConsultation={() => setConsultationOpen(true)}
            onOpenCase={openCase}
          />
        </div>

        {justoraAllowedPages
          .filter((pageId) => pageId !== "home")
          .map((pageId) => {
            const visible =
              !isLibraryPage && !selectedCase && currentPage === pageId;

            return (
              <div
                key={pageId}
                data-visual-page-panel={pageId}
                hidden={!visible}
                aria-hidden={!visible}
              >
                <SimplePage
                  data={mergedData}
                  type={pageId}
                  goTo={goTo}
                  openConsultation={() => setConsultationOpen(true)}
                  onOpenCase={openCase}
                />
              </div>
            );
          })}

        <div
          data-visual-page-panel="case-detail"
          hidden={!showCaseDetail}
          aria-hidden={!showCaseDetail}
        >
          {selectedCase ? (
            <CaseDetailPage
              data={mergedData}
              item={selectedCase}
              onBack={backToCases}
              openConsultation={() => setConsultationOpen(true)}
            />
          ) : null}
        </div>
      </div>

      {/*
        Host יציב לסקשנים מספריית העורך — מחוץ לפאנלים שמתחלפים.
        applyAllVisualDataToDom מעדיף את ה-host הזה.
      */}
      <div data-visual-insert-host="true" data-visual-runtime-host="true" />

      <ConsultationModal
        data={mergedData}
        open={consultationOpen}
        onClose={() => setConsultationOpen(false)}
      />
    </div>
  );
}
