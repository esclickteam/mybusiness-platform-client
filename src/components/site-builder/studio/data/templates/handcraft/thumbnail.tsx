import React from "react";

export default function HandcraftThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl p-5"
      style={{ background: "#FAFAF9", color: "#1C1917" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white"
            style={{ background: "#F97316" }}
          >
            H
          </div>
          <span className="text-sm font-bold">Handcraft</span>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[10px] font-semibold"
          style={{ background: "#F9731622", color: "#F97316" }}
        >
          שירותים לבית
        </span>
      </div>
      <div className="mt-8 text-center">
        <p
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "#F97316" }}
        >
          שירותים לבית
        </p>
        <h3 className="mx-auto max-w-[220px] text-xl font-bold leading-tight">
          עובדים קשה. אתם נחים.
        </h3>
      </div>
    </div>
  );
}
