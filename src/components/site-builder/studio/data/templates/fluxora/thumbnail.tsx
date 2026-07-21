import React from "react";

export default function FluxoraThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl bg-[#070b10] p-5 text-[#e8eef5]"
    >
      <div className="absolute left-1/2 top-0 h-40 w-56 -translate-x-1/2 rounded-full bg-[#3dffa8]/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-28 w-28 rounded-full bg-[#38bdf8]/20 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#3dffa8] text-xs font-black text-[#07110c]">
            Fx
          </div>
          <span className="text-sm font-bold">Fluxora</span>
        </div>
        <div className="rounded-full border border-[#3dffa8]/30 bg-[#3dffa8]/10 px-3 py-1 text-[10px] font-semibold text-[#9dffc9]">
          פיד מפתחים
        </div>
      </div>

      <div className="relative z-10 mt-8 space-y-2">
        {["AI · מאמר חדש", "Frontend · מדריך", "DevOps · סיכום"].map((item) => (
          <div
            key={item}
            className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] font-semibold text-slate-300"
          >
            {item}
          </div>
        ))}
      </div>

      <p className="relative z-10 mt-5 text-center text-lg font-bold leading-tight">
        מגלים מה קורה עכשיו בפיתוח.
      </p>
    </div>
  );
}
