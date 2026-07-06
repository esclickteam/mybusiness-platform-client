import React from "react";

import type { StudioTemplateDefinition } from "../types";

import ElevoraPreview from "./preview";
import { elevoraEditorCss } from "./editorCss";
import { elevoraSeed } from "./elevoraData";

export const elevoraTemplate = {
  id: "elevora",
  name: "Elevora",
  author: "BizUply",
  category: "business",
  categoryLabel: "עסקים ושירותים",
  priceLabel: "חינם",
  badge: "NEW",
  description:
    "תבנית יוקרתית לעסקים נותני שירות, יועצים, סוכנויות, קליניקות ושירותים מקצועיים. כוללת Hero חזק, שירותים, אודות, תהליך עבודה, המלצות, FAQ וטופס לידים.",
  image:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  previewImage:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",

  seed: elevoraSeed,

  css: elevoraEditorCss,
  editorCss: elevoraEditorCss,

  thumbnail: React.createElement(ElevoraPreview),
  preview: React.createElement(ElevoraPreview),
} as unknown as StudioTemplateDefinition;

export default elevoraTemplate;