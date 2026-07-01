import React from "react";
import { ArrowLeft, ShoppingBag, Sparkles } from "lucide-react";

export default function VelmoraThumbnail() {
  return (
    <div dir="rtl" className="h-full w-full overflow-hidden bg-[#fbf7ef] text-[#2f241b]">
      <div className="flex h-10 items-center justify-between border-b border-[#e7dfd2] bg-[#fbf7ef] px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2f241b] text-white">
            <ShoppingBag className="h-3 w-3" />
          </div>
          <span className="text-[10px] font-black">Velmora</span>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <span className="h-1.5 w-10 rounded-full bg-[#d8cab9]" />
          <span className="h-1.5 w-10 rounded-full bg-[#d8cab9]" />
          <span className="h-1.5 w-10 rounded-full bg-[#d8cab9]" />
        </div>

        <div className="h-5 w-16 rounded-full bg-[#2f241b]" />
      </div>

      <div className="grid h-[calc(100%-40px)] grid-cols-[0.9fr_1.1fr] gap-4 p-5">
        <div className="flex flex-col justify-center">
          <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border border-[#e7dfd2] bg-white px-3 py-1">
            <Sparkles className="h-3 w-3 text-[#9a6f3b]" />
            <span className="text-[9px] font-black text-[#6d5a49]">
              חדש
            </span>
          </div>

          <div className="space-y-2">
            <div className="h-7 w-[92%] rounded bg-[#2f241b]" />
            <div className="h-7 w-[78%] rounded bg-[#2f241b]" />
            <div className="h-7 w-[55%] rounded bg-[#2f241b]" />
          </div>

          <div className="mt-5 space-y-2">
            <div className="h-2 w-[90%] rounded-full bg-[#d8cab9]" />
            <div className="h-2 w-[68%] rounded-full bg-[#d8cab9]" />
          </div>

          <div className="mt-5 flex gap-2">
            <div className="flex h-8 w-28 items-center justify-center gap-1 rounded-full bg-[#2f241b] text-white">
              <span className="text-[9px] font-black">לקולקציה</span>
              <ArrowLeft className="h-3 w-3" />
            </div>
            <div className="h-8 w-24 rounded-full border border-[#d8cab9] bg-white" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&q=80"
            alt="Velmora"
            className="h-full rounded-[1.5rem] object-cover"
          />
          <div className="flex flex-col gap-2 pt-8">
            <img
              src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80"
              alt="Collection"
              className="h-1/2 rounded-[1.2rem] object-cover"
            />
            <div className="rounded-[1.2rem] border border-[#e7dfd2] bg-white p-3">
              <div className="h-2.5 w-20 rounded-full bg-[#2f241b]" />
              <div className="mt-2 h-1.5 w-full rounded-full bg-[#d8cab9]" />
              <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-[#d8cab9]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}