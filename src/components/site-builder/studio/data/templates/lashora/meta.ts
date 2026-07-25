import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LashoraPages, { lashoraPages } from "./pages";
import LashoraPreview from "./preview";
import LashoraThumbnail from "./thumbnail";
import { lashoraEditorCss } from "./editorCss";
import { lashoraSchema } from "./schema";
import { lashoraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#A78BFA",
  secondary: "#0B0A12",
  accent: "#DDD6FE",
  background: "#0B0A12",
  surface: "#16141F",
  text: "#F5F3FF",
  muted: "#A5A0B8",
  dark: "#05040A",
};

const blocks = [
  { type: "header", variant: "lashNoir-header", title: "header" },
  { type: "hero", variant: "lashNoir-hero", title: "hero" },
  { type: "servicesPreview", variant: "lashNoir-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "lashNoir-ritual", title: "ritual" },
  { type: "gallery", variant: "lashNoir-gallery", title: "gallery" },
  { type: "team", variant: "lashNoir-team", title: "team" },
  { type: "testimonials", variant: "lashNoir-testimonials", title: "testimonials" },
  { type: "packages", variant: "lashNoir-packages", title: "packages" },
  { type: "whyUs", variant: "lashNoir-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "lashNoir-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "lashNoir-footer", title: "footer" },
  { type: "aboutHero", variant: "lashNoir-aboutHero", title: "aboutHero" },
  { type: "story", variant: "lashNoir-story", title: "story" },
  { type: "spaceTour", variant: "lashNoir-spaceTour", title: "spaceTour" },
  { type: "values", variant: "lashNoir-values", title: "values" },
  { type: "specialistsDeep", variant: "lashNoir-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "lashNoir-certifications", title: "certifications" },
  { type: "timeline", variant: "lashNoir-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "lashNoir-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "lashNoir-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "lashNoir-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "lashNoir-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "lashNoir-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "lashNoir-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "lashNoir-addons", title: "addons" },
  { type: "beforeAfter", variant: "lashNoir-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "lashNoir-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "lashNoir-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "lashNoir-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "lashNoir-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "lashNoir-booking", title: "booking" },
  { type: "servicePicker", variant: "lashNoir-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "lashNoir-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "lashNoir-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "lashNoir-policies", title: "policies" },
  { type: "confirmationForm", variant: "lashNoir-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "lashNoir-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "lashNoir-bookingFaq", title: "bookingFaq" },
];

export const lashoraSeed = {
  id: "lashora",
  key: "lashora",
  name: "Lashora",
  title: "Lashora",
  description: "סטודיו ריסים וגבות: הארכות, למינציה, מיפוי גבות ויומן תורים.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "lashes-brows",
  layout: "full",
  image: (lashoraDefaultData as Record<string, any>).heroImage,
  heroTitle: (lashoraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (lashoraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `lashora-${index + 1}-${block.type}`, ...block })),
  pages: lashoraPages,
  editor: { pages: lashoraPages, css: lashoraEditorCss },
  css: lashoraEditorCss,
  data: lashoraDefaultData,
  defaultData: lashoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const lashoraTemplate = {
  id: "lashora",
  key: "lashora",
  name: "Lashora",
  title: "Lashora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description: "סטודיו ריסים וגבות: הארכות, למינציה, מיפוי גבות ויומן תורים.",
  thumbnail: React.createElement(LashoraThumbnail),
  preview: React.createElement(LashoraPreview),
  component: LashoraPages,
  Component: LashoraPages,
  seed: lashoraSeed,
  pages: lashoraPages,
  editorCss: lashoraEditorCss,
  schema: lashoraSchema,
  defaultData: lashoraDefaultData,
  renderer: {
    key: "lashora",
    name: "Lashora",
    Component: LashoraPages,
    component: LashoraPages,
    pages: lashoraPages,
    editorMode: "visual-react",
    editorCss: lashoraEditorCss,
    schema: lashoraSchema,
    defaultData: lashoraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default lashoraTemplate;
