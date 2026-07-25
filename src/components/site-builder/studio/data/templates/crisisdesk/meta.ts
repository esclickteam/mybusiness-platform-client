import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import CrisisdeskPages, { crisisdeskPages } from "./pages";
import CrisisdeskPreview from "./preview";
import CrisisdeskThumbnail from "./thumbnail";
import { crisisdeskEditorCss } from "./editorCss";
import { crisisdeskSchema } from "./schema";
import { crisisdeskDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#DC2626",
  secondary: "#030712",
  accent: "#FDE047",
  background: "#111827",
  surface: "#1F2937",
  text: "#F9FAFB",
  muted: "#D1D5DB",
  dark: "#030712",
};

export const crisisdeskSeed = {
  id: "crisisdesk",
  key: "crisisdesk",
  name: "CrisisDesk",
  title: "CrisisDesk",
  description: "אתר מלא לסוכנות תקשורת משברים: 8 עמודים, תנועה, אפקטים ועיצוב newsroom alert.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "crisis-communications",
  layout: "full-agency",
  image: (crisisdeskDefaultData as Record<string, any>).heroImage,
  heroTitle: (crisisdeskDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (crisisdeskDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "crisisdesk-header", title: "Header" },
    { type: "hero", variant: "crisisdesk-hero", title: "Hero" },
    { type: "about", variant: "crisisdesk-about", title: "About" },
    { type: "services", variant: "crisisdesk-services", title: "Services" },
    { type: "cases", variant: "crisisdesk-cases", title: "Cases" },
    { type: "team", variant: "crisisdesk-team", title: "Team" },
    { type: "gallery", variant: "crisisdesk-gallery", title: "Gallery" },
    { type: "contact", variant: "crisisdesk-contact", title: "Contact" },
    { type: "footer", variant: "crisisdesk-footer", title: "Footer" },
  ].map((block, index) => ({ id: `crisisdesk-${index + 1}-${block.type}`, ...block })),
  pages: crisisdeskPages,
  editor: { pages: crisisdeskPages, css: crisisdeskEditorCss },
  css: crisisdeskEditorCss,
  data: crisisdeskDefaultData,
  defaultData: crisisdeskDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const crisisdeskTemplate = {
  id: "crisisdesk",
  key: "crisisdesk",
  name: "CrisisDesk",
  title: "CrisisDesk",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות תקשורת משברים עם 8 עמודים, תנועה ואפקטים — newsroom alert.",
  thumbnail: React.createElement(CrisisdeskThumbnail),
  preview: React.createElement(CrisisdeskPreview),
  component: CrisisdeskPages,
  Component: CrisisdeskPages,
  seed: crisisdeskSeed,
  pages: crisisdeskPages,
  editorCss: crisisdeskEditorCss,
  schema: crisisdeskSchema,
  defaultData: crisisdeskDefaultData,
  renderer: {
    key: "crisisdesk",
    name: "CrisisDesk",
    Component: CrisisdeskPages,
    component: CrisisdeskPages,
    pages: crisisdeskPages,
    editorMode: "visual-react",
    editorCss: crisisdeskEditorCss,
    schema: crisisdeskSchema,
    defaultData: crisisdeskDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default crisisdeskTemplate;
