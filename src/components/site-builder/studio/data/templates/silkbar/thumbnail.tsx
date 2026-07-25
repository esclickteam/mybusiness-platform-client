import React from "react";

export default function SilkbarThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#F7FCFB", color: "#134E4A" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #0F766E55, transparent 42%), linear-gradient(135deg, #FFFFFF, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#0F766E" }}>מספרת בוטיק</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Libre Baskerville\"" }}>Silkbar</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">חיתוך, צבע וטיפול קרטין בגישה עיתונאית נקייה — פחות רעש, יותר מבנה ותנוע…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#0F766E" }} />
      </div>
    </div>
  );
}
