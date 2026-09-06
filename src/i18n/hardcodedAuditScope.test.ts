import { describe, expect, it } from "vitest";
import {
  classifySourcePath,
  isDefaultSiteContentString,
  isNonChromeHebrewHit,
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
    expect(classifySourcePath("pages/manager/EmployeeDashboard.jsx")).toBe("B");
  });

  it("treats website templates and default site content as category C", () => {
    expect(
      classifySourcePath("components/site-builder/studio/data/templates/crustora/schema.ts")
    ).toBe("C");
    expect(
      classifySourcePath("pages/business/dashboardPages/automations/workingTemplates.ts")
    ).toBe("C");
    expect(
      classifySourcePath(
        "components/site-builder/studio/visual-editor/library/sectionLibrary.ts"
      )
    ).toBe("C");
  });

  it("treats tests as category D", () => {
    expect(classifySourcePath("pages/dev/AiAutomationTemplatesVisualPage.tsx")).toBe("D");
    expect(classifySourcePath("i18n/languages.js")).toBe("D");
    expect(classifySourcePath("utils/adminSoftphoneStore.ts")).toBe("A");
    expect(classifySourcePath("i18n/localeCatalogParity.test.ts")).toBe("D");
    expect(classifySourcePath("lib/partnerLabels.ts")).toBe("D");
    expect(classifySourcePath("i18n/businessCategoryLabels.js")).toBe("D");
    expect(classifySourcePath("data/categories.js")).toBe("D");
    expect(
      classifySourcePath(
        "components/website/site-management/payments/paymentProvidersCatalog.ts"
      )
    ).toBe("D");
    expect(
      classifySourcePath("components/site-plugins/countdown/countdownUtils.ts")
    ).toBe("D");
    expect(
      classifySourcePath(
        "pages/business/dashboardPages/automations/aiAutomationCatalog.ts"
      )
    ).toBe("D");
    expect(
      classifySourcePath(
        "pages/business/dashboardPages/automations/templateCategoryMapping.ts"
      )
    ).toBe("D");
    expect(
      classifySourcePath(
        "components/site-builder/studio/visual-editor/library/sectionCategories.ts"
      )
    ).toBe("D");
    expect(
      classifySourcePath(
        "components/site-builder/studio/visual-editor/library/elementLibrary.ts"
      )
    ).toBe("D");
    expect(
      classifySourcePath("guidedDemo/postDemoQuestionnaire/types.ts")
    ).toBe("D");
    expect(classifySourcePath("utils/materializeAiSitePlan.ts")).toBe("D");
    expect(classifySourcePath("utils/syncExistingWebsiteTemplatesToMongo.ts")).toBe("D");
    expect(classifySourcePath("utils/softphoneMicrophone.ts")).toBe("A");
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

  it("does not count matchers, logs, or phrasebook keys as chrome", () => {
    expect(
      isNonChromeHebrewHit('console.error("שגיאה בטעינת העסק:", err);', "שגיאה בטעינת העסק:")
    ).toBe(true);
    expect(
      isNonChromeHebrewHit('if (rawLabel.includes("דפי נחיתה")) return "landing";', "דפי נחיתה")
    ).toBe(true);
    expect(
      isNonChromeHebrewHit('return clean !== "" && clean !== "כללי";', "כללי")
    ).toBe(true);
    expect(
      isNonChromeHebrewHit('label: localizeBuiltInText("סקשן חדש", i18n.language)', "סקשן חדש")
    ).toBe(true);
    expect(
      isNonChromeHebrewHit('<option value="חד צדדי">One-sided</option>', "חד צדדי")
    ).toBe(true);
    expect(
      isNonChromeHebrewHit(
        'const KNOWN_OTHER_LABELS = ["אחר / קטגוריה מותאמת", "Other / custom category"];',
        "אחר / קטגוריה מותאמת"
      )
    ).toBe(true);
    expect(
      isNonChromeHebrewHit(
        'text: `⭐ ביקורת חדשה מ-${clientName}`',
        "⭐ ביקורת חדשה מ-${clientName}"
      )
    ).toBe(false);
  });
});
