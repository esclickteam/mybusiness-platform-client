import {
  assertInvistimoShareAssets,
  evaluateInvistimoShareEvent,
  invistimoShareScreenRequiresAbort,
  isInvistimoShareTenant,
  planInvistimoShareLaunch,
  selectInvistimoShareConfigId,
  INVISTIMO_SHARE_EMBEDDED_SIGNUP_CONFIG_ID,
  INVISTIMO_SHARE_PHONE_NUMBER_ID,
  INVISTIMO_SHARE_PORTFOLIO_ID,
  INVISTIMO_SHARE_WABA_ID,
  PRODUCTION_EMBEDDED_SIGNUP_CONFIG_ID,
  STALE_INVISTIMO_SHARE_PHONE_NUMBER_ID,
} from "./invistimoAccountSharePolicy";
import { INVISTIMO_BUSINESS_ID } from "../../../../utils/invistimoAdmin";

const serverExtras = {
  setup: {
    business: {
      id: INVISTIMO_SHARE_PORTFOLIO_ID,
      phone: { code: 972, number: "515953390" },
    },
    whatsAppBusinessAccount: { id: INVISTIMO_SHARE_WABA_ID },
    preVerifiedPhone: { ids: [INVISTIMO_SHARE_PHONE_NUMBER_ID] },
  },
  featureType: "",
  sessionInfoVersion: "3",
};

describe("Invistimo account-share-only policy", () => {
  it("uses the server phone and keeps the share config off other customers", () => {
    expect(INVISTIMO_SHARE_PHONE_NUMBER_ID).toBe("1325815400610124");
    expect(INVISTIMO_SHARE_PHONE_NUMBER_ID).not.toBe(
      STALE_INVISTIMO_SHARE_PHONE_NUMBER_ID
    );
    const launch = planInvistimoShareLaunch({
      configId: PRODUCTION_EMBEDDED_SIGNUP_CONFIG_ID,
      invistimoAccountShare: { extras: serverExtras },
    });
    expect(launch).toEqual({
      ok: true,
      configId: INVISTIMO_SHARE_EMBEDDED_SIGNUP_CONFIG_ID,
      extras: serverExtras,
    });
    expect(selectInvistimoShareConfigId(PRODUCTION_EMBEDDED_SIGNUP_CONFIG_ID)).toEqual({
      ok: true,
      configId: INVISTIMO_SHARE_EMBEDDED_SIGNUP_CONFIG_ID,
    });
    expect(isInvistimoShareTenant(INVISTIMO_BUSINESS_ID)).toBe(true);
    expect(isInvistimoShareTenant("other")).toBe(false);
  });

  it("does not invent local extras when the server payload is missing or stale", () => {
    expect(planInvistimoShareLaunch({ configId: PRODUCTION_EMBEDDED_SIGNUP_CONFIG_ID })).toEqual({
      ok: false,
      reason: "server_extras_missing",
    });
    const stale = {
      ...serverExtras,
      setup: {
        ...serverExtras.setup,
        preVerifiedPhone: { ids: [STALE_INVISTIMO_SHARE_PHONE_NUMBER_ID] },
      },
    };
    expect(
      planInvistimoShareLaunch({
        configId: PRODUCTION_EMBEDDED_SIGNUP_CONFIG_ID,
        extras: stale,
      })
    ).toEqual({ ok: false, reason: "server_extras_mismatch" });
    expect(selectInvistimoShareConfigId("some-other-config")).toEqual({
      ok: false,
      reason: "config_unrecognized",
    });
  });

  it("allows FINISH and aborts ownership or only-WABA completions", () => {
    expect(evaluateInvistimoShareEvent("FINISH").allowComplete).toBe(true);
    expect(evaluateInvistimoShareEvent("FINISH_OBO_MIGRATION").abort).toBe(true);
    expect(evaluateInvistimoShareEvent("FINISH_ONLY_WABA").abort).toBe(true);
    expect(evaluateInvistimoShareEvent("CANCEL").abort).toBe(true);
  });

  it("rejects the wrong phone or portfolio and stops on Meta transfer copy", () => {
    expect(
      assertInvistimoShareAssets({
        phoneNumberId: INVISTIMO_SHARE_PHONE_NUMBER_ID,
        wabaId: INVISTIMO_SHARE_WABA_ID,
        metaBusinessId: INVISTIMO_SHARE_PORTFOLIO_ID,
      })
    ).toEqual({ ok: true });
    expect(
      assertInvistimoShareAssets({
        phoneNumberId: STALE_INVISTIMO_SHARE_PHONE_NUMBER_ID,
        wabaId: INVISTIMO_SHARE_WABA_ID,
        metaBusinessId: INVISTIMO_SHARE_PORTFOLIO_ID,
      }).ok
    ).toBe(false);
    expect(invistimoShareScreenRequiresAbort("Transfer ownership")).toBe(true);
    expect(invistimoShareScreenRequiresAbort("Share existing account")).toBe(
      false
    );
  });
});
