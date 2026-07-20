import React from "react";

export default function AureliaThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl bg-[#14100d] p-5 text-[#f5eee1]"
    >
      <div className="absolute left-4 top-6 h-24 w-24 rounded-full bg-[#c9a24b]/25 blur-2xl" />
      <div className="absolute bottom-4 right-4 h-28 w-28 rounded-full bg-[#7a3b1d]/30 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full border border-[#c9a24b]/40 bg-[#1d1712] font-serif text-sm font-bold text-[#c9a24b]">
            A
          </div>
          <span className="font-serif text-sm font-semibold">Aurelia</span>
        </div>
        <div className="rounded-full border border-[#c9a24b]/25 bg-[#c9a24b]/10 px-3 py-1 text-[10px] font-semibold text-[#c9a24b]">
          Fine Dining
        </div>
      </div>

      <div className="relative z-10 mt-10">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#c9a24b]">
          מסעדת שף • יין
        </p>
        <h3 className="max-w-[230px] font-serif text-3xl font-semibold leading-[1.05]">
          טעם שמספר סיפור.
        </h3>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-[#c9a24b]/15 bg-[#1a1510] p-3">
            <div className="h-16 rounded-xl bg-[#c9a24b]/20" />
            <p className="mt-3 font-serif text-[11px] font-semibold">אנטריקוט</p>
          </div>
          <div className="translate-y-5 rounded-2xl bg-[#c9a24b] p-3 text-[#14100d]">
            <div className="h-16 rounded-xl bg-[#14100d]/25" />
            <p className="mt-3 font-serif text-[11px] font-semibold">ערב שף</p>
          </div>
        </div>
      </div>
    </div>
  );
}
