import {
  ADMIN_AUTOMATIONS_BASE,
  ADMIN_WHATSAPP_PATH,
  automationBasePath,
  isAdminAutomationHost,
  whatsappConnectPath,
  whatsappSettingsPath,
} from "./automationHostPaths";

describe("automation host paths", () => {
  it("keeps customer automations on the business dashboard", () => {
    expect(automationBasePath("biz-1")).toBe(
      "/business/biz-1/dashboard/automations"
    );
    expect(whatsappSettingsPath("biz-1")).toBe(
      "/business/biz-1/dashboard/whatsapp/settings"
    );
    expect(isAdminAutomationHost("/business/biz-1/dashboard/automations")).toBe(
      false
    );
  });

  it("mounts the same screens under the admin shell and the US connection page", () => {
    expect(automationBasePath("us-biz", ADMIN_AUTOMATIONS_BASE)).toBe(
      "/admin/automations"
    );
    expect(whatsappConnectPath("us-biz", ADMIN_AUTOMATIONS_BASE)).toBe(
      ADMIN_WHATSAPP_PATH
    );
    expect(whatsappSettingsPath("us-biz", ADMIN_AUTOMATIONS_BASE)).toBe(
      ADMIN_WHATSAPP_PATH
    );
    expect(isAdminAutomationHost(ADMIN_AUTOMATIONS_BASE)).toBe(true);
  });
});
