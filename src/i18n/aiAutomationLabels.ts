import type { AiAutomationTemplate } from "../pages/business/dashboardPages/automations/aiAutomationCatalog";

type TranslateFn = (key: string, options?: { defaultValue?: string }) => string;

export function aiTemplateTitle(
  t: TranslateFn,
  template: Pick<AiAutomationTemplate, "templateKey" | "titleHe">
) {
  return t(`automations.aiTemplates.${template.templateKey}.title`, {
    defaultValue: template.titleHe,
  });
}

export function aiTemplateDescription(
  t: TranslateFn,
  template: Pick<AiAutomationTemplate, "templateKey" | "description">
) {
  return t(`automations.aiTemplates.${template.templateKey}.description`, {
    defaultValue: template.description,
  });
}

export function localizedAutomationName(
  t: TranslateFn,
  key: string | undefined,
  fallback: string
) {
  if (!key) return fallback;
  return t(`automations.aiTemplates.${key}.title`, { defaultValue: fallback });
}

export function aiConfigFieldLabel(
  t: TranslateFn,
  field: { key: string; label: string }
) {
  return t(`automations.aiConfig.${field.key}.label`, {
    defaultValue: field.label,
  });
}

export function aiConfigFieldDefault(
  t: TranslateFn,
  field: { key: string; defaultValue?: unknown }
) {
  const value = field.defaultValue;
  if (typeof value === "string" && value) {
    return t(`automations.aiConfig.${field.key}.default`, {
      defaultValue: value,
    });
  }
  if (Array.isArray(value)) {
    return value.map((item, index) =>
      t(`automations.aiConfig.option${index + 1}`, {
        defaultValue: String(item),
      })
    );
  }
  return value;
}
