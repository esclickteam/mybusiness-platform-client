import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderCookieBannerPaint, trackingChoiceFromCookie } from "./cookieBannerPaint.mjs";

describe("cookie banner first paint", () => {
  it("keeps a saved choice from showing the banner and lets the newest choice win", () => {
    expect(trackingChoiceFromCookie("")).toBe("unknown");
    expect(trackingChoiceFromCookie("bizuply_tracking=essential")).toBe("essential");
    expect(trackingChoiceFromCookie("bizuply_tracking=all")).toBe("all");
    expect(trackingChoiceFromCookie("bizuply_tracking=essential; bizuply_tracking=all")).toBe("all");
    expect(trackingChoiceFromCookie("bizuply_tracking=v2:ad:2026-11-07")).toBe("all");
    expect(trackingChoiceFromCookie("bizuply_tracking=v2:none:2026-11-07")).toBe("essential");
    expect(trackingChoiceFromCookie("bizuply_tracking=all; bizuply_tracking=v2:none:2026-11-07")).toBe("essential");
  });

  it("offers only the Meta Pixel and the real legal pages", () => {
    const hebrew = renderCookieBannerPaint("he");
    expect(hebrew).toContain("השימוש בעוגיות באתר Bizuply");
    expect(hebrew).toContain("אישור כל העוגיות");
    expect(hebrew).toContain("דחיית כל העוגיות הלא חיוניות");
    expect(hebrew).toContain("שמירת העדפות");
    expect(hebrew).toContain("אינה בשימוש");
    expect(hebrew).toContain('role="switch" aria-checked="true" disabled');
    expect(hebrew).toContain('id="bizuply-cookie-advertising"');
    expect(hebrew).toContain('href="/he/privacy#section-8"');
    expect(hebrew).toContain('href="/he/privacy"');
    expect(hebrew).toContain('href="/he/terms"');
    expect(hebrew).toContain("Meta Pixel");
    expect(hebrew).not.toContain("Google Analytics");
    expect(hebrew).toContain("v2:ad:2026-11-07");
    expect(hebrew).toContain("v2:none:2026-11-07");

    const english = renderCookieBannerPaint("en");
    expect(english).toContain('href="/privacy#section-8"');
    expect(english).toContain('href="/terms"');
  });

  it("uses the same critical stylesheet on both shells", () => {
    const root = process.cwd();
    const index = readFileSync(path.join(root, "index.html"), "utf8");
    const marketing = readFileSync(path.join(root, "marketing.html"), "utf8");
    expect(index).toContain('href="/cookie-critical.css"');
    expect(marketing).toContain('href="/cookie-critical.css"');
    expect(readFileSync(path.join(root, "public/cookie-critical.css"), "utf8")).toContain("border-radius: 0");
  });
});
