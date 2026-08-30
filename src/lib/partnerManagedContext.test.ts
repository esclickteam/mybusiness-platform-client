import { describe, expect, it } from "vitest";
import { shouldAttachManagedBusinessHeader } from "./partnerManagedContext";

describe("shouldAttachManagedBusinessHeader", () => {
  it("does not attach leftover managed context on partner CRM pages", () => {
    expect(
      shouldAttachManagedBusinessHeader({
        pagePath: "/partner/dashboard/crm/6a93d82a5d7bd64fb7e966f6",
        requestUrl: "/partner/clients/6a93d82a5d7bd64fb7e966f6",
      })
    ).toBe(false);
  });

  it("does not attach the header for partner APIs even from another page", () => {
    expect(
      shouldAttachManagedBusinessHeader({
        pagePath: "/business/64f0000000000000000000bb/crm",
        requestUrl: "/partner/clients/6a93d82a5d7bd64fb7e966f6/enter",
      })
    ).toBe(false);
  });

  it("still attaches the header on a managed business workspace", () => {
    expect(
      shouldAttachManagedBusinessHeader({
        pagePath: "/business/64f0000000000000000000bb/crm",
        requestUrl: "/leads",
      })
    ).toBe(true);
  });
});
