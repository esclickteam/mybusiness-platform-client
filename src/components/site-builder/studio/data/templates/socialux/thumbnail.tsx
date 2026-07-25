import React from "react";

export default function SocialuxThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#08111F", color: "#F2FBFF", fontFamily: "Rubik, sans-serif" }}>
      <div>
        <div className="inline-flex rounded-full px-3 py-1 text-[10px] font-black" style={{ background: "#00C2FF", color: "#fff" }}>סוכנות סושיאל</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Socialux</h3>
        <p className="mt-2 text-xs font-semibold opacity-75">kinetic feed grid</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-2 h-16 rounded-2xl" style={{ background: "#0E1B2E", border: "1px solid color-mix(in srgb, currentColor 25%, transparent)" }} />
        <div className="grid h-16 place-items-center rounded-2xl text-[11px] font-black" style={{ background: "#F72585", color: "#fff" }}>38M</div>
      </div>
    </div>
  );
}
