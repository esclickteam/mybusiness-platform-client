import type { ApprovedWhatsAppTemplate } from "../../../../api/whatsappApi";
import i18n from "../../../../i18n/i18n";
import { getManagedTemplateDisplayName } from "./whatsappAutomationMetaTemplates";

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
  const managedDisplay = getManagedTemplateDisplayName(meta);
  if (managedDisplay) return managedDisplay;
  return humanizeWhatsAppTemplateName(meta) || meta || "—";
}

export function formatWhatsAppTemplateLanguage(language = ""): string {
  const lang = String(language || "").toLowerCase().replace(/-/g, "_");
  if (lang.startsWith("he")) return i18n.t("leftover.waTemplate.he", "Hebrew");
  if (lang.startsWith("en")) return i18n.t("leftover.waTemplate.en", "English");
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
  if (meta === "MARKETING") return i18n.t("leftover.waTemplate.marketing", "Marketing");
  if (meta === "UTILITY") return i18n.t("leftover.waTemplate.utility", "Utility");
  if (meta === "AUTHENTICATION") return i18n.t("leftover.waTemplate.auth", "Authentication");
  const local = String(template?.category || "").trim();
  return local || "—";
}

export function formatWhatsAppVariableCountLabel(count = 0): string {
  const n = Number(count) || 0;
  if (n <= 0) return "";
  if (n === 1) return i18n.t("leftover.waTemplate.oneVar", "1 variable");
  return i18n.t("leftover.waTemplate.manyVars", "{{count}} variables", { count: n });
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

/** Tenant/business templates that Automations cannot send yet. */
export function getTenantTemplateNotSendable() {
  return i18n.t(
    "leftover.waTemplate.tenantNotSendable",
    "Available in the business WhatsApp account — sending business templates from automations is not available yet."
  );
}

export function getSavedTemplateNotApproved() {
  return i18n.t(
    "leftover.waTemplate.notApproved",
    "The template is not approved right now and cannot be sent."
  );
}

export const TENANT_TEMPLATE_NOT_SENDABLE_HE = getTenantTemplateNotSendable;
export const SAVED_TEMPLATE_NOT_APPROVED_HE = getSavedTemplateNotApproved;

/** True only for templates that Automations can newly select and send today. */
export function isAutomationSendableTemplate(
  template: Partial<ApprovedWhatsAppTemplate> | null | undefined
): boolean {
  if (!template) return false;
  if (template.isTestTemplate) return false;
  if (template.automationSendable === false) return false;
  return true;
}

/** Guard: do not persist a new selection that the engine cannot send. */
export function canPersistAutomationTemplateSelection(
  template: Partial<ApprovedWhatsAppTemplate> | null | undefined
): boolean {
  return isAutomationSendableTemplate(template);
}

/**
 * Picker rows: sendable first, then disabled tenant/business-only templates.
 * Test templates are excluded entirely.
 */
export function listAutomationPickerTemplates<
  T extends Partial<ApprovedWhatsAppTemplate>,
>(templates: T[]): T[] {
  const rows = (Array.isArray(templates) ? templates : []).filter(
    (tpl) => !tpl.isTestTemplate
  );
  const sendable = rows.filter((tpl) => isAutomationSendableTemplate(tpl));
  const disabled = rows.filter((tpl) => !isAutomationSendableTemplate(tpl));
  return [...sendable, ...disabled];
}

export type AutomationTemplateWarningKind =
  | "none"
  | "not_approved"
  | "tenant_not_sendable";

export function resolveAutomationTemplateWarning(opts: {
  value?: string;
  selected?: Partial<ApprovedWhatsAppTemplate> | null;
  templates?: Array<Partial<ApprovedWhatsAppTemplate>>;
  savedMeta?: {
    templateId?: string;
    metaTemplateName?: string;
  };
}): { kind: AutomationTemplateWarningKind; message: string } {
  const value = String(opts.value || opts.savedMeta?.templateId || "").trim();
  const savedName = String(opts.savedMeta?.metaTemplateName || "").trim();
  if (!value && !savedName) {
    return { kind: "none", message: "" };
  }

  const selected = opts.selected || null;
  if (selected && isAutomationSendableTemplate(selected)) {
    return { kind: "none", message: "" };
  }

  if (selected && selected.automationSendable === false) {
    return {
      kind: "tenant_not_sendable",
      message: getTenantTemplateNotSendable(),
    };
  }

  const match =
    (opts.templates || []).find((tpl) => String(tpl._id) === value) || null;
  if (match && match.automationSendable === false) {
    return {
      kind: "tenant_not_sendable",
      message: getTenantTemplateNotSendable(),
    };
  }

  if (value || savedName) {
    return {
      kind: "not_approved",
      message: getSavedTemplateNotApproved(),
    };
  }

  return { kind: "none", message: "" };
}
