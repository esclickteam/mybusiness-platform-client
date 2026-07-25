import React from "react";

export default function CampuslyThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#EFF6FF", color: "#1E3A8A" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 18% 20%, #1D4ED866, transparent 45%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#1D4ED8" }}>שיעורים פרטיים</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Literata\"" }}>Campusly</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">שיעורים פרטיים לבגרות, אקדמיה ופסיכומטרי — עם מרצים שמדברים בגובה העינ…</p>
        <div className="mt-8 flex gap-2">
          {["2.4k", "4.9", "120"].map((n) => (
            <div key={n} className="border px-3 py-2 text-xs font-bold" style={{ borderColor: "#1D4ED855", color: "#1D4ED8" }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
