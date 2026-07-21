import React from "react";

import type { StudioTemplateDefinition } from "../types";

import { pulsecoreSeed } from "./pulsecoreData";
import PulsecorePreview from "./preview";

function PulsecoreThumbnail() {
  const thumbnailImage =
    String(
      (pulsecoreSeed as unknown as { image?: string; thumbnail?: string })
        .image ||
        (pulsecoreSeed as unknown as { image?: string; thumbnail?: string })
          .thumbnail ||
        "",
    );

  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[220px] overflow-hidden rounded-[26px] bg-[#080808] p-5 text-white"
    >
      {thumbnailImage ? (
        <img
          src={thumbnailImage}
          alt="תבנית כושר PulseCore"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
      ) : null}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.35),rgba(0,0,0,0.92))]" />
      <div className="absolute left-[-40px] top-[-30px] h-28 w-28 rounded-full bg-[#FF4D1D]/60 blur-2xl" />
      <div className="absolute bottom-[-50px] right-[-40px] h-32 w-32 rounded-full bg-[#D7FF36]/50 blur-2xl" />

      <div className="relative z-10 flex min-h-[220px] flex-col justify-between">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-black tracking-[0.22em] text-[#D7FF36]">
            PULSECORE
          </p>

          <span className="rounded-full bg-[#D7FF36] px-3 py-1 text-[11px] font-black text-black">
            Fitness
          </span>
        </div>

        <div>
          <h3 className="text-4xl font-black leading-[0.9] tracking-[-0.08em]">
            אימון חזק.
            <br />
            <span className="text-[#D7FF36]">אנרגיה גבוהה.</span>
            <br />
            תוצאה ברורה.
          </h3>

          <p className="mt-4 max-w-[260px] text-xs font-semibold leading-5 text-white/60">
            תבנית פיטנס למאמנים, סטודיו כושר וחדרי כושר עם Hero חזק ותצוגה
            מלאה.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="h-16 rounded-2xl bg-[#D7FF36]" />
          <div className="h-16 rounded-2xl bg-white/10 backdrop-blur" />
          <div className="h-16 rounded-2xl bg-[#FF4D1D]" />
        </div>
      </div>
    </div>
  );
}

export const pulsecoreTemplate: StudioTemplateDefinition = {
  id: "pulsecore",
  name: "PulseCore",
  author: "BizUply",
  category: "fitness",
  categoryLabel: "פיטנס",
  priceLabel: "חינם",
  description:
    "תבנית פיטנס אנרגטית למאמנים, חדרי כושר וסטודיואים עם Hero חזק, תוכניות, מאמנים, מחירים, מערכת שעות וטופס הצטרפות.",
  previewImage: String(
    (pulsecoreSeed as unknown as { image?: string; thumbnail?: string }).image ||
      (pulsecoreSeed as unknown as { image?: string; thumbnail?: string })
        .thumbnail ||
      "",
  ),
  seed: pulsecoreSeed,
  thumbnail: React.createElement(PulsecoreThumbnail),
  preview: React.createElement(PulsecorePreview),
};