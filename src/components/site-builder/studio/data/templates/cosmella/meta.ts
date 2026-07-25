import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import CosmellaPages, { cosmellaPages } from "./pages";
import CosmellaPreview from "./preview";
import CosmellaThumbnail from "./thumbnail";
import { cosmellaEditorCss } from "./editorCss";
import { cosmellaSchema } from "./schema";
import { cosmellaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#059669",
  secondary: "#ECFDF5",
  accent: "#A7F3D0",
  background: "#F6FFFB",
  surface: "#FFFFFF",
  text: "#064E3B",
  muted: "#5C8B79",
  dark: "#022C22",
};

const blocks = [
  { type: "header", variant: "skinStudio-header", title: "header" },
  { type: "hero", variant: "skinStudio-hero", title: "hero" },
  { type: "servicesPreview", variant: "skinStudio-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "skinStudio-ritual", title: "ritual" },
  { type: "gallery", variant: "skinStudio-gallery", title: "gallery" },
  { type: "team", variant: "skinStudio-team", title: "team" },
  { type: "testimonials", variant: "skinStudio-testimonials", title: "testimonials" },
  { type: "packages", variant: "skinStudio-packages", title: "packages" },
  { type: "whyUs", variant: "skinStudio-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "skinStudio-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "skinStudio-footer", title: "footer" },
  { type: "aboutHero", variant: "skinStudio-aboutHero", title: "aboutHero" },
  { type: "story", variant: "skinStudio-story", title: "story" },
  { type: "spaceTour", variant: "skinStudio-spaceTour", title: "spaceTour" },
  { type: "values", variant: "skinStudio-values", title: "values" },
  { type: "specialistsDeep", variant: "skinStudio-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "skinStudio-certifications", title: "certifications" },
  { type: "timeline", variant: "skinStudio-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "skinStudio-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "skinStudio-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "skinStudio-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "skinStudio-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "skinStudio-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "skinStudio-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "skinStudio-addons", title: "addons" },
  { type: "beforeAfter", variant: "skinStudio-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "skinStudio-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "skinStudio-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "skinStudio-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "skinStudio-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "skinStudio-booking", title: "booking" },
  { type: "servicePicker", variant: "skinStudio-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "skinStudio-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "skinStudio-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "skinStudio-policies", title: "policies" },
  { type: "confirmationForm", variant: "skinStudio-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "skinStudio-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "skinStudio-bookingFaq", title: "bookingFaq" },
];

export const cosmellaSeed = {
  id: "cosmella",
  key: "cosmella",
  name: "Cosmella",
  title: "Cosmella",
  description: "קוסמטיקאית בוטיק: אבחון עור, ניקוי עמוק, לחות ושגרת בית.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "cosmetician",
  layout: "full",
  image: (cosmellaDefaultData as Record<string, any>).heroImage,
  heroTitle: (cosmellaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (cosmellaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `cosmella-${index + 1}-${block.type}`, ...block })),
  pages: cosmellaPages,
  editor: { pages: cosmellaPages, css: cosmellaEditorCss },
  css: cosmellaEditorCss,
  data: cosmellaDefaultData,
  defaultData: cosmellaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const cosmellaTemplate = {
  id: "cosmella",
  key: "cosmella",
  name: "Cosmella",
  title: "Cosmella",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description: "קוסמטיקאית בוטיק: אבחון עור, ניקוי עמוק, לחות ושגרת בית.",
  thumbnail: React.createElement(CosmellaThumbnail),
  preview: React.createElement(CosmellaPreview),
  component: CosmellaPages,
  Component: CosmellaPages,
  seed: cosmellaSeed,
  pages: cosmellaPages,
  editorCss: cosmellaEditorCss,
  schema: cosmellaSchema,
  defaultData: cosmellaDefaultData,
  renderer: {
    key: "cosmella",
    name: "Cosmella",
    Component: CosmellaPages,
    component: CosmellaPages,
    pages: cosmellaPages,
    editorMode: "visual-react",
    editorCss: cosmellaEditorCss,
    schema: cosmellaSchema,
    defaultData: cosmellaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default cosmellaTemplate;
