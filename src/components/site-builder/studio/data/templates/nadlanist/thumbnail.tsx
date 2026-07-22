import React from "react";

export default function NadlanistThumbnail() {
  return (
    <div className="relative h-full min-h-[240px] w-full overflow-hidden rounded-[1.5rem] bg-[#10100e] p-4 text-[#f6efe3]">
      <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#d8b36a]/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-white/15 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6efe3] text-xs font-black text-[#10100e]">
            ND
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.25em]">
            Nadlanist
          </span>
        </div>

        <span className="rounded-full border border-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/55">
          Realty
        </span>
      </div>

      <div className="relative z-10 mt-8">
        <div className="text-[43px] font-black uppercase leading-[0.76] tracking-[-0.12em]">
          Real
          <br />
          Estate
          <br />
          Advisor
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=70",
            "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=300&q=70",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=70",
          ].map((src, index) => (
            <div
              key={src}
              className={`overflow-hidden rounded-2xl border border-white/10 ${
                index === 1 ? "mt-5" : ""
              }`}
            >
              <img
                src={src}
                alt=""
                className="h-24 w-full object-cover grayscale"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-full bg-[#d8b36a] px-4 py-2 text-[#10100e]">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            No Public Prices
          </span>
          <span className="text-sm font-black">→</span>
        </div>
      </div>
    </div>
  );
}