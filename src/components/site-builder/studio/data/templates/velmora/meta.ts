import React from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import VelmoraThumbnail from "./thumbnail";
import VelmoraPreview from "./preview";
import { velmoraEditorCss } from "./editorCss";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const palette: ReadyWebsitePalette = {
  primary: "#2F241B",
  secondary: "#6D5A49",
  accent: "#9A6F3B",
  background: "#FBF7EF",
  surface: "#FFFFFF",
  text: "#2F241B",
  muted: "#8B735F",
  dark: "#1F1712",
};

const blocks: TemplateBlockInput[] = [
  { type: "header", variant: "boutique-rtl", title: "Header" },
  { type: "hero", variant: "fashion-editorial-rtl", title: "Hero" },
  { type: "collection", variant: "boutique-grid-rtl", title: "Collections" },
  {
    type: "store",
    variant: "premium-products-rtl",
    title: "Products",
    items: ["שמלות", "בלייזרים", "אקססוריז"],
  },
  { type: "gallery", variant: "lookbook-rtl", title: "Lookbook" },
  { type: "about", variant: "brand-story-rtl", title: "About" },
  { type: "faq", variant: "accordion-rtl", title: "FAQ" },
  { type: "contact", variant: "boutique-contact-rtl", title: "Contact" },
  { type: "footer", variant: "boutique-footer-rtl", title: "Footer" },
];

function withBlockIds(
  templateId: string,
  inputBlocks: TemplateBlockInput[],
): ReadyWebsiteBlock[] {
  return inputBlocks.map((block, index) => ({
    ...block,
    id: `${templateId}-${index + 1}`,
  }));
}

/**
 * חשוב:
 * ה־CSS של Velmora חייב להיות רשום גם על ה־seed וגם על ה־template.
 * יש אצלך כמה מסלולי רינדור:
 * 1. preview React component
 * 2. visual editor / renderer registry
 * 3. editor seed / static render
 *
 * לכן שמים את velmoraEditorCss בכמה מקומות.
 * ה־cast ל־ReadyWebsiteTemplateSeed מונע שגיאות TypeScript אם הטייפ הרשמי
 * עדיין לא כולל css/editorCss/editor.
 */
const seed = {
  id: "velmora",
  name: "Velmora",
  category: "store",
  description:
    "תבנית בוטיק יוקרתית בעברית לחנות בגדים, מותג לייףסטייל או נותני שירות שרוצים אתר נקי ואלגנטי.",
  niche: "חנות בגדים",
  layout: "rtlBoutiqueEditorial",
  image:
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",
  palette,
  heroTitle: "אופנה נקייה, מדויקת ויוקרתית ליום־יום שלך.",
  heroSubtitle:
    "תבנית עברית מלאה לחנות בגדים, קולקציות, לוקבוק, סיפור מותג ויצירת קשר.",
  blocks: withBlockIds("velmora", blocks),

  /**
   * תמיכה ברנדררים שקוראים CSS ישירות מה־seed.
   */
  css: velmoraEditorCss,
  editorCss: velmoraEditorCss,

  /**
   * תמיכה ברנדררים שקוראים CSS מתוך seed.editor.css.
   */
  editor: {
    css: velmoraEditorCss,
    pages: [],
  },
} as unknown as ReadyWebsiteTemplateSeed;

export const velmoraTemplate = {
  id: "velmora",
  name: "Velmora",
  author: "BizUply",
  priceLabel: "כלול",
  category: "store",
  categoryLabel: "קמעונאות / מסחר אלקטרוני",
  badge: "חדש",
  description:
    "תבנית בוטיק עברית לחנות בגדים, קולקציות, מוצרים, לוקבוק וסיפור מותג.",
  previewImage:
    "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80",

  /**
   * חשוב:
   * אם WebsiteStudioPage / TemplateVisualEditor / Registry מחפשים editorCss
   * על אובייקט התבנית, הם יקבלו אותו מכאן.
   */
  editorCss: velmoraEditorCss,
  css: velmoraEditorCss,

  thumbnail: React.createElement(VelmoraThumbnail),
  preview: React.createElement(VelmoraPreview),

  seed,
} as unknown as StudioTemplateDefinition;
