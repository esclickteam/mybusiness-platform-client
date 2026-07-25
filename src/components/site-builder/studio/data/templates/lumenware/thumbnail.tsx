import React from "react";

export default function LumenwareThumbnail() {
  return (
    <div className="relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#07111A", color: "#E8F4FF", fontFamily: "Heebo, sans-serif" }}>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 80% 20%, #0EA5E966, transparent 45%)` }} />
      <div className="relative">
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: "#0EA5E9", color: "#041018" }}>אלקטרוניקה וגאדג׳טים</div>
        <h3 className="mt-4 text-3xl font-black leading-none" style={{ fontFamily: "Space Grotesk, serif" }}>Lumenware</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">טכנולוגיה שמאירה קדימה</p>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        {["חנות", "מוצר", "סל", "FAQ"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "#0EA5E955", background: "#122232" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
