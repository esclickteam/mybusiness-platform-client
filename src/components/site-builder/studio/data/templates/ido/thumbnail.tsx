import React from "react";

export default function IdoThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[220px] w-full overflow-hidden rounded-[1.8rem] bg-[#07100e] text-white"
    >
      <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-[#c9f4dc]/25 blur-2xl" />
      <div className="absolute -bottom-12 -right-12 h-44 w-44 rounded-full bg-[#d8b98f]/25 blur-2xl" />

      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#c9f4dc] text-xs font-black text-[#07100e]">
            IDO
          </div>
          <div className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[10px] font-bold text-white/75">
            BEAUTY
          </div>
        </div>

        <div>
          <div className="mb-3 h-28 overflow-hidden rounded-3xl bg-black">
            <img
              src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=90"
              alt="IDO template thumbnail"
              className="h-full w-full object-cover opacity-90"
            />
          </div>

          <div className="text-2xl font-semibold leading-[0.95] tracking-[-0.06em]">
            סטודיו יופי
            <br />
            פרימיום
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <span className="h-2 rounded-full bg-[#c9f4dc]" />
            <span className="h-2 rounded-full bg-white/25" />
            <span className="h-2 rounded-full bg-white/25" />
          </div>
        </div>
      </div>
    </div>
  );
}