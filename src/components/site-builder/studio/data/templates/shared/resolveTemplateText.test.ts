import { describe, expect, it } from "vitest";

import { resolveTemplateTextFromVisualData } from "./resolveTemplateText";

describe("resolveTemplateTextFromVisualData", () => {
  it("prefers page __content over hardcoded children", () => {
    expect(
      resolveTemplateTextFromVisualData("header.cta", {
        __content: { "header.cta": { text: "LOGIN" } },
      }),
    ).toBe("LOGIN");
  });

  it("falls back to shared chrome for header CTA after page switch", () => {
    expect(
      resolveTemplateTextFromVisualData("header.cta", {
        heroPrimaryButton: "BOOK_TRIAL",
        __sharedChrome: {
          __content: {
            "chrome.header.cta": { text: "LOGIN" },
          },
        },
      }),
    ).toBe("LOGIN");
  });

  it("uses CTA scalars when content maps are empty", () => {
    expect(
      resolveTemplateTextFromVisualData("header.cta", {
        headerCta: "LOGIN",
        heroPrimaryButton: "BOOK_TRIAL",
      }),
    ).toBe("LOGIN");
  });

  it("returns null when no override exists so templates keep children", () => {
    expect(
      resolveTemplateTextFromVisualData("header.cta", {
        brandName: "IDO",
      }),
    ).toBeNull();
  });
});