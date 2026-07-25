import React from "react";

export default function GrowthlyThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-5 text-right" style={{ background: "#041F1E", color: "#ECFDF5", fontFamily: "Heebo, sans-serif" }}>
      <div>
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ background: "#0D9488" }}>סוכנות שיווק</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Growthly</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">Growth Engine</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="px-2 py-4 text-center text-[11px] font-black text-white" style={{ background: "#0D9488" }}>186%</div>
        <div className="border px-2 py-4 text-center text-[11px] font-bold" style={{ borderColor: "#0D948866" }}>cinematic</div>
      </div>
    </div>
  );
}
