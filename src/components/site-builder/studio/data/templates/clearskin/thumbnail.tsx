import React from "react";

export default function ClearskinThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#F3FEFF", color: "#164E63" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #0891B255, transparent 42%), linear-gradient(135deg, #FFFFFF, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#0891B2" }}>קוסמטיקה רפואית / אקנה</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"IBM Plex Serif\"" }}>Clearskin</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">טיפולי אקנה וקוסמטיקה רפואית בשילוב תיעוד, הדרכה ושינויים קטנים שמחזיקים…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#0891B2" }} />
      </div>
    </div>
  );
}
