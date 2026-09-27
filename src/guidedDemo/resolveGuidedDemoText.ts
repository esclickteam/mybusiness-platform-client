/**
 * Resolve guided-demo walkthrough copy via i18n, falling back to catalog strings.
 */

import { tourModuleTitle, tourStepText } from "./tourCopy";

type TranslateFn = (key: string, defaultValue?: string) => string;

export function resolveGuidedDemoStepText(
  step: { id?: string; title?: string; instruction?: string } | null | undefined,
  t: TranslateFn,
  language?: string
) {
  const id = String(step?.id || "").trim();
  const localized = id ? tourStepText(id, language) : null;
  if (localized) return localized;
  const title = id
    ? t(`leftover.guided.steps.${id}.title`, step?.title || "")
    : step?.title || "";
  const instruction = id
    ? t(`leftover.guided.steps.${id}.instruction`, step?.instruction || "")
    : step?.instruction || "";
  return { title, instruction };
}

export function resolveGuidedDemoModuleTitle(
  module: { key?: string; title?: string } | null | undefined,
  t: TranslateFn,
  language?: string
) {
  const key = String(module?.key || "").trim();
  if (!key) return module?.title || "";
  const localized = tourModuleTitle(key, language);
  if (localized) return localized;
  return t(`leftover.guided.modules.${key}`, module?.title || "");
}
