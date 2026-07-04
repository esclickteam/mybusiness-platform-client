import React, { useMemo, useRef } from "react";

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

function getActiveWantravelPage(props: WantravelPagesProps): WantravelPageKey {
  const raw =
    normalizePageValue(props.selectedPageId) ||
    normalizePageValue(props.pageId) ||
    normalizePageValue(props.selectedPageSlug) ||
    normalizePageValue(props.pageSlug);

  if (raw.includes("packages")) return "packages";
  if (raw.includes("how-it-works") || raw.includes("process")) {
    return "process";
  }
  if (raw.includes("reviews") || raw.includes("testimonials")) {
    return "reviews";
  }

  return "home";
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

  const activePage = getActiveWantravelPage(props);

  useWantravelMotion(rootRef, activePage);

  return (
    <div
      ref={rootRef}
      dir="rtl"
      data-template-id="wantravel"
      className="wan-page"
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