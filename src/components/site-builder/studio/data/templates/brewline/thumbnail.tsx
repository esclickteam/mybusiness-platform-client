import React from "react";
export default function BrewlineThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#1A1410", color: "#F6EFE6", fontFamily: "Manrope, sans-serif" }}>
      <img
        src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#1A1410] via-[#1A1410]/70 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "#8B5E3C" }}>B</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "#C9AA8F" }}>specialty coffee</span>
        </div>
        <div>
          <h3 className="text-6xl leading-[0.8] tracking-[-0.08em]" style={{ fontFamily: "Instrument Serif, serif" }}>Brewline</h3>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((item) => (
              <span key={item} className="aspect-square border border-white/20" style={{ background: item === 2 ? "#8B5E3C" : "rgba(246,239,230,0.08)" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
