import React from "react";

export default function CrisisdeskThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#111827", color: "#F9FAFB", fontFamily: "Tinos, sans-serif" }}>
      <div>
        <div className="inline-flex rounded-full px-3 py-1 text-[10px] font-black" style={{ background: "#DC2626", color: "#fff" }}>סוכנות תקשורת משברים</div>
        <h3 className="mt-4 text-3xl font-black leading-none">CrisisDesk</h3>
        <p className="mt-2 text-xs font-semibold opacity-75">newsroom alert</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 h-16 rounded-2xl" style={{ background: "#1F2937", border: "1px solid color-mix(in srgb, currentColor 25%, transparent)" }} />
        <div className="grid h-16 place-items-center rounded-2xl text-[11px] font-black" style={{ background: "#FDE047", color: "#111827" }}>24/7</div>
      </div>
    </div>
  );
}
