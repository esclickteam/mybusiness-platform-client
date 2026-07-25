import React from "react";

export default function PlayoraThumbnail() {
  return (
    <div className="relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#FFF7FB", color: "#831843", fontFamily: "Heebo, sans-serif" }}>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 80% 20%, #DB277766, transparent 45%)` }} />
      <div className="relative">
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: "#DB2777", color: "#FFFFFF" }}>צעצועים ומשחקים</div>
        <h3 className="mt-4 text-3xl font-black leading-none" style={{ fontFamily: "Fredoka, serif" }}>Playora</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">כיף ברמה גבוהה.</p>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        {["חנות", "גלריה", "אודות", "FAQ"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "#DB277755", background: "#FFFFFF" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
