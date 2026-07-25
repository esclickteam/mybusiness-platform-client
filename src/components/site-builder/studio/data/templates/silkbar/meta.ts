import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SilkbarPages, { silkbarPages } from "./pages";
import SilkbarPreview from "./preview";
import SilkbarThumbnail from "./thumbnail";
import { silkbarEditorCss } from "./editorCss";
import { silkbarSchema } from "./schema";
import { silkbarDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0F766E",
  secondary: "#F3FAF9",
  accent: "#14B8A6",
  background: "#F7FCFB",
  surface: "#FFFFFF",
  text: "#134E4A",
  muted: "#5F8F8A",
  dark: "#042F2E",
};

const blocks = [
  { type: "header", variant: "shearInk-header", title: "header" },
  { type: "hero", variant: "shearInk-hero", title: "hero" },
  { type: "servicesPreview", variant: "shearInk-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "shearInk-ritual", title: "ritual" },
  { type: "gallery", variant: "shearInk-gallery", title: "gallery" },
  { type: "team", variant: "shearInk-team", title: "team" },
  { type: "testimonials", variant: "shearInk-testimonials", title: "testimonials" },
  { type: "packages", variant: "shearInk-packages", title: "packages" },
  { type: "whyUs", variant: "shearInk-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "shearInk-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "shearInk-footer", title: "footer" },
  { type: "aboutHero", variant: "shearInk-aboutHero", title: "aboutHero" },
  { type: "story", variant: "shearInk-story", title: "story" },
  { type: "spaceTour", variant: "shearInk-spaceTour", title: "spaceTour" },
  { type: "values", variant: "shearInk-values", title: "values" },
  { type: "specialistsDeep", variant: "shearInk-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "shearInk-certifications", title: "certifications" },
  { type: "timeline", variant: "shearInk-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "shearInk-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "shearInk-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "shearInk-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "shearInk-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "shearInk-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "shearInk-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "shearInk-addons", title: "addons" },
  { type: "beforeAfter", variant: "shearInk-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "shearInk-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "shearInk-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "shearInk-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "shearInk-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "shearInk-booking", title: "booking" },
  { type: "servicePicker", variant: "shearInk-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "shearInk-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "shearInk-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "shearInk-policies", title: "policies" },
  { type: "confirmationForm", variant: "shearInk-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "shearInk-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "shearInk-bookingFaq", title: "bookingFaq" },
];

export const silkbarSeed = {
  id: "silkbar",
  key: "silkbar",
  name: "Silkbar",
  title: "Silkbar",
  description: "מספרת בוטיק: חיתוכים עיתונאיים, צבע, צוות ספרים ויומן תורים.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "hair-salon",
  layout: "full",
  image: (silkbarDefaultData as Record<string, any>).heroImage,
  heroTitle: (silkbarDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (silkbarDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `silkbar-${index + 1}-${block.type}`, ...block })),
  pages: silkbarPages,
  editor: { pages: silkbarPages, css: silkbarEditorCss },
  css: silkbarEditorCss,
  data: silkbarDefaultData,
  defaultData: silkbarDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const silkbarTemplate = {
  id: "silkbar",
  key: "silkbar",
  name: "Silkbar",
  title: "Silkbar",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "מספרת בוטיק: חיתוכים עיתונאיים, צבע, צוות ספרים ויומן תורים.",
  thumbnail: React.createElement(SilkbarThumbnail),
  preview: React.createElement(SilkbarPreview),
  component: SilkbarPages,
  Component: SilkbarPages,
  seed: silkbarSeed,
  pages: silkbarPages,
  editorCss: silkbarEditorCss,
  schema: silkbarSchema,
  defaultData: silkbarDefaultData,
  renderer: {
    key: "silkbar",
    name: "Silkbar",
    Component: SilkbarPages,
    component: SilkbarPages,
    pages: silkbarPages,
    editorMode: "visual-react",
    editorCss: silkbarEditorCss,
    schema: silkbarSchema,
    defaultData: silkbarDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default silkbarTemplate;
