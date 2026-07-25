import React from "react";

export default function NeuralisThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#050816", color: "#E8F7FF" }}>
      <div className="absolute -left-12 top-8 h-36 w-36 rounded-full blur-3xl" style={{ background: "rgba(34,211,238,0.28)" }} />
      <div className="absolute -right-10 bottom-2 h-44 w-44 rounded-full blur-3xl" style={{ background: "rgba(14,165,233,0.2)" }} />
      <div className="relative z-10 flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center border text-xs font-black" style={{ borderColor: "#22D3EE", background: "#22D3EE", color: "#050816" }}>N</span>
        <span className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: "#8BA3B8" }}>AI OS</span>
      </div>
      <h3 className="relative z-10 mt-6 text-5xl font-black leading-none" style={{ fontFamily: "\"Space Grotesk\", sans-serif", letterSpacing: "-0.06em" }}>Neuralis</h3>
      <p className="relative z-10 mt-3 max-w-[230px] text-sm font-semibold leading-5" style={{ color: "#8BA3B8" }}>מנוע AI שמחבר דאטה, החלטות ואוטומציות.</p>
      <div className="relative z-10 mt-6 grid grid-cols-3 gap-2">
        {[42, 8, 99].map((value) => (
          <div key={value} className="aspect-square border p-2" style={{ borderColor: "rgba(34,211,238,0.28)", background: "rgba(255,255,255,0.04)" }}>
            <p className="text-xl font-black" style={{ color: "#22D3EE" }}>{value}</p>
            <span className="mt-2 block h-1 w-full" style={{ background: "rgba(34,211,238,0.45)" }} />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-5 py-3 text-xs font-black uppercase tracking-[0.22em]" style={{ background: "#22D3EE", color: "#050816" }}>
        דמו חי
      </div>
    </div>
  );
}
