/** Role-scoped hardcoded-string audit. Admin/Staff Hebrew is not localization debt. */

const C_MARKERS = [
  "/data/templates/",
  "/section-variants/",
  "readyWebsiteTemplates",
  "pageLibrary",
  "Showcase",
  "pageShowcase",
  "sectionCatalogMega",
  "sectionLibraryExtra",
  "readyWebsiteRenderer",
  "workingTemplates.ts",
  "localTemplateGraphs.ts",
  "appointmentConfirmationEmail",
  "leadWelcomeEmail",
  "studio/data/elementLibrary.ts",
  "visual-editor/library/sectionLibrary.ts",
];

export function classifySourcePath(rel) {
  const r = String(rel || "").replaceAll("\\", "/");
  if (
    r.startsWith("pages/admin/") ||
    r.includes("/pages/admin/") ||
    r.includes("AdminSoftphone") ||
    r.includes("AdminSoftphoneHost") ||
    r.includes("AdminNotifications") ||
    r.includes("AdminPushPermission") ||
    r.includes("AdminDialButton") ||
    /(^|\/)components\/Admin[^/]+$/.test(r)
  ) {
    return "A";
  }
  if (
    r.startsWith("pages/staff/") ||
    r === "pages/StaffLogin.jsx" ||
    r.includes("/staff/") ||
    r.includes("StaffSoftphone")
  ) {
    return "B";
  }
  if (C_MARKERS.some((marker) => r.includes(marker))) return "C";
  if (
    r.includes(".test.") ||
    r.includes(".spec.") ||
    r.includes("/__tests__/") ||
    r.endsWith(".css") ||
    r.endsWith(".md") ||
    r.endsWith("partnerLabels.ts") ||
    r.endsWith("businessCategoryLabels.js") ||
    r.endsWith("data/categories.js") ||
    r.endsWith("data/pricingAddonsData.ts") ||
    r.endsWith("data/pricingPackagesData.ts") ||
    r.endsWith("data/pluginEditorRegistry.ts") ||
    r.endsWith("data/sitePluginNav.ts") ||
    r.endsWith("payments/paymentProvidersCatalog.ts") ||
    r.endsWith("countdown/countdownUtils.ts") ||
    r.endsWith("automations/aiAutomationCatalog.ts")
  ) {
    return "D";
  }
  return "E";
}

/** Default customer-site HTML / canvas seed copy is category C, even inside Studio files. */
export function isDefaultSiteContentString(value) {
  const text = String(value || "");
  if (!text) return false;
  if (/<[a-zA-Z][\s\S]*?>/.test(text)) return true;
  if (/<\/[a-zA-Z]/.test(text)) return true;
  return false;
}
