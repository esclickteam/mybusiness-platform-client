import React from "react";

import type { StudioTemplateDefinition } from "../types";

import { cycloraDefaultData } from "./cycloraData";
import CycloraPreview from "./preview";

const CYRCLO_PREVIEW_IMAGE =
  "https://cdn.prod.website-files.com/6995302bd78651f6cf0f7066/69a62eb04a9ed9a25f485453_open-graph-image.jpg";

export const cycloraTemplate = {
  id: "cyclora",
  name: "Cyrclo",
  author: "BizUply",

  category: "portfolio",
  categoryLabel: "Marketing agency",

  priceLabel: "Free",
  badge: "NEW",

  description:
    "Cyrclo-inspired marketing agency template with cinematic hero, floating media, scroll animations, case studies, testimonials, pricing, FAQ, and CTA — based on the Cyrclo Webflow template.",

  image: CYRCLO_PREVIEW_IMAGE,
  previewImage: CYRCLO_PREVIEW_IMAGE,

  seed: cycloraDefaultData,

  thumbnail: React.createElement(CycloraPreview),
  preview: React.createElement(CycloraPreview),
} as unknown as StudioTemplateDefinition;

export default cycloraTemplate;
