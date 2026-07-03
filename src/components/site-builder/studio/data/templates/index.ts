import type { ReadyWebsiteTemplateSeed } from "../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "./types";

import { spalcioTemplate } from "./spalcio/meta";
import { velmoraTemplate } from "./velmora/meta";
import { aelineTemplate } from "./aeline/meta";
import { pulsecoreTemplate } from "./pulsecore/meta";
import { lunelleTemplate } from "./lunelle/meta";

export const studioTemplateDefinitions: StudioTemplateDefinition[] = [
  spalcioTemplate,
  velmoraTemplate,
  aelineTemplate,
  lunelleTemplate,
  pulsecoreTemplate,
];

export const studioTemplateSeeds: ReadyWebsiteTemplateSeed[] =
  studioTemplateDefinitions.map((template) => template.seed);

export function getStudioTemplateById(
  templateId: string,
): StudioTemplateDefinition | undefined {
  const cleanTemplateId = String(templateId || "").trim().toLowerCase();

  if (!cleanTemplateId) return undefined;

  return studioTemplateDefinitions.find(
    (template) =>
      String(template.id || "")
        .trim()
        .toLowerCase() === cleanTemplateId,
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
  const cleanCategoryId = String(categoryId || "all").trim().toLowerCase();

  if (!cleanCategoryId || cleanCategoryId === "all") {
    return studioTemplateDefinitions;
  }

  return studioTemplateDefinitions.filter(
    (template) =>
      String(template.category || "")
        .trim()
        .toLowerCase() === cleanCategoryId,
  );
}