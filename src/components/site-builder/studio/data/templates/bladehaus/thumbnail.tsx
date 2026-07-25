import React from "react";

export default function BladehausThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-4" style={{ background: "#111111", color: "#F2F2F2" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "linear-gradient(90deg,#C0A06022 1px,transparent 1px) 0 0 / 38px 38px" }} />
      <div className="relative z-10 flex items-center justify-between border-b-2 pb-3" style={{ borderColor: "#C0A060" }}>
        <div className="grid h-9 w-9 place-items-center text-lg font-black" style={{ border: "2px solid #C0A060", color: "#C0A060", borderRadius: 0 }}>B</div>
        <span className="text-2xl leading-none tracking-wide" style={{ fontFamily: "\"Bebas Neue\", sans-serif" }}>Bladehaus</span>
        <span className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "#C0A060" }}>Barber</span>
      </div>
      <div className="relative z-10 mt-5">
        <h3 className="text-[54px] leading-[0.75] tracking-wide" style={{ fontFamily: "\"Bebas Neue\", sans-serif", textShadow: "3px 3px 0 #C0A06044" }}>
          Sharp Cuts.
          <br />
          No Mercy.
        </h3>
        <div className="mt-4 flex gap-2">
          <div className="flex-1 bg-white px-2 py-2 text-[9px] font-black uppercase tracking-wider text-black" style={{ borderRadius: 0 }}>קביעת תור</div>
          <div className="flex-1 px-2 py-2 text-[9px] font-black uppercase tracking-wider text-black" style={{ background: "#C0A060", borderRadius: 0 }}>מחירון</div>
        </div>
      </div>
      <div className="relative z-10 mt-5 grid grid-cols-[1.2fr_0.8fr] gap-3">
        <div className="grid grid-cols-2 gap-2">
          {["Cut", "Beard", "Fade", "Ritual"].map((item, index) => (
            <div key={item} className="border p-2" style={{ borderColor: "#ffffff33", background: "#181818", borderRadius: 0 }}>
              <div className="text-[8px]" style={{ color: "#C0A060" }}>0{index + 1}</div>
              <div className="text-lg leading-none" style={{ fontFamily: "\"Bebas Neue\", sans-serif" }}>{item}</div>
              <div className="mt-1 h-px" style={{ background: "#ffffff33" }} />
            </div>
          ))}
        </div>
        <div className="relative overflow-hidden border" style={{ borderColor: "#C0A060", borderRadius: 0 }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#777,#111)" }} />
          <div className="absolute inset-x-0 bottom-0 px-2 py-2 text-black" style={{ background: "#C0A060" }}>
            <div className="text-lg leading-none" style={{ fontFamily: "\"Bebas Neue\", sans-serif" }}>רוי</div>
            <div className="text-[8px] font-black uppercase">Fade</div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 py-1 text-center text-xl leading-none text-black" style={{ background: "#C0A060", fontFamily: "\"Bebas Neue\", sans-serif" }}>
        Fade · Beard · Hot Towel · Cut
      </div>
    </div>
  );
}
