import React from "react";

export default function SalonixThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden bg-white p-4 text-black">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-black px-3 py-1 text-[10px] font-black text-white">SX</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#fc427f]">Salonix</span>
      </div>
      <div className="mt-4 h-14 overflow-hidden rounded-md bg-gradient-to-l from-[#fc427f] via-[#333] to-black" />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((item) => (
          <div key={item} className="aspect-square rounded-[18px] border-2 border-[#e7e7e7] bg-[#fafafa]" />
        ))}
      </div>
      <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fc427f]">סלון ציפורניים</p>
      <h3 className="text-lg font-bold leading-tight">Salonix</h3>
    </div>
  );
}
