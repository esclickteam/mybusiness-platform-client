import React from "react";

export default function LexhavenThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#F7F3EE", color: "#1C1412" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 20% 15%, #7A1F2B55, transparent 42%)" }} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-bold" style={{ background: "#7A1F2B", color: "#2A1518", borderRadius: 0 }}>L</div>
          <span className="text-sm font-bold" style={{ fontFamily: "\"Libre Baskerville\"" }}>Lexhaven</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#7A1F2B" }}>משרד עורכי דין</span>
      </div>
      <div className="relative z-10 mt-10">
        <h3 className="max-w-[230px] text-2xl font-bold leading-tight" style={{ fontFamily: "\"Libre Baskerville\"" }}>ייצוג משפטי
בגובה העיניים.</h3>
        <div className="mt-5 h-px w-14" style={{ background: "#7A1F2B" }} />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["25+", "1.2K", "98%"].map((n) => (
            <div key={n} className="border py-2 text-center text-xs font-bold" style={{ borderColor: "#7A1F2B44", color: "#7A1F2B", borderRadius: 0 }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
