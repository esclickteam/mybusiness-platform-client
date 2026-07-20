import React from "react";

export default function FortivaThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl bg-[#f6f5f1] p-5 text-[#0f1e3d]"
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#0f1e3d] font-serif text-sm font-bold text-[#c6a664]">
            F
          </div>
          <span className="font-serif text-sm font-semibold">Fortiva</span>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8935a]">
          Law &amp; Finance
        </div>
      </div>

      <div className="relative z-10 mt-10">
        <p className="mb-3 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#b8935a]">
          <span className="h-px w-6 bg-current" />
          משרד עורכי דין
        </p>
        <h3 className="max-w-[230px] font-serif text-3xl font-semibold leading-[1.08]">
          ליווי שאפשר לסמוך עליו.
        </h3>

        <div className="mt-7 grid grid-cols-3 gap-3 border-t border-[#0f1e3d]/10 pt-5">
          {[["25+", "ניסיון"], ["1.2K", "תיקים"], ["98%", "שביעות"]].map(([n, l]) => (
            <div key={l}>
              <div className="font-serif text-xl font-semibold text-[#0f1e3d]">{n}</div>
              <div className="text-[10px] font-semibold text-[#7a8395]">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
