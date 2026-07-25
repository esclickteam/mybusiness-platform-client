import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import SpajadePages, { spajadePages } from "./pages";
import SpajadePreview from "./preview";
import SpajadeThumbnail from "./thumbnail";
import { spajadeEditorCss } from "./editorCss";
import { spajadeSchema } from "./schema";
import { spajadeDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#10B981",
  secondary: "#ECFDF5",
  accent: "#A7F3D0",
  background: "#07140F",
  surface: "#10231A",
  text: "#ECFDF5",
  muted: "#A1BDAF",
  dark: "#030A07",
};

const blocks = [
  { type: "header", variant: "jadeSpa-header", title: "header" },
  { type: "hero", variant: "jadeSpa-hero", title: "hero" },
  { type: "servicesPreview", variant: "jadeSpa-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "jadeSpa-ritual", title: "ritual" },
  { type: "gallery", variant: "jadeSpa-gallery", title: "gallery" },
  { type: "team", variant: "jadeSpa-team", title: "team" },
  { type: "testimonials", variant: "jadeSpa-testimonials", title: "testimonials" },
  { type: "packages", variant: "jadeSpa-packages", title: "packages" },
  { type: "whyUs", variant: "jadeSpa-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "jadeSpa-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "jadeSpa-footer", title: "footer" },
  { type: "aboutHero", variant: "jadeSpa-aboutHero", title: "aboutHero" },
  { type: "story", variant: "jadeSpa-story", title: "story" },
  { type: "spaceTour", variant: "jadeSpa-spaceTour", title: "spaceTour" },
  { type: "values", variant: "jadeSpa-values", title: "values" },
  { type: "specialistsDeep", variant: "jadeSpa-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "jadeSpa-certifications", title: "certifications" },
  { type: "timeline", variant: "jadeSpa-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "jadeSpa-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "jadeSpa-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "jadeSpa-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "jadeSpa-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "jadeSpa-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "jadeSpa-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "jadeSpa-addons", title: "addons" },
  { type: "beforeAfter", variant: "jadeSpa-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "jadeSpa-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "jadeSpa-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "jadeSpa-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "jadeSpa-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "jadeSpa-booking", title: "booking" },
  { type: "servicePicker", variant: "jadeSpa-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "jadeSpa-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "jadeSpa-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "jadeSpa-policies", title: "policies" },
  { type: "confirmationForm", variant: "jadeSpa-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "jadeSpa-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "jadeSpa-bookingFaq", title: "bookingFaq" },
];

export const spajadeSeed = {
  id: "spajade",
  key: "spajade",
  name: "Spajade",
  title: "Spajade",
  description: "ספא ועיסוי פנים: ניקוז, גוואשה, הרגעה וטקסי זוהר.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "spa-face-massage",
  layout: "full",
  image: (spajadeDefaultData as Record<string, any>).heroImage,
  heroTitle: (spajadeDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (spajadeDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `spajade-${index + 1}-${block.type}`, ...block })),
  pages: spajadePages,
  editor: { pages: spajadePages, css: spajadeEditorCss },
  css: spajadeEditorCss,
  data: spajadeDefaultData,
  defaultData: spajadeDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const spajadeTemplate = {
  id: "spajade",
  key: "spajade",
  name: "Spajade",
  title: "Spajade",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "ספא ועיסוי פנים: ניקוז, גוואשה, הרגעה וטקסי זוהר.",
  thumbnail: React.createElement(SpajadeThumbnail),
  preview: React.createElement(SpajadePreview),
  component: SpajadePages,
  Component: SpajadePages,
  seed: spajadeSeed,
  pages: spajadePages,
  editorCss: spajadeEditorCss,
  schema: spajadeSchema,
  defaultData: spajadeDefaultData,
  renderer: {
    key: "spajade",
    name: "Spajade",
    Component: SpajadePages,
    component: SpajadePages,
    pages: spajadePages,
    editorMode: "visual-react",
    editorCss: spajadeEditorCss,
    schema: spajadeSchema,
    defaultData: spajadeDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default spajadeTemplate;
