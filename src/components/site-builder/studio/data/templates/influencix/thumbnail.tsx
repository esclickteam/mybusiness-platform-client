import React from "react";

export default function InfluencixThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#14070C", color: "#FFF5F7", fontFamily: "Alef, sans-serif" }}>
      <div>
        <div className="inline-flex rounded-full px-3 py-1 text-[10px] font-black" style={{ background: "#FF4D6D", color: "#fff" }}>סוכנות משפיענים</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Influencix</h3>
        <p className="mt-2 text-xs font-semibold opacity-75">creator spotlight</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 h-16 rounded-2xl" style={{ background: "#241018", border: "1px solid color-mix(in srgb, currentColor 25%, transparent)" }} />
        <div className="grid h-16 place-items-center rounded-2xl text-[11px] font-black" style={{ background: "#FFD166", color: "#111827" }}>1,260</div>
      </div>
    </div>
  );
}
