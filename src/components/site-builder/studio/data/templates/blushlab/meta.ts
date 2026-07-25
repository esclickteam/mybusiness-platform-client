import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BlushlabPages, { blushlabPages } from "./pages";
import BlushlabPreview from "./preview";
import BlushlabThumbnail from "./thumbnail";
import { blushlabEditorCss } from "./editorCss";
import { blushlabSchema } from "./schema";
import { blushlabDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#E11D48",
  secondary: "#1C0A10",
  accent: "#FB7185",
  background: "#14080C",
  surface: "#241018",
  text: "#FFF1F2",
  muted: "#E8A0AE",
  dark: "#0A0406",
};

const blocks = [
  { type: "header", variant: "roseAtelier-header", title: "header" },
  { type: "hero", variant: "roseAtelier-hero", title: "hero" },
  { type: "servicesPreview", variant: "roseAtelier-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "roseAtelier-ritual", title: "ritual" },
  { type: "gallery", variant: "roseAtelier-gallery", title: "gallery" },
  { type: "team", variant: "roseAtelier-team", title: "team" },
  { type: "testimonials", variant: "roseAtelier-testimonials", title: "testimonials" },
  { type: "packages", variant: "roseAtelier-packages", title: "packages" },
  { type: "whyUs", variant: "roseAtelier-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "roseAtelier-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "roseAtelier-footer", title: "footer" },
  { type: "aboutHero", variant: "roseAtelier-aboutHero", title: "aboutHero" },
  { type: "story", variant: "roseAtelier-story", title: "story" },
  { type: "spaceTour", variant: "roseAtelier-spaceTour", title: "spaceTour" },
  { type: "values", variant: "roseAtelier-values", title: "values" },
  { type: "specialistsDeep", variant: "roseAtelier-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "roseAtelier-certifications", title: "certifications" },
  { type: "timeline", variant: "roseAtelier-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "roseAtelier-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "roseAtelier-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "roseAtelier-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "roseAtelier-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "roseAtelier-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "roseAtelier-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "roseAtelier-addons", title: "addons" },
  { type: "beforeAfter", variant: "roseAtelier-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "roseAtelier-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "roseAtelier-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "roseAtelier-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "roseAtelier-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "roseAtelier-booking", title: "booking" },
  { type: "servicePicker", variant: "roseAtelier-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "roseAtelier-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "roseAtelier-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "roseAtelier-policies", title: "policies" },
  { type: "confirmationForm", variant: "roseAtelier-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "roseAtelier-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "roseAtelier-bookingFaq", title: "bookingFaq" },
];

export const blushlabSeed = {
  id: "blushlab",
  key: "blushlab",
  name: "Blushlab",
  title: "Blushlab",
  description: "סטודיו איפור מודרני: לוקים, צוות מאפרות, חבילות כלה ותיאום תורים.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "makeup-studio",
  layout: "full",
  image: (blushlabDefaultData as Record<string, any>).heroImage,
  heroTitle: (blushlabDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (blushlabDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `blushlab-${index + 1}-${block.type}`, ...block })),
  pages: blushlabPages,
  editor: { pages: blushlabPages, css: blushlabEditorCss },
  css: blushlabEditorCss,
  data: blushlabDefaultData,
  defaultData: blushlabDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const blushlabTemplate = {
  id: "blushlab",
  key: "blushlab",
  name: "Blushlab",
  title: "Blushlab",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description: "סטודיו איפור מודרני: לוקים, צוות מאפרות, חבילות כלה ותיאום תורים.",
  thumbnail: React.createElement(BlushlabThumbnail),
  preview: React.createElement(BlushlabPreview),
  component: BlushlabPages,
  Component: BlushlabPages,
  seed: blushlabSeed,
  pages: blushlabPages,
  editorCss: blushlabEditorCss,
  schema: blushlabSchema,
  defaultData: blushlabDefaultData,
  renderer: {
    key: "blushlab",
    name: "Blushlab",
    Component: BlushlabPages,
    component: BlushlabPages,
    pages: blushlabPages,
    editorMode: "visual-react",
    editorCss: blushlabEditorCss,
    schema: blushlabSchema,
    defaultData: blushlabDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default blushlabTemplate;
