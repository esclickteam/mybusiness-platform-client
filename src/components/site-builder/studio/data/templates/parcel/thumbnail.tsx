import React from "react";

export default function ParcelThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden p-4" style={{ background: "#efe9da", color: "#243018", fontFamily: '"IBM Plex Sans Hebrew", sans-serif' }}>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(107,90,46,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(107,90,46,0.18) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 flex items-center justify-between border-b pb-2 text-[10px] font-bold tracking-[0.22em]" style={{ borderColor: "rgba(107,90,46,0.28)", color: "#6b5a2e" }}>
          <span>Parcel</span>
          <span>LAND SURVEY</span>
        </div>
        <div className="relative z-10 mt-3 grid grid-cols-[1fr_0.8fr] gap-3">
          <div>
            <div className="text-[6.5rem] font-black leading-none" style={{ color: "#6b5a2e" }}>12</div>
            <h3 className="mt-1 text-2xl font-black leading-none">בודקים קרקע.</h3>
          </div>
          <div className="mt-5 border bg-[#e4dcc8] p-1" style={{ borderColor: "rgba(107,90,46,0.28)" }}>
            <div className="aspect-[4/5]" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=700&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
          </div>
        </div>
        <div className="absolute inset-x-4 bottom-4 border-t pt-2 text-[10px] font-bold tracking-[0.16em]" style={{ borderColor: "rgba(107,90,46,0.28)", color: "#6e684f" }}>820 מ״ר · מגורים א׳ · חזית דרומית</div>
      </div>
    </div>
  );
}
