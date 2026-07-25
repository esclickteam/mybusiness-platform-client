import React from "react";

export default function MarkoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#0A0A0B", color: "#F7F7F8" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 20% 15%, #FF2D5555, transparent 42%)" }} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-bold" style={{ background: "#FF2D55", color: "#050505", borderRadius: 0 }}>M</div>
          <span className="text-sm font-bold" style={{ fontFamily: "\"Syne\"" }}>Markora</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#FF2D55" }}>שיווק דיגיטלי</span>
      </div>
      <div className="relative z-10 mt-10">
        <h3 className="max-w-[230px] text-2xl font-bold leading-tight" style={{ fontFamily: "\"Syne\"" }}>שיווק שלא
מתנצל.</h3>
        <div className="mt-5 h-px w-14" style={{ background: "#FF2D55" }} />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["3.2x", "180+", "₪12M"].map((n) => (
            <div key={n} className="border py-2 text-center text-xs font-bold" style={{ borderColor: "#FF2D5544", color: "#FF2D55", borderRadius: 0 }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
