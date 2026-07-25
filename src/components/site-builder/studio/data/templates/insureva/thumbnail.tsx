import React from "react";

export default function InsurevaThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-5 text-right" style={{ background: "#F8FAFC", color: "#0F172A", fontFamily: "Heebo, sans-serif" }}>
      <div>
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ background: "#1D4ED8" }}>סוכנות ביטוח</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Insureva</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">שקט ביטוחי</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="px-2 py-4 text-center text-[11px] font-black text-white" style={{ background: "#1D4ED8" }}>2,400+</div>
        <div className="border px-2 py-4 text-center text-[11px] font-bold" style={{ borderColor: "#1D4ED866" }}>trust</div>
      </div>
    </div>
  );
}
