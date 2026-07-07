import type { ReadyWebsiteTemplateSeed } from "../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "./types";

import { idoTemplate } from "./ido/meta";
import { spalcioTemplate } from "./spalcio/meta";
import { velmoraTemplate } from "./velmora/meta";
import { aelineTemplate } from "./aeline/meta";
import { pulsecoreTemplate } from "./pulsecore/meta";
import { lunelleTemplate } from "./lunelle/meta";
import { wantravelTemplate } from "./wantravel/meta";
import { lexoraTemplate } from "./lexora/meta";
import { elevoraTemplate } from "./elevora/meta";
import { servoraTemplate } from "./Servora/meta";
import { adionTemplate } from "./adion/meta";
import { adionTemplate as virelloTemplate } from "./Virello/meta";
import { nadlanistTemplate } from "./nadlanist/meta";
import { novastraTemplate } from "./novastra/meta";
import { domoraTemplate } from "./domora/meta";
import { launchoraTemplate } from "./launchora/meta";

export const studioTemplateDefinitions: StudioTemplateDefinition[] = [
  idoTemplate,
  spalcioTemplate,
  velmoraTemplate,
  aelineTemplate,
  pulsecoreTemplate,
  lunelleTemplate,
  wantravelTemplate,
  lexoraTemplate,
  elevoraTemplate,
  servoraTemplate,
  adionTemplate,
  virelloTemplate,
  nadlanistTemplate,
  novastraTemplate,
  domoraTemplate,
  launchoraTemplate,
];

export const studioTemplateSeeds: ReadyWebsiteTemplateSeed[] =
  studioTemplateDefinitions
    .map((template) => template.seed)
    .filter(Boolean) as ReadyWebsiteTemplateSeed[];

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