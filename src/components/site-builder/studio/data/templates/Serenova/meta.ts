import React from "react";

import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import SerenovaPages, { serenovaPages } from "./pages";
import SerenovaPreview from "./preview";
import SerenovaThumbnail from "./thumbnail";
import { serenovaEditorCss } from "./editorCss";
import { serenovaSchema } from "./schema";
import { serenovaDefaultData } from "./defaultData";

export const serenovaTemplate = {
  id: "serenova",
  name: "Serenova",

  description:
    "תבנית פרימיום רגועה לקליניקות, מטפלים, יועצים וקואצ׳רים עם אפקטים רכים, אזורי שירותים, מחירון, גלריה, מאמרים וטופס יצירת קשר.",

  category: "business",
  categoryLabel: "שירותים מקצועיים",
  priceLabel: "Premium",

  thumbnail: React.createElement(SerenovaThumbnail),
  preview: React.createElement(SerenovaPreview),

  renderer: {
    Component: SerenovaPages,
    pages: serenovaPages,
    editorCss: serenovaEditorCss,
    schema: serenovaSchema,
    defaultData: serenovaDefaultData as unknown as ReadyWebsiteTemplateSeed,
  },
} as unknown as StudioTemplateDefinition;