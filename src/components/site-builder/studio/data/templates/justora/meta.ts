import React from "react";

import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import JustoraPages, { justoraPages } from "./pages";
import JustoraPreview from "./preview";
import JustoraThumbnail from "./thumbnail";
import { justoraEditorCss } from "./editorCss";
import { justoraSchema } from "./schema";
import { justoraDefaultData } from "./defaultData";

const justoraSeed = {
  id: "justora",
  templateId: "justora",
  name: "Justora",
  title: "Justora",
  description:
    "תבנית פרימיום למשרדי עורכי דין עם הירו סמכותי, תחומי התמחות, בדיקת תיק, צוות, תיקים, המלצות, מאמרים וטופס ייעוץ.",
  category: "business",
  categoryLabel: "עורכי דין",
  priceLabel: "Premium",
  pages: justoraPages,
  defaultData: justoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const justoraTemplate = {
  id: "justora",
  name: "Justora",

  description:
    "תבנית פרימיום למשרדי עורכי דין עם הירו סמכותי, תחומי התמחות, בדיקת תיק, צוות, תיקים, המלצות, מאמרים וטופס ייעוץ.",

  category: "business",
  categoryLabel: "עורכי דין",
  priceLabel: "Premium",

  thumbnail: React.createElement(JustoraThumbnail),
  preview: React.createElement(JustoraPreview),

  seed: justoraSeed,

  renderer: {
    Component: JustoraPages,
    pages: justoraPages,
    editorCss: justoraEditorCss,
    schema: justoraSchema as unknown,
    defaultData: justoraDefaultData as unknown as Record<string, any>,
  },
} as unknown as StudioTemplateDefinition;