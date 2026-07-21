import React from "react";
import type { ReadyWebsitePalette, ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";
import AzurelinePages, { azurelinePages } from "./pages";
import AzurelinePreview from "./preview";
import AzurelineThumbnail from "./thumbnail";
import { azurelineEditorCss } from "./editorCss";
import { azurelineSchema } from "./schema";
import { azurelineDefaultData } from "./defaultData";

const palette: ReadyWebsitePalette = {
  primary: "#0066cc", secondary: "#5a7a96", accent: "#0066cc",
  background: "#f8fcff", surface: "#ffffff", text: "#0a2540", muted: "#5a7a96", dark: "#051828",
};

export const azurelineSeed = {
  id: "azureline", key: "azureline", name: "Azureline", title: "Azureline",
  description: "תבנית שכירת יאכטות: הירו מינימלי עם קו אופק ripple, נקודות מסלול, מפרטי כלי שייט ופס הזמנה — אפקט ripple-expand.",
  category: "travel", categoryLabel: "תיירות וחוף", niche: "יאcht · שייט", layout: "full",
  image: (azurelineDefaultData as any).heroImage,
  heroTitle: (azurelineDefaultData as any).heroTitle,
  heroSubtitle: (azurelineDefaultData as any).heroSubtitle,
  palette,
  blocks: [
    { type: "header", variant: "yacht-nav", title: "Yacht nav" },
    { type: "hero", variant: "horizon-ripple", title: "Horizon ripple hero" },
    { type: "routes", variant: "route-dots", title: "Route dots" },
    { type: "fleet", variant: "vessel-specs", title: "Vessel specs" },
    { type: "about", variant: "sailing-story", title: "Sailing story" },
    { type: "contact", variant: "charter-form", title: "Charter form" },
    { type: "footer", variant: "minimal", title: "Footer" },
  ].map((b, i) => ({ id: `azureline-${i+1}-${b.type}`, ...b })),
  pages: azurelinePages,
  editor: { pages: azurelinePages, css: azurelineEditorCss },
  css: azurelineEditorCss, data: azurelineDefaultData, defaultData: azurelineDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const azurelineTemplate = {
  id: "azureline", key: "azureline", name: "Azureline", title: "Azureline", author: "Bizuply", priceLabel: "כלול",
  category: "travel", categoryLabel: "תיירות וחוף", badge: "חדש",
  description: "תבנית שכירת יאכטות: הירו מינימלי עם קו אופק ripple, נקודות מסלול, מפרטי כלי שייט ופס הזמנה — אפקט ripple-expand.",
  thumbnail: React.createElement(AzurelineThumbnail),
  preview: React.createElement(AzurelinePreview),
  component: AzurelinePages, Component: AzurelinePages,
  seed: azurelineSeed, pages: azurelinePages, editorCss: azurelineEditorCss, schema: azurelineSchema, defaultData: azurelineDefaultData,
  renderer: {
    key: "azureline", name: "Azureline", Component: AzurelinePages, component: AzurelinePages, pages: azurelinePages,
    editorMode: "visual-react", editorCss: azurelineEditorCss, schema: azurelineSchema, defaultData: azurelineDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default azurelineTemplate;
