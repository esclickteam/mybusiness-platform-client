import { describe, expect, it } from "vitest";

import {
  isNavMenuLabelElementId,
  resolveBuiltinNavLabelFromSitePages,
  resolveNavLabelFromSitePages,
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

describe("first-load nav label lifecycle", () => {
  it("keeps template label בית when the initial server home title differs", () => {
    const next = syncSitePageTitlesIntoVisualData(
      {
        nav: [{ page: "home", label: "בית", href: "/" }],
        navHome: "בית",
      },
      [{ id: "home", title: "דף הבית", slug: "", isHome: true }],
    );

    expect(next.nav[0].label).toBe("בית");
    expect(next.navHome).toBe("בית");
    expect(next.nav[0].__sitePageId).toBe("home");
  });

  it("keeps template label Shop when the initial server home title is Store", () => {
    const next = syncSitePageTitlesIntoVisualData(
      {
        nav: [{ page: "home", label: "Shop", href: "/" }],
        navHome: "Shop",
      },
      [{ id: "home", title: "Store", slug: "", isHome: true }],
    );

    expect(next.nav[0].label).toBe("Shop");
    expect(next.navHome).toBe("Shop");
  });

  it("updates the nav label after an already-initialized page is renamed", () => {
    const sitePages = [
      { id: "home", title: "Store", slug: "", isHome: true },
    ];
    const initialized = syncSitePageTitlesIntoVisualData(
      { nav: [{ page: "home", label: "Shop", href: "/" }], navHome: "Shop" },
      sitePages,
    );

    const renamed = syncSitePageTitlesIntoVisualData(
      initialized,
      [{ id: "home", title: "Main Store", slug: "", isHome: true }],
      { previousTitleById: { home: "Store" } },
    );

    expect(renamed.nav[0].__sitePageId).toBe("home");
    expect(renamed.nav[0].label).toBe("Main Store");
    expect(renamed.navHome).toBe("Main Store");
  });

  it("keeps a bound nav label when previous titles are empty and the site page title differs", () => {
    const next = syncSitePageTitlesIntoVisualData(
      { navHome: "בית" },
      [{ id: "home", title: "דף הבית", slug: "", isHome: true }],
    );
    expect(next.navHome).toBe("בית");
    expect(
      resolveNavLabelFromSitePages(
        { page: "home", label: next.navHome, href: "/", __sitePageId: "home" },
        next.__sitePages,
        { href: "/" },
      ),
    ).toBe("בית");
  });

  it("leaves anchor, custom, external, mailto, and tel items unchanged", () => {
    const nav = [
      { label: "Home", href: "/" },
      { label: "About", href: "/#about" },
      { label: "Lookbook", href: "/lookbook" },
      { label: "Instagram", href: "https://instagram.com/example" },
      { label: "Email", href: "mailto:hi@example.com" },
      { label: "Call", href: "tel:+15551212" },
    ];
    const next = syncSitePageTitlesIntoVisualData(
      { nav },
      [
        { id: "home", title: "דף הבית", slug: "", isHome: true },
        { id: "products", title: "Products", slug: "products" },
      ],
      { previousTitleById: { home: "Home", products: "Shop" } },
    ).nav;

    expect(next.map((item: any) => [item.label, item.href])).toEqual([
      ["Home", "/"],
      ["About", "/#about"],
      ["Lookbook", "/lookbook"],
      ["Instagram", "https://instagram.com/example"],
      ["Email", "mailto:hi@example.com"],
      ["Call", "tel:+15551212"],
    ]);
    expect(next[1].__sitePageId).toBeFalsy();
    expect(next[2].__sitePageId).toBeFalsy();
    expect(next[3].__sitePageId).toBeFalsy();
    expect(next[4].__sitePageId).toBeFalsy();
    expect(next[5].__sitePageId).toBeFalsy();
  });
});

describe("resolveBuiltinNavLabelFromSitePages", () => {
  const pages = [
    { id: "home", title: "Home page", slug: "", isHome: true },
  ];

  it("keeps the template label when the initial Site Page title differs", () => {
    expect(
      resolveBuiltinNavLabelFromSitePages("home", "Welcome", pages, {
        href: "/",
        boundSitePageId: "home",
      }),
    ).toBe("Welcome");
  });

  it("uses the Site Page title after a real post-init rename", () => {
    expect(
      resolveBuiltinNavLabelFromSitePages(
        "home",
        "Welcome",
        [{ id: "home", title: "Landing", slug: "", isHome: true }],
        {
          href: "/",
          boundSitePageId: "home",
          previousTitleById: { home: "Home page" },
        },
      ),
    ).toBe("Landing");
  });
});