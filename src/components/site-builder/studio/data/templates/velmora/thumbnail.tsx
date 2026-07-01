import React from "react";

import VelmoraPages from "./pages";

export default function VelmoraThumbnail() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1rem] bg-[#f6f2ea]">
      <div className="pointer-events-none absolute right-0 top-0 h-[1200px] w-[1600px] origin-top-right scale-[0.255]">
        <VelmoraPages />
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[1rem] ring-1 ring-black/10" />

      <div className="pointer-events-none absolute right-3 top-3 rounded-md border border-[#bfdbfe] bg-[#dbeafe] px-2.5 py-1 text-xs font-bold text-[#2563eb] shadow-sm">
        NEW ✦
      </div>
    </div>
  );
}