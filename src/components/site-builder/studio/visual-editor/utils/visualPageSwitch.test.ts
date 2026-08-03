import { describe, expect, it } from "vitest";

import { VISUAL_SHARED_CHROME_KEY } from "./visualSharedChrome";
import { buildVisualPageSwitchSession } from "./visualPageSwitch";

describe("buildVisualPageSwitchSession", () => {
  it("keeps shared chrome and drops leaving-page body maps", () => {
    const session = buildVisualPageSwitchSession({
      nextPageId: "register",
      previousSession: {
        __siteSlug: "lala",
        __content: { "old.page.text": { text: "should not survive" } },
      },
      snapshot: {
        __siteSlug: "lala",
        __content: {
          "home.header.button.cta": { text: "התחברות", href: "/login" },
          "register.hero.title": { text: "הרשמה" },
        },
        [VISUAL_SHARED_CHROME_KEY]: {
          __content: {
            "chrome.header.button.cta": { text: "התחברות", href: "/login" },
          },
        },
      },
    });

    expect(session.__activePageId).toBe("register");
    expect(session.__siteSlug).toBe("lala");
    expect((session as Record<string, any>).__content).toBeUndefined();
    expect(session[VISUAL_SHARED_CHROME_KEY]).toEqual({
      __content: {
        "chrome.header.button.cta": { text: "התחברות", href: "/login" },
      },
    });
  });
});
