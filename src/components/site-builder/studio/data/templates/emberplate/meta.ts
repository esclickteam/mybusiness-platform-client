import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import EmberplatePages, { emberplatePages } from "./pages";
import EmberplatePreview from "./preview";
import EmberplateThumbnail from "./thumbnail";
import { emberplateEditorCss } from "./editorCss";
import { emberplateSchema } from "./schema";
import { emberplateDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#e85d04", secondary: "#b89a82", accent: "#e85d04",
  background: "#140c08", surface: "#1f1410", text: "#f6ebe0", muted: "#b89a82", dark: "#0a0604",
};

export const emberplateSeed = {
  id: "emberplate", key: "emberplate", name: "Emberplate", title: "Emberplate",
  description: "תבנית גריל וסטייקים: הירו עם ניצוצות אש עולים, תפריט כציר בשר אנכי, שבבי שעות זוהרים וטופס הזמנה עם פעימת גחלים — תנועה חמה וקולנועית.",
  category: "food", categoryLabel: "אוכל ומסעדות", niche: "גריל · סטייקים", layout: "full",
  image: (emberplateDefaultData as any).heroImage,
  heroTitle: (emberplateDefaultData as any).heroTitle,
  heroSubtitle: (emberplateDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "charcoal-ember-nav", title: "Charcoal ember sticky nav" },
    { type: "hero", variant: "rising-ember-sparks", title: "Rising ember sparks hero" },
    { type: "menu", variant: "vertical-meat-timeline", title: "Vertical meat timeline" },
    { type: "process", variant: "ember-process-strip", title: "Ember process strip" },
    { type: "gallery", variant: "ember-gallery-mosaic", title: "Ember gallery mosaic" },
    { type: "reviews", variant: "ember-reviews-rail", title: "Ember reviews rail" },
    { type: "hours", variant: "glowing-hour-chips", title: "Glowing hour chips + stats" },
    { type: "cta", variant: "ember-home-cta", title: "Home CTA teaser" },
    { type: "menuPage", variant: "full-meat-menu", title: "Full meat menu page" },
    { type: "grillPage", variant: "coal-process-story", title: "Grill process story page" },
    { type: "about", variant: "ash-timeline-portrait", title: "Ash timeline + pitmaster" },
    { type: "contact", variant: "ember-reserve-faq", title: "Ember reserve + FAQ" },
    { type: "footer", variant: "ember-line", title: "Ember line footer" },
  ].map((b, i) => ({ id: `emberplate-${i+1}-${b.type}`, ...b })),
  pages: emberplatePages,
  editor: { pages: emberplatePages, css: emberplateEditorCss },
  css: emberplateEditorCss, data: emberplateDefaultData, defaultData: emberplateDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const emberplateTemplate = {
  id: "emberplate", key: "emberplate", name: "Emberplate", title: "Emberplate", author: "Bizuply", priceLabel: "כלול",
  category: "food", categoryLabel: "אוכל ומסעדות", badge: "חדש",
  description: "תבנית גריל וסטייקים: הירו עם ניצוצות אש עולים, תפריט כציר בשר אנכי, שבבי שעות זוהרים וטופס הזמנה עם פעימת גחלים — תנועה חמה וקולנועית.",
  thumbnail: React.createElement(EmberplateThumbnail),
  preview: React.createElement(EmberplatePreview),
  component: EmberplatePages, Component: EmberplatePages,
  seed: emberplateSeed, pages: emberplatePages, editorCss: emberplateEditorCss, schema: emberplateSchema, defaultData: emberplateDefaultData,
  renderer: {
    key: "emberplate", name: "Emberplate", Component: EmberplatePages, component: EmberplatePages, pages: emberplatePages,
    editorMode: "visual-react", editorCss: emberplateEditorCss, schema: emberplateSchema, defaultData: emberplateDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default emberplateTemplate;
