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
    r.endsWith("utils/softphoneMicrophone.ts") ||
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
    r.endsWith("i18n/localizeBuiltInTemplateSeed.ts") ||
    r.endsWith("grapes/BizuplyWebsiteStudio.tsx") ||
    r.endsWith("grapes/canvasTheme.ts") ||
    r.endsWith("grapes/grapesTheme.ts") ||
    r.endsWith("studio/grapes/initEditor.ts") ||
    r.endsWith("public/PublicVisualSiteRenderer.jsx") ||
    r.endsWith("public/mountPublicLeadForms.js") ||
    r.endsWith("visual-editor/library/pexelsMediaService.ts") ||
    r.endsWith("visual-editor/library/tableBuilder.ts") ||
    r.endsWith("visual-editor/library/libraryFactories.ts") ||
    r.endsWith("visual-editor/library/LottieAnimationBrowser.tsx") ||
    r.endsWith("pages/business/dashboardPages/meta-campaigns/ads-manager/metaLeadFormLocales.ts") ||
    r.endsWith("pages/business/dashboardPages/crmpages/clientSessionConsumption.ts") ||
    r.endsWith("utils/materializeAiSitePlan.ts") ||
    r.endsWith("studio/utils/pageSeoUtils.ts") ||
    r.endsWith("lib/partnerMoney.ts") ||
    r.endsWith("lib/partnerDealMath.ts") ||
    r.endsWith("guidedDemo/adminSendForm.ts") ||
    r.endsWith("visual-editor/utils/visualSelectors.ts") ||
    r.endsWith("visual-editor/utils/applySitePageNavSubmenusToDom.ts") ||
    r.endsWith("visual-editor/utils/bindClientPortalVariables.ts") ||
    r.endsWith("utils/syncExistingWebsiteTemplatesToMongo.ts")
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

/**
 * Hebrew that is not Business/Partner chrome: logs, stored-value matchers,
 * phrasebook lookup keys, and option enum values.
 */
export function isNonChromeHebrewHit(source, value) {
  const text = String(value || "");
  if (!text) return false;
  const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(
      String.raw`console\.(?:error|log|warn|info|debug)\s*\([\s\S]{0,240}['"\`]${escaped}`
    ),
    new RegExp(String.raw`localizeBuiltInText\s*\(\s*['"\`]${escaped}`),
    new RegExp(
      String.raw`\.(?:includes|startsWith|endsWith)\s*\(\s*['"\`]${escaped}`
    ),
    new RegExp(String.raw`(?:===|!==)\s*['"\`]${escaped}`),
    new RegExp(String.raw`['"\`]${escaped}['"\`]\s*(?:===|!==)`),
    new RegExp(String.raw`\bvalue\s*=\s*['"\`]${escaped}['"\`]`),
    new RegExp(
      String.raw`\/(?:\\\/|[^/\n])*${escaped}(?:\\\/|[^/\n])*\/[gimsuy]*`
    ),
    new RegExp(
      String.raw`(?:KNOWN_[A-Z0-9_]+|LEGACY_[A-Z0-9_]+|[A-Z0-9_]+_(?:LABELS|PREFIXES|MATCHERS|ALIASES))\s*=\s*\[[^\]]{0,500}['"\`]${escaped}`
    ),
  ];
  return patterns.some((pattern) => pattern.test(String(source || "")));
}
