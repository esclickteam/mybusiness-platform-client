import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PetaluxePages, { petaluxePages } from "./pages";
import PetaluxePreview from "./preview";
import PetaluxeThumbnail from "./thumbnail";
import { petaluxeEditorCss } from "./editorCss";
import { petaluxeSchema } from "./schema";
import { petaluxeDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#BE185D",
  secondary: "#FDF2F8",
  accent: "#F9A8D4",
  background: "#FFF5F9",
  surface: "#FFFFFF",
  text: "#4A044E",
  muted: "#9D6B8A",
  dark: "#500724",
};

const blocks = [
  { type: "header", variant: "bridalPearl-header", title: "header" },
  { type: "hero", variant: "bridalPearl-hero", title: "hero" },
  { type: "servicesPreview", variant: "bridalPearl-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "bridalPearl-ritual", title: "ritual" },
  { type: "gallery", variant: "bridalPearl-gallery", title: "gallery" },
  { type: "team", variant: "bridalPearl-team", title: "team" },
  { type: "testimonials", variant: "bridalPearl-testimonials", title: "testimonials" },
  { type: "packages", variant: "bridalPearl-packages", title: "packages" },
  { type: "whyUs", variant: "bridalPearl-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "bridalPearl-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "bridalPearl-footer", title: "footer" },
  { type: "aboutHero", variant: "bridalPearl-aboutHero", title: "aboutHero" },
  { type: "story", variant: "bridalPearl-story", title: "story" },
  { type: "spaceTour", variant: "bridalPearl-spaceTour", title: "spaceTour" },
  { type: "values", variant: "bridalPearl-values", title: "values" },
  { type: "specialistsDeep", variant: "bridalPearl-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "bridalPearl-certifications", title: "certifications" },
  { type: "timeline", variant: "bridalPearl-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "bridalPearl-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "bridalPearl-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "bridalPearl-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "bridalPearl-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "bridalPearl-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "bridalPearl-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "bridalPearl-addons", title: "addons" },
  { type: "beforeAfter", variant: "bridalPearl-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "bridalPearl-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "bridalPearl-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "bridalPearl-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "bridalPearl-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "bridalPearl-booking", title: "booking" },
  { type: "servicePicker", variant: "bridalPearl-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "bridalPearl-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "bridalPearl-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "bridalPearl-policies", title: "policies" },
  { type: "confirmationForm", variant: "bridalPearl-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "bridalPearl-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "bridalPearl-bookingFaq", title: "bookingFaq" },
];

export const petaluxeSeed = {
  id: "petaluxe",
  key: "petaluxe",
  name: "Petaluxe",
  title: "Petaluxe",
  description: "יופי לכלות: ניסיונות, לוקים, צוות כלה ויומן חזרות ותורים.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "bridal-beauty",
  layout: "full",
  image: (petaluxeDefaultData as Record<string, any>).heroImage,
  heroTitle: (petaluxeDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (petaluxeDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `petaluxe-${index + 1}-${block.type}`, ...block })),
  pages: petaluxePages,
  editor: { pages: petaluxePages, css: petaluxeEditorCss },
  css: petaluxeEditorCss,
  data: petaluxeDefaultData,
  defaultData: petaluxeDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const petaluxeTemplate = {
  id: "petaluxe",
  key: "petaluxe",
  name: "Petaluxe",
  title: "Petaluxe",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "יופי לכלות: ניסיונות, לוקים, צוות כלה ויומן חזרות ותורים.",
  thumbnail: React.createElement(PetaluxeThumbnail),
  preview: React.createElement(PetaluxePreview),
  component: PetaluxePages,
  Component: PetaluxePages,
  seed: petaluxeSeed,
  pages: petaluxePages,
  editorCss: petaluxeEditorCss,
  schema: petaluxeSchema,
  defaultData: petaluxeDefaultData,
  renderer: {
    key: "petaluxe",
    name: "Petaluxe",
    Component: PetaluxePages,
    component: PetaluxePages,
    pages: petaluxePages,
    editorMode: "visual-react",
    editorCss: petaluxeEditorCss,
    schema: petaluxeSchema,
    defaultData: petaluxeDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default petaluxeTemplate;
