import React, { useCallback, useMemo, useRef, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
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
  type LexoraNavigate,
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

  return "home";
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
    about: {
      ...base.about,
      ...(override.about || {}),
      team: override.about?.team || base.about.team,
    },
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
        return;
      }

      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  const handleNavigate: LexoraNavigate = useCallback(
    (page) => {
      setActivePage(page);
      scrollToTop();
    },
    [scrollToTop],
  );

  return (
    <div
      ref={rootRef}
      dir="rtl"
      data-template-id="lexora"
      className="lex-page"
      data-active-page={activePage}
    >
      <style>{lexoraEditorCss}</style>

      <LexoraHeader
        data={data}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <VisualPageStack
        activePageId={activePage}
        pages={[
          {
            id: "home",
            content: (
              <LexoraHomePage data={data} onNavigate={handleNavigate} />
            ),
          },
          {
            id: "services",
            content: (
              <LexoraServicesPage data={data} onNavigate={handleNavigate} />
            ),
          },
          {
            id: "cases",
            content: (
              <LexoraCasesPage data={data} onNavigate={handleNavigate} />
            ),
          },
          {
            id: "process",
            content: <LexoraProcessPage data={data} />,
          },
          {
            id: "about",
            content: <LexoraAboutPage data={data} />,
          },
          {
            id: "contact",
            content: <LexoraContactPage data={data} />,
          },
        ]}
      />

      <LexoraFooter
        data={data}
        activePage={activePage}
        onNavigate={handleNavigate}
      />
    </div>
  );
}