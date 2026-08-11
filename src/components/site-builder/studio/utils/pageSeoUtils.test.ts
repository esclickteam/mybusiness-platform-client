import { describe, expect, it } from "vitest";
import {
  isSafeHttpUrl,
  normalizeCanonicalUrl,
  normalizeKeywords,
  normalizePageSeo,
  normalizeSiteSeoSettings,
} from "./pageSeoUtils";

describe("pageSeoUtils hardening", () => {
  it("normalizes keywords: trim, drop empty, dedupe", () => {
    expect(normalizeKeywords("  a , , B, a, b ,C  ")).toBe("a, B, C");
    expect(normalizeSiteSeoSettings({ keywords: " x , , x ,Y " }).keywords).toBe(
      "x, Y",
    );
  });

  it("validates canonical URLs", () => {
    expect(isSafeHttpUrl("https://example.com/page")).toBe(true);
    expect(isSafeHttpUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeHttpUrl("data:text/html,hi")).toBe(false);
    expect(isSafeHttpUrl("file:///tmp")).toBe(false);
    expect(isSafeHttpUrl("not a url")).toBe(false);
    expect(normalizeCanonicalUrl("javascript:alert(1)")).toBe("");
    expect(normalizePageSeo({ canonicalUrl: "javascript:alert(1)" }).canonicalUrl).toBe(
      "",
    );
    expect(normalizePageSeo({ canonicalUrl: "https://ok.example/x" }).canonicalUrl).toBe(
      "https://ok.example/x",
    );
  });
});
