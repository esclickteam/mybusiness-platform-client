import { describe, expect, it } from "vitest";
import {
  minorToIlsInput,
  parseIlsInputToMinor,
  validateAmountInput,
} from "./whatsappFundsAmount";

describe("whatsappFundsAmount", () => {
  it("parses free ILS amounts to minor units", () => {
    expect(parseIlsInputToMinor("50")).toBe(5000);
    expect(parseIlsInputToMinor("73")).toBe(7300);
    expect(parseIlsInputToMinor("20.8")).toBe(2080);
    expect(parseIlsInputToMinor("")).toBeNull();
    expect(parseIlsInputToMinor("abc")).toBeNull();
    expect(parseIlsInputToMinor("0")).toBeNull();
    expect(parseIlsInputToMinor("-10")).toBeNull();
  });

  it("round-trips minor to input", () => {
    expect(minorToIlsInput(5000)).toBe("50");
    expect(minorToIlsInput(2080)).toBe("20.8");
  });

  it("validates min top-up", () => {
    expect(validateAmountInput("49", { minMinor: 5000 }).ok).toBe(false);
    expect(validateAmountInput("50", { minMinor: 5000 })).toEqual({
      ok: true,
      minor: 5000,
    });
  });
});
