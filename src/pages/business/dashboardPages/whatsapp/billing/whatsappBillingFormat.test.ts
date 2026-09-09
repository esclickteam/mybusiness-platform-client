import { describe, expect, it } from "vitest";
import {
  formatHeDate,
  formatHeIls,
  formatHeNumber,
  resolveWhatsAppUnitPriceIls,
} from "./whatsappBillingFormat";

describe("whatsappBillingFormat", () => {
  it("formatHeNumber respects locale", () => {
    expect(formatHeNumber(2500, "en-US")).toBe("2,500");
    expect(formatHeNumber(2500, "he-IL")).toMatch(/2.?500/);
  });

  it("formatHeIls keeps currency mark", () => {
    expect(formatHeIls(1.5, "en-US")).toContain("₪");
    expect(formatHeIls(1.5, "en-US")).toContain("1.50");
  });

  it("formatHeDate returns null for invalid", () => {
    expect(formatHeDate(null)).toBeNull();
    expect(formatHeDate("not-a-date")).toBeNull();
  });

  it("resolveWhatsAppUnitPriceIls falls back to default", () => {
    expect(resolveWhatsAppUnitPriceIls(null)).toBe(0.2);
    expect(resolveWhatsAppUnitPriceIls(0.35)).toBe(0.35);
  });
});
