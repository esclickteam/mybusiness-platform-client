import React from "react";

import type { StudioTemplateDefinition } from "../types";

import { aelineSeed } from "./aelineData";
import AelinePreview from "./preview";
import AelineThumbnail from "./thumbnail";

export const aelineTemplate: StudioTemplateDefinition = {
  id: "aeline",
  name: "Aeline",
  author: "BizUply",
  category: "business",
  categoryLabel: "Business",
  priceLabel: "Free",
  description:
    "תבנית AI consulting מלאה לעסקי ייעוץ, אוטומציות, דאטה ושירותים טכנולוגיים.",
  seed: aelineSeed,
  thumbnail: React.createElement(AelineThumbnail),
  preview: React.createElement(AelinePreview),
};