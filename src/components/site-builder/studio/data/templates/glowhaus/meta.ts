import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import GlowhausPages, { glowhausPages } from "./pages";
import GlowhausPreview from "./preview";
import GlowhausThumbnail from "./thumbnail";
import { glowhausEditorCss } from "./editorCss";
import { glowhausSchema } from "./schema";
import { glowhausDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#22D3EE",
  secondary: "#071521",
  accent: "#67E8F9",
  background: "#061018",
  surface: "#0D1F2D",
  text: "#E0F2FE",
  muted: "#7DA4B8",
  dark: "#030A10",
};

const blocks = [
  { type: "header", variant: "neonLounge-header", title: "header" },
  { type: "hero", variant: "neonLounge-hero", title: "hero" },
  { type: "servicesPreview", variant: "neonLounge-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "neonLounge-ritual", title: "ritual" },
  { type: "gallery", variant: "neonLounge-gallery", title: "gallery" },
  { type: "team", variant: "neonLounge-team", title: "team" },
  { type: "testimonials", variant: "neonLounge-testimonials", title: "testimonials" },
  { type: "packages", variant: "neonLounge-packages", title: "packages" },
  { type: "whyUs", variant: "neonLounge-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "neonLounge-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "neonLounge-footer", title: "footer" },
  { type: "aboutHero", variant: "neonLounge-aboutHero", title: "aboutHero" },
  { type: "story", variant: "neonLounge-story", title: "story" },
  { type: "spaceTour", variant: "neonLounge-spaceTour", title: "spaceTour" },
  { type: "values", variant: "neonLounge-values", title: "values" },
  { type: "specialistsDeep", variant: "neonLounge-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "neonLounge-certifications", title: "certifications" },
  { type: "timeline", variant: "neonLounge-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "neonLounge-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "neonLounge-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "neonLounge-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "neonLounge-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "neonLounge-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "neonLounge-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "neonLounge-addons", title: "addons" },
  { type: "beforeAfter", variant: "neonLounge-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "neonLounge-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "neonLounge-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "neonLounge-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "neonLounge-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "neonLounge-booking", title: "booking" },
  { type: "servicePicker", variant: "neonLounge-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "neonLounge-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "neonLounge-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "neonLounge-policies", title: "policies" },
  { type: "confirmationForm", variant: "neonLounge-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "neonLounge-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "neonLounge-bookingFaq", title: "bookingFaq" },
];

export const glowhausSeed = {
  id: "glowhaus",
  key: "glowhaus",
  name: "Glowhaus",
  title: "Glowhaus",
  description: "טרקלין יופי אורבני: חבילות זוהר, צוות רב־תחומי וחוויית תורים סלון.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "beauty-lounge",
  layout: "full",
  image: (glowhausDefaultData as Record<string, any>).heroImage,
  heroTitle: (glowhausDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (glowhausDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `glowhaus-${index + 1}-${block.type}`, ...block })),
  pages: glowhausPages,
  editor: { pages: glowhausPages, css: glowhausEditorCss },
  css: glowhausEditorCss,
  data: glowhausDefaultData,
  defaultData: glowhausDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const glowhausTemplate = {
  id: "glowhaus",
  key: "glowhaus",
  name: "Glowhaus",
  title: "Glowhaus",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "טרקלין יופי אורבני: חבילות זוהר, צוות רב־תחומי וחוויית תורים סלון.",
  thumbnail: React.createElement(GlowhausThumbnail),
  preview: React.createElement(GlowhausPreview),
  component: GlowhausPages,
  Component: GlowhausPages,
  seed: glowhausSeed,
  pages: glowhausPages,
  editorCss: glowhausEditorCss,
  schema: glowhausSchema,
  defaultData: glowhausDefaultData,
  renderer: {
    key: "glowhaus",
    name: "Glowhaus",
    Component: GlowhausPages,
    component: GlowhausPages,
    pages: glowhausPages,
    editorMode: "visual-react",
    editorCss: glowhausEditorCss,
    schema: glowhausSchema,
    defaultData: glowhausDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default glowhausTemplate;
