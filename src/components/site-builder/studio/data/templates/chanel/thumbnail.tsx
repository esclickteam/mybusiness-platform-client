import React from "react";

export default function ChanelThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[220px] w-full overflow-hidden rounded-[28px] bg-white p-5 text-[#2a1b16] shadow-[0_28px_90px_rgba(42,27,22,.14)]"
    >
      <div className="flex items-center justify-between border-b border-[#2a1b16]/10 pb-4">
        <div className="h-8 w-24 rounded-full bg-[#2a1b16]" />
        <div className="font-serif text-3xl tracking-[-0.12em]">Chanel</div>
      </div>

      <div className="mt-8 grid grid-cols-[.85fr_1fr] gap-5">
        <div className="space-y-4">
          <div className="h-5 w-20 rounded-full bg-[#c95268]/15" />
          <div className="h-7 w-full rounded bg-[#2a1b16]/12" />
          <div className="h-7 w-3/4 rounded bg-[#2a1b16]/12" />
          <div className="h-9 w-28 rounded bg-[#c95268]" />
        </div>

        <div className="h-28 rounded-[14px] bg-[linear-gradient(135deg,#f3d7d1,#c95268)]" />
      </div>

      <div className="mt-8 flex gap-3">
        <div className="h-12 flex-1 rounded bg-[#f7f4f2]" />
        <div className="h-12 flex-1 rounded bg-[#f7f4f2]" />
        <div className="h-12 flex-1 rounded bg-[#f7f4f2]" />
      </div>
    </div>
  );
}
