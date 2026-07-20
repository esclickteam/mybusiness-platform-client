import React from "react";

export default function StudioraThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl bg-[#0a0a0a] p-5 text-white"
    >
      <div className="absolute right-4 top-6 h-28 w-28 rounded-full bg-[#c3ff00]/15 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#c3ff00] text-sm font-black text-[#0a0a0a]">
            S
          </div>
          <span className="text-sm font-black uppercase">Studiora</span>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c3ff00]">
          Studio
        </div>
      </div>

      <div className="relative z-10 mt-9">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#c3ff00]">
          עיצוב · מיתוג · דיגיטל
        </p>
        <h3 className="max-w-[230px] text-4xl font-black uppercase leading-[0.9]">
          מותגים בלתי נשכחים.
        </h3>

        <div className="mt-6 flex gap-2">
          <div className="h-14 flex-1 rounded-xl bg-white/8" />
          <div className="h-14 flex-1 rounded-xl bg-[#c3ff00]" />
          <div className="h-14 flex-1 rounded-xl bg-white/8" />
        </div>
      </div>
    </div>
  );
}
