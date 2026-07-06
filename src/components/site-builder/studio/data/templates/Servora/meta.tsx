import React from "react";

import type { StudioTemplateDefinition } from "../types";

import ServoraPreview from "./preview";
import { servoraEditorCss } from "./editorCss";
import { servoraSeed } from "./servoraData";

export const servoraTemplate = {
  id: "servora",
  name: "Servora",
  author: "BizUply",
  category: "home-services",
  categoryLabel: "שירותי בית",
  priceLabel: "חינם",
  badge: "NEW",
  description:
    "תבנית פרימיום לעסקי שירות לבית: הנדימן, אינסטלטור, חשמלאי, מיזוג, ניקיון, הדברה, גינון ושיפוצים.",
  image:
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=90",
  previewImage:
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1400&q=90",
  seed: servoraSeed,
  css: servoraEditorCss,
  editorCss: servoraEditorCss,
  thumbnail: React.createElement(ServoraPreview),
  preview: React.createElement(ServoraPreview),
} as unknown as StudioTemplateDefinition;

export default servoraTemplate;