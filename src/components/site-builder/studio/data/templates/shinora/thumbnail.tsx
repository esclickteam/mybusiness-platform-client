import React from "react";

export default function ShinoraThumbnail() {
  return (
    <div className="relative h-full min-h-[220px] w-full overflow-hidden rounded-[28px] bg-[#fbf4ef] p-4 text-[#2d211d]">
      <div className="absolute -right-10 top-4 h-36 w-36 rounded-full bg-[#efc7ab] blur-2xl" />
      <div className="absolute -left-8 bottom-0 h-40 w-40 rounded-full bg-[#ddc1af] blur-2xl" />
      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2d211d] text-sm font-black text-white">S</div>
          <div className="rounded-full border border-[#d9bba6] bg-white/70 px-3 py-1 text-[11px] font-black">Beauty</div>
        </div>
        <div>
          <div className="mb-3 h-28 rounded-[28px] bg-[url('https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=700&q=85')] bg-cover bg-center shadow-xl" />
          <div className="text-2xl font-black leading-none tracking-[-0.05em]">Shinora</div>
          <div className="mt-2 h-2 w-24 rounded-full bg-[#d8b39a]" />
          <div className="mt-2 h-2 w-16 rounded-full bg-[#ead8ca]" />
        </div>
      </div>
    </div>
  );
}
