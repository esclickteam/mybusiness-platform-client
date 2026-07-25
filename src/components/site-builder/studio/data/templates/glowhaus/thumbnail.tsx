import React from "react";

export default function GlowhausThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#061018", color: "#E0F2FE" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 15%, #22D3EE55, transparent 42%), linear-gradient(135deg, #0D1F2D, transparent 60%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#22D3EE" }}>טרקלין יופי</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Archivo\"" }}>Glowhaus</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">סלון רב־תחומי — עור, שיער, גבות ואיפור — במקום אחד עם וייב טרקלין וטיפול…</p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#22D3EE" }} />
      </div>
    </div>
  );
}
