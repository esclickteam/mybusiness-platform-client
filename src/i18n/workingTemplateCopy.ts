type TranslateFn = (
  key: string,
  options?: { defaultValue?: string },
) => string;

export type WorkingTemplateCopySource = {
  key: string;
  name: string;
  description: string;
  triggerLabel: string;
  resultLabels: string[];
  keywords?: string[];
};

export type WorkingTemplateCopy = {
  name: string;
  description: string;
  triggerLabel: string;
  resultLabels: string[];
};

export function workingTemplateCopy(
  t: TranslateFn,
  template: WorkingTemplateCopySource,
): WorkingTemplateCopy {
  return {
    name: t(`automations.working.${template.key}.name`, {
      defaultValue: template.name,
    }),
    description: t(`automations.working.${template.key}.description`, {
      defaultValue: template.description,
    }),
    triggerLabel: t(`automations.working.${template.key}.trigger`, {
      defaultValue: template.triggerLabel,
    }),
    resultLabels: template.resultLabels.map((label, index) =>
      t(`automations.working.${template.key}.result${index + 1}`, {
        defaultValue: label,
      }),
    ),
  };
}

export function workingTemplateSearchHaystack(
  t: TranslateFn,
  template: WorkingTemplateCopySource,
): string {
  const copy = workingTemplateCopy(t, template);
  return [
    copy.name,
    copy.description,
    copy.triggerLabel,
    copy.resultLabels.join(" "),
    template.name,
    template.description,
    template.triggerLabel,
    template.resultLabels.join(" "),
    ...(template.keywords || []),
  ].join(" ");
}
