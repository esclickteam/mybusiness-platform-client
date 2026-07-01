import React from "react";

import type { StudioTemplateDefinition } from "../types";
import { velmoraSeed } from "./velmoraData";
import VelmoraThumbnail from "./thumbnail";

function VelmoraRegistryPreview() {
  const homePage =
    velmoraSeed.editor.pages.find((page) => page.isHome) ||
    velmoraSeed.editor.pages.find((page) => page.id === "home") ||
    velmoraSeed.editor.pages[0];

  const css = [
    velmoraSeed.css || "",
    velmoraSeed.editor.css || "",
    homePage?.css || "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const html = homePage?.html || "";

  return React.createElement(
    "main",
    {
      dir: "rtl",
      className: "min-h-screen bg-[#F6F2EA] text-[#27231F]",
    },
    React.createElement("style", null, css),
    React.createElement("div", {
      dangerouslySetInnerHTML: {
        __html: html,
      },
    })
  );
}

export const velmoraTemplate: StudioTemplateDefinition = {
  id: velmoraSeed.id,
  name: velmoraSeed.name,
  author: "BizUply",
  priceLabel: "Included",

  category: velmoraSeed.category as StudioTemplateDefinition["category"],
  categoryLabel: "Retail & E-Commerce",

  badge: "NEW",
  description: velmoraSeed.description,

  previewImage: velmoraSeed.image,

  thumbnail: React.createElement(VelmoraThumbnail),
  preview: React.createElement(VelmoraRegistryPreview),

  seed: velmoraSeed,
};