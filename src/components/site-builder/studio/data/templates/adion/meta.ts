import type { ComponentType } from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import AdionThumbnail from "./thumbnail";
import AdionPreview from "./preview";
import AdionPages, { adionPages } from "./pages";
import { adionEditorCss } from "./editorCss";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const adionThumbnailImage =
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=85";

const palette: ReadyWebsitePalette = {
  primary: "#F6EFE3",
  secondary: "#10100E",
  accent: "#F7C873",
  background: "#10100E",
  surface: "#191915",
  text: "#F6EFE3",
  muted: "#A9A093",
  dark: "#050504",
};

const blocks: TemplateBlockInput[] = [
  { type: "header", variant: "cinematic-sticky-dark", title: "ניווט עליון" },
  { type: "hero", variant: "framion-inspired-visual-hero", title: "פתיחה ראשית" },

  // ReadyBlockType לא תומך ב-"logos", לכן זה חייב להיות type קיים.
  { type: "about", variant: "partner-grid-dark", title: "לקוחות ושותפים" },

  { type: "about", variant: "large-editorial-manifesto", title: "מסר מותג" },
  { type: "services", variant: "image-cards-cinematic", title: "שירותים" },
  { type: "gallery", variant: "case-study-grid", title: "עבודות נבחרות" },
  {
    type: "testimonials",
    variant: "premium-review-cards",
    title: "ביקורות",
  },
  { type: "pricing", variant: "two-plan-cinematic", title: "מחירים" },
  { type: "faq", variant: "accordion-dark", title: "שאלות נפוצות" },
  { type: "contact", variant: "large-cta-contact", title: "צור קשר" },
  { type: "footer", variant: "editorial-footer", title: "פוטר" },
];

export const adionSeed = {
  id: "adion",
  templateId: "adion",

  name: "Adion",
  title: "Adion",

  category: "תיק עבודות",
  subcategory: "צילום ווידאו",

  description:
    "תבנית פרימיום לסטודיו צילום ווידאו, עם פתיחה קולנועית, טיפוגרפיה גדולה, כרטיסי תמונה, עבודות נבחרות וקריאה לפעולה חזקה.",

  palette,

  blocks: blocks.map((block, index) => ({
    ...block,
    id: `adion-${String(index + 1).padStart(2, "0")}-${block.type}`,
  })),

  pages: adionPages,
} as unknown as ReadyWebsiteTemplateSeed;

export const adionTemplate = {
  id: "adion",
  templateId: "adion",

  name: "Adion",
  title: "Adion",
  label: "Adion",

  category: "תיק עבודות",
  subcategory: "צילום ווידאו",

  description:
    "תבנית סטודיו קולנועית לצלמים, יוצרי וידאו, סטודיו קריאייטיב ומותגים שרוצים אתר פרימיום עם נראות חזקה, תנועה, גלריית עבודות ועמודי תוכן מלאים.",

  tags: [
    "צילום",
    "וידאו",
    "תיק עבודות",
    "סטודיו",
    "קריאייטיב",
    "מותגים",
    "כהה",
    "קולנועי",
  ],

  palette,
  seed: adionSeed,
  defaultData: adionSeed,

  pages: adionPages,

  Component: AdionPages as ComponentType<any>,
  Preview: AdionPreview,
  PreviewComponent: AdionPreview,

  Thumbnail: AdionThumbnail,
  ThumbnailComponent: AdionThumbnail,
  thumbnailComponent: AdionThumbnail,

  // חשוב: לחלק מהכרטיסיות במערכת יש צורך בתמונה כ־URL ולא קומפוננטה.
  thumbnail: adionThumbnailImage,
  thumbnailUrl: adionThumbnailImage,
  previewImage: adionThumbnailImage,
  coverImage: adionThumbnailImage,
  image: adionThumbnailImage,

  editorCss: adionEditorCss,
} as unknown as StudioTemplateDefinition;

export default adionTemplate;