import React from "react";
import type { StudioTemplateDefinition } from "../types";
import { chanelSeed, chanelImages } from "./chanelData";
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
    "תבנית ספא/ביוטי יוקרתית עם Hero גדול, חוויית גלילה רכה, אנימציות פרימיום, טיפולים, מחירון, צוות, גלריה, FAQ, קביעת תור וצור קשר.",

  previewImage: chanelImages.hero,
  image: chanelImages.hero,
  thumbnailImage: chanelImages.hero,

  seed: chanelSeed,

  thumbnail: React.createElement(ChanelThumbnail),
  preview: React.createElement(ChanelPreview),
} as unknown as StudioTemplateDefinition;