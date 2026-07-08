import React from "react";

export default function SerenovaThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl bg-[#f8f2e8] p-5 text-[#20342a]"
    >
      <div className="absolute left-4 top-5 h-24 w-24 rounded-full bg-[#abc5a6]/45 blur-2xl" />
      <div className="absolute bottom-4 right-4 h-28 w-28 rounded-full bg-[#d2bc99]/45 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#24352d] text-sm font-bold text-[#f8f2e8]">
            S
          </div>
          <span className="text-sm font-semibold">Serenova</span>
        </div>
        <div className="rounded-full bg-white/65 px-3 py-1 text-[10px] font-semibold text-[#5e765f]">
          Therapy
        </div>
      </div>

      <div className="relative z-10 mt-10">
        <p className="mb-3 text-[11px] font-semibold text-[#5e765f]">
          קליניקה • ייעוץ • טיפול
        </p>
        <h3 className="max-w-[230px] text-3xl font-semibold leading-[1.02] tracking-[-0.06em]">
          מרחב רגוע לצמיחה ושינוי.
        </h3>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/65 p-3 shadow-lg shadow-[#24352d]/10">
            <div className="h-16 rounded-xl bg-[#abc5a6]/50" />
            <p className="mt-3 text-[11px] font-semibold">טיפול אישי</p>
          </div>
          <div className="translate-y-5 rounded-2xl bg-[#24352d] p-3 text-[#f8f2e8] shadow-lg shadow-[#24352d]/15">
            <div className="h-16 rounded-xl bg-[#f8f2e8]/25" />
            <p className="mt-3 text-[11px] font-semibold">שיחת היכרות</p>
          </div>
        </div>
      </div>
    </div>
  );
}