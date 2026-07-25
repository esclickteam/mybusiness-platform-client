import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import ChromabarPages, { chromabarPages } from "./pages";
import ChromabarPreview from "./preview";
import ChromabarThumbnail from "./thumbnail";
import { chromabarEditorCss } from "./editorCss";
import { chromabarSchema } from "./schema";
import { chromabarDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#2563EB",
  secondary: "#EFF6FF",
  accent: "#93C5FD",
  background: "#0B1220",
  surface: "#111C2F",
  text: "#EAF2FF",
  muted: "#9FB3CF",
  dark: "#050914",
};

const blocks = [
  { type: "header", variant: "colorHaus-header", title: "header" },
  { type: "hero", variant: "colorHaus-hero", title: "hero" },
  { type: "servicesPreview", variant: "colorHaus-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "colorHaus-ritual", title: "ritual" },
  { type: "gallery", variant: "colorHaus-gallery", title: "gallery" },
  { type: "team", variant: "colorHaus-team", title: "team" },
  { type: "testimonials", variant: "colorHaus-testimonials", title: "testimonials" },
  { type: "packages", variant: "colorHaus-packages", title: "packages" },
  { type: "whyUs", variant: "colorHaus-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "colorHaus-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "colorHaus-footer", title: "footer" },
  { type: "aboutHero", variant: "colorHaus-aboutHero", title: "aboutHero" },
  { type: "story", variant: "colorHaus-story", title: "story" },
  { type: "spaceTour", variant: "colorHaus-spaceTour", title: "spaceTour" },
  { type: "values", variant: "colorHaus-values", title: "values" },
  { type: "specialistsDeep", variant: "colorHaus-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "colorHaus-certifications", title: "certifications" },
  { type: "timeline", variant: "colorHaus-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "colorHaus-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "colorHaus-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "colorHaus-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "colorHaus-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "colorHaus-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "colorHaus-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "colorHaus-addons", title: "addons" },
  { type: "beforeAfter", variant: "colorHaus-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "colorHaus-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "colorHaus-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "colorHaus-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "colorHaus-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "colorHaus-booking", title: "booking" },
  { type: "servicePicker", variant: "colorHaus-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "colorHaus-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "colorHaus-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "colorHaus-policies", title: "policies" },
  { type: "confirmationForm", variant: "colorHaus-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "colorHaus-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "colorHaus-bookingFaq", title: "bookingFaq" },
];

export const chromabarSeed = {
  id: "chromabar",
  key: "chromabar",
  name: "Chromabar",
  title: "Chromabar",
  description: "בר צבע לשיער: בליאז׳, גוונים, תיקוני צבע וברק.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "hair-color",
  layout: "full",
  image: (chromabarDefaultData as Record<string, any>).heroImage,
  heroTitle: (chromabarDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (chromabarDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `chromabar-${index + 1}-${block.type}`, ...block })),
  pages: chromabarPages,
  editor: { pages: chromabarPages, css: chromabarEditorCss },
  css: chromabarEditorCss,
  data: chromabarDefaultData,
  defaultData: chromabarDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const chromabarTemplate = {
  id: "chromabar",
  key: "chromabar",
  name: "Chromabar",
  title: "Chromabar",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "בר צבע לשיער: בליאז׳, גוונים, תיקוני צבע וברק.",
  thumbnail: React.createElement(ChromabarThumbnail),
  preview: React.createElement(ChromabarPreview),
  component: ChromabarPages,
  Component: ChromabarPages,
  seed: chromabarSeed,
  pages: chromabarPages,
  editorCss: chromabarEditorCss,
  schema: chromabarSchema,
  defaultData: chromabarDefaultData,
  renderer: {
    key: "chromabar",
    name: "Chromabar",
    Component: ChromabarPages,
    component: ChromabarPages,
    pages: chromabarPages,
    editorMode: "visual-react",
    editorCss: chromabarEditorCss,
    schema: chromabarSchema,
    defaultData: chromabarDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default chromabarTemplate;
