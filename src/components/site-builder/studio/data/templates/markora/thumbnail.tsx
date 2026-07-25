import React from "react";

export default function MarkoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-4" style={{ background: "#0A0A0B", color: "#F7F7F8" }}>
      <div className="absolute -left-8 top-0 h-[320px] w-12 rotate-12" style={{ background: "#FF2D55" }} />
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)", backgroundSize: "34px 34px" }} />
      <div className="relative z-10 grid h-full grid-cols-[1fr_92px] gap-3">
        <div className="flex flex-col justify-center">
          <div className="mb-4 h-8 w-8 border text-center text-sm font-black leading-8" style={{ borderColor: "#FF2D55", background: "#FF2D55" }}>M</div>
          <p className="text-[42px] font-black uppercase leading-[.75] tracking-[-.12em]" style={{ fontFamily: "\"Syne\", sans-serif", textShadow: "5px 0 0 rgba(255,45,85,.5)" }}>Markora</p>
          <h3 className="mt-3 whitespace-pre-line text-2xl font-black leading-[.9] tracking-[-.05em]" style={{ fontFamily: "\"Syne\", sans-serif" }}>שיווק שלא{"\n"}מבקש רשות.</h3>
          <div className="mt-5 flex w-max gap-2 bg-[#FF2D55] px-3 py-1 text-[10px] font-black text-white">
            <span>Meta</span>
            <span>Google</span>
            <span>TikTok</span>
          </div>
        </div>
        <div className="grid grid-rows-2 gap-2">
          {[
            "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=75",
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=75",
          ].map((image) => (
            <div key={image} className="overflow-hidden border" style={{ borderColor: "rgba(255,255,255,.18)" }}>
              <img src={image} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
