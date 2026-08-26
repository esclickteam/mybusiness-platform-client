import {
  extractEmbeddedSignupEnteredPhone,
  normalizeEnteredSignupPhone,
  splitE164ForMetaPrefill,
} from "./embeddedSignupEnteredPhone";

describe("embeddedSignupEnteredPhone", () => {
  it("normalizes the number the user typed, including Israeli local form", () => {
    expect(normalizeEnteredSignupPhone("+972555072093")).toEqual({
      e164: "+972555072093",
      digits: "972555072093",
    });
    expect(normalizeEnteredSignupPhone("0555072093")).toEqual({
      e164: "+972555072093",
      digits: "972555072093",
    });
    expect(normalizeEnteredSignupPhone("")).toBeNull();
    expect(normalizeEnteredSignupPhone("123")).toBeNull();
  });

  it("splits E.164 for Meta extras.setup.business.phone prefill", () => {
    expect(splitE164ForMetaPrefill("+972555072093")).toEqual({
      code: 972,
      number: "555072093",
    });
    expect(splitE164ForMetaPrefill("short")).toBeNull();
  });

  it("does not invent a phone from official FINISH / CANCEL payloads", () => {
    expect(
      extractEmbeddedSignupEnteredPhone({
        type: "WA_EMBEDDED_SIGNUP",
        event: "FINISH",
        data: {
          phone_number_id: "123",
          waba_id: "456",
          business_id: "789",
        },
      })
    ).toBe("");
    expect(
      extractEmbeddedSignupEnteredPhone({
        type: "WA_EMBEDDED_SIGNUP",
        event: "CANCEL",
        data: { current_step: "PHONE_NUMBER_VERIFICATION" },
      })
    ).toBe("");
  });

  it("reads an unofficial phone field when Meta actually sends one", () => {
    expect(
      extractEmbeddedSignupEnteredPhone({
        type: "WA_EMBEDDED_SIGNUP",
        event: "FINISH",
        data: { display_phone_number: "+972555072093" },
      })
    ).toBe("+972555072093");
  });
});
