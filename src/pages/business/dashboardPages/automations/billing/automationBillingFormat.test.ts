import { describe, expect, it } from "vitest";
import {
  formatHeDate,
  formatHeDateTime,
  formatHeNumber,
  getUsageSeverity,
} from "./automationBillingFormat";

describe("automationBillingFormat", () => {
  it("formatHeNumber formats Basic limit 2,500", () => {
    expect(formatHeNumber(2500)).toBe("2,500");
  });

  it("formatHeNumber formats Growth limit 10,000", () => {
    expect(formatHeNumber(10000)).toBe("10,000");
  });

  it("formatHeNumber falls back to 0 for non-finite", () => {
    expect(formatHeNumber(Number.NaN)).toBe("0");
  });

  it("getUsageSeverity returns normal below 80%", () => {
    expect(getUsageSeverity(0)).toBe("normal");
    expect(getUsageSeverity(79.9)).toBe("normal");
  });

  it("getUsageSeverity returns warn at 80%", () => {
    expect(getUsageSeverity(80)).toBe("warn");
    expect(getUsageSeverity(94.9)).toBe("warn");
  });

  it("getUsageSeverity returns critical at 95%", () => {
    expect(getUsageSeverity(95)).toBe("critical");
    expect(getUsageSeverity(99.9)).toBe("critical");
  });

  it("getUsageSeverity returns exhausted at 100%", () => {
    expect(getUsageSeverity(100)).toBe("exhausted");
    expect(getUsageSeverity(120)).toBe("exhausted");
  });

  it("getUsageSeverity returns normal for invalid percentage", () => {
    expect(getUsageSeverity(null)).toBe("normal");
    expect(getUsageSeverity(undefined)).toBe("normal");
  });

  it("formatHeDate returns null for empty or invalid", () => {
    expect(formatHeDate(null)).toBeNull();
    expect(formatHeDate("not-a-date")).toBeNull();
  });

  it("formatHeDateTime returns a Hebrew label for valid ISO", () => {
    const label = formatHeDateTime("2026-09-01T12:30:00.000Z");
    expect(label).toBeTruthy();
    expect(typeof label).toBe("string");
  });
});
