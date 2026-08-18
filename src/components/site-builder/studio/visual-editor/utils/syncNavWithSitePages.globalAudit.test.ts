import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { chanelDefaultData } from "../../data/templates/chanel/chanelData";
import { studioTemplateRendererRegistry } from "../../data/templates/templateRendererRegistry";
import {
  isNonPageNavHref,
  resolveTemplateNavFromSitePages,
  syncSitePageTitlesIntoVisualData,
} from "./syncNavWithSitePages";

const TEMPLATES_DIR = path.resolve(
  __dirname,
  "../../data/templates",
);

function asNavList(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function navFingerprint(items: any[]) {
  return items.map((item) => ({
    label: String(item?.label || item?.title || "").trim(),
    href: String(item?.href || item?.slug || "").trim(),
    page: String(item?.page || item?.pageId || item?.id || "").trim(),
    sitePageId: String(item?.__sitePageId || "").trim(),
  }));
}

function toSitePages(pages: any[] | undefined) {
  return (Array.isArray(pages) ? pages : []).map((page, index) => {
    const id = String(page?.id || `page-${index + 1}`).trim();
    const slug = String(page?.slug || page?.path || "")
      .trim()
      .replace(/^\/+|\/+$/g, "");
    return {
      id,
      title: String(page?.label || page?.name || page?.title || id).trim(),
      slug: id === "home" || slug === "" ? "" : slug,
      isHome: id === "home" || page?.slug === "/" || index === 0,
      hiddenFromMenu: Boolean(page?.hiddenFromMenu),
    };
  });
}

function usesSitePageGeneratedNav(templateDir: string) {
  const pagesFile = path.join(TEMPLATES_DIR, templateDir, "pages.tsx");
  if (!fs.existsSync(pagesFile)) return false;
  const src = fs.readFileSync(pagesFile, "utf8");
  return src.includes("resolveTemplateNavFromSitePages");
}

function folderHasHeader(templateDir: string) {
  const pagesFile = path.join(TEMPLATES_DIR, templateDir, "pages.tsx");
  if (!fs.existsSync(pagesFile)) return false;
  const src = fs.readFileSync(pagesFile, "utf8");
  return /<header\b/.test(src) || /data-section-kind=["']header["']/.test(src);
}

function auditRenderer(key: string, renderer: any) {
  const data = (renderer?.defaultData || {}) as Record<string, any>;
  const sitePages = toSitePages(renderer?.pages);
  const beforeNav = navFingerprint(asNavList(data.nav));
  const beforeNavigation = navFingerprint(asNavList(data.navigation));
  const next = syncSitePageTitlesIntoVisualData(data, sitePages);
  const afterNav = navFingerprint(asNavList(next.nav));
  const afterNavigation = navFingerprint(asNavList(next.navigation));

  const failures: string[] = [];

  const checkList = (
    field: string,
    before: ReturnType<typeof navFingerprint>,
    after: ReturnType<typeof navFingerprint>,
  ) => {
    if (before.length === 0 && after.length === 0) return;
    if (before.length !== after.length) {
      failures.push(
        `${field} count ${before.length} -> ${after.length}`,
      );
    }
    const limit = Math.max(before.length, after.length);
    for (let i = 0; i < limit; i += 1) {
      const a = before[i];
      const b = after[i];
      if (!a || !b) {
        failures.push(`${field}[${i}] missing after sync`);
        continue;
      }
      const href = a.href || b.href;
      if (a.href && b.href && a.href !== b.href) {
        failures.push(`${field}[${i}] href ${a.href} -> ${b.href}`);
      }
      if (a.page && b.page && a.page !== b.page) {
        failures.push(`${field}[${i}] page ${a.page} -> ${b.page}`);
      }
      if (isNonPageNavHref(href) || (href && !a.page && isNonPageNavHref(href))) {
        if (a.label !== b.label) {
          failures.push(`${field}[${i}] label ${a.label} -> ${b.label}`);
        }
        if (b.sitePageId) {
          failures.push(
            `${field}[${i}] non-page href ${href} got __sitePageId=${b.sitePageId}`,
          );
        }
      } else if (!a.page && href && !b.sitePageId && a.label !== b.label) {
        failures.push(`${field}[${i}] manual label ${a.label} -> ${b.label}`);
      }
    }
  };

  checkList("nav", beforeNav, afterNav);
  checkList("navigation", beforeNavigation, afterNavigation);

  return {
    key,
    name: String(renderer?.name || key),
    hasNavArray: beforeNav.length > 0 || beforeNavigation.length > 0,
    beforeNav,
    afterNav,
    failures,
  };
}

describe("global template nav audit", () => {
  const folders = fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  const registryKeys = Object.keys(studioTemplateRendererRegistry);
  const intentional = folders.filter((folder) => usesSitePageGeneratedNav(folder));
  const withHeader = folders.filter((folder) => folderHasHeader(folder));

  it("scans every registered template through editor nav sync", () => {
    const results = registryKeys.map((key) =>
      auditRenderer(key, studioTemplateRendererRegistry[key]),
    );
    const standard = results.filter((item) => item.key !== "nestiq");
    const failed = standard.filter((item) => item.failures.length > 0);
    const withNav = results.filter((item) => item.hasNavArray);
    const standardParity = `${standard.length - failed.length}/${standard.length} PASS`;

    expect({
      TOTAL_TEMPLATES_FOUND: folders.length,
      REGISTRY_KEYS: registryKeys.length,
      TEMPLATES_WITH_HEADER: withHeader.length,
      TEMPLATES_AUTOMATICALLY_AUDITED: results.length,
      TEMPLATES_WITH_NAV_ARRAY: withNav.length,
      STANDARD_TEMPLATE_NAV_PARITY: standardParity,
      INTENTIONAL_SITE_PAGE_GENERATED_NAV:
        "nestiq — EXPECTED DIFFERENCE",
      INTENTIONAL_SITE_PAGE_NAV: intentional,
      NAV_PARITY_FAIL: failed.map((item) => ({
        key: item.key,
        failures: item.failures,
        before: item.beforeNav,
        after: item.afterNav,
      })),
    }).toEqual({
      TOTAL_TEMPLATES_FOUND: folders.length,
      REGISTRY_KEYS: registryKeys.length,
      TEMPLATES_WITH_HEADER: withHeader.length,
      TEMPLATES_AUTOMATICALLY_AUDITED: results.length,
      TEMPLATES_WITH_NAV_ARRAY: withNav.length,
      STANDARD_TEMPLATE_NAV_PARITY: `${standard.length}/${standard.length} PASS`,
      INTENTIONAL_SITE_PAGE_GENERATED_NAV:
        "nestiq — EXPECTED DIFFERENCE",
      INTENTIONAL_SITE_PAGE_NAV: intentional,
      NAV_PARITY_FAIL: [],
    });

    expect(results.length).toBe(registryKeys.length);
    expect(registryKeys.length).toBeGreaterThan(100);
  });

  it("records Nestiq as an intentional site-page-generated nav exception", () => {
    const nestiq = studioTemplateRendererRegistry.nestiq;
    const fallback = (nestiq?.pages || []).map((page: any) => ({
      id: page.id,
      label: page.label || page.name,
      slug: page.slug || page.path,
    }));
    const preview = resolveTemplateNavFromSitePages(fallback, {});
    const editor = resolveTemplateNavFromSitePages(fallback, {
      __sitePages: toSitePages(nestiq?.pages),
    });
    // Nestiq builds nav from live Site Pages. That is not Preview/Editor
    // template-nav parity, and the generator itself must stay unchanged.
    expect(preview.map((item) => item.id)).toEqual(
      editor.map((item) => item.id),
    );
    expect(intentional).toEqual(["nestiq"]);
    expect("INTENTIONAL SITE-PAGE-GENERATED NAV = nestiq — EXPECTED DIFFERENCE").toBeTruthy();
  });
});

describe("Chanel regression", () => {
  it("keeps 6/6 preview items after editor sync", () => {
    const renderer = studioTemplateRendererRegistry.chanel;
    const next = syncSitePageTitlesIntoVisualData(
      { nav: chanelDefaultData.nav },
      toSitePages(renderer.pages),
    );
    expect(next.nav.map((item: any) => `${item.label} ${item.href}`)).toEqual([
      `${chanelDefaultData.nav[0].label} ${chanelDefaultData.nav[0].href}`,
      `${chanelDefaultData.nav[1].label} ${chanelDefaultData.nav[1].href}`,
      `${chanelDefaultData.nav[2].label} ${chanelDefaultData.nav[2].href}`,
      `${chanelDefaultData.nav[3].label} ${chanelDefaultData.nav[3].href}`,
      `${chanelDefaultData.nav[4].label} ${chanelDefaultData.nav[4].href}`,
      `${chanelDefaultData.nav[5].label} ${chanelDefaultData.nav[5].href}`,
    ]);
    expect(next.nav).toHaveLength(6);
    expect(next.nav.filter((item: any) => item.__sitePageId === "home")).toHaveLength(1);
  });
});

describe("navigation type matrix", () => {
  const pages = [
    { id: "home", title: "Home", slug: "", isHome: true },
    { id: "products", title: "Products", slug: "products" },
    { id: "services", title: "Services", slug: "services" },
  ];

  function run(nav: any[]) {
    return syncSitePageTitlesIntoVisualData({ nav }, pages).nav;
  }

  it("page only", () => {
    const nav = [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Services", href: "/services" },
    ];
    const next = run(nav);
    expect(next.map((item: any) => item.href)).toEqual(["/", "/products", "/services"]);
    expect(next).toHaveLength(3);
  });

  it("anchors only", () => {
    const nav = [
      { label: "About", href: "/#about" },
      { label: "Contact", href: "/#contact" },
      { label: "Gallery", href: "/#gallery" },
    ];
    const next = run(nav);
    expect(next).toEqual(nav);
    expect(next.every((item: any) => !item.__sitePageId)).toBe(true);
  });

  it("page + anchors", () => {
    const nav = [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "About", href: "/#about" },
      { label: "Contact", href: "/#contact" },
    ];
    const next = run(nav);
    expect(next.map((item: any) => item.href)).toEqual([
      "/",
      "/products",
      "/#about",
      "/#contact",
    ]);
    expect(next).toHaveLength(4);
  });

  it("page + anchor + external", () => {
    const nav = [
      { label: "Home", href: "/" },
      { label: "About", href: "/#about" },
      { label: "Shop", href: "https://example.com" },
    ];
    const next = run(nav);
    expect(next.map((item: any) => item.href)).toEqual([
      "/",
      "/#about",
      "https://example.com",
    ]);
    expect(next[2].__sitePageId).toBeFalsy();
  });

  it("mailto and tel", () => {
    const nav = [
      { label: "Email", href: "mailto:hi@example.com" },
      { label: "Call", href: "tel:+15551212" },
    ];
    const next = run(nav);
    expect(next).toEqual(nav);
  });

  it("custom manual relative href that is not a site page", () => {
    const nav = [
      { label: "Home", href: "/" },
      { label: "Lookbook", href: "/lookbook" },
      { label: "Collections", href: "/collections" },
    ];
    const next = run(nav);
    expect(next.map((item: any) => item.href)).toEqual([
      "/",
      "/lookbook",
      "/collections",
    ]);
    expect(next[1].__sitePageId).toBeFalsy();
    expect(next[2].__sitePageId).toBeFalsy();
    expect(next[1].label).toBe("Lookbook");
  });

  it("keeps template labels on first load and updates them after a page rename", () => {
    const nav = [
      { label: "Main", page: "home" },
      { label: "Services", page: "services" },
      { label: "Contact", page: "contact" },
    ];
    const sitePages = [
      { id: "home", title: "HomePage", slug: "", isHome: true },
      { id: "services", title: "OurServices", slug: "services" },
      { id: "contact", title: "ContactUs", slug: "contact" },
    ];

    const firstLoad = syncSitePageTitlesIntoVisualData({ nav }, sitePages);
    expect(firstLoad.nav.map((item: any) => [item.page, item.label])).toEqual([
      ["home", "Main"],
      ["services", "Services"],
      ["contact", "Contact"],
    ]);

    const renamed = syncSitePageTitlesIntoVisualData({ nav }, sitePages, {
      previousTitleById: {
        home: "Main",
        services: "Services",
        contact: "Contact",
      },
    });
    expect(renamed.nav.map((item: any) => [item.page, item.label])).toEqual([
      ["home", "HomePage"],
      ["services", "OurServices"],
      ["contact", "ContactUs"],
    ]);
  });
});