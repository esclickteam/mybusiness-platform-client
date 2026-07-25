import React from "react";

export default function SpajadeThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#07140F", color: "#ECFDF5" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #10B98155, transparent 42%), linear-gradient(135deg, #10231A, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#10B981" }}>ספא / עיסוי פנים</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Cormorant Infant\"" }}>Spajade</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">עיסוי פנים, ניקוז לימפטי וגוואשה בטקס שקט שמחזיר רכות, זרימה וזוהר טבעי.…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#10B981" }} />
      </div>
    </div>
  );
}
