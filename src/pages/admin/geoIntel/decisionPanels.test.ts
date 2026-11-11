import { describe, expect, it } from "vitest";
import { computeDisplayPct, formatUnmeasured } from "./decisionFormat";

describe("decision format helpers", () => {
  it("shows לא נמדד instead of 0 for null", () => {
    expect(formatUnmeasured(null)).toBe("לא נמדד");
    expect(formatUnmeasured(undefined)).toBe("לא נמדד");
    expect(formatUnmeasured(0)).toBe("0");
  });

  it("formats CTR only when measured", () => {
    expect(computeDisplayPct(null)).toBe("לא נמדד");
    expect(computeDisplayPct(0.0617)).toBe("6.2%");
  });
});
