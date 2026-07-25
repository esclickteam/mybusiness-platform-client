import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import GeloraPages, { geloraPages } from "./pages";
import GeloraPreview from "./preview";
import GeloraThumbnail from "./thumbnail";
import { geloraEditorCss } from "./editorCss";
import { geloraSchema } from "./schema";
import { geloraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#DB2777",
  secondary: "#FFF1F7",
  accent: "#F9A8D4",
  background: "#FFF7FB",
  surface: "#FFFFFF",
  text: "#4C0F2E",
  muted: "#9D6681",
  dark: "#2A0718",
};

const blocks = [
  { type: "header", variant: "glassGel-header", title: "header" },
  { type: "hero", variant: "glassGel-hero", title: "hero" },
  { type: "servicesPreview", variant: "glassGel-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "glassGel-ritual", title: "ritual" },
  { type: "gallery", variant: "glassGel-gallery", title: "gallery" },
  { type: "team", variant: "glassGel-team", title: "team" },
  { type: "testimonials", variant: "glassGel-testimonials", title: "testimonials" },
  { type: "packages", variant: "glassGel-packages", title: "packages" },
  { type: "whyUs", variant: "glassGel-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "glassGel-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "glassGel-footer", title: "footer" },
  { type: "aboutHero", variant: "glassGel-aboutHero", title: "aboutHero" },
  { type: "story", variant: "glassGel-story", title: "story" },
  { type: "spaceTour", variant: "glassGel-spaceTour", title: "spaceTour" },
  { type: "values", variant: "glassGel-values", title: "values" },
  { type: "specialistsDeep", variant: "glassGel-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "glassGel-certifications", title: "certifications" },
  { type: "timeline", variant: "glassGel-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "glassGel-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "glassGel-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "glassGel-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "glassGel-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "glassGel-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "glassGel-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "glassGel-addons", title: "addons" },
  { type: "beforeAfter", variant: "glassGel-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "glassGel-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "glassGel-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "glassGel-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "glassGel-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "glassGel-booking", title: "booking" },
  { type: "servicePicker", variant: "glassGel-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "glassGel-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "glassGel-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "glassGel-policies", title: "policies" },
  { type: "confirmationForm", variant: "glassGel-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "glassGel-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "glassGel-bookingFaq", title: "bookingFaq" },
];

export const geloraSeed = {
  id: "gelora",
  key: "gelora",
  name: "Gelora",
  title: "Gelora",
  description: "סטודיו לק ג׳ל מדויק: צבעים עונתיים, תיקונים מהירים ותורים נוחים.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "gel-polish",
  layout: "full",
  image: (geloraDefaultData as Record<string, any>).heroImage,
  heroTitle: (geloraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (geloraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `gelora-${index + 1}-${block.type}`, ...block })),
  pages: geloraPages,
  editor: { pages: geloraPages, css: geloraEditorCss },
  css: geloraEditorCss,
  data: geloraDefaultData,
  defaultData: geloraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const geloraTemplate = {
  id: "gelora",
  key: "gelora",
  name: "Gelora",
  title: "Gelora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "חדש",
  description: "סטודיו לק ג׳ל מדויק: צבעים עונתיים, תיקונים מהירים ותורים נוחים.",
  thumbnail: React.createElement(GeloraThumbnail),
  preview: React.createElement(GeloraPreview),
  component: GeloraPages,
  Component: GeloraPages,
  seed: geloraSeed,
  pages: geloraPages,
  editorCss: geloraEditorCss,
  schema: geloraSchema,
  defaultData: geloraDefaultData,
  renderer: {
    key: "gelora",
    name: "Gelora",
    Component: GeloraPages,
    component: GeloraPages,
    pages: geloraPages,
    editorMode: "visual-react",
    editorCss: geloraEditorCss,
    schema: geloraSchema,
    defaultData: geloraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default geloraTemplate;
