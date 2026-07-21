import React from "react";

export default function HorizonThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#f7f3ed", color: "#1c1c1c" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-black" style={{ background: "#b8956b", color: "#f7f3ed" }}>
            HO
          </div>
          <span className="text-sm font-bold">Horizon</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#b8956b" }}>
          נדל״ן
        </span>
      </div>
      <div className="mt-10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "#b8956b" }}>
          נדל״ן
        </p>
        <h3 className="max-w-[220px] text-2xl font-black leading-tight">נוף שמשנה החלטות.</h3>
        <div className="mt-6 grid grid-cols-3 gap-0 border" style={{ borderColor: "#b8956b33" }}>
          {[["120+", "פרויקטים"], ["18", "שנים"], ["96%", "שביעות"]].map(([n, l]) => (
            <div key={l} className="border px-2 py-3" style={{ borderColor: "#b8956b33" }}>
              <div className="text-sm font-black">{n}</div>
              <div className="text-[9px] opacity-60">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
