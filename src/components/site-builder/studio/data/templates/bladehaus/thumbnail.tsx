import React from "react";

export default function BladehausThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#111111", color: "#F2F2F2" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 20% 15%, #E8E8E855, transparent 42%)" }} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-bold" style={{ background: "#E8E8E8", color: "#000000", borderRadius: 0 }}>B</div>
          <span className="text-sm font-bold" style={{ fontFamily: "\"Bebas Neue\"" }}>Bladehaus</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#E8E8E8" }}>מספרת גברים</span>
      </div>
      <div className="relative z-10 mt-10">
        <h3 className="max-w-[230px] text-2xl font-bold leading-tight" style={{ fontFamily: "\"Bebas Neue\"" }}>תספורת חדה.
סטייל מדויק.</h3>
        <div className="mt-5 h-px w-14" style={{ background: "#E8E8E8" }} />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["12K+", "6", "4.9"].map((n) => (
            <div key={n} className="border py-2 text-center text-xs font-bold" style={{ borderColor: "#E8E8E844", color: "#E8E8E8", borderRadius: 0 }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
