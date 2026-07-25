import React from "react";

export default function PeeloraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#F8FCFF", color: "#0C4A6E" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #0EA5E955, transparent 42%), linear-gradient(135deg, #FFFFFF, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#0EA5E9" }}>פילינג / טיפולי פנים</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Cormorant Upright\"" }}>Peelora</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">פילינגים וטיפולי פנים לפי מצב העור, עונות השנה וקצב החלמה שמתאים לחיים ש…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#0EA5E9" }} />
      </div>
    </div>
  );
}
