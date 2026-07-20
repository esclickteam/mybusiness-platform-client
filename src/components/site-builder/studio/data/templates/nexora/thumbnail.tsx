import React from "react";

export default function NexoraThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl bg-[#0b1020] p-5 text-white"
    >
      <div className="absolute left-1/2 top-0 h-40 w-52 -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl" />
      <div className="absolute bottom-2 right-4 h-24 w-24 rounded-full bg-violet-600/30 blur-2xl" />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-sm font-bold text-white">
            N
          </div>
          <span className="text-sm font-bold">Nexora</span>
        </div>
        <div className="rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-[10px] font-semibold text-indigo-300">
          SaaS
        </div>
      </div>

      <div className="relative z-10 mt-9 text-center">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-indigo-300">
          פלטפורמת SaaS
        </p>
        <h3 className="mx-auto max-w-[220px] text-2xl font-bold leading-[1.1]">
          התוכנה שמריצה את העסק קדימה.
        </h3>

        <div className="mt-6 grid grid-cols-3 gap-2">
          {["12K+", "99.9%", "4.9"].map((stat) => (
            <div key={stat} className="rounded-xl border border-white/10 bg-white/5 py-2">
              <div className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-sm font-bold text-transparent">
                {stat}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
