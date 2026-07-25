import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import VelvetinePages, { velvetinePages } from "./pages";
import VelvetinePreview from "./preview";
import VelvetineThumbnail from "./thumbnail";
import { velvetineEditorCss } from "./editorCss";
import { velvetineSchema } from "./schema";
import { velvetineDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#C9A227",
  secondary: "#1A1210",
  accent: "#E8D5A3",
  background: "#120E0C",
  surface: "#1F1714",
  text: "#F5EDE3",
  muted: "#A89888",
  dark: "#0A0807",
};

const blocks = [
  { type: "header", variant: "noirGold-header", title: "header" },
  { type: "hero", variant: "noirGold-hero", title: "hero" },
  { type: "servicesPreview", variant: "noirGold-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "noirGold-ritual", title: "ritual" },
  { type: "gallery", variant: "noirGold-gallery", title: "gallery" },
  { type: "team", variant: "noirGold-team", title: "team" },
  { type: "testimonials", variant: "noirGold-testimonials", title: "testimonials" },
  { type: "packages", variant: "noirGold-packages", title: "packages" },
  { type: "whyUs", variant: "noirGold-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "noirGold-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "noirGold-footer", title: "footer" },
  { type: "aboutHero", variant: "noirGold-aboutHero", title: "aboutHero" },
  { type: "story", variant: "noirGold-story", title: "story" },
  { type: "spaceTour", variant: "noirGold-spaceTour", title: "spaceTour" },
  { type: "values", variant: "noirGold-values", title: "values" },
  { type: "specialistsDeep", variant: "noirGold-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "noirGold-certifications", title: "certifications" },
  { type: "timeline", variant: "noirGold-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "noirGold-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "noirGold-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "noirGold-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "noirGold-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "noirGold-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "noirGold-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "noirGold-addons", title: "addons" },
  { type: "beforeAfter", variant: "noirGold-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "noirGold-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "noirGold-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "noirGold-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "noirGold-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "noirGold-booking", title: "booking" },
  { type: "servicePicker", variant: "noirGold-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "noirGold-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "noirGold-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "noirGold-policies", title: "policies" },
  { type: "confirmationForm", variant: "noirGold-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "noirGold-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "noirGold-bookingFaq", title: "bookingFaq" },
];

export const velvetineSeed = {
  id: "velvetine",
  key: "velvetine",
  name: "Velvetine",
  title: "Velvetine",
  description: "ספא לילות קטיפה: הירו דרמטי, טקסי טיפול, גלריה וחבילות פרימיום.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "luxury-spa",
  layout: "full",
  image: (velvetineDefaultData as Record<string, any>).heroImage,
  heroTitle: (velvetineDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (velvetineDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `velvetine-${index + 1}-${block.type}`, ...block })),
  pages: velvetinePages,
  editor: { pages: velvetinePages, css: velvetineEditorCss },
  css: velvetineEditorCss,
  data: velvetineDefaultData,
  defaultData: velvetineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const velvetineTemplate = {
  id: "velvetine",
  key: "velvetine",
  name: "Velvetine",
  title: "Velvetine",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "ספא לילות קטיפה: הירו דרמטי, טקסי טיפול, גלריה וחבילות פרימיום.",
  thumbnail: React.createElement(VelvetineThumbnail),
  preview: React.createElement(VelvetinePreview),
  component: VelvetinePages,
  Component: VelvetinePages,
  seed: velvetineSeed,
  pages: velvetinePages,
  editorCss: velvetineEditorCss,
  schema: velvetineSchema,
  defaultData: velvetineDefaultData,
  renderer: {
    key: "velvetine",
    name: "Velvetine",
    Component: VelvetinePages,
    component: VelvetinePages,
    pages: velvetinePages,
    editorMode: "visual-react",
    editorCss: velvetineEditorCss,
    schema: velvetineSchema,
    defaultData: velvetineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default velvetineTemplate;
