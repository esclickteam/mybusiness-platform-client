import React from "react";

export default function NumerisThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-4" style={{ background: "#F3F6F4", color: "#143028", fontFamily: "\"Figtree\", sans-serif" }}>
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "linear-gradient(rgba(15,110,86,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(15,110,86,.12) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative z-10 flex items-center justify-between border-b bg-white px-3 py-3" style={{ borderColor: "rgba(15,110,86,.2)" }}>
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center text-xs font-bold text-white" style={{ background: "#0F6E56", borderRadius: 0 }}>N</div>
          <span className="text-sm font-bold" style={{ fontFamily: "\"Literata\", serif" }}>Numeris</span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: "#0F6E56" }}>ledger</span>
      </div>
      <div className="relative z-10 mt-5 grid grid-cols-[1fr_.78fr] gap-3">
        <div className="border bg-white p-4" style={{ borderColor: "rgba(15,110,86,.2)", borderRadius: 0 }}>
          <h3 className="text-2xl font-bold leading-[1.02] tracking-[-0.05em]" style={{ fontFamily: "\"Literata\", serif" }}>מספרים מסודרים.<br />החלטות שקטות.</h3>
          <div className="mt-5 space-y-2">
            {["שירות", "תיאור", "מחיר"].map((item) => (
              <div key={item} className="flex justify-between border-b pb-1 text-[10px]" style={{ borderColor: "rgba(15,110,86,.16)" }}>
                <span>{item}</span>
                <span style={{ color: "#0F6E56" }}>✓</span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["450+", "98%", "24h", "15"].map((stat) => (
            <div key={stat} className="grid aspect-square place-items-center text-sm font-bold text-white" style={{ background: "#0F6E56", borderRadius: 0 }}>{stat}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
