import { describe, expect, it } from "vitest";
import {
  buildCloudApiEmbeddedSignupExtras,
  buildCoexistenceEmbeddedSignupExtras,
  isCoexistenceFinishEvent,
} from "./embeddedSignupCoexistence";
import { extractEmbeddedSignupSessionAssets } from "./embeddedSignupSessionAssets";

describe("embeddedSignupCoexistence extras", () => {
  it("keeps the regular Cloud API extras empty", () => {
    const extras = buildCloudApiEmbeddedSignupExtras("+972501234567");
    expect(extras.featureType).toBe("");
    expect(extras.sessionInfoVersion).toBe("3");
  });

  it("uses Embedded Signup v5 extras without featureType", () => {
    const extras = buildCoexistenceEmbeddedSignupExtras("+972501234567");
    expect(extras).toEqual({
      version: "v5",
      setup: {
        business: { phone: { code: 972, number: "501234567" } },
      },
    });
    expect(extras).not.toHaveProperty("featureType");
    expect(extras).not.toHaveProperty("sessionInfoVersion");
  });

  it("recognizes the Coexistence finish event", () => {
    expect(
      isCoexistenceFinishEvent("FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING")
    ).toBe(true);
    expect(isCoexistenceFinishEvent("FINISH")).toBe(false);
  });
});

describe("embeddedSignupSessionAssets coexistence", () => {
  it("captures FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING assets", () => {
    expect(
      extractEmbeddedSignupSessionAssets({
        type: "WA_EMBEDDED_SIGNUP",
        event: "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING",
        data: {
          phone_number_id: "106540352242922",
          waba_id: "102290129340398",
          business_id: "2329417887457253",
        },
      })
    ).toEqual({
      phoneNumberId: "106540352242922",
      wabaId: "102290129340398",
      metaBusinessId: "2329417887457253",
      event: "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING",
      isOnBizApp: false,
      messagingAccountIds: [],
      primaryWaacIds: [],
    });
  });

  it("captures v5 session messaging_account_ids and is_on_biz_app", () => {
    expect(
      extractEmbeddedSignupSessionAssets({
        type: "WA_EMBEDDED_SIGNUP",
        event: "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING",
        data: {
          phone_number_id: "106540352242922",
          messaging_account_ids: ["102290129340398"],
          business_id: "2329417887457253",
          is_on_biz_app: true,
          primary_waac_ids: ["waac-1"],
        },
      })
    ).toEqual({
      phoneNumberId: "106540352242922",
      wabaId: "102290129340398",
      metaBusinessId: "2329417887457253",
      event: "FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING",
      isOnBizApp: true,
      messagingAccountIds: ["102290129340398"],
      primaryWaacIds: ["waac-1"],
    });
  });
});
