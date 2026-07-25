import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import PeeloraPages, { peeloraPages } from "./pages";
import PeeloraPreview from "./preview";
import PeeloraThumbnail from "./thumbnail";
import { peeloraEditorCss } from "./editorCss";
import { peeloraSchema } from "./schema";
import { peeloraDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0EA5E9",
  secondary: "#EFF6FF",
  accent: "#BAE6FD",
  background: "#F8FCFF",
  surface: "#FFFFFF",
  text: "#0C4A6E",
  muted: "#63889B",
  dark: "#082F49",
};

const blocks = [
  { type: "header", variant: "peelClinic-header", title: "header" },
  { type: "hero", variant: "peelClinic-hero", title: "hero" },
  { type: "servicesPreview", variant: "peelClinic-servicesPreview", title: "servicesPreview" },
  { type: "ritual", variant: "peelClinic-ritual", title: "ritual" },
  { type: "gallery", variant: "peelClinic-gallery", title: "gallery" },
  { type: "team", variant: "peelClinic-team", title: "team" },
  { type: "testimonials", variant: "peelClinic-testimonials", title: "testimonials" },
  { type: "packages", variant: "peelClinic-packages", title: "packages" },
  { type: "whyUs", variant: "peelClinic-whyUs", title: "whyUs" },
  { type: "bookingTeaser", variant: "peelClinic-bookingTeaser", title: "bookingTeaser" },
  { type: "footer", variant: "peelClinic-footer", title: "footer" },
  { type: "aboutHero", variant: "peelClinic-aboutHero", title: "aboutHero" },
  { type: "story", variant: "peelClinic-story", title: "story" },
  { type: "spaceTour", variant: "peelClinic-spaceTour", title: "spaceTour" },
  { type: "values", variant: "peelClinic-values", title: "values" },
  { type: "specialistsDeep", variant: "peelClinic-specialistsDeep", title: "specialistsDeep" },
  { type: "certifications", variant: "peelClinic-certifications", title: "certifications" },
  { type: "timeline", variant: "peelClinic-timeline", title: "timeline" },
  { type: "pressQuotes", variant: "peelClinic-pressQuotes", title: "pressQuotes" },
  { type: "aboutCta", variant: "peelClinic-aboutCta", title: "aboutCta" },
  { type: "servicesHero", variant: "peelClinic-servicesHero", title: "servicesHero" },
  { type: "catalog", variant: "peelClinic-catalog", title: "catalog" },
  { type: "featuredTreatment", variant: "peelClinic-featuredTreatment", title: "featuredTreatment" },
  { type: "durationGuide", variant: "peelClinic-durationGuide", title: "durationGuide" },
  { type: "addons", variant: "peelClinic-addons", title: "addons" },
  { type: "beforeAfter", variant: "peelClinic-beforeAfter", title: "beforeAfter" },
  { type: "priceTable", variant: "peelClinic-priceTable", title: "priceTable" },
  { type: "serviceFaq", variant: "peelClinic-serviceFaq", title: "serviceFaq" },
  { type: "bookCta", variant: "peelClinic-bookCta", title: "bookCta" },
  { type: "bookingHero", variant: "peelClinic-bookingHero", title: "bookingHero" },
  { type: "booking", variant: "peelClinic-booking", title: "booking" },
  { type: "servicePicker", variant: "peelClinic-servicePicker", title: "servicePicker" },
  { type: "specialistPicker", variant: "peelClinic-specialistPicker", title: "specialistPicker" },
  { type: "hoursPanel", variant: "peelClinic-hoursPanel", title: "hoursPanel" },
  { type: "policies", variant: "peelClinic-policies", title: "policies" },
  { type: "confirmationForm", variant: "peelClinic-confirmationForm", title: "confirmationForm" },
  { type: "locationMap", variant: "peelClinic-locationMap", title: "locationMap" },
  { type: "bookingFaq", variant: "peelClinic-bookingFaq", title: "bookingFaq" },
];

export const peeloraSeed = {
  id: "peelora",
  key: "peelora",
  name: "Peelora",
  title: "Peelora",
  description: "טיפולי פנים ופילינג: חידוש מרקם, פיגמנטציה וזוהר מדורג.",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  niche: "peels-facials",
  layout: "full",
  image: (peeloraDefaultData as Record<string, any>).heroImage,
  heroTitle: (peeloraDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (peeloraDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: blocks.map((block, index) => ({ id: `peelora-${index + 1}-${block.type}`, ...block })),
  pages: peeloraPages,
  editor: { pages: peeloraPages, css: peeloraEditorCss },
  css: peeloraEditorCss,
  data: peeloraDefaultData,
  defaultData: peeloraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const peeloraTemplate = {
  id: "peelora",
  key: "peelora",
  name: "Peelora",
  title: "Peelora",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "beauty",
  categoryLabel: "יופי וטיפוח",
  badge: "Premium",
  description: "טיפולי פנים ופילינג: חידוש מרקם, פיגמנטציה וזוהר מדורג.",
  thumbnail: React.createElement(PeeloraThumbnail),
  preview: React.createElement(PeeloraPreview),
  component: PeeloraPages,
  Component: PeeloraPages,
  seed: peeloraSeed,
  pages: peeloraPages,
  editorCss: peeloraEditorCss,
  schema: peeloraSchema,
  defaultData: peeloraDefaultData,
  renderer: {
    key: "peelora",
    name: "Peelora",
    Component: PeeloraPages,
    component: PeeloraPages,
    pages: peeloraPages,
    editorMode: "visual-react",
    editorCss: peeloraEditorCss,
    schema: peeloraSchema,
    defaultData: peeloraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default peeloraTemplate;
