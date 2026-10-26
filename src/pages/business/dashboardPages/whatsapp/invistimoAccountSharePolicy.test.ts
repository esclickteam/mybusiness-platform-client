import {
  assertInvistimoShareAssets,
  buildInvistimoAccountShareExtras,
  evaluateInvistimoShareEvent,
  invistimoShareScreenRequiresAbort,
  isInvistimoShareTenant,
  INVISTIMO_SHARE_PHONE_NUMBER_ID,
  INVISTIMO_SHARE_PORTFOLIO_ID,
  INVISTIMO_SHARE_WABA_ID,
} from "./invistimoAccountSharePolicy";
import { INVISTIMO_BUSINESS_ID } from "../../../../utils/invistimoAdmin";

describe("Invistimo account-share-only policy", () => {
  it("pins extras to the Invistimo portfolio and existing number", () => {
    const extras = buildInvistimoAccountShareExtras();
    expect(extras.setup.business.id).toBe(INVISTIMO_SHARE_PORTFOLIO_ID);
    expect(extras.setup.preVerifiedPhone.ids).toEqual([
      INVISTIMO_SHARE_PHONE_NUMBER_ID,
    ]);
    expect(extras.setup.whatsAppBusinessAccount.id).toBe(INVISTIMO_SHARE_WABA_ID);
    expect(isInvistimoShareTenant(INVISTIMO_BUSINESS_ID)).toBe(true);
    expect(isInvistimoShareTenant("other")).toBe(false);
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
        phoneNumberId: "1",
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
