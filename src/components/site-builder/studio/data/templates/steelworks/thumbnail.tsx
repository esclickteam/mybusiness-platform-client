import React from "react";

export default function SteelworksThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#1a1a1a", color: "#f0f0f0" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-black" style={{ background: "#ff6b2c", color: "#1a1a1a" }}>
            ST
          </div>
          <span className="text-sm font-bold">Steelworks</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#ff6b2c" }}>
          ייצור תעשייתי
        </span>
      </div>
      <div className="mt-10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "#ff6b2c" }}>
          ייצור תעשייתי
        </p>
        <h3 className="max-w-[220px] text-2xl font-black leading-tight">חוזק שאפשר למדוד.</h3>
        <div className="mt-6 grid grid-cols-3 gap-0 border" style={{ borderColor: "#ff6b2c33" }}>
          {[["120+", "פרויקטים"], ["18", "שנים"], ["96%", "שביעות"]].map(([n, l]) => (
            <div key={l} className="border px-2 py-3" style={{ borderColor: "#ff6b2c33" }}>
              <div className="text-sm font-black">{n}</div>
              <div className="text-[9px] opacity-60">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
