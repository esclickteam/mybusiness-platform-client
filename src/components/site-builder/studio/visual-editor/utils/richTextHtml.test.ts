import { describe, expect, it } from "vitest";

import {
  applyInlinePatchToHtml,
  hasRichMarkup,
  isInlineCapablePatch,
  pickInlineStylePatch,
  sanitizeRichHtml,
} from "./richTextHtml";

describe("richTextHtml", () => {
  it("keeps only safe inline tags and styles", () => {
    const html = sanitizeRichHtml(
      '<span style="color: red; font-weight: 700" onclick="alert(1)">Hi</span><script>x()</script>',
    );
    expect(html).toContain("color: red");
    expect(html).toContain("font-weight: 700");
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("script");
  });

  it("drops unsafe hrefs", () => {
    const html = sanitizeRichHtml('<a href="javascript:alert(1)">x</a>');
    expect(html).not.toContain("javascript:");
  });

  it("wraps a plain-text range with the requested style", () => {
    const html = applyInlinePatchToHtml("Your Trusted Towing", "Your Trusted Towing", {
      start: 5,
      end: 12,
    }, {
      "font-weight": "700",
      fontWeight: "700",
    });
    expect(hasRichMarkup(html)).toBe(true);
    expect(html).toContain("Trusted");
    expect(html).toContain("font-weight: 700");
  });

  it("treats alignment as element-only", () => {
    expect(isInlineCapablePatch({ "text-align": "center" })).toBe(false);
    expect(isInlineCapablePatch({ "font-weight": "700" })).toBe(true);
    expect(pickInlineStylePatch({ "text-align": "center", color: "#111" })).toEqual({
      color: "#111",
    });
  });
});
