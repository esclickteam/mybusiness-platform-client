import React from "react";

export default function ArboraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#eef2ea", color: "#1c2618" }}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #eef2ea 15%, transparent 70%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.22em]" style={{ color: "#4f6b45" }}>אדריכלות נוף</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Assistant", serif' }}>Arbora</h3>
        <p className="mt-2 max-w-[220px] text-xs leading-5 opacity-80">ארבורה מתכננת חצרות, גגות ומרחבים ציבוריים — עם …</p>
      </div>
    </div>
  );
}
