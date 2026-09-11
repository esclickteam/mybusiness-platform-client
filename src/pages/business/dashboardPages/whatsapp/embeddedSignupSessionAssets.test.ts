import {
  extractEmbeddedSignupSessionAssets,
  embeddedSignupAssetsLogFields,
  isEmbeddedSignupSuccessEvent,
} from "./embeddedSignupSessionAssets";

describe("embeddedSignupSessionAssets", () => {
  it("captures FINISH assets", () => {
    expect(
      extractEmbeddedSignupSessionAssets({
        type: "WA_EMBEDDED_SIGNUP",
        event: "FINISH",
        data: {
          phone_number_id: "111",
          waba_id: "222",
          business_id: "333",
        },
      })
    ).toEqual({
      phoneNumberId: "111",
      wabaId: "222",
      metaBusinessId: "333",
      event: "FINISH",
    });
  });

  it("captures FINISH_OBO_MIGRATION assets without treating it as overwrite", () => {
    const assets = extractEmbeddedSignupSessionAssets({
      type: "WA_EMBEDDED_SIGNUP",
      event: "FINISH_OBO_MIGRATION",
      data: {
        phone_number_id: "999000111222",
        waba_id: "888777666555",
        business_id: "portfolio-1",
      },
    });
    expect(assets).toEqual({
      phoneNumberId: "999000111222",
      wabaId: "888777666555",
      metaBusinessId: "portfolio-1",
      event: "FINISH_OBO_MIGRATION",
    });
    expect(isEmbeddedSignupSuccessEvent("FINISH_OBO_MIGRATION")).toBe(true);
  });

  it("preserves FINISH_ONLY_WABA when waba is present", () => {
    expect(
      extractEmbeddedSignupSessionAssets({
        type: "WA_EMBEDDED_SIGNUP",
        event: "FINISH_ONLY_WABA",
        data: { waba_id: "waba-only", business_id: "biz" },
      })
    ).toEqual({
      phoneNumberId: "",
      wabaId: "waba-only",
      metaBusinessId: "biz",
      event: "FINISH_ONLY_WABA",
    });
  });

  it("fails closed on malformed FINISH_OBO_MIGRATION", () => {
    expect(
      extractEmbeddedSignupSessionAssets({
        type: "WA_EMBEDDED_SIGNUP",
        event: "FINISH_OBO_MIGRATION",
        data: { business_id: "only-portfolio" },
      })
    ).toBeNull();
    expect(
      extractEmbeddedSignupSessionAssets({
        type: "WA_EMBEDDED_SIGNUP",
        event: "FINISH_OBO_MIGRATION",
        data: null,
      })
    ).toBeNull();
    expect(
      extractEmbeddedSignupSessionAssets({
        type: "WA_EMBEDDED_SIGNUP",
        event: "ERROR",
        data: { phone_number_id: "1", waba_id: "2" },
      })
    ).toBeNull();
  });

  it("log fields never include secrets", () => {
    const fields = embeddedSignupAssetsLogFields(
      {
        phoneNumberId: "1300904689773726",
        wabaId: "1795723778519344",
        metaBusinessId: "497710782903804",
        event: "FINISH_OBO_MIGRATION",
      },
      "FINISH_OBO_MIGRATION"
    );
    const serialized = JSON.stringify(fields);
    expect(serialized).not.toMatch(/code|token|pin|secret/i);
    expect(fields.phoneNumberIdSuffix).toBe("773726");
  });
});
