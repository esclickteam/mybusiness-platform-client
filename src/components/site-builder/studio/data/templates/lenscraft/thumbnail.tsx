import React from "react";

export default function LenscraftThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#0F0F10", color: "#FAFAFA" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 20% 15%, #E11D4855, transparent 42%)" }} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-bold" style={{ background: "#E11D48", color: "#09090B", borderRadius: 0 }}>LC</div>
          <span className="text-sm font-bold" style={{ fontFamily: "\"Space Grotesk\"" }}>Lenscraft</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#E11D48" }}>סטודיו צילום</span>
      </div>
      <div className="relative z-10 mt-10">
        <h3 className="max-w-[230px] text-2xl font-bold leading-tight" style={{ fontFamily: "\"Space Grotesk\"" }}>רגעים שנשארים
בתמונה.</h3>
        <div className="mt-5 h-px w-14" style={{ background: "#E11D48" }} />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["800+", "4.9", "10"].map((n) => (
            <div key={n} className="border py-2 text-center text-xs font-bold" style={{ borderColor: "#E11D4844", color: "#E11D48", borderRadius: 0 }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
