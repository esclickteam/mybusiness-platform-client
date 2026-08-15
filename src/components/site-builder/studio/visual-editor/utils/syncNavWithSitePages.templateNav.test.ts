import { describe, it, expect } from "vitest";

import {
  resolveTemplateNavFromSitePages,
  siteHasNavPage,
} from "./syncNavWithSitePages";

const NESTIQ = [
  { id: "home", label: "Home", slug: "/" },
  { id: "listings", label: "Listings", slug: "/listings" },
  { id: "about", label: "About", slug: "/about" },
  { id: "contact", label: "Contact", slug: "/contact" },
];

describe("resolveTemplateNavFromSitePages", () => {
  it("falls back to template pages when no site pages exist", () => {
    const nav = resolveTemplateNavFromSitePages(NESTIQ, {});
    expect(nav.map((item) => item.id)).toEqual([
      "home",
      "listings",
      "about",
      "contact",
    ]);
  });

  it("uses saved site pages and drops template demo routes", () => {
    const nav = resolveTemplateNavFromSitePages(NESTIQ, {
      __sitePages: [
        { id: "home", title: "Home", slug: "home", isHome: true },
        { id: "page-login", title: "Login", slug: "login" },
        { id: "page-register", title: "Register", slug: "register" },
        { id: "page-account", title: "Account", slug: "account" },
      ],
    });
    expect(nav.map((item) => item.id)).toEqual([
      "home",
      "page-login",
      "page-register",
      "page-account",
    ]);
    expect(nav.some((item) => item.id === "listings")).toBe(false);
  });

  it("hides pages marked hiddenFromMenu", () => {
    const nav = resolveTemplateNavFromSitePages(NESTIQ, {
      __sitePages: [
        { id: "home", title: "Home", isHome: true },
        { id: "secret", title: "Hidden", slug: "secret", hiddenFromMenu: true },
      ],
    });
    expect(nav.map((item) => item.id)).toEqual(["home"]);
  });
});

describe("siteHasNavPage", () => {
  it("returns true in template preview without site pages", () => {
    expect(siteHasNavPage({}, "listings")).toBe(true);
  });

  it("returns false for removed template pages", () => {
    expect(
      siteHasNavPage(
        { __sitePages: [{ id: "home", title: "Home", isHome: true }] },
        "listings",
      ),
    ).toBe(false);
  });
});
