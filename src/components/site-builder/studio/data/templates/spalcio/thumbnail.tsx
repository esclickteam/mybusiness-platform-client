import React from "react";
import { ArrowRight, Building2, Sparkles } from "lucide-react";

export default function SpalcioThumbnail() {
  return (
    <div className="h-full w-full overflow-hidden bg-[#f6f3ee] text-slate-950">
      <div className="flex h-full flex-col">
        <div className="flex h-10 items-center justify-between border-b border-slate-200 bg-white px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-950 text-white">
              <Building2 className="h-3 w-3" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
              Spalcio
            </span>
          </div>

          <div className="hidden items-center gap-4 sm:flex">
            <span className="h-1.5 w-10 rounded-full bg-slate-200" />
            <span className="h-1.5 w-10 rounded-full bg-slate-200" />
            <span className="h-1.5 w-10 rounded-full bg-slate-200" />
          </div>

          <div className="h-5 w-16 rounded-full bg-slate-950" />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1.05fr_0.95fr] gap-4 p-5">
          <div className="flex flex-col justify-center">
            <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 shadow-sm">
              <Sparkles className="h-3 w-3 text-blue-600" />
              <span className="text-[9px] font-black text-slate-600">
                PURPOSE
              </span>
            </div>

            <div className="space-y-2">
              <div className="h-7 w-[92%] rounded bg-slate-950" />
              <div className="h-7 w-[82%] rounded bg-slate-950" />
              <div className="h-7 w-[66%] rounded bg-slate-950" />
            </div>

            <div className="mt-5 space-y-2">
              <div className="h-2 w-[88%] rounded-full bg-slate-300" />
              <div className="h-2 w-[70%] rounded-full bg-slate-300" />
            </div>

            <div className="mt-5 flex gap-2">
              <div className="flex h-8 w-28 items-center justify-center gap-1 rounded-full bg-slate-950 text-white">
                <span className="text-[9px] font-black">Start</span>
                <ArrowRight className="h-3 w-3" />
              </div>
              <div className="h-8 w-24 rounded-full border border-slate-300 bg-white" />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-slate-200 pt-4">
              <div>
                <div className="h-4 w-10 rounded bg-slate-950" />
                <div className="mt-2 h-1.5 w-12 rounded-full bg-slate-300" />
              </div>
              <div>
                <div className="h-4 w-10 rounded bg-slate-950" />
                <div className="mt-2 h-1.5 w-12 rounded-full bg-slate-300" />
              </div>
              <div>
                <div className="h-4 w-10 rounded bg-slate-950" />
                <div className="mt-2 h-1.5 w-12 rounded-full bg-slate-300" />
              </div>
            </div>
          </div>

          <div className="relative flex items-center">
            <div className="absolute -left-5 top-4 h-24 w-24 rounded-full bg-blue-200/60 blur-2xl" />
            <div className="absolute -bottom-4 right-0 h-28 w-28 rounded-full bg-amber-200/70 blur-2xl" />

            <div className="relative h-[82%] w-full overflow-hidden rounded-[1.4rem] border border-white bg-white p-2 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80"
                alt="Spalcio template preview"
                className="h-full w-full rounded-[1rem] object-cover"
              />

              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-white/30 bg-white/85 p-3 shadow-lg backdrop-blur">
                <div className="h-2.5 w-28 rounded-full bg-slate-950" />
                <div className="mt-2 h-1.5 w-full rounded-full bg-slate-300" />
                <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-slate-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}