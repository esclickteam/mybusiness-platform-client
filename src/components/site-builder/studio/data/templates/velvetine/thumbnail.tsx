import React from "react";

export default function VelvetineThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#120E0C", color: "#F5EDE3" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #C9A22755, transparent 42%), linear-gradient(135deg, #1F1714, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#C9A227" }}>ספא יוקרתי</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Cormorant Garamond\"" }}>Velvetine</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">טקסי גוף ופנים באווירת לילה קטיפתית — שמנים נדירים, ידיים מדויקות, זמן ב…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#C9A227" }} />
      </div>
    </div>
  );
}
