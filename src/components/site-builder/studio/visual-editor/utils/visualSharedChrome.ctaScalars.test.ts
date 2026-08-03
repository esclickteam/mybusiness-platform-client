import { describe, expect, it } from "vitest";

import {
  applySharedChromeScalarsToVisualData,
  syncHeaderCtaScalarFromChromeText,
  writeSharedChromeIntoVisualData,
} from "./visualSharedChrome";

describe("shared chrome CTA scalars", () => {
  it("syncs heroPrimaryButton when editing an explicit header primaryCta", () => {
    const next = syncHeaderCtaScalarFromChromeText(
      { heroPrimaryButton: "BOOK_TRIAL" },
      "global.header.primaryCta",
      "LOGIN",
      { previousText: "BOOK_TRIAL" },
    );

    expect(next.heroPrimaryButton).toBe("LOGIN");
  });

  it("syncs heroPrimaryButton when previous text matches the current CTA scalar", () => {
    const next = syncHeaderCtaScalarFromChromeText(
      { heroPrimaryButton: "BOOK_TRIAL", brandName: "Petaluxe" },
      "home.header.button.button.button-4",
      "LOGIN",
      { previousText: "BOOK_TRIAL" },
    );

    expect(next.heroPrimaryButton).toBe("LOGIN");
  });

  it("does not treat brand edits as CTA edits", () => {
    const next = syncHeaderCtaScalarFromChromeText(
      { heroPrimaryButton: "BOOK_TRIAL", brandName: "Petaluxe" },
      "home.header.button.button.button-1",
      "Petaluxe Studio",
      { previousText: "Petaluxe" },
    );

    expect(next.heroPrimaryButton).toBe("BOOK_TRIAL");
  });

  it("restores heroPrimaryButton from shared chrome on page switch data", () => {
    const restored = applySharedChromeScalarsToVisualData({
      brandName: "Petaluxe",
      navHome: "HOME",
      navAbout: "ABOUT",
      heroPrimaryButton: "BOOK_TRIAL",
      __sharedChrome: {
        __content: {
          "chrome.header.button.button.button-4": { text: "LOGIN" },
        },
        __scalars: {
          heroPrimaryButton: "LOGIN",
        },
      },
    });

    expect(restored.heroPrimaryButton).toBe("LOGIN");
  });

  it("restores CTA from auto-id chrome content when scalars are missing", () => {
    const restored = applySharedChromeScalarsToVisualData({
      brandName: "Petaluxe",
      navHome: "HOME",
      navAbout: "ABOUT",
      navServices: "SERVICES",
      navBooking: "BOOKING",
      heroPrimaryButton: "BOOK_TRIAL",
      __sharedChrome: {
        __content: {
          "chrome.header.button.button.button-4": { text: "LOGIN" },
        },
      },
    });

    expect(restored.heroPrimaryButton).toBe("LOGIN");
  });

  it("persists heroPrimaryButton into shared chrome scalars on write", () => {
    const root = document.createElement("div");
    root.innerHTML = `
      <header data-section-kind="header">
        <button data-visual-edit-id="global.header.primaryCta">LOGIN</button>
      </header>
    `;

    const saved = writeSharedChromeIntoVisualData(root, {
      heroPrimaryButton: "LOGIN",
      __content: {
        "global.header.primaryCta": { text: "LOGIN" },
      },
    });

    expect(saved.__sharedChrome.__scalars.heroPrimaryButton).toBe("LOGIN");
    expect(saved.__sharedChrome.__content["chrome.header.primaryCta"].text).toBe(
      "LOGIN",
    );
  });
});