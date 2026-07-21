import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import LedgerPages, { ledgerPages } from "./pages";
import LedgerPreview from "./preview";
import LedgerThumbnail from "./thumbnail";
import { ledgerEditorCss } from "./editorCss";
import { ledgerSchema } from "./schema";
import { ledgerDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0d5c45",
  secondary: "#102018",
  accent: "#0d5c45",
  background: "#f6f3ea",
  surface: "#f6f3ea",
  text: "#102018",
  muted: "#10201899",
  dark: "#102018",
};

export const ledgerSeed = {
  id: "ledger",
  key: "ledger",
  name: "Ledger",
  title: "Ledger",
  description: "תבנית פיננסית: גריד טבלאי, ירוק-קרם, 5 עמודים עם סקשנים מובנים וברורים.",
  category: "finance",
  categoryLabel: "פיננסים וחשבונאות",
  niche: "accounting-finance",
  layout: "full",
  image: (ledgerDefaultData as Record<string, any>).heroImage,
  heroTitle: (ledgerDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (ledgerDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "rect-nav", title: "Header" },
    { type: "hero", variant: "rect-split", title: "Hero" },
    { type: "stats", variant: "rect-grid", title: "Stats" },
    { type: "services", variant: "rect-columns", title: "Services" },
    { type: "work", variant: "rect-gallery", title: "Work" },
    { type: "process", variant: "rect-steps", title: "Process" },
    { type: "contact", variant: "rect-form", title: "Contact" },
    { type: "footer", variant: "rect-footer", title: "Footer" },
  ].map((block, index) => ({ id: `ledger-${index + 1}-${block.type}`, ...block })),
  pages: ledgerPages,
  editor: { pages: ledgerPages, css: ledgerEditorCss },
  css: ledgerEditorCss,
  data: ledgerDefaultData,
  defaultData: ledgerDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const ledgerTemplate = {
  id: "ledger",
  key: "ledger",
  name: "Ledger",
  title: "Ledger",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "finance",
  categoryLabel: "פיננסים וחשבונאות",
  badge: "חדש",
  description: "תבנית פיננסית: גריד טבלאי, ירוק-קרם, 5 עמודים עם סקשנים מובנים וברורים.",
  thumbnail: React.createElement(LedgerThumbnail),
  preview: React.createElement(LedgerPreview),
  component: LedgerPages,
  Component: LedgerPages,
  seed: ledgerSeed,
  pages: ledgerPages,
  editorCss: ledgerEditorCss,
  schema: ledgerSchema,
  defaultData: ledgerDefaultData,
  renderer: {
    key: "ledger",
    name: "Ledger",
    Component: LedgerPages,
    component: LedgerPages,
    pages: ledgerPages,
    editorMode: "visual-react",
    editorCss: ledgerEditorCss,
    schema: ledgerSchema,
    defaultData: ledgerDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default ledgerTemplate;
