import { describe, expect, it } from "vitest";
import { exclusiveSelectionBlocked } from "./partnerAgreementRules";

describe("exclusive territory selection", () => {
  it("blocks an active exclusive country only for another exclusive agreement", () => {
    const locked = { selectableForExclusive: false };
    const open = { selectableForExclusive: true };
    expect(exclusiveSelectionBlocked("exclusive", locked)).toBe(true);
    expect(exclusiveSelectionBlocked("non_exclusive", locked)).toBe(false);
    expect(exclusiveSelectionBlocked("exclusive", open)).toBe(false);
    expect(exclusiveSelectionBlocked("exclusive", { selectableForExclusive: true })).toBe(false);
  });

  it("does not block a country that only has a draft or sent agreement", () => {
    expect(exclusiveSelectionBlocked("exclusive", { selectableForExclusive: true })).toBe(false);
  });
});
