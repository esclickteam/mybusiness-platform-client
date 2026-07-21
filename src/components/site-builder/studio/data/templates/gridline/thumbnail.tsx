import React from "react";

export default function GridlineThumbnail() {
  return (
    <div
      dir="ltr"
      className="relative h-full min-h-[260px] w-full overflow-hidden bg-white p-4 text-black"
    >
      <div className="flex items-center justify-between">
        <div className="rounded bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
          Gala
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#fc427f]">
          Nail Salon
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-md">
        <div className="h-16 bg-gradient-to-r from-[#111] via-[#333] to-[#fc427f]" />
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="aspect-square rounded-[18px] border-2 border-[#e7e7e7] bg-[#fafafa]"
          />
        ))}
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#fc427f]">
          Our Service
        </p>
        <h3 className="mt-1 text-lg font-bold uppercase leading-tight">
          Gala Nail Salon
        </h3>
      </div>
    </div>
  );
}
