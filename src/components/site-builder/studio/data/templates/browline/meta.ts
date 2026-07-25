import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import BrowlinePages, { browlinePages } from "./pages";
import BrowlinePreview from "./preview";
import BrowlineThumbnail from "./thumbnail";
import { browlineEditorCss } from "./editorCss";
import { browlineSchema } from "./schema";
import { browlineDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#6D4C41",
  secondary: "#F8F1ED",
  accent: "#D7B8A6",
  background: "#FBF7F4",
  surface: "#FFFFFF",
  text: "#3E2723",
  muted: "#8A6D64",
  dark: "#1F100D",
};

const blocks = [
  { type: "header", variant: "archBrow-header", title: "header" },
  { type: "hero", variant: "archBrow-hero", title: "hero" },
  { type: "servicesPreview", variant: "archBrow-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "archBrow-ritual", title: "ritual" },
  { type: "gallery", variant: "archBrow-gallery", title: "gallery" },
  { type: "team", variant: "archBrow-team", title: "team" },
  { type: "testimonials", variant: "archBrow-testimonials", title: "testimonials" },
  { type: "packages", variant: "archBrow-packages", title: "packages" },
  { type: "whyUs", variant: "archBrow-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "archBrow-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "archBrow-footer", title: "footer" },
  { type: "aboutHero", variant: "archBrow-aboutHero", title: "aboutHero" },
  { type: "story", variant: "archBrow-story", title: "story" },
  { type: "spaceTour", variant: "archBrow-spaceTour", title: "spaceTour" },
  { type: "values", variant: "archBrow-values", title: "values" },
  { type: "specialistsDeep", variant: "archBrow-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "archBrow-certifications", title: "certifications" },
  { type: "timeline", variant: "archBrow-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "archBrow-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "archBrow-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "archBrow-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "archBrow-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "archBrow-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "archBrow-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "archBrow-addons", title: "addons" },
  { type: "beforeAfter", variant: "archBrow-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "archBrow-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "archBrow-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "archBrow-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "archBrow-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "archBrow-booking", title: "booking" },
  { type: "servicePicker", variant: "archBrow-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "archBrow-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "archBrow-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "archBrow-policies", title: "policies" },
  { type: "confirmationForm", variant: "archBrow-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "archBrow-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "archBrow-bookingFaq", title: "bookingFaq" },
];

export const browlineSeed = {
  id: "browline",
  key: "browline",
  name: "Browline",
  title: "Browline",
  description: "עיצוב גבות: מיפוי, פינצטה, צבע ולמינציה למראה מסודר.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "brow-designer",
  layout: "full",
  image: (browlineDefaultData as Record<string, any>).heroImage,
  heroTitle: (browlineDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (browlineDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `browline-${index + 1}-${block.type}`, ...block })),
  pages: browlinePages,
  editor: { pages: browlinePages, css: browlineEditorCss },
  css: browlineEditorCss,
  data: browlineDefaultData,
  defaultData: browlineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const browlineTemplate = {
  id: "browline",
  key: "browline",
  name: "Browline",
  title: "Browline",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description: "עיצוב גבות: מיפוי, פינצטה, צבע ולמינציה למראה מסודר.",
  thumbnail: React.createElement(BrowlineThumbnail),
  preview: React.createElement(BrowlinePreview),
  component: BrowlinePages,
  Component: BrowlinePages,
  seed: browlineSeed,
  pages: browlinePages,
  editorCss: browlineEditorCss,
  schema: browlineSchema,
  defaultData: browlineDefaultData,
  renderer: {
    key: "browline",
    name: "Browline",
    Component: BrowlinePages,
    component: BrowlinePages,
    pages: browlinePages,
    editorMode: "visual-react",
    editorCss: browlineEditorCss,
    schema: browlineSchema,
    defaultData: browlineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default browlineTemplate;
