import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renderCookieBannerPaint, renderCookieManagerInner, renderCookieNoticeInner, trackingChoiceFromCookie } from "./cookieBannerPaint.mjs";

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

  it("shows a short notice first and keeps the categories in the manager", () => {
    const hebrew = renderCookieBannerPaint("he");
    const visible = hebrew.split("<script>")[0];
    expect(visible).toContain("הפרטיות שלכם חשובה לנו");
    expect(visible).toContain("אישור כל העוגיות");
    expect(visible).toContain("עוגיות חיוניות בלבד");
    expect(visible).toContain("ניהול עוגיות");
    expect(visible).toContain('href="/he/privacy#section-8"');
    expect(visible).toContain('href="/he/privacy"');
    expect(visible).toContain('href="/he/terms"');
    expect(visible).not.toContain("cookie-banner__cat");
    expect(visible).not.toContain('role="switch"');
    expect(visible).not.toContain("שמירת העדפות");

    const manager = renderCookieManagerInner("he");
    expect(manager).toContain("ניהול העדפות העוגיות");
    expect(manager).toContain("שמירת העדפות");
    expect(manager).toContain("חזרה");
    expect(manager).toContain("אינה בשימוש");
    expect(manager).toContain('role="switch" aria-checked="true" disabled');
    expect(manager).toContain('id="bizuply-cookie-advertising"');
    expect(manager).not.toContain("אישור כל העוגיות");
    expect(manager).not.toContain("עוגיות חיוניות בלבד");
    expect(hebrew).toContain("bizuplyOpenCookieManager");
    expect(hebrew).toContain("v2:ad:2026-11-07");
    expect(hebrew).toContain("v2:none:2026-11-07");
    expect(hebrew).not.toContain("Google Analytics");

    const english = renderCookieNoticeInner("en");
    expect(english).toContain("Your privacy matters to us");
    expect(english).toContain('href="/privacy#section-8"');
    expect(english).toContain('href="/terms"');
    expect(renderCookieManagerInner("ar")).toContain("إدارة تفضيلات ملفات تعريف الارتباط");
    expect(renderCookieNoticeInner("es")).toContain("Solo cookies esenciales");
    expect(renderCookieNoticeInner("pt-BR")).toContain("Somente cookies essenciais");
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
