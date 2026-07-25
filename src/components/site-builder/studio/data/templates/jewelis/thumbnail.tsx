import React from "react";

export default function JewelisThumbnail() {
  return (
    <div className="relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#0C0A09", color: "#FAF7F0", fontFamily: "Heebo, sans-serif" }}>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 80% 20%, #A1620766, transparent 45%)` }} />
      <div className="relative">
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: "#A16207", color: "#1C1408" }}>תכשיטים ושעונים</div>
        <h3 className="mt-4 text-3xl font-black leading-none" style={{ fontFamily: "Cormorant, serif" }}>Jewelis</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">יוקרה עדינה ליום־יום</p>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        {["חנות", "מוצר", "סל", "FAQ"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "#A1620755", background: "#292524" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
