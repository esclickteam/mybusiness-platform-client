import React from "react";

export default function VitalcareThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl p-5"
      style={{ background: "#F0F9FF", color: "#0C4A6E" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white"
            style={{ background: "#0EA5E9" }}
          >
            VC
          </div>
          <span className="text-sm font-bold">Vitalcare</span>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[10px] font-semibold"
          style={{ background: "#0EA5E922", color: "#0EA5E9" }}
        >
          רפואה ובריאות
        </span>
      </div>
      <div className="mt-8 text-center">
        <p
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "#0EA5E9" }}
        >
          רפואה ובריאות
        </p>
        <h3 className="mx-auto max-w-[220px] text-xl font-bold leading-tight">
          בריאות שמבוססת על אמון.
        </h3>
      </div>
    </div>
  );
}
