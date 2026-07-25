import React from "react";
export default function AutovoltThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#0A0F14", color: "#E8F1F8", fontFamily: "IBM Plex Sans Hebrew, sans-serif" }}>
      <img
        src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-48"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F14] via-[#0A0F14]/76 to-transparent" />
      <div className="absolute left-0 top-1/3 h-1 w-full bg-[#38BDF8] shadow-[0_0_28px_rgba(56,189,248,0.9)]" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center border border-[#38BDF8] text-[#38BDF8]">A</span>
          <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#38BDF8]">auto detailing</span>
        </div>
        <div>
          <h3 className="text-6xl font-bold uppercase leading-[0.78] tracking-[-0.05em]" style={{ fontFamily: "Oswald, sans-serif" }}>AUTO<br />VOLT</h3>
          <div className="mt-5 grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((item) => (
              <span key={item} className="aspect-square border border-white/20" style={{ background: item === 3 ? "#38BDF8" : "rgba(232,241,248,0.08)" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
