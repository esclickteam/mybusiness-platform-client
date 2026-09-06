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
];

export function classifySourcePath(rel) {
  const r = String(rel || "").replaceAll("\\", "/");
  if (
    r.startsWith("pages/admin/") ||
    r.includes("/pages/admin/") ||
    r.includes("AdminSoftphone") ||
    r.includes("AdminSoftphoneHost")
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
    r.endsWith(".md")
  ) {
    return "D";
  }
  return "E";
}
