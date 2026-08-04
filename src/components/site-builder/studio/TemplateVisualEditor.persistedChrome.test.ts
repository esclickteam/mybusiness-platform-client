import { describe, expect, it } from "vitest";

import { pickPersistedVisualSnapshot } from "./TemplateVisualEditor";
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
});
