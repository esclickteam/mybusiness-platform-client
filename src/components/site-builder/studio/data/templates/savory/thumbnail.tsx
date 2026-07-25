import React from "react";

export default function SavoryThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl p-5"
      style={{ background: "#FAF6F0", color: "#2D1810" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white"
            style={{ background: "#C45C26" }}
          >
            S
          </div>
          <span className="text-sm font-bold">Savory</span>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[10px] font-semibold"
          style={{ background: "#C45C2622", color: "#C45C26" }}
        >
          מסעדת שף
        </span>
      </div>
      <div className="mt-8 text-center">
        <p
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "#C45C26" }}
        >
          מסעדת שף
        </p>
        <h3 className="mx-auto max-w-[220px] text-xl font-bold leading-tight">
          טעם שמספר סיפור.
        </h3>
      </div>
    </div>
  );
}
