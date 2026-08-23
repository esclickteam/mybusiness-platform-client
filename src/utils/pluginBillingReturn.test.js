import { describe, it, expect, beforeEach } from "vitest";
import {
  clearPluginBillingReturn,
  isAllowedPluginBillingReturn,
  isWebsiteDashboardPath,
  readBillingReturnParam,
} from "./pluginBillingReturn";

describe("pluginBillingReturn", () => {
  beforeEach(() => {
    clearPluginBillingReturn();
  });

  it("reads portal and plugin billing return params", () => {
    expect(readBillingReturnParam("?portalBilling=success")).toBe("success");
    expect(readBillingReturnParam("?pluginBilling=cancel&addon=x")).toBe(
      "cancel"
    );
    expect(readBillingReturnParam("?section=plugins")).toBeNull();
  });

  it("does not allow bare website manage without billing return marker", () => {
    expect(
      isAllowedPluginBillingReturn({
        pathname:
          "/business/abc/dashboard/website/sites/xyz/manage",
        search: "?section=plugins",
      })
    ).toBe(false);
  });

  it("allows Stripe return query and keeps website path after marker", () => {
    expect(
      isAllowedPluginBillingReturn({
        pathname:
          "/business/abc/dashboard/website/sites/xyz/manage",
        search: "?section=plugins&portalBilling=success",
      })
    ).toBe(true);

    expect(
      isAllowedPluginBillingReturn({
        pathname:
          "/business/abc/dashboard/website/sites/xyz/manage",
        search: "?section=plugins",
      })
    ).toBe(true);

    expect(
      isAllowedPluginBillingReturn({
        pathname: "/business/abc/dashboard/crm",
        search: "",
      })
    ).toBe(false);
  });

  it("detects website dashboard paths", () => {
    expect(
      isWebsiteDashboardPath("/business/x/dashboard/website/sites/y/manage")
    ).toBe(true);
    expect(isWebsiteDashboardPath("/business/x/dashboard/crm")).toBe(false);
  });
});