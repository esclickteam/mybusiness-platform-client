import React from "react";

export default function LashoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#0B0A12", color: "#F5F3FF" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #A78BFA55, transparent 42%), linear-gradient(135deg, #16141F, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#A78BFA" }}>ריסים וגבות</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Italiana\"" }}>Lashora</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">הארכות ריסים, למינציה ועיצוב גבות — מיפוי אישי, היגיינה קלינית, ותוצאה ט…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#A78BFA" }} />
      </div>
    </div>
  );
}
