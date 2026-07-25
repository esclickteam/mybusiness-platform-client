import React from "react";

export default function HandcraftThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden p-5"
      style={{ background: "#F4F2EE", color: "#1C1E20" }}
    >
      <div className="absolute inset-x-0 top-0 h-2" style={{ background: "#C56A3A" }} />
      <div className="absolute left-5 top-12 h-36 w-28" style={{ background: "#2B2F33" }} />
      <div className="absolute left-10 top-20 h-32 w-36 border" style={{ borderColor: "#C56A3A" }} />
      <div className="relative z-10">
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: "#D9D3CA" }}>
          <div className="flex items-center gap-2">
            <div
              className="grid h-9 w-9 place-items-center border text-[10px] font-black tracking-[0.16em]"
              style={{ borderColor: "#C56A3A", color: "#C56A3A" }}
            >
              HC
            </div>
            <span className="text-xs font-black uppercase tracking-[-0.04em]">Handcraft</span>
          </div>
          <span className="text-[9px] font-black uppercase tracking-[0.24em]" style={{ color: "#6B6F74" }}>
            שירותי בית
          </span>
        </div>
        <div className="mt-8 max-w-[230px]">
          <div className="mb-4 h-1 w-14" style={{ background: "#C56A3A" }} />
          <p className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: "#C56A3A" }}>
            אינסטלציה · חשמל · שיפוצים
          </p>
          <h3 className="mt-3 text-3xl font-black leading-[0.9] tracking-[-0.08em]">
            מטפלים בבית בלי רעש מיותר.
          </h3>
        </div>
        <div className="mt-8 grid grid-cols-4 gap-1">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-12 border bg-white p-2" style={{ borderColor: "#D9D3CA" }}>
              <div className="h-1 w-5" style={{ background: "#C56A3A" }} />
              <div className="mt-4 h-1 w-full" style={{ background: "#2B2F33" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
