import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import FormellaPages, { formellaPages } from "./pages";
import FormellaPreview from "./preview";
import FormellaThumbnail from "./thumbnail";
import { formellaEditorCss } from "./editorCss";
import { formellaSchema } from "./schema";
import { formellaDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#84CC16",
  secondary: "#0A0F08",
  accent: "#A3E635",
  background: "#0B1009",
  surface: "#152014",
  text: "#F7FEE7",
  muted: "#9CA88A",
  dark: "#050705",
};

const blocks = [
  { type: "header", variant: "sculptInk-header", title: "header" },
  { type: "hero", variant: "sculptInk-hero", title: "hero" },
  { type: "servicesPreview", variant: "sculptInk-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "sculptInk-ritual", title: "ritual" },
  { type: "gallery", variant: "sculptInk-gallery", title: "gallery" },
  { type: "team", variant: "sculptInk-team", title: "team" },
  { type: "testimonials", variant: "sculptInk-testimonials", title: "testimonials" },
  { type: "packages", variant: "sculptInk-packages", title: "packages" },
  { type: "whyUs", variant: "sculptInk-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "sculptInk-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "sculptInk-footer", title: "footer" },
  { type: "aboutHero", variant: "sculptInk-aboutHero", title: "aboutHero" },
  { type: "story", variant: "sculptInk-story", title: "story" },
  { type: "spaceTour", variant: "sculptInk-spaceTour", title: "spaceTour" },
  { type: "values", variant: "sculptInk-values", title: "values" },
  { type: "specialistsDeep", variant: "sculptInk-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "sculptInk-certifications", title: "certifications" },
  { type: "timeline", variant: "sculptInk-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "sculptInk-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "sculptInk-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "sculptInk-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "sculptInk-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "sculptInk-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "sculptInk-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "sculptInk-addons", title: "addons" },
  { type: "beforeAfter", variant: "sculptInk-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "sculptInk-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "sculptInk-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "sculptInk-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "sculptInk-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "sculptInk-booking", title: "booking" },
  { type: "servicePicker", variant: "sculptInk-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "sculptInk-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "sculptInk-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "sculptInk-policies", title: "policies" },
  { type: "confirmationForm", variant: "sculptInk-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "sculptInk-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "sculptInk-bookingFaq", title: "bookingFaq" },
];

export const formellaSeed = {
  id: "formella",
  key: "formella",
  name: "Formella",
  title: "Formella",
  description: "סטודיו טיפולי גוף: עיצוב, ניקוז, חבילות מסלול ויומן תורים מקצועי.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "body-treatments",
  layout: "full",
  image: (formellaDefaultData as Record<string, any>).heroImage,
  heroTitle: (formellaDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (formellaDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `formella-${index + 1}-${block.type}`, ...block })),
  pages: formellaPages,
  editor: { pages: formellaPages, css: formellaEditorCss },
  css: formellaEditorCss,
  data: formellaDefaultData,
  defaultData: formellaDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const formellaTemplate = {
  id: "formella",
  key: "formella",
  name: "Formella",
  title: "Formella",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description: "סטודיו טיפולי גוף: עיצוב, ניקוז, חבילות מסלול ויומן תורים מקצועי.",
  thumbnail: React.createElement(FormellaThumbnail),
  preview: React.createElement(FormellaPreview),
  component: FormellaPages,
  Component: FormellaPages,
  seed: formellaSeed,
  pages: formellaPages,
  editorCss: formellaEditorCss,
  schema: formellaSchema,
  defaultData: formellaDefaultData,
  renderer: {
    key: "formella",
    name: "Formella",
    Component: FormellaPages,
    component: FormellaPages,
    pages: formellaPages,
    editorMode: "visual-react",
    editorCss: formellaEditorCss,
    schema: formellaSchema,
    defaultData: formellaDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default formellaTemplate;
