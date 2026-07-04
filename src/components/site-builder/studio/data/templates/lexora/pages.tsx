import React, { useCallback, useMemo, useRef, useState } from "react";

import { lexoraEditorCss } from "./editorCss";
import { lexoraSeed, type LexoraSeed } from "./lexoraData";

import LexoraHomePage from "./homePage";
import LexoraServicesPage from "./servicesPage";
import LexoraCasesPage from "./casesPage";
import LexoraProcessPage from "./processPage";
import LexoraAboutPage from "./aboutPage";
import LexoraContactPage from "./contactPage";

import {
  LexoraFooter,
  LexoraHeader,
  type LexoraPageKey,
  useLexoraMotion,
} from "./shared";

export const lexoraPages = [
  { id: "home", name: "בית", slug: "/" },
  { id: "services", name: "שירותים", slug: "/services" },
  { id: "cases", name: "תיקים", slug: "/cases" },
  { id: "process", name: "תהליך", slug: "/process" },
  { id: "about", name: "אודות", slug: "/about" },
  { id: "contact", name: "יצירת קשר", slug: "/contact" },
];

type LexoraPagesProps = {
  data?: Partial<LexoraSeed>;
  defaultData?: Partial<LexoraSeed>;
  pageId?: string;
  pageSlug?: string;
  selectedPageId?: string;
  selectedPageSlug?: string;
};

function normalizePageValue(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function isLexoraPageKey(value: string): value is LexoraPageKey {
  return (
    value === "home" ||
    value === "services" ||
    value === "cases" ||
    value === "process" ||
    value === "about" ||
    value === "contact"
  );
}

function getPageFromRawValue(value: string | null | undefined): LexoraPageKey {
  const raw = normalizePageValue(value);

  if (raw.includes("services")) return "services";
  if (raw.includes("cases") || raw.includes("projects")) return "cases";
  if (raw.includes("process")) return "process";
  if (raw.includes("about")) return "about";
  if (raw.includes("contact") || raw.includes("consultation")) return "contact";

  return "home";
}

function getInitialPage(props: LexoraPagesProps): LexoraPageKey {
  const explicit =
    normalizePageValue(props.selectedPageId) ||
    normalizePageValue(props.pageId) ||
    normalizePageValue(props.selectedPageSlug) ||
    normalizePageValue(props.pageSlug);

  if (explicit) return getPageFromRawValue(explicit);

  if (typeof window === "undefined") return "home";

  return getPageFromRawValue(window.location.pathname || "/");
}

function getLexoraPageSlug(page: LexoraPageKey) {
  if (page === "services") return "/services";
  if (page === "cases") return "/cases";
  if (page === "process") return "/process";
  if (page === "about") return "/about";
  if (page === "contact") return "/contact";

  return "/";
}

function mergeLexoraData(
  base: LexoraSeed,
  override?: Partial<LexoraSeed>,
): LexoraSeed {
  if (!override) return base;

  return {
    ...base,
    ...override,
    brand: { ...base.brand, ...(override.brand || {}) },
    hero: { ...base.hero, ...(override.hero || {}) },
    stats: override.stats || base.stats,
    intro: { ...base.intro, ...(override.intro || {}) },
    services: {
      ...base.services,
      ...(override.services || {}),
      items: override.services?.items || base.services.items,
    },
    cases: {
      ...base.cases,
      ...(override.cases || {}),
      items: override.cases?.items || base.cases.items,
    },
    process: {
      ...base.process,
      ...(override.process || {}),
      steps: override.process?.steps || base.process.steps,
    },
    about: { ...base.about, ...(override.about || {}) },
    faqs: override.faqs || base.faqs,
    consultation: {
      ...base.consultation,
      ...(override.consultation || {}),
    },
    footer: { ...base.footer, ...(override.footer || {}) },
  };
}

export default function LexoraPages(props: LexoraPagesProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const data = useMemo(
    () => mergeLexoraData(lexoraSeed, props.data || props.defaultData),
    [props.data, props.defaultData],
  );

  const initialPage = useMemo(() => getInitialPage(props), [props]);
  const [activePage, setActivePage] = useState<LexoraPageKey>(initialPage);

  useLexoraMotion(rootRef, activePage);

  const scrollToTop = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;

    const previewScroller = root.closest(
      ".lexora-preview-scroll",
    ) as HTMLElement | null;

    window.requestAnimationFrame(() => {
      if (previewScroller) {
        previewScroller.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }, []);

  const navigateToPage = useCallback(
    (page: LexoraPageKey) => {
      setActivePage(page);

      if (typeof window !== "undefined") {
        try {
          const nextUrl = getLexoraPageSlug(page);
          window.history.pushState({ lexoraPage: page }, "", nextUrl);
        } catch {
          // בפריוויו או בעורך history לפעמים חסום, לא מפילים את התבנית.
        }
      }

      scrollToTop();
    },
    [scrollToTop],
  );

  const handleClickCapture = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest(
        "a[data-lex-page]",
      ) as HTMLAnchorElement | null;

      if (!anchor) return;

      const pageValue = normalizePageValue(anchor.dataset.lexPage);
      if (!isLexoraPageKey(pageValue)) return;

      event.preventDefault();
      event.stopPropagation();

      navigateToPage(pageValue);
    },
    [navigateToPage],
  );

  return (
    <div
      ref={rootRef}
      dir="rtl"
      data-template-id="lexora"
      className="lex-page"
      onClickCapture={handleClickCapture}
    >
      <style>{lexoraEditorCss}</style>

      <LexoraHeader data={data} activePage={activePage} />

      {activePage === "home" ? <LexoraHomePage data={data} /> : null}
      {activePage === "services" ? <LexoraServicesPage data={data} /> : null}
      {activePage === "cases" ? <LexoraCasesPage data={data} /> : null}
      {activePage === "process" ? <LexoraProcessPage data={data} /> : null}
      {activePage === "about" ? <LexoraAboutPage data={data} /> : null}
      {activePage === "contact" ? <LexoraContactPage data={data} /> : null}

      <LexoraFooter data={data} activePage={activePage} />
    </div>
  );
}