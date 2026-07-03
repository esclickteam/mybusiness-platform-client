import React from "react";

import type { StudioTemplateDefinition } from "../types";

import { aelineSeed } from "./aelineData";
import AelinePreview from "./preview";
import AelineThumbnail from "./thumbnail";

export const aelineTemplate: StudioTemplateDefinition = {
  id: "aeline",
  name: "Nova Flow",
  author: "BizUply",
  category: "business",
  categoryLabel: "עסקים",
  priceLabel: "חינם",
  description:
    "תבנית פרימיום לעסקי שירות, אוטומציות, CRM, מכירות וחוויית לקוח דיגיטלית.",
  seed: {
    ...aelineSeed,
    name: "Nova Flow",
    niche: "digital-growth",
    heroTitle: "הופכים פניות ללקוחות משלמים",
    heroSubtitle:
      "תבנית דיגיטלית לעסקים שרוצים לחבר בין עיצוב, אוטומציות, CRM ותהליך מכירה מסודר.",
  },
  thumbnail: React.createElement(AelineThumbnail),
  preview: React.createElement(AelinePreview),
};