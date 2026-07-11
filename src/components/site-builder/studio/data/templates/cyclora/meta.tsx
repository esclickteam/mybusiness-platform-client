import React from "react";

import type { StudioTemplateDefinition } from "../types";

import { cycloraDefaultData } from "./cycloraData";
import CycloraPreview from "./preview";

export const cycloraTemplate = {
  id: "cyclora",
  name: "Cyclora",
  author: "BizUply",

  category: "portfolio",
  categoryLabel: "פורטפוליו וסוכנות",

  priceLabel: "חינם",
  badge: "NEW",

  description:
    "תבנית פרימיום כהה לסטודיו, סוכנות קריאייטיב או מותג דיגיטלי, עם Hero קולנועי, מדיה מרחפת, אנימציות גלילה, עבודות, המלצות, מחירון, שאלות נפוצות וקריאה לפעולה.",

  image:
    "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=90",

  previewImage:
    "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1600&q=90",

  seed: cycloraDefaultData,

  thumbnail: React.createElement(CycloraPreview),
  preview: React.createElement(CycloraPreview),
} as unknown as StudioTemplateDefinition;

export default cycloraTemplate;