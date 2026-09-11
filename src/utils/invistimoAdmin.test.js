import { describe, expect, it } from "vitest";
import {
  INVISTIMO_ADMIN_LABEL,
  INVISTIMO_BUSINESS_ID,
  isInvistimoAdminBusiness,
  workspaceDisplayName,
} from "./invistimoAdmin";

describe("invistimoAdmin branding helpers", () => {
  it("recognizes the Invistimo business id", () => {
    expect(isInvistimoAdminBusiness(INVISTIMO_BUSINESS_ID)).toBe(true);
    expect(isInvistimoAdminBusiness("other")).toBe(false);
  });

  it("labels the Invistimo workspace as Invistimo Admin", () => {
    expect(
      workspaceDisplayName({
        businessId: INVISTIMO_BUSINESS_ID,
        businessName: "Invistimo Support",
        fallbackName: "Support",
      })
    ).toBe(INVISTIMO_ADMIN_LABEL);
  });

  it("keeps other tenants unchanged", () => {
    expect(
      workspaceDisplayName({
        businessId: "abc",
        businessName: "Cafe",
        fallbackName: "Owner",
      })
    ).toBe("Cafe");
  });
});
