import React from "react";

export default function VerdantThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl p-5"
      style={{ background: "#F7F3ED", color: "#1C1C1C" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white"
            style={{ background: "#B8956B" }}
          >
            V
          </div>
          <span className="text-sm font-bold">Verdant</span>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[10px] font-semibold"
          style={{ background: "#B8956B22", color: "#B8956B" }}
        >
          נדל״ן יוקרה
        </span>
      </div>
      <div className="mt-8 text-center">
        <p
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "#B8956B" }}
        >
          נדל״ן יוקרה
        </p>
        <h3 className="mx-auto max-w-[220px] text-xl font-bold leading-tight">
          הבית שמחכה לכם כבר כאן.
        </h3>
      </div>
    </div>
  );
}
