import React from "react";

import { luminelleDefaultData } from "./defaultData";

export default function LuminelleThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden p-5"
      style={{ background: "#E8E4DF", color: "#2A2430", fontFamily: "Outfit, sans-serif" }}
    >
      <style>
        {"@import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Outfit:wght@400;600;700&display=swap');"}
      </style>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="grid h-9 w-9 place-items-center border text-xs font-bold tracking-[0.2em]"
            style={{ borderColor: "#2A2430" }}
          >
            L
          </div>
          <span className="text-[18px] font-bold leading-none" style={{ fontFamily: "'Libre Baskerville', serif" }}>
            Luminelle
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#7A8B76" }}>
          Beauty Atelier
        </span>
      </div>

      <div className="mt-7 grid grid-cols-[1fr_0.82fr] gap-4">
        <div>
          <div className="h-px w-14" style={{ background: "#7A8B76" }} />
          <h3
            className="mt-5 max-w-[165px] text-[27px] font-bold leading-[1.08]"
            style={{ fontFamily: "'Libre Baskerville', serif" }}
          >
            טיפוח מדויק, רגוע, בלתי מתפשר.
          </h3>
          <p className="mt-4 text-[11px] leading-5" style={{ color: "#7A736C" }}>
            סלון יופי בוטיק בשפה נקייה, מקצועית ומעודנת.
          </p>
        </div>
        <div className="overflow-hidden" style={{ background: "#F4F1EC", boxShadow: "0 18px 45px rgba(26,22,28,0.16)" }}>
          <img
            src={(luminelleDefaultData as Record<string, any>).heroImage}
            alt=""
            className="h-[154px] w-full object-cover"
          />
        </div>
      </div>

      <div className="absolute inset-x-5 bottom-5 grid grid-cols-3 gap-2 border-t pt-3" style={{ borderColor: "rgba(42,36,48,0.16)" }}>
        {["Facial", "Hair", "Ritual"].map((item) => (
          <div key={item} className="text-[10px] font-bold" style={{ color: "#7A8B76" }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
