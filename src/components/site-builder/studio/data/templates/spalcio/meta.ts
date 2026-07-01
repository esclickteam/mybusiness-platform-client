import React from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import SpalcioThumbnail from "./thumbnail";
import SpalcioPreview from "./preview";

type TemplateBlockInput = Omit<ReadyWebsiteBlock, "id">;

const palette: ReadyWebsitePalette = {
  primary: "#111827",
  secondary: "#374151",
  accent: "#2563EB",
  background: "#F8FAFC",
  surface: "#FFFFFF",
  text: "#111827",
  muted: "#6B7280",
  dark: "#030712",
};

const blocks: TemplateBlockInput[] = [
  { type: "header", variant: "minimal", title: "Header" },
  { type: "hero", variant: "editorial-minimal", title: "Hero" },
  { type: "about", variant: "split-story", title: "About" },
  {
    type: "services",
    variant: "cards",
    title: "Services",
    items: ["Strategy", "Consulting", "Project Management"],
  },
  { type: "projects", variant: "case-grid", title: "Projects" },
  { type: "process", variant: "timeline", title: "Process" },
  { type: "reviews", variant: "cards", title: "Reviews" },
  { type: "contact", variant: "map", title: "Contact" },
  { type: "footer", variant: "minimal", title: "Footer" },
];

function withBlockIds(
  templateId: string,
  inputBlocks: TemplateBlockInput[]
): ReadyWebsiteBlock[] {
  return inputBlocks.map((block, index) => ({
    ...block,
    id: `${templateId}-${index + 1}`,
  }));
}

const seed: ReadyWebsiteTemplateSeed = {
  id: "spalcio",
  name: "Spalcio",
  category: "business",
  description:
    "A clean professional business website template for agencies, consultants and service providers.",
  niche: "Business",
  layout: "cleanEditorialGrid",
  image:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
  palette,
  heroTitle: "Built with clarity, shaped with purpose",
  heroSubtitle:
    "A professional website structure for businesses that want a clean and premium online presence.",
  blocks: withBlockIds("spalcio", blocks),
};

export const spalcioTemplate: StudioTemplateDefinition = {
  id: "spalcio",
  name: "Spalcio",
  author: "BizUply",
  priceLabel: "Included",
  category: "business",
  categoryLabel: "Business & Services",
  badge: "NEW",
  description:
    "Clean business website template with hero, services, projects, process and contact.",
  previewImage:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",

  thumbnail: React.createElement(SpalcioThumbnail),
  preview: React.createElement(SpalcioPreview),

  seed,
};