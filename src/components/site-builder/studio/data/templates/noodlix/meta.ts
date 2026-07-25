import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import NoodlixPages, { noodlixPages } from "./pages";
import NoodlixPreview from "./preview";
import NoodlixThumbnail from "./thumbnail";
import { noodlixEditorCss } from "./editorCss";
import { noodlixSchema } from "./schema";
import { noodlixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#3dd6c6", secondary: "#8aa89a", accent: "#3dd6c6",
  background: "#0f1412", surface: "#18201c", text: "#eef6f1", muted: "#8aa89a", dark: "#070a09",
};

export const noodlixSeed = {
  id: "noodlix", key: "noodlix", name: "Noodlix", title: "Noodlix",
  description: "תבנית ראמן ואסיה: הירו עם קיטור עולה סביב קערה, תפריט רדיאלי עגול, שלבי הכנה במקלות אכילה וטופס עגול — אפקטי steam וריחוף.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "ראמן · אסיה", layout: "full",
  image: (noodlixDefaultData as any).heroImage,
  heroTitle: (noodlixDefaultData as any).heroTitle,
  heroSubtitle: (noodlixDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "floating-pill-nav", title: "Floating pill nav" },
    { type: "hero", variant: "centered-bowl-steam", title: "Centered bowl steam hero" },
    { type: "dishes", variant: "radial-circular-dishes", title: "Radial circular dishes" },
    { type: "process", variant: "steam-process-steps", title: "Steam process steps" },
    { type: "gallery", variant: "steam-round-gallery", title: "Steam round gallery" },
    { type: "reviews", variant: "steam-reviews", title: "Steam reviews" },
    { type: "stats", variant: "steam-stats-hours", title: "Steam stats + hours" },
    { type: "cta", variant: "steam-home-cta", title: "Home CTA teaser" },
    { type: "bowlsPage", variant: "full-bowl-menu", title: "Full bowls menu page" },
    { type: "brothPage", variant: "broth-lab-story", title: "Broth lab story page" },
    { type: "about", variant: "steam-timeline-chef", title: "Steam timeline + chef" },
    { type: "contact", variant: "circular-steam-reserve", title: "Circular reserve + FAQ" },
    { type: "footer", variant: "noodle-wave-svg", title: "Noodle wave footer" },
  ].map((b, i) => ({ id: `noodlix-${i+1}-${b.type}`, ...b })),
  pages: noodlixPages,
  editor: { pages: noodlixPages, css: noodlixEditorCss },
  css: noodlixEditorCss, data: noodlixDefaultData, defaultData: noodlixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const noodlixTemplate = {
  id: "noodlix", key: "noodlix", name: "Noodlix", title: "Noodlix", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית ראמן ואסיה: הירו עם קיטור עולה סביב קערה, תפריט רדיאלי עגול, שלבי הכנה במקלות אכילה וטופס עגול — אפקטי steam וריחוף.",
  thumbnail: React.createElement(NoodlixThumbnail),
  preview: React.createElement(NoodlixPreview),
  component: NoodlixPages, Component: NoodlixPages,
  seed: noodlixSeed, pages: noodlixPages, editorCss: noodlixEditorCss, schema: noodlixSchema, defaultData: noodlixDefaultData,
  renderer: {
    key: "noodlix", name: "Noodlix", Component: NoodlixPages, component: NoodlixPages, pages: noodlixPages,
    editorMode: "visual-react", editorCss: noodlixEditorCss, schema: noodlixSchema, defaultData: noodlixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default noodlixTemplate;
