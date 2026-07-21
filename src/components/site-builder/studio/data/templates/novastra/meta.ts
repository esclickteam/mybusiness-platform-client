import type {
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import NovastraPages, { novastraPages } from "./pages";
import NovastraPreview from "./preview";
import NovastraThumbnail from "./thumbnail";
import { novastraDefaultData } from "./defaultData";
import { novastraEditorCss } from "./editorCss";
import { novastraSchema } from "./schema";

const palette: ReadyWebsitePalette = {
  primary: "#09090B",
  secondary: "#27272A",
  accent: "#F5F0E8",
  background: "#FFFFFF",
  surface: "#F7F3EC",
  text: "#09090B",
  muted: "#71717A",
  dark: "#09090B",
};

const blocks = [
  { type: "header", variant: "fashion-mega-menu", title: "Header" },
  { type: "hero", variant: "fashion-collage-motion", title: "Hero" },
  { type: "collection", variant: "editorial-cards", title: "Collections" },
  { type: "products", variant: "premium-grid", title: "New Arrivals" },
  { type: "feature", variant: "featured-piece", title: "Featured Piece" },
  { type: "testimonials", variant: "moving-reviews", title: "Reviews" },
  { type: "journal", variant: "fashion-blog", title: "Journal" },
  { type: "faq", variant: "dark-faq", title: "FAQ" },
  { type: "newsletter", variant: "split-newsletter", title: "Newsletter" },
  { type: "footer", variant: "premium-footer", title: "Footer" },
];

export const novastraSeed = {
  id: "novastra",
  key: "novastra",
  name: "Novastra",
  title: "Novastra",
  description:
    "תבנית אופנה / מסחר אלקטרוני פרימיום עם הירו קולאז׳, מגה־מניו, באנרים זזים, רשת מוצרים, ביקורות, יומן, FAQ וניוזלטר.",
  category: "ecommerce",
  categoryLabel: "חנויות / אופנה",
  palette,
  blocks: blocks.map((block, index) => ({
    id: `novastra-${index + 1}-${block.type}`,
    ...block,
  })),
  pages: novastraPages,
  editor: {
    pages: novastraPages,
    css: novastraEditorCss,
  },
  css: novastraEditorCss,
  data: novastraDefaultData,
  defaultData: novastraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const novastraTemplate = {
  id: "novastra",
  key: "novastra",
  name: "Novastra",
  title: "Novastra",
  author: "Bizuply",
  priceLabel: "כלול",
  category: "ecommerce",
  categoryLabel: "חנויות / אופנה",
  badge: "חדש",
  description:
    "תבנית אופנה פרימיום בסגנון Astral Threads: הירו קולאז׳, מגה־מניו, באנרים זזים, מוצרים, ביקורות, יומן, FAQ וניוזלטר.",
  thumbnail: NovastraThumbnail,
  preview: NovastraPreview,
  component: NovastraPages,
  Component: NovastraPages,
  seed: novastraSeed,
  pages: novastraPages,
  editorCss: novastraEditorCss,
  schema: novastraSchema,
  defaultData: novastraDefaultData,
  renderer: {
    key: "novastra",
    name: "Novastra",
    Component: NovastraPages,
    component: NovastraPages,
    pages: novastraPages,
    editorMode: "visual-react",
    editorCss: novastraEditorCss,
    schema: novastraSchema,
    defaultData: novastraDefaultData,
  },
} as unknown as StudioTemplateDefinition;

export default novastraTemplate;