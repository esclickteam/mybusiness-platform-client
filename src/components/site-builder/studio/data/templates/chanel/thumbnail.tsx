import React from "react";

export default function ChanelThumbnail() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-[#fbf4ee] text-[#2b1b15]">
      <div className="absolute -left-10 -top-10 h-36 w-36 rounded-full bg-[#c8977a]/35 blur-2xl" />
      <div className="absolute -bottom-12 -right-10 h-40 w-40 rounded-full bg-[#2b1b15]/20 blur-2xl" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <div className="font-serif text-2xl tracking-[-0.08em]">Chanel</div>
          <div className="h-8 w-20 rounded-full bg-[#2b1b15]" />
        </div>

        <div>
          <div className="mb-3 h-44 overflow-hidden rounded-[26px]">
            <img
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=85"
              alt="Chanel spa template"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="rounded-[24px] bg-white/75 p-4 shadow-xl">
            <div className="mb-2 h-3 w-24 rounded-full bg-[#c8977a]" />
            <div className="h-4 w-full rounded-full bg-[#2b1b15]/80" />
            <div className="mt-2 h-4 w-3/4 rounded-full bg-[#2b1b15]/45" />
          </div>
        </div>
      </div>
    </div>
  );
}