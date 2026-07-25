import React from "react";

export default function GlinticaThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#1F1A1C", color: "#F8F1F2" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 20% 15%, #D4A0A755, transparent 42%)" }} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-bold" style={{ background: "#D4A0A7", color: "#120E10", borderRadius: 0 }}>G</div>
          <span className="text-sm font-bold" style={{ fontFamily: "\"Cormorant Infant\"" }}>Glintica</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#D4A0A7" }}>איפור מקצועי</span>
      </div>
      <div className="relative z-10 mt-10">
        <h3 className="max-w-[230px] text-2xl font-bold leading-tight" style={{ fontFamily: "\"Cormorant Infant\"" }}>איפור שמאיר
את הפנים.</h3>
        <div className="mt-5 h-px w-14" style={{ background: "#D4A0A7" }} />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["500+", "4.9", "8"].map((n) => (
            <div key={n} className="border py-2 text-center text-xs font-bold" style={{ borderColor: "#D4A0A744", color: "#D4A0A7", borderRadius: 0 }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
