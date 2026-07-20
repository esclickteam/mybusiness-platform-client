import React from "react";

export default function VitalisThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl bg-[#f7fcfc] p-5 text-[#0f2a36]"
    >
      <div className="absolute left-4 top-6 h-24 w-24 rounded-full bg-[#0ea5a4]/18 blur-2xl" />
      <div className="absolute bottom-4 right-4 h-28 w-28 rounded-full bg-[#0284c7]/15 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-[#0ea5a4] to-[#0891b2] text-sm font-bold text-white">
            V
          </div>
          <span className="text-sm font-bold">Vitalis</span>
        </div>
        <div className="rounded-full bg-[#0891b2]/10 px-3 py-1 text-[10px] font-bold text-[#0891b2]">
          Medical
        </div>
      </div>

      <div className="relative z-10 mt-10">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0891b2]">
          מרפאת שיניים ובריאות
        </p>
        <h3 className="max-w-[230px] text-3xl font-bold leading-[1.08]">
          חיוך בביטחון מלא.
        </h3>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {[["15+", "ניסיון"], ["20K", "מטופלים"], ["4.9", "דירוג"]].map(([n, l]) => (
            <div key={l} className="rounded-xl border border-[#0891b2]/10 bg-white py-2 text-center shadow-sm">
              <div className="text-sm font-bold text-[#0891b2]">{n}</div>
              <div className="text-[9px] font-semibold text-[#7c95a0]">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
