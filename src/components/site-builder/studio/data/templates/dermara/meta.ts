import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import DermaraPages, { dermaraPages } from "./pages";
import DermaraPreview from "./preview";
import DermaraThumbnail from "./thumbnail";
import { dermaraEditorCss } from "./editorCss";
import { dermaraSchema } from "./schema";
import { dermaraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0D9488",
  secondary: "#F0FDFA",
  accent: "#2DD4BF",
  background: "#F7FFFD",
  surface: "#FFFFFF",
  text: "#134E4A",
  muted: "#5B8A84",
  dark: "#042F2E",
};

const blocks = [
  { type: "header", variant: "clinicMint-header", title: "header" },
  { type: "hero", variant: "clinicMint-hero", title: "hero" },
  { type: "servicesPreview", variant: "clinicMint-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "clinicMint-ritual", title: "ritual" },
  { type: "gallery", variant: "clinicMint-gallery", title: "gallery" },
  { type: "team", variant: "clinicMint-team", title: "team" },
  { type: "testimonials", variant: "clinicMint-testimonials", title: "testimonials" },
  { type: "packages", variant: "clinicMint-packages", title: "packages" },
  { type: "whyUs", variant: "clinicMint-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "clinicMint-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "clinicMint-footer", title: "footer" },
  { type: "aboutHero", variant: "clinicMint-aboutHero", title: "aboutHero" },
  { type: "story", variant: "clinicMint-story", title: "story" },
  { type: "spaceTour", variant: "clinicMint-spaceTour", title: "spaceTour" },
  { type: "values", variant: "clinicMint-values", title: "values" },
  { type: "specialistsDeep", variant: "clinicMint-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "clinicMint-certifications", title: "certifications" },
  { type: "timeline", variant: "clinicMint-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "clinicMint-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "clinicMint-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "clinicMint-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "clinicMint-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "clinicMint-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "clinicMint-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "clinicMint-addons", title: "addons" },
  { type: "beforeAfter", variant: "clinicMint-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "clinicMint-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "clinicMint-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "clinicMint-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "clinicMint-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "clinicMint-booking", title: "booking" },
  { type: "servicePicker", variant: "clinicMint-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "clinicMint-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "clinicMint-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "clinicMint-policies", title: "policies" },
  { type: "confirmationForm", variant: "clinicMint-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "clinicMint-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "clinicMint-bookingFaq", title: "bookingFaq" },
];

export const dermaraSeed = {
  id: "dermara",
  key: "dermara",
  name: "Dermara",
  title: "Dermara",
  description: "קליניקת עור נקייה: אבחונים, פרוטוקולים, צוות קוסמטיקאיות ויומן תורים.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "skincare-clinic",
  layout: "full",
  image: (dermaraDefaultData as Record<string, any>).heroImage,
  heroTitle: (dermaraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (dermaraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `dermara-${index + 1}-${block.type}`, ...block })),
  pages: dermaraPages,
  editor: { pages: dermaraPages, css: dermaraEditorCss },
  css: dermaraEditorCss,
  data: dermaraDefaultData,
  defaultData: dermaraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const dermaraTemplate = {
  id: "dermara",
  key: "dermara",
  name: "Dermara",
  title: "Dermara",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "קליניקת עור נקייה: אבחונים, פרוטוקולים, צוות קוסמטיקאיות ויומן תורים.",
  thumbnail: React.createElement(DermaraThumbnail),
  preview: React.createElement(DermaraPreview),
  component: DermaraPages,
  Component: DermaraPages,
  seed: dermaraSeed,
  pages: dermaraPages,
  editorCss: dermaraEditorCss,
  schema: dermaraSchema,
  defaultData: dermaraDefaultData,
  renderer: {
    key: "dermara",
    name: "Dermara",
    Component: DermaraPages,
    component: DermaraPages,
    pages: dermaraPages,
    editorMode: "visual-react",
    editorCss: dermaraEditorCss,
    schema: dermaraSchema,
    defaultData: dermaraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default dermaraTemplate;
