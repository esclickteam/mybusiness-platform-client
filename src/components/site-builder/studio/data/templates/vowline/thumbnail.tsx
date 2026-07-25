import React from "react";

export default function VowlineThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#F8F4F0", color: "#243040" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 20% 15%, #5B7C9955, transparent 42%)" }} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-bold" style={{ background: "#5B7C99", color: "#1A2430", borderRadius: 0 }}>V</div>
          <span className="text-sm font-bold" style={{ fontFamily: "\"Great Vibes\"" }}>Vowline</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#5B7C99" }}>תכנון חתונות</span>
      </div>
      <div className="relative z-10 mt-10">
        <h3 className="max-w-[230px] text-2xl font-bold leading-tight" style={{ fontFamily: "\"Great Vibes\"" }}>היום שלכם,
בדיוק כמו שחלמתם.</h3>
        <div className="mt-5 h-px w-14" style={{ background: "#5B7C99" }} />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["220+", "4.9", "9"].map((n) => (
            <div key={n} className="border py-2 text-center text-xs font-bold" style={{ borderColor: "#5B7C9944", color: "#5B7C99", borderRadius: 0 }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
