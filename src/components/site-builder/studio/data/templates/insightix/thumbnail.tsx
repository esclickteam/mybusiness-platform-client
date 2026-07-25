import React from "react";

export default function InsightixThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#F8FAFC", color: "#0F172A", fontFamily: "Suez One, sans-serif" }}>
      <div>
        <div className="inline-flex rounded-full px-3 py-1 text-[10px] font-black" style={{ background: "#0F766E", color: "#fff" }}>סוכנות מחקר שוק</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Insightix</h3>
        <p className="mt-2 text-xs font-semibold opacity-75">charts insight cards</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 h-16 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid color-mix(in srgb, currentColor 25%, transparent)" }} />
        <div className="grid h-16 place-items-center rounded-2xl text-[11px] font-black" style={{ background: "#F59E0B", color: "#111827" }}>14K</div>
      </div>
    </div>
  );
}
