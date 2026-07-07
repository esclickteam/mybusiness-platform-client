import React from "react";

import type {
  ReadyWebsiteBlock,
  ReadyWebsitePalette,
  ReadyWebsiteTemplateSeed,
} from "../../readyWebsiteTypes";

import type { StudioTemplateDefinition } from "../types";

import LaunchoraThumbnail from "./thumbnail";
import LaunchoraPreview from "./preview";

const palette: ReadyWebsitePalette = {
  primary: "#050505",
  secondary: "#525252",
  accent: "#5277FF",
  background: "#FBFBFA",
  surface: "#FFFFFF",
  text: "#050505",
  muted: "#737373",
  dark: "#000000",
};

const blocks: ReadyWebsiteBlock[] = [
  {
    id: "launchora-header",
    type: "header",
    variant: "launchora-premium-nav",
    title: "Premium Navigation",
  },
  {
    id: "launchora-hero",
    type: "hero",
    variant: "launchora-floating-cards",
    title: "Hero Floating Cards",
  },
  {
    id: "launchora-featured-work",
    type: "gallery",
    variant: "launchora-featured-work",
    title: "Featured Work",
  },
  {
    id: "launchora-services",
    type: "services",
    variant: "launchora-service-cards",
    title: "Services",
  },
  {
    id: "launchora-testimonials",
    type: "testimonials",
    variant: "launchora-testimonials",
    title: "Testimonials",
  },
  {
    id: "launchora-pricing",
    type: "pricing",
    variant: "launchora-pricing",
    title: "Pricing",
  },
  {
    id: "launchora-faq",
    type: "faq",
    variant: "launchora-faq",
    title: "FAQ",
  },
  {
    id: "launchora-contact",
    type: "contact",
    variant: "launchora-dark-cta",
    title: "Final CTA",
  },
];

export const launchoraSeed: ReadyWebsiteTemplateSeed = {
  id: "launchora",
  name: "Launchora",
  description:
    "Premium portfolio and creative agency template with floating hero cards, smooth reveal effects, featured work, pricing, testimonials and FAQ.",
  category: "business",

  niche: "Creative Agency",
  layout: "premium-agency",
  image:
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",

  heroTitle: "Design that moves brands forward.",
  heroSubtitle:
    "We help ambitious companies grow with strategic branding, web experiences, and digital products that drive results.",

  palette,
  blocks,
};

export const launchoraTemplate: StudioTemplateDefinition = {
  id: "launchora",
  name: "Launchora",
  description:
    "תבנית פרימיום בסגנון Framer לסוכנויות, מעצבים, פורטפוליו ועסקים יצירתיים.",
  category: "business",
  categoryLabel: "Business",
  author: "Invistimo Studio",
  priceLabel: "Premium",

  thumbnail: React.createElement(LaunchoraThumbnail),
  preview: React.createElement(LaunchoraPreview),

  seed: launchoraSeed,
};

export default launchoraTemplate;