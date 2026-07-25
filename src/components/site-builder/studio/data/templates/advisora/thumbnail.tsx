import React from "react";

export default function AdvisoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#0B1F3A", color: "#F4F1E8" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 20% 15%, #C9A22755, transparent 42%)" }} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-bold" style={{ background: "#C9A227", color: "#071428", borderRadius: 0 }}>A</div>
          <span className="text-sm font-bold" style={{ fontFamily: "\"Fraunces\"" }}>Advisora</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#C9A227" }}>ייעוץ עסקי</span>
      </div>
      <div className="relative z-10 mt-10">
        <h3 className="max-w-[230px] text-2xl font-bold leading-tight" style={{ fontFamily: "\"Fraunces\"" }}>צמיחה עסקית
עם כיוון ברור.</h3>
        <div className="mt-5 h-px w-14" style={{ background: "#C9A227" }} />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["87%", "40+", "12"].map((n) => (
            <div key={n} className="border py-2 text-center text-xs font-bold" style={{ borderColor: "#C9A22744", color: "#C9A227", borderRadius: 0 }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
