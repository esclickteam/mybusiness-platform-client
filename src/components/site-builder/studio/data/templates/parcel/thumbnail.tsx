import React from "react";
export default function ParcelThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] p-5" style={{ background: "#efe9da", color: "#243018" }}>
        <div className="pointer-events-none absolute inset-0 opacity-25" style={{ backgroundImage: "linear-gradient(rgba(36,48,24,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(36,48,24,0.16) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative">
          <div className="text-7xl font-bold leading-none" style={{ fontFamily: '"IBM Plex Sans Hebrew"', color: "#6b5a2e" }}>12</div>
          <p className="text-[10px] tracking-[0.18em]" style={{ color: "#6e684f" }}>דונם</p>
          <h3 className="mt-4 text-3xl font-bold">Parcel</h3>
        </div>
      </div>
    </div>
  );
}
