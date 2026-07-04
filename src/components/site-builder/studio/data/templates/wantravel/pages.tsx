import React, { useCallback, useMemo, useRef, useState } from "react";

import { wantravelEditorCss } from "./editorCss";
import { wantravelSeed, type WantravelSeed } from "./wantravelData";

import WantravelHomePage from "./homePage";
import WantravelPackagesPage from "./packagesPage";
import WantravelHowItWorksPage from "./howItWorksPage";
import WantravelReviewsPage from "./reviewsPage";

import {
  useWantravelMotion,
  WantravelFooter,
  WantravelHeader,
  type WantravelPageKey,
} from "./shared";

export const wantravelPages = [
  {
    id: "home",
    name: "בית",
    slug: "/",
  },
  {
    id: "packages",
    name: "חבילות",
    slug: "/packages",
  },
  {
    id: "process",
    name: "איך זה עובד",
    slug: "/how-it-works",
  },
  {
    id: "reviews",
    name: "המלצות",
    slug: "/reviews",
  },
];

type WantravelPagesProps = {
  data?: Partial<WantravelSeed>;
  defaultData?: Partial<WantravelSeed>;
  pageId?: string;
  pageSlug?: string;
  selectedPageId?: string;
  selectedPageSlug?: string;
};

function normalizePageValue(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function isWantravelPageKey(value: string): value is WantravelPageKey {
  return (
    value === "home" ||
    value === "packages" ||
    value === "process" ||
    value === "reviews"
  );
}

function getPageFromRawValue(value: string | null | undefined): WantravelPageKey {
  const raw = normalizePageValue(value);

  if (raw.includes("packages") || raw.includes("package")) {
    return "packages";
  }

  if (
    raw.includes("how-it-works") ||
    raw.includes("howitworks") ||
    raw.includes("process")
  ) {
    return "process";
  }

  if (
    raw.includes("reviews") ||
    raw.includes("review") ||
    raw.includes("testimonials")
  ) {
    return "reviews";
  }

  return "home";
}

function getPageFromWindowPath(): WantravelPageKey {
  if (typeof window === "undefined") return "home";

  const pathname = window.location.pathname || "";
  return getPageFromRawValue(pathname);
}

function getActiveWantravelPage(props: WantravelPagesProps): WantravelPageKey {
  const explicitPage =
    normalizePageValue(props.selectedPageId) ||
    normalizePageValue(props.pageId) ||
    normalizePageValue(props.selectedPageSlug) ||
    normalizePageValue(props.pageSlug);

  if (explicitPage) {
    return getPageFromRawValue(explicitPage);
  }

  return getPageFromWindowPath();
}

function getWantravelPageSlug(page: WantravelPageKey) {
  if (page === "packages") return "/packages";
  if (page === "process") return "/how-it-works";
  if (page === "reviews") return "/reviews";

  return "/";
}

function getWantravelBasePath() {
  if (typeof window === "undefined") return "";

  const pathname = window.location.pathname || "/";
  const clean = pathname.replace(/\/+$/, "") || "/";

  if (clean.endsWith("/packages")) {
    return clean.slice(0, -"/packages".length) || "";
  }

  if (clean.endsWith("/how-it-works")) {
    return clean.slice(0, -"/how-it-works".length) || "";
  }

  if (clean.endsWith("/reviews")) {
    return clean.slice(0, -"/reviews".length) || "";
  }

  return clean === "/" ? "" : clean;
}

function buildWantravelUrl(page: WantravelPageKey, hash?: string) {
  const basePath = getWantravelBasePath();
  const pageSlug = getWantravelPageSlug(page);
  const cleanHash = hash ? `#${hash.replace(/^#/, "")}` : "";

  if (pageSlug === "/") {
    return `${basePath || "/"}${cleanHash}`;
  }

  return `${basePath}${pageSlug}${cleanHash}`;
}

function mergeWantravelData(
  base: WantravelSeed,
  override?: Partial<WantravelSeed>,
): WantravelSeed {
  if (!override) return base;

  return {
    ...base,
    ...override,
    brand: {
      ...base.brand,
      ...(override.brand || {}),
    },
    nav: override.nav || base.nav,
    hero: {
      ...base.hero,
      ...(override.hero || {}),
    },
    stats: override.stats || base.stats,
    marquee: override.marquee || base.marquee,
    destinations: {
      ...base.destinations,
      ...(override.destinations || {}),
      items: override.destinations?.items || base.destinations.items,
    },
    packages: {
      ...base.packages,
      ...(override.packages || {}),
      items: override.packages?.items || base.packages.items,
    },
    process: {
      ...base.process,
      ...(override.process || {}),
      steps: override.process?.steps || base.process.steps,
    },
    reviews: {
      ...base.reviews,
      ...(override.reviews || {}),
      items: override.reviews?.items || base.reviews.items,
    },
    booking: {
      ...base.booking,
      ...(override.booking || {}),
    },
    footer: {
      ...base.footer,
      ...(override.footer || {}),
    },
  };
}

export default function WantravelPages(props: WantravelPagesProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const data = useMemo(
    () => mergeWantravelData(wantravelSeed, props.data || props.defaultData),
    [props.data, props.defaultData],
  );

  const initialPage = useMemo(() => getActiveWantravelPage(props), [props]);
  const [activePage, setActivePage] = useState<WantravelPageKey>(initialPage);

  useWantravelMotion(rootRef, activePage);

  const scrollToTopOrHash = useCallback((hash?: string) => {
    const root = rootRef.current;
    if (!root) return;

    const previewScroller = root.closest(
      ".wantravel-preview-scroll",
    ) as HTMLElement | null;

    const scrollTarget = previewScroller || window;

    window.requestAnimationFrame(() => {
      if (hash) {
        const target = root.querySelector<HTMLElement>(
          `#${hash.replace(/^#/, "")}`,
        );

        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          return;
        }
      }

      if (previewScroller) {
        previewScroller.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      } else {
        scrollTarget.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  }, []);

  const navigateToPage = useCallback(
    (page: WantravelPageKey, hash?: string) => {
      setActivePage(page);

      if (typeof window !== "undefined") {
        const nextUrl = buildWantravelUrl(page, hash);

        try {
          window.history.pushState(
            {
              wantravelPage: page,
              wantravelHash: hash || "",
            },
            "",
            nextUrl,
          );
        } catch {
          // לא מפילים את העמוד אם ה־history חסום בפריוויו/עורך
        }
      }

      scrollToTopOrHash(page === "home" ? hash : undefined);
    },
    [scrollToTopOrHash],
  );

  const handleTemplateClickCapture = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest(
        "a[data-wan-page]",
      ) as HTMLAnchorElement | null;

      if (!anchor) return;

      const pageValue = normalizePageValue(anchor.dataset.wanPage);
      const hashValue = normalizePageValue(anchor.dataset.wanHash);

      if (!isWantravelPageKey(pageValue)) return;

      event.preventDefault();
      event.stopPropagation();

      navigateToPage(pageValue, hashValue || undefined);
    },
    [navigateToPage],
  );

  return (
    <div
      ref={rootRef}
      dir="rtl"
      data-template-id="wantravel"
      className="wan-page"
      onClickCapture={handleTemplateClickCapture}
    >
      <style>{wantravelEditorCss}</style>

      <WantravelHeader data={data} activePage={activePage} />

      {activePage === "home" ? <WantravelHomePage data={data} /> : null}

      {activePage === "packages" ? (
        <WantravelPackagesPage data={data} />
      ) : null}

      {activePage === "process" ? (
        <WantravelHowItWorksPage data={data} />
      ) : null}

      {activePage === "reviews" ? <WantravelReviewsPage data={data} /> : null}

      <WantravelFooter data={data} />
    </div>
  );
}