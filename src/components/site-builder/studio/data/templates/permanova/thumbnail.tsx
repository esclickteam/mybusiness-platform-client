import React from "react";

export default function PermanovaThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#FFFBF7", color: "#431407" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #B4530955, transparent 42%), linear-gradient(135deg, #FFFFFF, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#B45309" }}>איפור קבוע / PMU</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Prata\"" }}>Permanova</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">איפור קבוע בשיטת שכבות עדינות — תכנון צורה, פיגמנט בטוח והנחיות החלמה מד…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#B45309" }} />
      </div>
    </div>
  );
}
