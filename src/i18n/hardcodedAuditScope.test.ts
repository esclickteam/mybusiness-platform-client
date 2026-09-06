import { describe, expect, it } from "vitest";
import {
  classifySourcePath,
  isDefaultSiteContentString,
} from "./hardcodedAuditScope.js";

describe("hardcoded i18n audit scope", () => {
  it("treats Admin-only files as acceptable Hebrew (A)", () => {
    expect(classifySourcePath("pages/admin/AdminsHeader.tsx")).toBe("A");
    expect(classifySourcePath("pages/admin/crm/AdminCrmOverview.tsx")).toBe("A");
    expect(classifySourcePath("components/AdminSoftphone.tsx")).toBe("A");
    expect(classifySourcePath("components/AdminNotifications.tsx")).toBe("A");
    expect(classifySourcePath("components/AdminPushPermissionBanner.tsx")).toBe("A");
  });

  it("treats Employee/Staff-only files as acceptable Hebrew (B)", () => {
    expect(classifySourcePath("pages/staff/StaffDashboard.jsx")).toBe("B");
    expect(classifySourcePath("pages/StaffLogin.jsx")).toBe("B");
  });

  it("treats website templates and default site content as category C", () => {
    expect(
      classifySourcePath("components/site-builder/studio/data/templates/crustora/schema.ts")
    ).toBe("C");
    expect(
      classifySourcePath("pages/business/dashboardPages/automations/workingTemplates.ts")
    ).toBe("C");
  });

  it("treats tests as category D", () => {
    expect(classifySourcePath("i18n/localeCatalogParity.test.ts")).toBe("D");
    expect(classifySourcePath("lib/partnerLabels.ts")).toBe("D");
    expect(classifySourcePath("i18n/businessCategoryLabels.js")).toBe("D");
    expect(classifySourcePath("data/categories.js")).toBe("D");
  });

  it("flags Business, Partner, and Marketer UI as category E", () => {
    expect(classifySourcePath("pages/partner/PartnerDashboard.tsx")).toBe("E");
    expect(classifySourcePath("pages/marketer/MarketerDashboardPage.jsx")).toBe("E");
    expect(classifySourcePath("pages/business/dashboardPages/DashboardPage.tsx")).toBe("E");
    expect(classifySourcePath("components/site-builder/studio/StudioTopbar.tsx")).toBe("E");
  });

  it("treats default site HTML as customer content, not UI chrome", () => {
    expect(
      isDefaultSiteContentString(
        '<div style="font-size:40px;font-weight:900">הכותרת שלך</div>'
      )
    ).toBe(true);
    expect(isDefaultSiteContentString("כותרת ענקית")).toBe(false);
  });
});
