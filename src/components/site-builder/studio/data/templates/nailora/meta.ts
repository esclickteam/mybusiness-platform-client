import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import NailoraPages, { nailoraPages } from "./pages";
import NailoraPreview from "./preview";
import NailoraThumbnail from "./thumbnail";
import { nailoraEditorCss } from "./editorCss";
import { nailoraSchema } from "./schema";
import { nailoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#FF4D8D",
  secondary: "#FFF5F8",
  accent: "#FFB3C7",
  background: "#FFF8FA",
  surface: "#FFFFFF",
  text: "#3D1F2E",
  muted: "#9A6B7C",
  dark: "#2A1220",
};

const blocks = [
  { type: "header", variant: "candyPop-header", title: "header" },
  { type: "hero", variant: "candyPop-hero", title: "hero" },
  { type: "servicesPreview", variant: "candyPop-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "candyPop-ritual", title: "ritual" },
  { type: "gallery", variant: "candyPop-gallery", title: "gallery" },
  { type: "team", variant: "candyPop-team", title: "team" },
  { type: "testimonials", variant: "candyPop-testimonials", title: "testimonials" },
  { type: "packages", variant: "candyPop-packages", title: "packages" },
  { type: "whyUs", variant: "candyPop-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "candyPop-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "candyPop-footer", title: "footer" },
  { type: "aboutHero", variant: "candyPop-aboutHero", title: "aboutHero" },
  { type: "story", variant: "candyPop-story", title: "story" },
  { type: "spaceTour", variant: "candyPop-spaceTour", title: "spaceTour" },
  { type: "values", variant: "candyPop-values", title: "values" },
  { type: "specialistsDeep", variant: "candyPop-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "candyPop-certifications", title: "certifications" },
  { type: "timeline", variant: "candyPop-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "candyPop-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "candyPop-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "candyPop-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "candyPop-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "candyPop-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "candyPop-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "candyPop-addons", title: "addons" },
  { type: "beforeAfter", variant: "candyPop-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "candyPop-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "candyPop-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "candyPop-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "candyPop-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "candyPop-booking", title: "booking" },
  { type: "servicePicker", variant: "candyPop-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "candyPop-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "candyPop-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "candyPop-policies", title: "policies" },
  { type: "confirmationForm", variant: "candyPop-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "candyPop-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "candyPop-bookingFaq", title: "bookingFaq" },
];

export const nailoraSeed = {
  id: "nailora",
  key: "nailora",
  name: "Nailora",
  title: "Nailora",
  description: "סלון ציפורניים צבעוני: גריד טיפוליים, לפני/אחרי ויומן תורים אינטראקטיבי.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "nail-salon",
  layout: "full",
  image: (nailoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (nailoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (nailoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `nailora-${index + 1}-${block.type}`, ...block })),
  pages: nailoraPages,
  editor: { pages: nailoraPages, css: nailoraEditorCss },
  css: nailoraEditorCss,
  data: nailoraDefaultData,
  defaultData: nailoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const nailoraTemplate = {
  id: "nailora",
  key: "nailora",
  name: "Nailora",
  title: "Nailora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description: "סלון ציפורניים צבעוני: גריד טיפוליים, לפני/אחרי ויומן תורים אינטראקטיבי.",
  thumbnail: React.createElement(NailoraThumbnail),
  preview: React.createElement(NailoraPreview),
  component: NailoraPages,
  Component: NailoraPages,
  seed: nailoraSeed,
  pages: nailoraPages,
  editorCss: nailoraEditorCss,
  schema: nailoraSchema,
  defaultData: nailoraDefaultData,
  renderer: {
    key: "nailora",
    name: "Nailora",
    Component: NailoraPages,
    component: NailoraPages,
    pages: nailoraPages,
    editorMode: "visual-react",
    editorCss: nailoraEditorCss,
    schema: nailoraSchema,
    defaultData: nailoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default nailoraTemplate;
