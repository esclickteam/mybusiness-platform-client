import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PermanovaPages, { permanovaPages } from "./pages";
import PermanovaPreview from "./preview";
import PermanovaThumbnail from "./thumbnail";
import { permanovaEditorCss } from "./editorCss";
import { permanovaSchema } from "./schema";
import { permanovaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#B45309",
  secondary: "#FFF7ED",
  accent: "#FDBA74",
  background: "#FFFBF7",
  surface: "#FFFFFF",
  text: "#431407",
  muted: "#8A6248",
  dark: "#241006",
};

const blocks = [
  { type: "header", variant: "inkPMU-header", title: "header" },
  { type: "hero", variant: "inkPMU-hero", title: "hero" },
  { type: "servicesPreview", variant: "inkPMU-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "inkPMU-ritual", title: "ritual" },
  { type: "gallery", variant: "inkPMU-gallery", title: "gallery" },
  { type: "team", variant: "inkPMU-team", title: "team" },
  { type: "testimonials", variant: "inkPMU-testimonials", title: "testimonials" },
  { type: "packages", variant: "inkPMU-packages", title: "packages" },
  { type: "whyUs", variant: "inkPMU-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "inkPMU-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "inkPMU-footer", title: "footer" },
  { type: "aboutHero", variant: "inkPMU-aboutHero", title: "aboutHero" },
  { type: "story", variant: "inkPMU-story", title: "story" },
  { type: "spaceTour", variant: "inkPMU-spaceTour", title: "spaceTour" },
  { type: "values", variant: "inkPMU-values", title: "values" },
  { type: "specialistsDeep", variant: "inkPMU-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "inkPMU-certifications", title: "certifications" },
  { type: "timeline", variant: "inkPMU-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "inkPMU-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "inkPMU-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "inkPMU-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "inkPMU-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "inkPMU-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "inkPMU-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "inkPMU-addons", title: "addons" },
  { type: "beforeAfter", variant: "inkPMU-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "inkPMU-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "inkPMU-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "inkPMU-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "inkPMU-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "inkPMU-booking", title: "booking" },
  { type: "servicePicker", variant: "inkPMU-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "inkPMU-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "inkPMU-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "inkPMU-policies", title: "policies" },
  { type: "confirmationForm", variant: "inkPMU-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "inkPMU-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "inkPMU-bookingFaq", title: "bookingFaq" },
];

export const permanovaSeed = {
  id: "permanova",
  key: "permanova",
  name: "Permanova",
  title: "Permanova",
  description: "סטודיו PMU: שפתיים, אייליינר, גבות ותהליך החלמה ברור.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "permanent-makeup",
  layout: "full",
  image: (permanovaDefaultData as Record<string, any>).heroImage,
  heroTitle: (permanovaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (permanovaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `permanova-${index + 1}-${block.type}`, ...block })),
  pages: permanovaPages,
  editor: { pages: permanovaPages, css: permanovaEditorCss },
  css: permanovaEditorCss,
  data: permanovaDefaultData,
  defaultData: permanovaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const permanovaTemplate = {
  id: "permanova",
  key: "permanova",
  name: "Permanova",
  title: "Permanova",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "סטודיו PMU: שפתיים, אייליינר, גבות ותהליך החלמה ברור.",
  thumbnail: React.createElement(PermanovaThumbnail),
  preview: React.createElement(PermanovaPreview),
  component: PermanovaPages,
  Component: PermanovaPages,
  seed: permanovaSeed,
  pages: permanovaPages,
  editorCss: permanovaEditorCss,
  schema: permanovaSchema,
  defaultData: permanovaDefaultData,
  renderer: {
    key: "permanova",
    name: "Permanova",
    Component: PermanovaPages,
    component: PermanovaPages,
    pages: permanovaPages,
    editorMode: "visual-react",
    editorCss: permanovaEditorCss,
    schema: permanovaSchema,
    defaultData: permanovaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default permanovaTemplate;
