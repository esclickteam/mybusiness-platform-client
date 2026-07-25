import React from "react";

export default function FranchoraThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#FFFBEB", color: "#2B1704", fontFamily: "Bellefair, sans-serif" }}>
      <div>
        <div className="inline-flex rounded-full px-3 py-1 text-[10px] font-black" style={{ background: "#92400E", color: "#fff" }}>סוכנות פיתוח זכיינות</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Franchora</h3>
        <p className="mt-2 text-xs font-semibold opacity-75">system map multi-location</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 h-16 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid color-mix(in srgb, currentColor 25%, transparent)" }} />
        <div className="grid h-16 place-items-center rounded-2xl text-[11px] font-black" style={{ background: "#10B981", color: "#111827" }}>86</div>
      </div>
    </div>
  );
}
