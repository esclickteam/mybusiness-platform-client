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
    "תבנית ספא/ביוטי יוקרתית בעברית עם Hero גדול, תנועה בגלילה, תהליך, שירותים, צוות, מחירון, FAQ וטופס קביעת תור.",
  previewImage:
    "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1500&q=90",
  seed: chanelSeed,
  thumbnail: React.createElement(ChanelThumbnail),
  preview: React.createElement(ChanelPreview),
} as unknown as StudioTemplateDefinition;
