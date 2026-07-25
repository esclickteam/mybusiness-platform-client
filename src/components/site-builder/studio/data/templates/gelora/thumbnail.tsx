import React from "react";

export default function GeloraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#FFF7FB", color: "#4C0F2E" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #DB277755, transparent 42%), linear-gradient(135deg, #FFFFFF, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#DB2777" }}>לק ג׳ל</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Fraunces\"" }}>Gelora</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">לק ג׳ל נקי, קווי פרנץ׳ מדויקים וצבעים שמותאמים לעור ולסגנון היומיומי שלך…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#DB2777" }} />
      </div>
    </div>
  );
}
