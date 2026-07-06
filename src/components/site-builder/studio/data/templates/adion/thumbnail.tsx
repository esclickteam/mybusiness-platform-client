import React from "react";

export default function AdionThumbnail() {
  return (
    <div className="relative h-full min-h-[240px] w-full overflow-hidden rounded-[1.5rem] bg-[#10100e] p-4 text-[#f6efe3]">
      <div className="absolute -left-20 -top-20 h-48 w-48 rounded-full bg-[#f7c873]/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-20 h-56 w-56 rounded-full bg-white/15 blur-3xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6efe3] text-xs font-black text-[#10100e]">
            AD
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.25em]">
            Adion
          </span>
        </div>
        <span className="rounded-full border border-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-white/55">
          Video
        </span>
      </div>

      <div className="relative z-10 mt-8">
        <div className="text-[48px] font-black uppercase leading-[0.76] tracking-[-0.12em]">
          Visual
          <br />
          Stories
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=70",
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=300&q=70",
            "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=300&q=70",
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

        <div className="mt-4 flex items-center justify-between rounded-full bg-[#f7c873] px-4 py-2 text-[#10100e]">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Photography
          </span>
          <span className="text-sm font-black">→</span>
        </div>
      </div>
    </div>
  );
}