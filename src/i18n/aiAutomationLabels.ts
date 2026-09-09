import type { AiAutomationTemplate } from "../pages/business/dashboardPages/automations/aiAutomationCatalog";

type TranslateFn = (key: string, options?: { defaultValue?: string }) => string;

export function aiTemplateTitle(
  t: TranslateFn,
  template: Pick<AiAutomationTemplate, "templateKey" | "titleHe">
) {
  // Catalogs cover en/he/es/pt-BR/ar; avoid leaking Hebrew titleHe into other locales.
  return t(`automations.aiTemplates.${template.templateKey}.title`);
}

export function aiTemplateDescription(
  t: TranslateFn,
  template: Pick<AiAutomationTemplate, "templateKey" | "description">
) {
  return t(`automations.aiTemplates.${template.templateKey}.description`);
}

export function localizedAutomationName(
  t: TranslateFn,
  key: string | undefined,
  fallback: string
) {
  if (!key) return fallback;
  const translated = t(`automations.aiTemplates.${key}.title`);
  return translated === `automations.aiTemplates.${key}.title` ? fallback : translated;
}

export function aiConfigFieldLabel(
  t: TranslateFn,
  field: { key: string; label: string }
) {
  const key = `automations.aiConfig.${field.key}.label`;
  const translated = t(key);
  return translated === key ? field.label : translated;
}

export function aiConfigFieldDefault(
  t: TranslateFn,
  field: { key: string; defaultValue?: unknown }
) {
  const value = field.defaultValue;
  if (typeof value === "string" && value) {
    const key = `automations.aiConfig.${field.key}.default`;
    const translated = t(key);
    return translated === key ? value : translated;
  }
  if (Array.isArray(value)) {
    return value.map((item, index) => {
      const key = `automations.aiConfig.option${index + 1}`;
      const translated = t(key);
      return translated === key ? String(item) : translated;
    });
  }
  return value;
}
