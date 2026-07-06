import React from "react";

export default function AdionThumbnail() {
  return (
    <div className="relative h-full min-h-[260px] w-full overflow-hidden rounded-[1.5rem] bg-[#fff8f0] p-4 text-[#301b12]">
      <div className="absolute left-4 top-4 h-24 w-24 rounded-full bg-[#ffc6d8] blur-2xl" />
      <div className="absolute bottom-4 right-4 h-28 w-28 rounded-full bg-[#c9b5ff] blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#301b12] text-lg font-black text-white">
            a
          </span>

          <span className="text-xl font-black tracking-[-0.08em]">adion</span>
        </div>

        <div className="hidden gap-1 text-[10px] font-black opacity-60 sm:flex">
          <span>(01)</span>
          <span>(02)</span>
          <span>(03)</span>
        </div>
      </div>

      <div className="relative z-10 mt-7">
        <p className="mb-2 inline-flex rounded-full bg-[#ffe3a8] px-3 py-1 text-[10px] font-black">
          Branding / Motion
        </p>

        <h3 className="text-[54px] font-black leading-[0.75] tracking-[-0.13em]">
          adion
        </h3>

        <p className="mt-3 max-w-[190px] text-xs font-bold leading-5 opacity-65">
          Digital studio template with bold typography, cards and motion.
        </p>
      </div>

      <div className="absolute bottom-5 left-5 flex items-end gap-2">
        <div className="h-20 w-14 rotate-[-10deg] overflow-hidden rounded-2xl border-4 border-[#fff8f0] bg-[#f7b6ca] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="h-24 w-16 rotate-[8deg] overflow-hidden rounded-2xl border-4 border-[#fff8f0] bg-[#c9b5ff] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="h-16 w-20 rotate-[-4deg] overflow-hidden rounded-2xl border-4 border-[#fff8f0] bg-[#ffe3a8] shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=300&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="absolute bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-[#301b12] text-center text-[10px] font-black leading-tight text-white">
        1.2k+
        <br />
        works
      </div>
    </div>
  );
}