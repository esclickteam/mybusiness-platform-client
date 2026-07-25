import React from "react";

export default function LobbyhausThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#F8FAFC", color: "#111827", fontFamily: "IBM Plex Sans Hebrew, sans-serif" }}>
      <div>
        <div className="inline-flex rounded-full px-3 py-1 text-[10px] font-black" style={{ background: "#1E3A8A", color: "#fff" }}>סוכנות ממשל ולובינג</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Lobbyhaus</h3>
        <p className="mt-2 text-xs font-semibold opacity-75">institutional formal</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 h-16 rounded-2xl" style={{ background: "#FFFFFF", border: "1px solid color-mix(in srgb, currentColor 25%, transparent)" }} />
        <div className="grid h-16 place-items-center rounded-2xl text-[11px] font-black" style={{ background: "#B45309", color: "#fff" }}>64</div>
      </div>
    </div>
  );
}
