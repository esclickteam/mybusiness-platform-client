import React from "react";

import type { StudioTemplateDefinition } from "../types";

import { chanelDefaultData } from "./chanelData";
import ChanelPreview from "./preview";

const CHANEL_PREVIEW_IMAGE =
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1600&q=90";

export const chanelTemplate = {
  id: "chanel",
  name: "שאנל",
  author: "BizUply",

  category: "store",
  categoryLabel: "חנות ואיקומרס",

  priceLabel: "חינם",
  badge: "חדש",

  description:
    "תבנית יוקרה לאקססוריז ואיקומרס, עם פס קידום, קטגוריות, מוצרים נבחרים, ערכים, קהילה, המלצות, אומנות ייצור, יומן, ניוזלטר ותחתית — בעיצוב קרם ושחור אלגנטי.",

  image: CHANEL_PREVIEW_IMAGE,
  previewImage: CHANEL_PREVIEW_IMAGE,

  seed: chanelDefaultData,

  thumbnail: React.createElement(ChanelPreview),
  preview: React.createElement(ChanelPreview),
} as unknown as StudioTemplateDefinition;

export default chanelTemplate;
