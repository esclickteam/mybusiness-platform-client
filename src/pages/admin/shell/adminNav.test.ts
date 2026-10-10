import { describe, expect, it } from "vitest";
import { findNavMatch, isNavItemActive } from "./adminNav";

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
  });
});
