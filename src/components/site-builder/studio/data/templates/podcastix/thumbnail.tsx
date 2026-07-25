import React from "react";

export default function PodcastixThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#0F0A1F", color: "#F5F3FF", fontFamily: "Arimo, sans-serif" }}>
      <div>
        <div className="inline-flex rounded-full px-3 py-1 text-[10px] font-black" style={{ background: "#8B5CF6", color: "#fff" }}>סוכנות פודקאסט ואודיו</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Podcastix</h3>
        <p className="mt-2 text-xs font-semibold opacity-75">waveform mic</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 h-16 rounded-2xl" style={{ background: "#1D1235", border: "1px solid color-mix(in srgb, currentColor 25%, transparent)" }} />
        <div className="grid h-16 place-items-center rounded-2xl text-[11px] font-black" style={{ background: "#22D3EE", color: "#fff" }}>420</div>
      </div>
    </div>
  );
}
