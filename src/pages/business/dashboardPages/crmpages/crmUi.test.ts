import { describe, expect, it } from "vitest";
import { periodChange, toCsv } from "./crmUi";

describe("periodChange", () => {
  it("returns a real percent from two periods", () => {
    expect(periodChange(12, 8)).toEqual({ label: "+50%", dir: "up" });
    expect(periodChange(6, 8)).toEqual({ label: "-25%", dir: "down" });
  });

  it("does not invent a percent when the previous period is zero", () => {
    expect(periodChange(5, 0)).toBeNull();
  });
});

describe("toCsv", () => {
  it("escapes commas and quotes", () => {
    expect(toCsv([["Ada, Lovelace", 'say "hi"']])).toBe(
      `"Ada, Lovelace","say ""hi"""`
    );
  });
});
