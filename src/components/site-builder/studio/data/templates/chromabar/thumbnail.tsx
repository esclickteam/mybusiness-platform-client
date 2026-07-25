import React from "react";

export default function ChromabarThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#0B1220", color: "#EAF2FF" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #2563EB55, transparent 42%), linear-gradient(135deg, #111C2F, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#2563EB" }}>צבע שיער</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Archivo Black\"" }}>Chromabar</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">בליאז׳, גוונים ותיקוני צבע עם אבחון שיער, בדיקת היסטוריה ושמירה על ברק.…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#2563EB" }} />
      </div>
    </div>
  );
}
