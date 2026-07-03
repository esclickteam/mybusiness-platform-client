import React from "react";

import type { StudioTemplateDefinition } from "../types";

import { lunelleSeed } from "./lunelleData";
import LunellePreview from "./preview";

function LunelleInlineThumbnail() {
  return React.createElement(
    "div",
    {
      dir: "rtl",
      className:
        "relative h-[420px] w-full overflow-hidden rounded-[28px] border border-[#2a171c]/10 bg-[#fff7f1] shadow-[0_20px_60px_rgba(42,23,28,.1)]",
    },
    React.createElement("div", {
      className:
        "absolute right-[-40px] top-[-40px] h-40 w-40 rounded-full bg-[#e8b8c1]/60 blur-3xl",
    }),
    React.createElement("div", {
      className:
        "absolute bottom-[-50px] left-[-50px] h-44 w-44 rounded-full bg-[#d6a24a]/30 blur-3xl",
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
            "mb-7 flex items-center justify-between gap-4 border-b border-[#2a171c]/10 pb-5",
        },
        React.createElement(
          "div",
          null,
          React.createElement(
            "p",
            {
              className:
                "text-[10px] font-black uppercase tracking-[0.28em] text-[#8a4f5f]",
            },
            "NAIL STUDIO",
          ),
          React.createElement(
            "p",
            {
              className:
                "mt-1 text-xl font-black tracking-[-0.05em] text-[#2a171c]",
            },
            "Lunelle Studio",
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "rounded-full bg-[#2a171c] px-4 py-2 text-[11px] font-black text-white",
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
                "text-[10px] font-black uppercase tracking-[0.28em] text-[#8a4f5f]",
            },
            "MANICURE • PEDICURE",
          ),
          React.createElement(
            "h3",
            {
              className:
                "mt-3 text-4xl font-black leading-[.95] tracking-[-0.08em] text-[#2a171c]",
            },
            "ציפורניים נקיות, עדינות ומדויקות",
          ),
          React.createElement(
            "p",
            {
              className: "mt-4 text-sm leading-6 text-[#2a171c]/55",
            },
            "תבנית בוטיק לבונת ציפורניים, מניקור, פדיקור, גלריה וקביעת תורים.",
          ),
          React.createElement(
            "div",
            {
              className: "mt-5 grid grid-cols-3 gap-2",
            },
            ["Gel", "Mani", "Pedi"].map((item) =>
              React.createElement(
                "div",
                {
                  key: item,
                  className:
                    "rounded-2xl bg-white px-3 py-4 text-center text-xs font-black text-[#2a171c] shadow-[0_12px_30px_rgba(42,23,28,.08)]",
                },
                item,
              ),
            ),
          ),
        ),
        React.createElement("img", {
          src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=900&q=90",
          alt: "Lunelle nail studio",
          className:
            "h-[260px] w-full rounded-[28px] object-cover shadow-[0_20px_55px_rgba(42,23,28,.16)]",
        }),
      ),
    ),
  );
}

export const lunelleTemplate = {
  id: "lunelle",
  name: "Lunelle",
  author: "BizUply",
  category: "beauty",
  categoryLabel: "ביוטי",
  priceLabel: "חינם",
  description:
    "תבנית מקורית מלאה לבונת ציפורניים, מניקור, פדיקור, לק ג׳ל, גלריה, מחירון וקביעת תורים.",
  previewImage:
    "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1500&q=90",
  seed: lunelleSeed,
  thumbnail: React.createElement(LunelleInlineThumbnail),
  preview: React.createElement(LunellePreview),
} as unknown as StudioTemplateDefinition;