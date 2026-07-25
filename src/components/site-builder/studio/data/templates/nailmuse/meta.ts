import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import NailmusePages, { nailmusePages } from "./pages";
import NailmusePreview from "./preview";
import NailmuseThumbnail from "./thumbnail";
import { nailmuseEditorCss } from "./editorCss";
import { nailmuseSchema } from "./schema";
import { nailmuseDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#F97316",
  secondary: "#FFF7ED",
  accent: "#FDE68A",
  background: "#FFF9F0",
  surface: "#FFFFFF",
  text: "#5A1C05",
  muted: "#A26F4E",
  dark: "#2B0B02",
};

const blocks = [
  { type: "header", variant: "artNails-header", title: "header" },
  { type: "hero", variant: "artNails-hero", title: "hero" },
  { type: "servicesPreview", variant: "artNails-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "artNails-ritual", title: "ritual" },
  { type: "gallery", variant: "artNails-gallery", title: "gallery" },
  { type: "team", variant: "artNails-team", title: "team" },
  { type: "testimonials", variant: "artNails-testimonials", title: "testimonials" },
  { type: "packages", variant: "artNails-packages", title: "packages" },
  { type: "whyUs", variant: "artNails-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "artNails-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "artNails-footer", title: "footer" },
  { type: "aboutHero", variant: "artNails-aboutHero", title: "aboutHero" },
  { type: "story", variant: "artNails-story", title: "story" },
  { type: "spaceTour", variant: "artNails-spaceTour", title: "spaceTour" },
  { type: "values", variant: "artNails-values", title: "values" },
  { type: "specialistsDeep", variant: "artNails-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "artNails-certifications", title: "certifications" },
  { type: "timeline", variant: "artNails-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "artNails-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "artNails-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "artNails-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "artNails-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "artNails-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "artNails-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "artNails-addons", title: "addons" },
  { type: "beforeAfter", variant: "artNails-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "artNails-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "artNails-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "artNails-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "artNails-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "artNails-booking", title: "booking" },
  { type: "servicePicker", variant: "artNails-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "artNails-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "artNails-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "artNails-policies", title: "policies" },
  { type: "confirmationForm", variant: "artNails-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "artNails-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "artNails-bookingFaq", title: "bookingFaq" },
];

export const nailmuseSeed = {
  id: "nailmuse",
  key: "nailmuse",
  name: "Nailmuse",
  title: "Nailmuse",
  description: "נייל ארט יצירתי: איורים, כרום, תלת־ממד וקולקציות עונתיות.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "nail-art",
  layout: "full",
  image: (nailmuseDefaultData as Record<string, any>).heroImage,
  heroTitle: (nailmuseDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (nailmuseDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `nailmuse-${index + 1}-${block.type}`, ...block })),
  pages: nailmusePages,
  editor: { pages: nailmusePages, css: nailmuseEditorCss },
  css: nailmuseEditorCss,
  data: nailmuseDefaultData,
  defaultData: nailmuseDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const nailmuseTemplate = {
  id: "nailmuse",
  key: "nailmuse",
  name: "Nailmuse",
  title: "Nailmuse",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description: "נייל ארט יצירתי: איורים, כרום, תלת־ממד וקולקציות עונתיות.",
  thumbnail: React.createElement(NailmuseThumbnail),
  preview: React.createElement(NailmusePreview),
  component: NailmusePages,
  Component: NailmusePages,
  seed: nailmuseSeed,
  pages: nailmusePages,
  editorCss: nailmuseEditorCss,
  schema: nailmuseSchema,
  defaultData: nailmuseDefaultData,
  renderer: {
    key: "nailmuse",
    name: "Nailmuse",
    Component: NailmusePages,
    component: NailmusePages,
    pages: nailmusePages,
    editorMode: "visual-react",
    editorCss: nailmuseEditorCss,
    schema: nailmuseSchema,
    defaultData: nailmuseDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default nailmuseTemplate;
