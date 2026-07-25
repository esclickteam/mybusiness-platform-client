import React from "react";

export default function LuminelleThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl p-5"
      style={{ background: "#FDF8F6", color: "#3D2C2E" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="grid h-9 w-9 place-items-center rounded-xl text-sm font-bold text-white"
            style={{ background: "#D4A5A5" }}
          >
            L
          </div>
          <span className="text-sm font-bold">Luminelle</span>
        </div>
        <span
          className="rounded-full px-3 py-1 text-[10px] font-semibold"
          style={{ background: "#D4A5A522", color: "#D4A5A5" }}
        >
          יופי וטיפוח
        </span>
      </div>
      <div className="mt-8 text-center">
        <p
          className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
          style={{ color: "#D4A5A5" }}
        >
          יופי וטיפוח
        </p>
        <h3 className="mx-auto max-w-[220px] text-xl font-bold leading-tight">
          היופי שמתחיל מבפנים.
        </h3>
      </div>
    </div>
  );
}
