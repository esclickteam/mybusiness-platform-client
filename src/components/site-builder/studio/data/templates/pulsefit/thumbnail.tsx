import React from "react";

export default function PulsefitThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#121212", color: "#F4F4F4" }}>
      <div className="absolute inset-0 bg-gradient-to-l from-black via-[#121212cc] to-[#C8FF3D22]" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center text-[10px] font-black" style={{ background: "#C8FF3D", color: "#000" }}>PF</div>
          <span className="text-base font-bold uppercase" style={{ fontFamily: "\"Oswald\", sans-serif" }}>Pulsefit</span>
        </div>
        <span className="px-3 py-2 text-[9px] font-black uppercase tracking-[0.18em]" style={{ background: "#C8FF3D", color: "#000" }}>התחלה</span>
      </div>
      <div className="relative z-10 mt-9 flex gap-3">
        <div className="h-20 w-3 -skew-x-12" style={{ background: "#C8FF3D" }} />
        <h3 className="text-4xl font-bold uppercase leading-[0.86]" style={{ fontFamily: "\"Oswald\", sans-serif" }}>
          תגיעו.
          <br />
          תדלקו.
          <br />
          תפרצו.
        </h3>
      </div>
      <div className="relative z-10 mt-7 space-y-2">
        {["חיטוב 90", "Build Strong", "Hybrid Engine"].map((item, index) => (
          <div key={item} className="flex items-center justify-between border px-3 py-2 text-[10px] font-black uppercase" style={{ borderColor: "#C8FF3D", color: index === 1 ? "#000" : "#C8FF3D", background: index === 1 ? "#C8FF3D" : "transparent" }}>
            <span>{item}</span>
            <span>0{index + 1}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-5 text-3xl font-bold" style={{ color: "#C8FF3D", fontFamily: "\"Oswald\", sans-serif" }}>-12KG</div>
    </div>
  );
}
