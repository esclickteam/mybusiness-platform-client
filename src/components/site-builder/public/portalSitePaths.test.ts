import { describe, expect, it } from "vitest";

import { detectPortalPageKind, resolvePortalPaths } from "./portalSitePaths";

function pageWithAttributes(slug: string, kind: string) {
  return {
    id: `page_${slug}`,
    slug,
    data: {
      __attributes: {
        "some.element.id": { "data-bizuply-portal-kind": kind },
      },
    },
  };
}

describe("detectPortalPageKind", () => {
  it("reads the widget kind from saved attributes", () => {
    expect(detectPortalPageKind(pageWithAttributes("login-02", "portal-login"))).toBe(
      "portal-login",
    );
  });

  it("falls back to the inserted section library id", () => {
    expect(
      detectPortalPageKind({
        slug: "account-03",
        data: {
          __insertedSections: {
            sec_1: { libraryId: "section-portal-account-03" },
          },
        },
      }),
    ).toBe("portal-account");
  });

  it("falls back to the library page template id", () => {
    // page-portal-11..20 are the register templates.
    expect(
      detectPortalPageKind({
        slug: "whatever",
        data: { __libraryPageTemplateId: "page-portal-12" },
      }),
    ).toBe("portal-register");
  });

  it("returns empty for a normal page", () => {
    expect(detectPortalPageKind({ slug: "about", data: {} })).toBe("");
  });
});

describe("resolvePortalPaths", () => {
  it("uses the real numbered slugs of the published portal pages", () => {
    const site = {
      pages: [
        { id: "home", slug: "", isHome: true, data: {} },
        { id: "about", slug: "about", data: {} },
        pageWithAttributes("login-02", "portal-login"),
        pageWithAttributes("register", "portal-register"),
        pageWithAttributes("account-02", "portal-account"),
      ],
    };

    expect(resolvePortalPaths(site)).toEqual({
      login: "/login-02",
      register: "/register",
      account: "/account-02",
      orders: "/account-02",
      cart: "/account-02",
    });
  });

  it("falls back to the portal gate routes when no page exists", () => {
    const paths = resolvePortalPaths({ pages: [{ id: "home", slug: "" }] });

    expect(paths.login).toBe("/portal/login");
    expect(paths.account).toBe("/portal/account");
    expect(paths.register).toBe("/portal/login");
  });

  it("never resolves a portal page to the home path", () => {
    const paths = resolvePortalPaths({
      pages: [
        { id: "home", slug: "", isHome: true, data: {} },
        pageWithAttributes("login", "portal-login"),
      ],
    });

    expect(paths.login).toBe("/login");
    expect(paths.account).not.toBe("/");
  });
});
