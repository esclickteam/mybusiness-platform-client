import { describe, expect, it } from "vitest";
import { getTextDirection } from "../../../i18n/languages";
import { NAV_GROUPS, findNavMatch, isNavItemActive } from "./adminNav";
import { adminNavPaths, adminShellCopy } from "./adminShellCopy";

describe("admin nav active state", () => {
  it("highlights the dashboard only on the dashboard route", () => {
    expect(isNavItemActive("/admin/dashboard", "/admin/dashboard")).toBe(true);
    expect(isNavItemActive("/admin/dashboard", "/admin")).toBe(true);
    expect(isNavItemActive("/admin/dashboard", "/admin/users")).toBe(false);
  });

  it("does not let the CRM overview steal nested CRM screens", () => {
    expect(isNavItemActive("/admin/crm", "/admin/crm")).toBe(true);
    expect(isNavItemActive("/admin/crm", "/admin/crm/customers")).toBe(false);
    expect(isNavItemActive("/admin/crm/customers", "/admin/crm/customers/abc")).toBe(true);
  });

  it("keeps partner list, referrals, and a dossier distinct", () => {
    expect(isNavItemActive("/admin/partners", "/admin/partners")).toBe(true);
    expect(isNavItemActive("/admin/partners", "/admin/partners/referrals")).toBe(false);
    expect(isNavItemActive("/admin/partners/referrals", "/admin/partners/referrals")).toBe(true);
    expect(isNavItemActive("/admin/partners", "/admin/partners/64b0a1")).toBe(true);
  });

  it("picks the most specific breadcrumb", () => {
    expect(findNavMatch("/admin/settings/legal")?.item.path).toBe("/admin/settings/legal");
    expect(findNavMatch("/admin/crm/whatsapp")?.group.id).toBe("whatsapp");
    expect(findNavMatch("/admin/plans")?.group.id).toBe("billing");
    expect(findNavMatch("/admin/saas-deals")?.item.path).toBe("/admin/saas-deals");
  });

  it("translates every admin menu label in Hebrew and English", () => {
    const he = adminShellCopy("he");
    const en = adminShellCopy("en");
    expect(getTextDirection("he")).toBe("rtl");
    expect(getTextDirection("en")).toBe("ltr");
    for (const group of NAV_GROUPS) {
      expect(he.groups[group.id]).toBe(group.label);
      expect(en.groups[group.id]).toBeTruthy();
      expect(en.groups[group.id]).not.toMatch(/[\u0590-\u05FF]/);
      for (const item of group.items) {
        expect(he.items[item.path]).toBe(item.label);
        expect(en.items[item.path]).toBeTruthy();
        expect(en.items[item.path]).not.toMatch(/[\u0590-\u05FF]/);
      }
    }
    expect(adminNavPaths()).toHaveLength(NAV_GROUPS.reduce((sum, group) => sum + group.items.length, 0));
    expect(en.items["/admin/managed-whatsapp"]).toBe("Managed connection");
    expect(en.chrome.search).toBe("Search");
    expect(he.chrome.adminCrumb).toBe("אדמין");
    expect(JSON.stringify(en.chrome)).not.toMatch(/[\u0590-\u05FF]/);
  });
});
