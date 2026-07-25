import React from "react";

export default function NailmuseThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#FFF9F0", color: "#5A1C05" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #F9731655, transparent 42%), linear-gradient(135deg, #FFFFFF, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#F97316" }}>נייל ארט</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Shrikhand\"" }}>Nailmuse</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">איורים קטנים, טקסטורות, כרום וקולקציות השראה שמתרגמות מצב רוח לסט מושלם.…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#F97316" }} />
      </div>
    </div>
  );
}
