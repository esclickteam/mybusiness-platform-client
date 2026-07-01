import type { ReadyWebsiteTemplateSeed } from "../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "./types";

import { spalcioTemplate } from "./spalcio/meta";
import { velmoraTemplate } from "./velmora/meta";

export const studioTemplateDefinitions: StudioTemplateDefinition[] = [
  spalcioTemplate,
  velmoraTemplate,
];

export const studioTemplateSeeds: ReadyWebsiteTemplateSeed[] =
  studioTemplateDefinitions.map((template) => template.seed);

export function getStudioTemplateById(
  templateId: string,
): StudioTemplateDefinition | undefined {
  return studioTemplateDefinitions.find(
    (template) => template.id === templateId,
  );
}

export function getStudioTemplateSeedById(
  templateId: string,
): ReadyWebsiteTemplateSeed | undefined {
  return getStudioTemplateById(templateId)?.seed;
}

export function getStudioTemplatesByCategory(
  categoryId: string,
): StudioTemplateDefinition[] {
  if (categoryId === "all") {
    return studioTemplateDefinitions;
  }

  return studioTemplateDefinitions.filter(
    (template) => template.category === categoryId,
  );
}
