import React from "react";

export default function LedgerThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#f6f3ea", color: "#102018" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-black" style={{ background: "#0d5c45", color: "#f6f3ea" }}>
            LE
          </div>
          <span className="text-sm font-bold">Ledger</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#0d5c45" }}>
          פיננסים והנהלת חשבונות
        </span>
      </div>
      <div className="mt-10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "#0d5c45" }}>
          פיננסים והנהלת חשבונות
        </p>
        <h3 className="max-w-[220px] text-2xl font-black leading-tight">מספרים עם הקשר עסקי.</h3>
        <div className="mt-6 grid grid-cols-3 gap-0 border" style={{ borderColor: "#0d5c4533" }}>
          {[["120+", "פרויקטים"], ["18", "שנים"], ["96%", "שביעות"]].map(([n, l]) => (
            <div key={l} className="border px-2 py-3" style={{ borderColor: "#0d5c4533" }}>
              <div className="text-sm font-black">{n}</div>
              <div className="text-[9px] opacity-60">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
