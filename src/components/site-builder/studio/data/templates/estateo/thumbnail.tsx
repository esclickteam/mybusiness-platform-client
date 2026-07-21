import React from "react";
import { estateoDefaultData } from "./defaultData";

export default function EstateoThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#100e0c", color: "#f4ecdf" }}>
      <div className="absolute inset-x-0 top-0 z-10 border-b px-4 py-3 text-center" style={{ borderColor: "rgba(212,175,106,0.34)", background: "rgba(16,14,12,0.86)" }}>
        <b className="text-lg" style={{ fontFamily: '"Playfair Display"' }}>Estateo</b>
        <div className="text-[8px] tracking-[0.32em]" style={{ color: "#d4af6a" }}>PRIVATE ESTATES</div>
      </div>
      <div className="grid h-full min-h-[260px] grid-cols-[0.44fr_0.56fr] pt-12">
        <div className="flex flex-col justify-between p-4">
          <span className="h-px w-16" style={{ background: "#d4af6a" }} />
          <h3 className="text-3xl font-bold leading-none" style={{ fontFamily: '"Playfair Display"' }}>נכסים שלא מפרסמים.</h3>
          <span className="border px-2 py-1 text-[8px] tracking-[0.22em]" style={{ borderColor: "#d4af6a", color: "#d4af6a" }}>ACCESS</span>
        </div>
        <div className="relative" style={{ backgroundImage: `url(${estateoDefaultData.heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
          <div className="absolute bottom-4 right-4 left-4 border p-2 text-[9px]" style={{ borderColor: "#d4af6a", background: "rgba(16,14,12,0.82)" }}>PRIVATE ACCESS</div>
        </div>
      </div>
    </div>
  );
}
