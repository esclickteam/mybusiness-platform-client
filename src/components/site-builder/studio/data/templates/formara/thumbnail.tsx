import React from "react";

export default function FormaraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#1E1C1A", color: "#F3EEE7" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 20% 15%, #8B5E3C55, transparent 42%)" }} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-bold" style={{ background: "#8B5E3C", color: "#12100E", borderRadius: 0 }}>F</div>
          <span className="text-sm font-bold" style={{ fontFamily: "\"Instrument Serif\"" }}>Formara</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#8B5E3C" }}>עיצוב פנים</span>
      </div>
      <div className="relative z-10 mt-10">
        <h3 className="max-w-[230px] text-2xl font-bold leading-tight" style={{ fontFamily: "\"Instrument Serif\"" }}>חללים שמרגישים
כמו בית.</h3>
        <div className="mt-5 h-px w-14" style={{ background: "#8B5E3C" }} />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["90+", "4.9", "11"].map((n) => (
            <div key={n} className="border py-2 text-center text-xs font-bold" style={{ borderColor: "#8B5E3C44", color: "#8B5E3C", borderRadius: 0 }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
