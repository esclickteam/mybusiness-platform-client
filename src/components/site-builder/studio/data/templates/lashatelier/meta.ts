import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LashatelierPages, { lashatelierPages } from "./pages";
import LashatelierPreview from "./preview";
import LashatelierThumbnail from "./thumbnail";
import { lashatelierEditorCss } from "./editorCss";
import { lashatelierSchema } from "./schema";
import { lashatelierDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#C084FC",
  secondary: "#FAF5FF",
  accent: "#E9D5FF",
  background: "#120A1F",
  surface: "#1E1230",
  text: "#FAF5FF",
  muted: "#BCA6D6",
  dark: "#090411",
};

const blocks = [
  { type: "header", variant: "lashCraft-header", title: "header" },
  { type: "hero", variant: "lashCraft-hero", title: "hero" },
  { type: "servicesPreview", variant: "lashCraft-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "lashCraft-ritual", title: "ritual" },
  { type: "gallery", variant: "lashCraft-gallery", title: "gallery" },
  { type: "team", variant: "lashCraft-team", title: "team" },
  { type: "testimonials", variant: "lashCraft-testimonials", title: "testimonials" },
  { type: "packages", variant: "lashCraft-packages", title: "packages" },
  { type: "whyUs", variant: "lashCraft-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "lashCraft-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "lashCraft-footer", title: "footer" },
  { type: "aboutHero", variant: "lashCraft-aboutHero", title: "aboutHero" },
  { type: "story", variant: "lashCraft-story", title: "story" },
  { type: "spaceTour", variant: "lashCraft-spaceTour", title: "spaceTour" },
  { type: "values", variant: "lashCraft-values", title: "values" },
  { type: "specialistsDeep", variant: "lashCraft-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "lashCraft-certifications", title: "certifications" },
  { type: "timeline", variant: "lashCraft-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "lashCraft-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "lashCraft-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "lashCraft-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "lashCraft-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "lashCraft-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "lashCraft-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "lashCraft-addons", title: "addons" },
  { type: "beforeAfter", variant: "lashCraft-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "lashCraft-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "lashCraft-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "lashCraft-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "lashCraft-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "lashCraft-booking", title: "booking" },
  { type: "servicePicker", variant: "lashCraft-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "lashCraft-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "lashCraft-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "lashCraft-policies", title: "policies" },
  { type: "confirmationForm", variant: "lashCraft-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "lashCraft-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "lashCraft-bookingFaq", title: "bookingFaq" },
];

export const lashatelierSeed = {
  id: "lashatelier",
  key: "lashatelier",
  name: "Lashatelier",
  title: "Lashatelier",
  description: "אטלייה לריסים: קלאסיק, ווליום, מילוי ומיפוי עין.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "lash-extensions",
  layout: "full",
  image: (lashatelierDefaultData as Record<string, any>).heroImage,
  heroTitle: (lashatelierDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (lashatelierDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `lashatelier-${index + 1}-${block.type}`, ...block })),
  pages: lashatelierPages,
  editor: { pages: lashatelierPages, css: lashatelierEditorCss },
  css: lashatelierEditorCss,
  data: lashatelierDefaultData,
  defaultData: lashatelierDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const lashatelierTemplate = {
  id: "lashatelier",
  key: "lashatelier",
  name: "Lashatelier",
  title: "Lashatelier",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "אטלייה לריסים: קלאסיק, ווליום, מילוי ומיפוי עין.",
  thumbnail: React.createElement(LashatelierThumbnail),
  preview: React.createElement(LashatelierPreview),
  component: LashatelierPages,
  Component: LashatelierPages,
  seed: lashatelierSeed,
  pages: lashatelierPages,
  editorCss: lashatelierEditorCss,
  schema: lashatelierSchema,
  defaultData: lashatelierDefaultData,
  renderer: {
    key: "lashatelier",
    name: "Lashatelier",
    Component: LashatelierPages,
    component: LashatelierPages,
    pages: lashatelierPages,
    editorMode: "visual-react",
    editorCss: lashatelierEditorCss,
    schema: lashatelierSchema,
    defaultData: lashatelierDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default lashatelierTemplate;
