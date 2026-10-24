import { describe, expect, it } from "vitest";
import {
  composeWhatsAppPhone,
  displayWhatsAppNumber,
  findLinkedNumber,
  isWhatsAppConversionLocation,
  numbersEqual,
  splitPhoneInput,
  toWhatsAppDigits,
} from "./pageWhatsAppNumber";

describe("pageWhatsAppNumber", () => {
  it("treats WhatsApp as its own conversion location", () => {
    expect(isWhatsAppConversionLocation("WhatsApp")).toBe(true);
    expect(isWhatsAppConversionLocation("Instant forms")).toBe(false);
  });

  it("normalizes Israeli local numbers to 972", () => {
    expect(toWhatsAppDigits("051-557-3699")).toBe("972515573699");
    expect(composeWhatsAppPhone({ iso: "IL", dial: "972", label: "Israel" }, "555039072")).toBe(
      "972555039072"
    );
  });

  it("splits an international number back into country and national parts", () => {
    expect(splitPhoneInput("+972515573699")).toEqual({
      country: expect.objectContaining({ dial: "972" }),
      national: "515573699",
    });
  });

  it("finds a linked number without treating a different page number as selected", () => {
    const numbers = [
      {
        id: "972515573699",
        phone: "972515573699",
        displayNumber: "+972 51-557-3699",
        linkedToPage: true,
      },
    ];
    expect(findLinkedNumber(numbers, "0515573699")?.phone).toBe("972515573699");
    expect(findLinkedNumber(numbers, "0555039072")).toBeNull();
    expect(numbersEqual("972515573699", "+972 51-557-3699")).toBe(true);
    expect(displayWhatsAppNumber("972515573699")).toContain("+972");
  });
});
