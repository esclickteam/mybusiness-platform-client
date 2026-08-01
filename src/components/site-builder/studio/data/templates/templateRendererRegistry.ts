/**
 * Public template registry API — lazy by default.
 *
 * The previous eager registry (templateRendererRegistry.eager.ts) statically
 * imported every template and bloated public/gallery/studio chunks (~15MB).
 * Runtime paths load a single template via import.meta.glob instead.
 */

export type {
  StudioTemplateEditorMode,
  StudioTemplateRenderer,
  StudioTemplateRendererPage,
} from "./templateEditorTypes";

export {
  getStudioTemplateRenderer,
  getStudioTemplateRendererKeys,
  hasStudioTemplateRenderer,
  loadStudioTemplateRenderer,
  prefetchStudioTemplateRenderer,
  prefetchStudioTemplateRenderers,
} from "./loadStudioTemplateRenderer";
