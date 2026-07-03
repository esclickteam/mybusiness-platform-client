import React from "react";

import type { StudioTemplateDefinition } from "../types";

import { pulsecoreSeed } from "./pulsecoreData";
import PulsecorePages from "./pages";

function PulsecoreThumbnail() {
  return (
    <div className="relative h-full min-h-[220px] overflow-hidden rounded-[26px] bg-[#080808] p-5 text-white">
      <div className="absolute left-[-40px] top-[-30px] h-28 w-28 rounded-full bg-[#FF4D1D]/60 blur-2xl" />
      <div className="absolute bottom-[-50px] right-[-40px] h-32 w-32 rounded-full bg-[#D7FF36]/50 blur-2xl" />

      <div className="relative z-10">
        <p className="text-xs font-black text-[#D7FF36]">PULSECORE</p>

        <h3 className="mt-5 text-4xl font-black leading-[0.9] tracking-[-0.08em]">
          אימון חזק.
          <br />
          תוצאה ברורה.
        </h3>

        <div className="mt-8 grid grid-cols-3 gap-2">
          <div className="h-20 rounded-2xl bg-[#D7FF36]" />
          <div className="h-20 rounded-2xl bg-white/10" />
          <div className="h-20 rounded-2xl bg-[#FF4D1D]" />
        </div>
      </div>
    </div>
  );
}

function PulsecorePreview() {
  return <PulsecorePages />;
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
  seed: pulsecoreSeed,
  thumbnail: React.createElement(PulsecoreThumbnail),
  preview: React.createElement(PulsecorePreview),
};