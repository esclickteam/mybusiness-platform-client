import React from "react";

export default function BridaluxeThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#FFF7F8", color: "#4C0519" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #BE123C55, transparent 42%), linear-gradient(135deg, #FFFFFF, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#BE123C" }}>איפור כלות</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Parisienne\"" }}>Bridaluxe</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">איפור כלות שמצטלם יפה ונשאר טבעי מקרוב — ניסיון מקדים, ליווי ביום האירוע…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#BE123C" }} />
      </div>
    </div>
  );
}
