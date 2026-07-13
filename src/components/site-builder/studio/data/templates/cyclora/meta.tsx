import React from "react";

import type { StudioTemplateDefinition } from "../types";

import { cycloraDefaultData } from "./cycloraData";
import CycloraPreview from "./preview";

const CYCLORA_PREVIEW_IMAGE =
  "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=90";

export const cycloraTemplate = {
  id: "cyclora",
  name: "Cyclora",
  author: "BizUply",

  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",

  priceLabel: "חינם",
  badge: "NEW",

  description:
    "תבנית פרימיום כהה לסטודיו שיווק או סוכנות דיגיטלית, עם Hero קולנועי, מדיה מרחפת, אנימציות גלילה, עבודות, המלצות, מחירון, שאלות נפוצות וקריאה לפעולה.",

  image: CYCLORA_PREVIEW_IMAGE,
  previewImage: CYCLORA_PREVIEW_IMAGE,

  seed: cycloraDefaultData,

  thumbnail: React.createElement(CycloraPreview),
  preview: React.createElement(CycloraPreview),
} as unknown as StudioTemplateDefinition;

export default cycloraTemplate;
