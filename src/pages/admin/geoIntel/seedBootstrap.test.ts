import { describe, expect, it } from "vitest";
import {
  formatSeedResultHe,
  shouldShowSeedInitButton,
} from "./seedBootstrap";

describe("seedBootstrap UI helpers", () => {
  it("shows button when bootstrap missing", () => {
    expect(shouldShowSeedInitButton(null)).toBe(true);
    expect(shouldShowSeedInitButton(undefined)).toBe(true);
  });

  it("hides button when complete or after success", () => {
    expect(shouldShowSeedInitButton({ complete: true })).toBe(false);
    expect(shouldShowSeedInitButton({ buttonVisible: false })).toBe(false);
    expect(shouldShowSeedInitButton({ complete: false }, true)).toBe(false);
  });

  it("shows button when incomplete", () => {
    expect(
      shouldShowSeedInitButton({
        complete: false,
        buttonVisible: true,
        promptCount: 0,
      })
    ).toBe(true);
  });

  it("formats Hebrew seed result from summary", () => {
    expect(
      formatSeedResultHe({
        noteHe: "נוצרו 40 שאלות חדשות · 0 דולגו · 2 מותגים",
      })
    ).toContain("40");
    expect(
      formatSeedResultHe({
        brandCount: 2,
        promptsCreated: 40,
        promptsSkipped: 0,
        promptsTotalNow: 40,
      })
    ).toMatch(/מותגים: 2/);
  });
});
