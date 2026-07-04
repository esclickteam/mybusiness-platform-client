import React from "react";
import type { StudioTemplateDefinition } from "../types";
import { chanelSeed } from "./chanelData";
import ChanelPreview from "./preview";
import ChanelThumbnail from "./thumbnail";

export const chanelTemplate = {
  id: "chanel",
  name: "Chanel",
  author: "BizUply",
  category: "beauty",
  categoryLabel: "ביוטי",
  priceLabel: "חינם",
  description:
    "תבנית ספא/ביוטי מקורית בסגנון Apsora עם גלילה פנימית, תנועה רכה לפי גלילה, מחירון, צוות, FAQ, צור קשר ובלוג.",
  previewImage:
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1600&q=90",
  seed: chanelSeed,
  thumbnail: React.createElement(ChanelThumbnail),
  preview: React.createElement(ChanelPreview),
} as unknown as StudioTemplateDefinition;
