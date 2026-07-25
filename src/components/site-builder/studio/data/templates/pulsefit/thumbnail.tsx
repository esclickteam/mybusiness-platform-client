import React from "react";

export default function PulsefitThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#121212", color: "#F4F4F4" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 20% 15%, #C8FF3D55, transparent 42%)" }} />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-bold" style={{ background: "#C8FF3D", color: "#0A0A0A", borderRadius: 0 }}>P</div>
          <span className="text-sm font-bold" style={{ fontFamily: "\"Oswald\"" }}>Pulsefit</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.18em]" style={{ color: "#C8FF3D" }}>אימון אישי</span>
      </div>
      <div className="relative z-10 mt-10">
        <h3 className="max-w-[230px] text-2xl font-bold leading-tight" style={{ fontFamily: "\"Oswald\"" }}>כוח. משמעת.
תוצאה.</h3>
        <div className="mt-5 h-px w-14" style={{ background: "#C8FF3D" }} />
        <div className="mt-6 grid grid-cols-3 gap-2">
          {["-12kg", "300+", "5★"].map((n) => (
            <div key={n} className="border py-2 text-center text-xs font-bold" style={{ borderColor: "#C8FF3D44", color: "#C8FF3D", borderRadius: 0 }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
