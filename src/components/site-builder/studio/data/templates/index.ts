import type { ReadyWebsiteTemplateSeed } from "../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "./types";

import { spalcioTemplate } from "./spalcio/meta";
import { velmoraTemplate } from "./velmora/meta";
import { aelineTemplate } from "./aeline/meta";
import { pulsecoreTemplate } from "./pulsecore/meta";
import { lunelleTemplate } from "./lunelle/meta";
import { chanelTemplate } from "./chanel/meta";

export const studioTemplateDefinitions: StudioTemplateDefinition[] = [
  spalcioTemplate,
  velmoraTemplate,
  aelineTemplate,
  pulsecoreTemplate,
  lunelleTemplate,
  chanelTemplate,
];

export const studioTemplateSeeds: ReadyWebsiteTemplateSeed[] =
  studioTemplateDefinitions.map((template) => template.seed);

function normalizeTemplateId(value: string | null | undefined): string {
  return String(value || "").trim().toLowerCase();
}

function normalizeCategoryId(value: string | null | undefined): string {
  return String(value || "all").trim().toLowerCase();
}

export function getStudioTemplateById(
  templateId: string | null | undefined,
): StudioTemplateDefinition | undefined {
  const cleanTemplateId = normalizeTemplateId(templateId);

  if (!cleanTemplateId) return undefined;

  return studioTemplateDefinitions.find(
    (template) => normalizeTemplateId(template.id) === cleanTemplateId,
  );
}

export function getStudioTemplateSeedById(
  templateId: string | null | undefined,
): ReadyWebsiteTemplateSeed | undefined {
  return getStudioTemplateById(templateId)?.seed;
}

export function getStudioTemplatesByCategory(
  categoryId: string | null | undefined,
): StudioTemplateDefinition[] {
  const cleanCategoryId = normalizeCategoryId(categoryId);

  if (!cleanCategoryId || cleanCategoryId === "all") {
    return studioTemplateDefinitions;
  }

  return studioTemplateDefinitions.filter(
    (template) => normalizeCategoryId(template.category) === cleanCategoryId,
  );
}

export function hasStudioTemplateDefinition(
  templateId: string | null | undefined,
): boolean {
  return Boolean(getStudioTemplateById(templateId));
}

export function getStudioTemplateDefinitionIds(): string[] {
  return studioTemplateDefinitions.map((template) => template.id);
}