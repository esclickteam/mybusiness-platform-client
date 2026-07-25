import React from "react";

export default function PolyglotaThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#F0F9FF", color: "#0C4A6E" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 18% 20%, #0284C766, transparent 45%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#0284C7" }}>בית ספר לשפות</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Sora\"" }}>Polyglota</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">אנגלית, ספרדית, ערבית ועוד — שיעורים חיים, תרגול יומי, וביטחון לדבר.…</p>
        <div className="mt-8 flex gap-2">
          {["2.4k", "4.9", "120"].map((n) => (
            <div key={n} className="border px-3 py-2 text-xs font-bold" style={{ borderColor: "#0284C755", color: "#0284C7" }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
