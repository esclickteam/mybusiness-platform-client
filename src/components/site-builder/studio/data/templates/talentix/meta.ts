import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import TalentixPages, { talentixPages } from "./pages";
import TalentixPreview from "./preview";
import TalentixThumbnail from "./thumbnail";
import { talentixEditorCss } from "./editorCss";
import { talentixSchema } from "./schema";
import { talentixDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0891B2",
  secondary: "#164E63",
  accent: "#22D3EE",
  background: "#ECFEFF",
  surface: "#FFFFFF",
  text: "#083344",
  muted: "#0E7490",
  dark: "#164E63",
};

export const talentixSeed = {
  id: "talentix",
  key: "talentix",
  name: "Talentix",
  title: "Talentix",
  description: "אתר מלא לסוכנות גיוס: 8 עמודים, תנועה, אפקטים ועיצוב ייחודי.",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  niche: "recruitment-agency",
  layout: "full",
  image: (talentixDefaultData as Record<string, any>).heroImage,
  heroTitle: (talentixDefaultData as Record<string, any>).heroTitle,
  heroSubtitle: (talentixDefaultData as Record<string, any>).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "talentix-header", title: "Header" },
    { type: "hero", variant: "talentix-hero", title: "Hero" },
    { type: "services", variant: "talentix-services", title: "Services" },
    { type: "cases", variant: "talentix-cases", title: "Cases" },
    { type: "team", variant: "talentix-team", title: "Team" },
    { type: "contact", variant: "talentix-contact", title: "Contact" },
    { type: "footer", variant: "talentix-footer", title: "Footer" },
  ].map((block, index) => ({ id: `talentix-${index + 1}-${block.type}`, ...block })),
  pages: talentixPages,
  editor: { pages: talentixPages, css: talentixEditorCss },
  css: talentixEditorCss,
  data: talentixDefaultData,
  defaultData: talentixDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const talentixTemplate = {
  id: "talentix",
  key: "talentix",
  name: "Talentix",
  title: "Talentix",
  author: "Bizuply",
  priceLabel: "Premium",
  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",
  badge: "חדש",
  description: "אתר מלא לסוכנות גיוס עם 8 עמודים, תנועה ואפקטים — עיצוב ייחודי.",
  thumbnail: React.createElement(TalentixThumbnail),
  preview: React.createElement(TalentixPreview),
  component: TalentixPages,
  Component: TalentixPages,
  seed: talentixSeed,
  pages: talentixPages,
  editorCss: talentixEditorCss,
  schema: talentixSchema,
  defaultData: talentixDefaultData,
  renderer: {
    key: "talentix",
    name: "Talentix",
    Component: TalentixPages,
    component: TalentixPages,
    pages: talentixPages,
    editorMode: "visual-react",
    editorCss: talentixEditorCss,
    schema: talentixSchema,
    defaultData: talentixDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default talentixTemplate;
