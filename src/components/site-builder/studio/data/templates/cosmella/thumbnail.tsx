import React from "react";

export default function CosmellaThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#F6FFFB", color: "#064E3B" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #05966955, transparent 42%), linear-gradient(135deg, #FFFFFF, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#059669" }}>קוסמטיקאית</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"DM Serif Display\"" }}>Cosmella</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">טיפולי פנים מותאמים אישית, חומרים פעילים במינון נכון ושיחה שמתרגמת לשגרה…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#059669" }} />
      </div>
    </div>
  );
}
