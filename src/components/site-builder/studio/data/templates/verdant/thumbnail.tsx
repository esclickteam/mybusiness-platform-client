import React from "react";

export default function VerdantThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden bg-[#0e1210] p-5 text-[#f2efe8]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(122,154,120,0.22),transparent_45%)]" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center border border-[#7a9a78] text-xs font-semibold tracking-[0.2em] text-[#7a9a78]">
            V
          </div>
          <span className="font-serif text-lg font-semibold">Verdant</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.22em] text-[#7a9a78]">נדל״ן יוקרה</span>
      </div>
      <div className="relative z-10 mt-10">
        <h3 className="max-w-[220px] font-serif text-3xl font-semibold leading-[1.05]">
          בתים שנבחרו בדיוק כמוכם.
        </h3>
        <div className="mt-5 h-px w-16 bg-[#7a9a78]" />
        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          {["₪2.4B", "340+", "15"].map((stat) => (
            <div key={stat} className="border border-white/10 py-2 text-sm font-semibold text-[#7a9a78]">
              {stat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
