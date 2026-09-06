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
    r.endsWith("utils/adminSoftphoneStore.ts") ||
    /(^|\/)components\/Admin[^/]+$/.test(r)
  ) {
    return "A";
  }
  if (
    r.startsWith("pages/staff/") ||
    r.startsWith("pages/manager/") ||
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
    r.startsWith("pages/dev/") ||
    r.includes("/pages/dev/") ||
    r.endsWith("i18n/languages.js") ||
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
    r.endsWith("automations/aiAutomationCatalog.ts") ||
    r.endsWith("automations/templateCategoryMapping.ts") ||
    r.endsWith("automations/runsUiHelpers.ts") ||
    r.endsWith("automations/billing/automationPlanCatalog.ts") ||
    r.endsWith("visual-editor/library/sectionCategories.ts") ||
    r.endsWith("visual-editor/library/sectionCatalogBuilders.ts") ||
    r.endsWith("visual-editor/library/elementLibrary.ts") ||
    r.endsWith("visual-editor/library/lottieLibrary.ts") ||
    r.endsWith("visual-editor/library/extraWebsiteElements.ts") ||
    r.endsWith("visual-editor/library/cardVariants.ts") ||
    r.endsWith("visual-editor/library/carePlanPortalSections.ts") ||
    r.endsWith("visual-editor/library/crmDynamicElementLibrary.ts") ||
    r.endsWith("visual-editor/library/mediaLibrary.ts") ||
    r.endsWith("visual-editor/library/buttonLibrary.ts") ||
    r.endsWith("grapes/grapesBlocks.ts") ||
    r.endsWith("grapes/studioTemplates.ts") ||
    r.endsWith("studio/data/pageTemplates.ts") ||
    r.endsWith("studio/data/themePalettes.ts") ||
    r.endsWith("guidedDemo/postDemoQuestionnaire/types.ts") ||
    r.endsWith("guidedDemo/demoOverlayData.ts") ||
    r.endsWith("i18n/templateSeedPhrasebook.json") ||
    r.endsWith("i18n/localizeBuiltInTemplateSeed.ts")
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
