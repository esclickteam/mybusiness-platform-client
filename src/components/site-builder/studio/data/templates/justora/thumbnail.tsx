import React from "react";

export default function JustoraThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl bg-[#f6efe3] p-5 text-[#172433]"
    >
      <div className="absolute left-4 top-5 h-24 w-24 rounded-full bg-[#b5894d]/30 blur-2xl" />
      <div className="absolute bottom-4 right-4 h-28 w-28 rounded-full bg-[#172433]/15 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#172433] text-sm font-bold text-[#f8efe0]">
            J
          </div>
          <span className="text-sm font-semibold">Justora</span>
        </div>

        <div className="rounded-full bg-white/70 px-3 py-1 text-[10px] font-semibold text-[#9b7a45]">
          Law Firm
        </div>
      </div>

      <div className="relative z-10 mt-9">
        <p className="mb-3 text-[11px] font-semibold text-[#9b7a45]">
          משרד עורכי דין • ייעוץ משפטי
        </p>

        <h3 className="max-w-[250px] text-3xl font-semibold leading-[1.02] tracking-[-0.06em]">
          ייצוג משפטי חד וברור.
        </h3>

        <div className="mt-6 grid grid-cols-[1.25fr_.75fr] gap-3">
          <div className="rounded-2xl bg-[#172433] p-3 text-[#f8efe0] shadow-lg shadow-[#172433]/15">
            <div className="h-20 rounded-xl bg-[#f8efe0]/14" />
            <p className="mt-3 text-[11px] font-semibold">תחומי התמחות</p>
          </div>

          <div className="translate-y-6 rounded-2xl bg-white/70 p-3 shadow-lg shadow-[#172433]/10">
            <div className="h-20 rounded-xl bg-[#b5894d]/25" />
            <p className="mt-3 text-[11px] font-semibold">ייעוץ</p>
          </div>
        </div>
      </div>
    </div>
  );
}