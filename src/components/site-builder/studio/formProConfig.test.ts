import { describe, expect, it } from "vitest";
import {
  conditionMatches,
  isSafeRedirectUrl,
  normalizeCondition,
  normalizeSteps,
} from "./formProConfig";

describe("formProConfig", () => {
  it("normalizes conditions and steps", () => {
    expect(normalizeCondition({ fieldId: "need", operator: "equals", value: "yes" })).toEqual({
      fieldId: "need",
      operator: "equals",
      value: "yes",
    });
    expect(normalizeSteps([{ title: "פרטים" }, { id: "step-2", title: "בחירה" }])).toEqual([
      { id: "step-1", title: "פרטים" },
      { id: "step-2", title: "בחירה" },
    ]);
  });

  it("matches condition operators", () => {
    expect(conditionMatches("yes", { fieldId: "need", operator: "equals", value: "yes" })).toBe(true);
    expect(conditionMatches("no", { fieldId: "need", operator: "notEquals", value: "yes" })).toBe(true);
    expect(conditionMatches("hello world", { fieldId: "q", operator: "contains", value: "world" })).toBe(true);
  });

  it("allows only http(s) or same-origin relative redirects", () => {
    expect(isSafeRedirectUrl("/thanks")).toBe(true);
    expect(isSafeRedirectUrl("https://bizuply.com/thanks")).toBe(true);
    expect(isSafeRedirectUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeRedirectUrl("//evil.example")).toBe(false);
  });
});
