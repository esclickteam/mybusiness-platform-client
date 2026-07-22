import type {
  VisualLibraryCategory,
  VisualLibraryNodeTemplate,
  VisualLibrarySectionTemplate,
} from "./visualLibraryTypes";
import type { PageContent } from "./pageShowcaseBlocks";
import {
  buildCategoryPageNodes,
  getRecipeMeta,
  type ShowcaseCategoryKey,
} from "./pageShowcaseRecipes";

export type { PageContent } from "./pageShowcaseBlocks";
export type { ShowcaseCategoryKey } from "./pageShowcaseRecipes";
export { buildCategoryPageNodes, getRecipeMeta };

/** @deprecated Kept for any legacy imports — prefer buildCategoryPageNodes. */
export type PageLayoutKind =
  | "split"
  | "center"
  | "magazine"
  | "cards"
  | "timeline"
  | "stats"
  | "dark"
  | "lifestyle"
  | "listMedia"
  | "ctaForm";

const LEGACY_KIND_TO_INDEX: Record<PageLayoutKind, number> = {
  split: 0,
  center: 1,
  magazine: 2,
  cards: 3,
  timeline: 4,
  stats: 5,
  dark: 6,
  lifestyle: 7,
  listMedia: 8,
  ctaForm: 9,
};

export function makePageSection(options: {
  id: string;
  category: VisualLibraryCategory;
  title: string;
  previewLayout: string;
  backgroundColor: string;
  minHeight: string;
  thumbnail: string;
  keywords: string[];
  nodes: VisualLibraryNodeTemplate[];
}): VisualLibrarySectionTemplate {
  return {
    id: options.id,
    kind: "section",
    tab: "sections",
    category: options.category,
    title: options.title,
    description: "עמוד מלא בסגנון Wix – קומפוזיציה ייחודית לפי קטגוריה",
    keywords: options.keywords,
    previewLayout: options.previewLayout,
    backgroundColor: options.backgroundColor,
    minHeight: options.minHeight,
    thumbnail: options.thumbnail,
    nodes: options.nodes,
  };
}

/**
 * Legacy adapter: maps old shared layout kinds onto hero recipes.
 * New pages should call buildCategoryPageNodes(category, index, content).
 */
export function buildLayoutNodes(
  kind: PageLayoutKind,
  content: PageContent,
): VisualLibraryNodeTemplate[] {
  return buildCategoryPageNodes("hero", LEGACY_KIND_TO_INDEX[kind], content);
}

export function recipeCategoryFromSectionCategory(
  category: VisualLibraryCategory | string,
): ShowcaseCategoryKey {
  if (category === "portfolio") return "gallery";
  return category as ShowcaseCategoryKey;
}
