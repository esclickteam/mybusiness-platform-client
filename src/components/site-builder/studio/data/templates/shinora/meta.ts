import React from "react";

import type { ReadyWebsiteTemplateSeed } from "../../readyWebsiteTypes";
import type { StudioTemplateDefinition } from "../types";

import ShinoraPages, { shinoraPages } from "./pages";
import ShinoraPreview from "./preview";
import ShinoraThumbnail from "./thumbnail";
import { shinoraDefaultData } from "./defaultData";

const shinoraDescription =
  "תבנית סלון יופי פרימיום בהשראת Shiny: הירו גדול, שירותים, ייעוץ חינמי, סטטיסטיקות, וידאו, מנהלת, המלצות, גלריה, חנות, בלוג ופוטר רחב.";

const shinoraSeed = {
  id: "shinora",
  templateId: "shinora",
  name: "Shinora",
  title: "Shinora",
  description: shinoraDescription,
  category: "business",
  categoryLabel: "יופי וטיפוח",
  priceLabel: "Premium",
  pages: shinoraPages,
  defaultData: shinoraDefaultData,
} as unknown as ReadyWebsiteTemplateSeed;

export const shinoraTemplate = {
  id: "shinora",
  name: "Shinora",

  description: shinoraDescription,

  category: "business",
  categoryLabel: "יופי וטיפוח",
  priceLabel: "Premium",

  thumbnail: React.createElement(ShinoraThumbnail),
  preview: React.createElement(ShinoraPreview),

  seed: shinoraSeed,

  renderer: {
    Component: ShinoraPages,
    pages: shinoraPages,
    editorCss: "",
    defaultData: shinoraDefaultData as unknown as Record<string, any>,
  },
} as unknown as StudioTemplateDefinition;
