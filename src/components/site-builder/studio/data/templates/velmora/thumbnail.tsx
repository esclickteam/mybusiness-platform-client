import React from "react";

import VelmoraPages from "./pages";

export default function VelmoraThumbnail() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1rem] bg-[#f6f2ea]">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            pointer-events-none absolute left-1/2 top-0
            h-[1500px] w-[1700px] origin-top
            -translate-x-1/2 scale-[0.27]
          "
        >
          <VelmoraPages />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 rounded-[1rem] bg-gradient-to-b from-transparent via-transparent to-white/10" />

      <div className="pointer-events-none absolute inset-0 rounded-[1rem] ring-1 ring-black/10" />

      <div className="pointer-events-none absolute left-3 top-3 rounded-md border border-[#bfdbfe] bg-[#dbeafe] px-2.5 py-1 text-xs font-bold text-[#2563eb] shadow-sm">
        NEW ✦
      </div>
    </div>
  );
}