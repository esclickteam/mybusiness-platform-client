import React from "react";

import type { StudioTemplateDefinition } from "../types";

import { chanelSeed } from "./chanelData";
import ChanelPreview from "./preview";

function ChanelInlineThumbnail() {
  return React.createElement(
    "div",
    {
      dir: "ltr",
      className:
        "relative h-[420px] w-full overflow-hidden rounded-[28px] border border-[#2b1b15]/10 bg-[#fbf4ee] shadow-[0_20px_60px_rgba(43,27,21,.12)]",
    },
    React.createElement("div", {
      className:
        "absolute left-[-40px] top-[-40px] h-40 w-40 rounded-full bg-[#c8977a]/45 blur-3xl",
    }),
    React.createElement("div", {
      className:
        "absolute bottom-[-50px] right-[-50px] h-44 w-44 rounded-full bg-[#2b1b15]/20 blur-3xl",
    }),
    React.createElement(
      "div",
      {
        className: "relative z-10 p-7",
      },
      React.createElement(
        "div",
        {
          className:
            "mb-7 flex items-center justify-between gap-4 border-b border-[#2b1b15]/10 pb-5",
        },
        React.createElement(
          "div",
          null,
          React.createElement(
            "p",
            {
              className:
                "text-[10px] font-black uppercase tracking-[0.28em] text-[#7b5f52]",
            },
            "SPA • BEAUTY",
          ),
          React.createElement(
            "p",
            {
              className:
                "mt-1 font-serif text-2xl font-black tracking-[-0.08em] text-[#2b1b15]",
            },
            "Chanel Spa",
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "rounded-full bg-[#2b1b15] px-4 py-2 text-[11px] font-black text-white",
          },
          "Book",
        ),
      ),
      React.createElement(
        "div",
        {
          className: "grid grid-cols-[1fr_.8fr] gap-5",
        },
        React.createElement(
          "div",
          null,
          React.createElement(
            "p",
            {
              className:
                "text-[10px] font-black uppercase tracking-[0.28em] text-[#7b5f52]",
            },
            "WELLNESS • RELAXATION",
          ),
          React.createElement(
            "h3",
            {
              className:
                "mt-3 font-serif text-4xl font-black leading-[.95] tracking-[-0.08em] text-[#2b1b15]",
            },
            "Rejuvenate Your Body and Mind",
          ),
          React.createElement(
            "p",
            {
              className: "mt-4 text-sm leading-6 text-[#2b1b15]/55",
            },
            "Luxury spa template with hero motion, services, pricing, FAQ and booking.",
          ),
          React.createElement(
            "div",
            {
              className: "mt-5 grid grid-cols-3 gap-2",
            },
            ["Spa", "Glow", "Care"].map((item) =>
              React.createElement(
                "div",
                {
                  key: item,
                  className:
                    "rounded-2xl bg-white px-3 py-4 text-center text-xs font-black text-[#2b1b15] shadow-[0_12px_30px_rgba(43,27,21,.08)]",
                },
                item,
              ),
            ),
          ),
        ),
        React.createElement("img", {
          src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=90",
          alt: "Chanel spa template",
          className:
            "h-[260px] w-full rounded-[28px] object-cover shadow-[0_20px_55px_rgba(43,27,21,.16)]",
        }),
      ),
    ),
  );
}

export const chanelTemplate = {
  id: "chanel",
  name: "Chanel",
  author: "BizUply",
  category: "beauty",
  categoryLabel: "ביוטי",
  priceLabel: "חינם",
  description:
    "תבנית ספא/ביוטי יוקרתית עם Hero גדול, תנועה, טיקר שירותים, שירותים, צוות, מחירון, FAQ וטופס.",
  previewImage:
    "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1500&q=90",
  seed: chanelSeed,
  thumbnail: React.createElement(ChanelInlineThumbnail),
  preview: React.createElement(ChanelPreview),
} as unknown as StudioTemplateDefinition;