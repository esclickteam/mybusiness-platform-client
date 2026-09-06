import { describe, expect, it } from "vitest";

import {
  mergeVisualData,
  pickPersistedVisualSnapshot,
} from "./TemplateVisualEditor";
import {
  SHARED_CHROME_SCALAR_KEYS,
  VISUAL_SHARED_CHROME_KEY,
  applySharedChromeScalarsToVisualData,
} from "./visual-editor/utils/visualSharedChrome";

describe("TemplateVisualEditor persisted chrome", () => {
  it("keeps __sharedChrome and CTA scalars through remount snapshot pick", () => {
    const source = {
      __content: { "about.hero.text.h1.h1-1": { text: "אודות" } },
      heroPrimaryButton: "התחברות",
      brandName: "Petaluxe",
      [VISUAL_SHARED_CHROME_KEY]: {
        __content: {
          "chrome.header.primaryCta": { text: "התחברות", href: "/login" },
        },
        __scalars: {
          heroPrimaryButton: "התחברות",
        },
      },
    };

    const picked = pickPersistedVisualSnapshot(source);

    expect(picked[VISUAL_SHARED_CHROME_KEY]).toEqual(
      source[VISUAL_SHARED_CHROME_KEY],
    );
    expect(picked.heroPrimaryButton).toBe("התחברות");
    expect(picked.brandName).toBe("Petaluxe");
    expect(SHARED_CHROME_SCALAR_KEYS.includes("heroPrimaryButton")).toBe(true);

    const merged = {
      ...{
        heroPrimaryButton: "תאמו ניסיון",
        brandName: "Petaluxe",
      },
      ...picked,
    };

    const restored = applySharedChromeScalarsToVisualData(merged);
    expect(restored.heroPrimaryButton).toBe("התחברות");
  });

  it("keeps saved visual copy over localized template defaults", () => {
    const defaults = {
      heroTitle: "Welcome",
      brandName: "BizUply",
      __content: { "home.hero.h1": { text: "Welcome" } },
    };
    const saved = {
      heroTitle: "My custom salon",
      brandName: "Petaluxe",
      __content: { "home.hero.h1": { text: "My custom salon" } },
    };

    const merged = mergeVisualData(defaults, saved);
    expect(merged.heroTitle).toBe("My custom salon");
    expect(merged.brandName).toBe("Petaluxe");
    expect(merged.__content["home.hero.h1"].text).toBe("My custom salon");
    expect(mergeVisualData(defaults, undefined).heroTitle).toBe("Welcome");
  });

  it("does not restore default __content when the saved map is empty", () => {
    const defaults = {
      __content: { "home.hero.h1": { text: "Default headline" } },
    };
    const saved = { __content: {} };
    expect(mergeVisualData(defaults, saved).__content).toEqual({});
  });
});
