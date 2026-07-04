import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const wantravelPreviewImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

const palette: ReadyWebsitePalette = {
  primary: "#18392F",
  secondary: "#2D5A49",
  accent: "#B6772F",
  background: "#F7F1E7",
  surface: "#FFF8EF",
  text: "#1F2A24",
  muted: "#6B786F",
  dark: "#10211B",
};

const blocks: TemplateBlockInput[] = [
  {
    type: "header",
    variant: "travel-luxury-rtl",
    title: "Header",
  },
  {
    type: "hero",
    variant: "travel-editorial-rtl",
    title: "Hero",
  },
  {
    type: "collection",
    variant: "destinations-grid-rtl",
    title: "Destinations",
  },
  {
    type: "services",
    variant: "tour-packages-rtl",
    title: "Packages",
  },
  {
    type: "services",
    variant: "process-steps-rtl",
    title: "Process",
  },
  {
    type: "testimonials",
    variant: "travel-reviews-rtl",
    title: "Testimonials",
  },
  {
    type: "contact",
    variant: "travel-booking-form-rtl",
    title: "Booking",
  },
  {
    type: "footer",
    variant: "travel-footer-rtl",
    title: "Footer",
  },
];

export const wantravelTemplateSeed = {
  id: "wantravel",
  name: "Wantravel",
  category: "beauty",
  description:
    "תבנית יוקרתית בעברית לסוכנות נסיעות, יעדים, חבילות, המלצות וטופס יצירת קשר.",
  image: wantravelPreviewImage,
  palette,
  blocks: blocks.map((block, index) => ({
    id: `wantravel-block-${index + 1}`,
    ...block,
  })),
} as unknown as ReadyWebsiteTemplateSeed;

export const wantravelTemplate: StudioTemplateDefinition = {
  id: "wantravel",
  name: "Wantravel",
  author: "BizUply",
  category: "beauty",
  categoryLabel: "ביוטי",
  priceLabel: "פרימיום",
  description:
    "תבנית יוקרתית ומודרנית לסוכנות נסיעות בעברית, עם הירו גדול, יעדים, חבילות, המלצות וטופס יצירת קשר.",
  seed: wantravelTemplateSeed,
};