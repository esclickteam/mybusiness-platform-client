import { describe, expect, it } from "vitest";

import {
  isNavMenuLabelElementId,
  resolveSitePageForNavContentElement,
  syncSitePageTitlesIntoVisualData,
} from "./syncNavWithSitePages";
import { VISUAL_SHARED_CHROME_KEY } from "./visualSharedChrome";

describe("nav menu label site page rename", () => {
  const sitePages = [
    { id: "home", title: "ראשי", slug: "home", isHome: true },
    { id: "about", title: "אודות", slug: "about" },
    { id: "contact", title: "צור קשר", slug: "contact" },
  ];

  it("detects header/footer nav label element ids", () => {
    expect(isNavMenuLabelElementId("global.header.nav.0")).toBe(true);
    expect(isNavMenuLabelElementId("chrome.header.nav.1")).toBe(true);
    expect(isNavMenuLabelElementId("global.footer.nav.2")).toBe(true);
    expect(isNavMenuLabelElementId("global.header.cta")).toBe(false);
  });

  it("resolves the site page for an indexed header nav label", () => {
    const data = {
      nav: [
        { page: "home", label: "ראשי", __sitePageId: "home" },
        { page: "about", label: "אודות", __sitePageId: "about" },
      ],
      __content: {
        "global.header.nav.0": { text: "ראשי", sitePageId: "home", href: "/" },
      },
    };

    const matched = resolveSitePageForNavContentElement(
      data,
      "global.header.nav.0",
      sitePages,
    );
    expect(matched?.id).toBe("home");
  });

  it("keeps shared chrome nav labels aligned after a page rename", () => {
    const data = {
      nav: [{ page: "home", label: "ראשי", __sitePageId: "home" }],
      __content: {
        "global.header.nav.0": { text: "ראשי", sitePageId: "home", href: "/" },
      },
      [VISUAL_SHARED_CHROME_KEY]: {
        __content: {
          "chrome.header.nav.0": {
            text: "ראשי",
            sitePageId: "home",
            href: "/",
          },
        },
      },
    };

    const renamedPages = sitePages.map((page) =>
      page.id === "home" ? { ...page, title: "דף הבית" } : page,
    );

    const next = syncSitePageTitlesIntoVisualData(data, renamedPages, {
      previousTitleById: { home: "ראשי" },
    });

    expect(next.__content["global.header.nav.0"].text).toBe("דף הבית");
    expect(
      next[VISUAL_SHARED_CHROME_KEY].__content["chrome.header.nav.0"].text,
    ).toBe("דף הבית");
    expect(next.nav[0].label).toBe("דף הבית");
  });
});