import React from "react";

export default function LoungoraThumbnail() {
  return (
    <div className="relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#FAF5FF", color: "#4C1D95", fontFamily: "Heebo, sans-serif" }}>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 80% 20%, #5B21B666, transparent 45%)` }} />
      <div className="relative">
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: "#5B21B6", color: "#F5F3FF" }}>הלבשת בית</div>
        <h3 className="mt-4 text-3xl font-black leading-none" style={{ fontFamily: "Literata, serif" }}>Loungora</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">נוחות שנראית כמו סטייל.</p>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        {["חנות", "גלריה", "אודות", "FAQ"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "#5B21B655", background: "#FFFFFF" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
