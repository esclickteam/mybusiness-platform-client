type TranslateFn = (
  key: string,
  options?: { defaultValue?: string },
) => string;

export type LocalTemplateCopySource = {
  key: string;
  name: string;
  description: string;
  triggerLabel: string;
  resultLabels: string[];
};

export type LocalTemplateCopy = {
  name: string;
  description: string;
  triggerLabel: string;
  resultLabels: string[];
};

export function localTemplateCopy(
  t: TranslateFn,
  template: LocalTemplateCopySource,
): LocalTemplateCopy {
  return {
    name: t(`automations.local.${template.key}.name`, {
      defaultValue: template.name,
    }),
    description: t(`automations.local.${template.key}.description`, {
      defaultValue: template.description,
    }),
    triggerLabel: t(`automations.local.${template.key}.trigger`, {
      defaultValue: template.triggerLabel,
    }),
    resultLabels: template.resultLabels.map((label, index) =>
      t(`automations.local.${template.key}.result${index + 1}`, {
        defaultValue: label,
      }),
    ),
  };
}
