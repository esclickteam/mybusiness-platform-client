import React from "react";
import { ArrowRight, Gem, Sparkles } from "lucide-react";

export default function LaunchoraThumbnail() {
  return (
    <div
      dir="ltr"
      className="relative h-full w-full overflow-hidden rounded-[22px] bg-[#fbfbfa] text-neutral-950"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(82,119,255,.22),transparent_30%)]" />

      <div className="relative z-10 flex h-full flex-col p-4">
        <div className="mb-5 flex items-center justify-between">
          <div className="grid h-7 w-7 place-items-center rounded-full bg-black text-white">
            <Gem size={13} />
          </div>

          <div className="flex items-center gap-2 text-[7px] font-semibold text-neutral-500">
            <span>Work</span>
            <span>Services</span>
            <span>About</span>
          </div>

          <div className="rounded-full bg-black px-3 py-1.5 text-[7px] font-bold text-white">
            Talk
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[0.9fr_1.1fr] items-center gap-3">
          <div>
            <div className="mb-3 inline-flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-2 py-1 text-[6px] font-semibold text-neutral-600">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5277ff]" />
              Available
            </div>

            <h3 className="text-[24px] font-black leading-[0.9] tracking-[-0.08em]">
              Design that moves brands
              <span className="text-[#5277ff]">.</span>
            </h3>

            <p className="mt-2 max-w-[120px] text-[7px] leading-[1.45] text-neutral-500">
              Strategic branding, websites and digital products.
            </p>

            <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-black px-3 py-1.5 text-[7px] font-bold text-white">
              Start
              <ArrowRight size={8} />
            </div>
          </div>

          <div className="relative h-[115px]">
            <div className="absolute left-0 top-5 h-20 w-16 rotate-[-8deg] rounded-xl bg-black shadow-xl" />
            <div className="absolute right-0 top-3 h-24 w-20 rotate-[8deg] rounded-xl bg-[#dbe8ff] shadow-xl" />

            <div className="absolute left-3 top-0 h-24 w-[120px] rotate-[4deg] rounded-xl border border-black/5 bg-white p-2 shadow-2xl">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[6px] font-bold">
                  <Sparkles size={7} />
                  Northline
                </div>
                <div className="h-3 w-8 rounded-full bg-black" />
              </div>

              <div className="text-[13px] font-black leading-[0.9] tracking-[-0.06em]">
                Where clarity meets
                <span className="text-[#5277ff]"> performance.</span>
              </div>

              <div className="mt-3 h-8 rounded-lg bg-[#f4f7ff] p-1.5">
                <svg viewBox="0 0 100 35" className="h-full w-full">
                  <path
                    d="M0 26 C12 12 24 28 38 18 C52 8 60 24 74 14 C86 6 92 12 100 5"
                    fill="none"
                    stroke="#5277ff"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <div className="h-9 rounded-xl bg-[#eef4ff]" />
          <div className="h-9 rounded-xl bg-black" />
          <div className="h-9 rounded-xl bg-[#fff2e5]" />
        </div>
      </div>
    </div>
  );
}