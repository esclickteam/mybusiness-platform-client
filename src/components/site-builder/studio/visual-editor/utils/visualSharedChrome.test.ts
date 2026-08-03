import { describe, expect, it } from "vitest";

import {
  canonicalChromeVisualKey,
  expandSharedChromeIntoVisualData,
  writeSharedChromeIntoVisualData,
} from "./visualSharedChrome";

function buildPageRoot(pageId: string, headerButtonId: string) {
  const root = document.createElement("div");
  root.setAttribute("data-visual-page-id", pageId);
  root.innerHTML = `
    <header data-section-kind="header">
      <a data-visual-edit-id="${headerButtonId}" href="/old">כפתור</a>
    </header>
    <section data-section-kind="hero">
      <h1 data-visual-edit-id="${pageId}.hero.text.h1.h1-1">כותרת</h1>
    </section>
  `;
  return root;
}

describe("canonicalChromeVisualKey", () => {
  it("strips the page prefix from auto-generated chrome ids", () => {
    expect(canonicalChromeVisualKey("home.header.button.a.a-1")).toBe(
      "chrome.header.button.a.a-1",
    );
    expect(canonicalChromeVisualKey("about.header.button.a.a-1")).toBe(
      "chrome.header.button.a.a-1",
    );
  });

  it("normalizes explicit template chrome ids", () => {
    expect(canonicalChromeVisualKey("global.header.brand.name")).toBe(
      "chrome.header.brand.name",
    );
    expect(canonicalChromeVisualKey("header.cta")).toBe("chrome.header.cta");
    expect(canonicalChromeVisualKey("global.footer.nav.about")).toBe(
      "chrome.footer.nav.about",
    );
  });

  it("ignores non-chrome ids", () => {
    expect(canonicalChromeVisualKey("home.hero.text.h1.h1-1")).toBe("");
    expect(canonicalChromeVisualKey("")).toBe("");
  });
});

describe("shared chrome round trip", () => {
  it("applies a header edit made on one page to a different page", () => {
    const homeRoot = buildPageRoot("home", "home.header.button.a.a-1");

    const homeData = {
      __content: {
        "home.header.button.a.a-1": { text: "אזור אישי", href: "/login" },
        "home.hero.text.h1.h1-1": { text: "דף הבית" },
      },
    };

    const savedHome = writeSharedChromeIntoVisualData(homeRoot, homeData);

    expect(savedHome.__sharedChrome).toEqual({
      __content: {
        "chrome.header.button.a.a-1": { text: "אזור אישי", href: "/login" },
      },
    });

    // Another page renders the same header with its own generated id.
    const aboutRoot = buildPageRoot("about", "about.header.button.a.a-1");
    const aboutData = {
      __content: { "about.hero.text.h1.h1-1": { text: "אודות" } },
      __sharedChrome: savedHome.__sharedChrome,
    };

    const expanded = expandSharedChromeIntoVisualData(aboutRoot, aboutData);

    expect(expanded.__content["about.header.button.a.a-1"]).toEqual({
      text: "אזור אישי",
      href: "/login",
    });
    expect(expanded.__content["about.hero.text.h1.h1-1"]).toEqual({
      text: "אודות",
    });
  });

  it("keeps page body edits out of the shared chrome map", () => {
    const root = buildPageRoot("home", "home.header.button.a.a-1");

    const saved = writeSharedChromeIntoVisualData(root, {
      __content: { "home.hero.text.h1.h1-1": { text: "רק גוף העמוד" } },
    });

    expect(saved.__sharedChrome).toEqual({});
  });

  it("shares header edits across templates with explicit chrome ids", () => {
    const servoraRoot = document.createElement("div");
    servoraRoot.setAttribute("data-visual-page-id", "home");
    servoraRoot.innerHTML = `
      <header data-template-section-id="global.header">
        <a data-visual-edit-id="global.header.primaryCta" href="/x">קבעו תור</a>
      </header>
    `;

    const saved = writeSharedChromeIntoVisualData(servoraRoot, {
      __content: {
        "global.header.primaryCta": { text: "דברו איתנו", href: "/contact" },
      },
    });

    // ido-style explicit ids resolve to the same canonical chrome key.
    const idoRoot = document.createElement("div");
    idoRoot.setAttribute("data-visual-page-id", "about");
    idoRoot.innerHTML = `
      <header data-section-kind="header">
        <a data-visual-edit-id="header.primaryCta" href="/y">קבעו תור</a>
      </header>
    `;

    const expanded = expandSharedChromeIntoVisualData(idoRoot, {
      __sharedChrome: saved.__sharedChrome,
    });

    expect(expanded.__content["header.primaryCta"]).toEqual({
      text: "דברו איתנו",
      href: "/contact",
    });
  });

  it("removes shared chrome when the edit is cleared on a page that renders it", () => {
    const root = buildPageRoot("home", "home.header.button.a.a-1");

    const saved = writeSharedChromeIntoVisualData(root, {
      __content: {},
      __sharedChrome: {
        __content: {
          "chrome.header.button.a.a-1": { text: "ישן" },
        },
      },
    });

    expect(saved.__sharedChrome).toEqual({});
  });
});
