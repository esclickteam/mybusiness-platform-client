import { describe, expect, it } from "vitest";

import { resolveSitePageForHeaderNavDomEdit } from "./syncNavWithSitePages";

describe("resolveSitePageForHeaderNavDomEdit", () => {
  const sitePages = [
    { id: "home", title: "HOME_PAGE", slug: "home", isHome: true },
    { id: "about", title: "ABOUT", slug: "about" },
    { id: "services", title: "SERVICES", slug: "services" },
    { id: "booking", title: "BOOKING", slug: "booking" },
  ];

  it("resolves by previous label text", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <header data-section-kind="header">
        <nav>
          <button data-visual-edit-id="home.header.button.button-1">HOME_PAGE</button>
          <button data-visual-edit-id="home.header.button.button-2">ABOUT</button>
        </nav>
      </header>
    `;

    const matched = resolveSitePageForHeaderNavDomEdit(
      root,
      "home.header.button.button-1",
      sitePages,
      { previousText: "HOME_PAGE" },
    );

    expect(matched?.id).toBe("home");
  });

  it("resolves by index in the header nav when titles differ", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <header data-section-kind="header">
        <nav>
          <button data-visual-edit-id="global.header.nav.0">HOME</button>
          <button data-visual-edit-id="global.header.nav.1">ABOUT</button>
        </nav>
      </header>
    `;

    const matched = resolveSitePageForHeaderNavDomEdit(
      root,
      "global.header.nav.1",
      sitePages,
      { previousText: "OLD_ABOUT" },
    );

    expect(matched?.id).toBe("about");
  });
});