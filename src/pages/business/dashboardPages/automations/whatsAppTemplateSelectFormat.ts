import type { ApprovedWhatsAppTemplate } from "../../../../api/whatsappApi";

/** Humanize snake_case Meta names for UI-only fallback. */
export function humanizeWhatsAppTemplateName(metaTemplateName = ""): string {
  const raw = String(metaTemplateName || "").trim();
  if (!raw) return "";
  return raw
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export function resolveWhatsAppTemplateDisplayName(
  template: Partial<ApprovedWhatsAppTemplate> | null | undefined
): string {
  const meta = String(template?.metaTemplateName || "").trim();
  const candidates = [
    (template as { displayName?: string } | null | undefined)?.displayName,
    template?.friendlyName,
    (template as { title?: string } | null | undefined)?.title,
    template?.name,
  ];
  for (const candidate of candidates) {
    const value = String(candidate || "").trim();
    if (!value) continue;
    if (meta && value.toLowerCase() === meta.toLowerCase()) continue;
    return value;
  }
  return humanizeWhatsAppTemplateName(meta) || meta || "—";
}

export function formatWhatsAppTemplateLanguage(language = ""): string {
  const lang = String(language || "").toLowerCase().replace(/-/g, "_");
  if (lang.startsWith("he")) return "עברית";
  if (lang.startsWith("en")) return "English";
  if (lang.startsWith("ar")) return "العربية";
  if (lang.startsWith("fr")) return "Français";
  if (lang.startsWith("es")) return "Español";
  if (lang.startsWith("de")) return "Deutsch";
  if (lang.startsWith("it")) return "Italiano";
  return String(language || "").trim() || "—";
}

export function formatWhatsAppTemplateCategory(
  template: Partial<ApprovedWhatsAppTemplate> | null | undefined
): string {
  if (template?.categoryLabelHe) return String(template.categoryLabelHe);
  const meta = String(template?.metaCategory || "").toUpperCase();
  if (meta === "MARKETING") return "שיווק";
  if (meta === "UTILITY") return "שירות";
  if (meta === "AUTHENTICATION") return "אימות";
  const local = String(template?.category || "").trim();
  return local || "—";
}

export function formatWhatsAppVariableCountLabel(count = 0): string {
  const n = Number(count) || 0;
  if (n <= 0) return "";
  if (n === 1) return "1 משתנה";
  return `${n} משתנים`;
}

export function buildWhatsAppTemplateSecondaryLine(
  template: Partial<ApprovedWhatsAppTemplate> | null | undefined
): string {
  if (template?.displaySecondary) return String(template.displaySecondary);
  const parts = [
    String(template?.metaTemplateName || "").trim(),
    template?.languageLabelHe ||
      formatWhatsAppTemplateLanguage(String(template?.language || "")),
    formatWhatsAppTemplateCategory(template),
  ].filter(Boolean);
  const vars = formatWhatsAppVariableCountLabel(
    Number(template?.variableCount) ||
      (Array.isArray(template?.variables) ? template!.variables!.length : 0)
  );
  if (vars) parts.push(vars);
  return parts.join(" · ");
}

export function buildWhatsAppTemplateSearchText(
  template: Partial<ApprovedWhatsAppTemplate> | null | undefined
): string {
  return [
    resolveWhatsAppTemplateDisplayName(template),
    template?.metaTemplateName,
    template?.languageLabelHe,
    formatWhatsAppTemplateLanguage(String(template?.language || "")),
    formatWhatsAppTemplateCategory(template),
    template?.metaCategory,
    template?.category,
  ]
    .map((v) => String(v || "").toLowerCase())
    .join(" ");
}

export function filterWhatsAppTemplatesByQuery<
  T extends Partial<ApprovedWhatsAppTemplate>,
>(templates: T[], query: string): T[] {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return templates;
  return templates.filter((tpl) =>
    buildWhatsAppTemplateSearchText(tpl).includes(q)
  );
}
