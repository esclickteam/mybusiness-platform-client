import type { ReadyWebsiteTemplateSeed } from "../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "./types";

import { spalcioTemplate } from "./spalcio/meta";
import { velmoraTemplate } from "./velmora/meta";

function assertTemplateHasEditorPages(
  template: StudioTemplateDefinition
): StudioTemplateDefinition {
  const pages = template.seed?.editor?.pages || [];

  if (!template.id || !template.seed?.id) {
    throw new Error("Studio template is missing id/seed.id");
  }

  if (!pages.length) {
    throw new Error(
      `Template "${template.id}" is missing seed.editor.pages. Do not generate fake template HTML. Add real editor pages to its data file.`
    );
  }

  const homePage = pages.find((page) => page.isHome) || pages[0];

  if (!homePage?.html) {
    throw new Error(
      `Template "${template.id}" home page is missing html inside seed.editor.pages.`
    );
  }

  return template;
}

export const studioTemplateDefinitions: StudioTemplateDefinition[] = [
  spalcioTemplate,
  velmoraTemplate,
].map(assertTemplateHasEditorPages);

export const studioTemplateSeeds: ReadyWebsiteTemplateSeed[] =
  studioTemplateDefinitions.map((template) => template.seed);

export function getStudioTemplateById(
  templateId: string
): StudioTemplateDefinition | undefined {
  return studioTemplateDefinitions.find(
    (template) => template.id === templateId
  );
}

export function getStudioTemplateSeedById(
  templateId: string
): ReadyWebsiteTemplateSeed | undefined {
  return getStudioTemplateById(templateId)?.seed;
}

export function getStudioTemplatesByCategory(
  categoryId: string
): StudioTemplateDefinition[] {
  if (categoryId === "all") {
    return studioTemplateDefinitions;
  }

  return studioTemplateDefinitions.filter(
    (template) => template.category === categoryId
  );
}
