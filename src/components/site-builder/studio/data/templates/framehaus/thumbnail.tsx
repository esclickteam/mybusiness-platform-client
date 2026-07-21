import React from "react";

export default function FramehausThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#fafafa", color: "#111111" }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-black" style={{ background: "#ff3b30", color: "#fafafa" }}>
            FR
          </div>
          <span className="text-sm font-bold">Framehaus</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "#ff3b30" }}>
          Photography Studio
        </span>
      </div>
      <div className="mt-10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "#ff3b30" }}>
          Photography Studio
        </p>
        <h3 className="max-w-[220px] text-2xl font-black leading-tight">פריים אחרי פריים.</h3>
        <div className="mt-6 grid grid-cols-3 gap-0 border" style={{ borderColor: "#ff3b3033" }}>
          {[["120+", "פרויקטים"], ["18", "שנים"], ["96%", "שביעות"]].map(([n, l]) => (
            <div key={l} className="border px-2 py-3" style={{ borderColor: "#ff3b3033" }}>
              <div className="text-sm font-black">{n}</div>
              <div className="text-[9px] opacity-60">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
