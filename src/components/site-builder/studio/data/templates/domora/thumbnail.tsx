import React from "react";

export default function DomoraThumbnail() {
  return (
    <div className="relative h-full min-h-[220px] w-full overflow-hidden rounded-[1.5rem] bg-[#f5f5f2] p-4 text-[#151d20]">
      <div className="mx-auto flex max-w-[92%] items-center justify-between rounded-full bg-[#151d20] px-4 py-3 text-white">
        <div className="text-sm font-semibold">Domora</div>
        <div className="hidden gap-3 text-[10px] text-white/65 sm:flex">
          <span>נכסים</span>
          <span>מאמרים</span>
          <span>שאלות</span>
        </div>
        <div className="rounded-full bg-white px-3 py-1 text-[10px] text-[#151d20]">
          קשר
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
        <div className="text-right">
          <div className="mb-2 text-[10px] text-[#777]">מגורי יוקרה</div>
          <div className="text-3xl font-light leading-none tracking-[-0.07em]">
            חוויית מגורים
            <br />
            שמתחילה נכון
          </div>
          <div className="mt-4 h-2 w-28 rounded-full bg-[#151d20]" />
        </div>

        <div className="grid gap-2">
          <div className="h-24 rounded-[1.25rem] bg-gradient-to-br from-[#11191c] to-[#8aa4b8]" />
          <div className="grid grid-cols-2 gap-2">
            <div className="h-16 rounded-[1rem] bg-[#d8c6a1]" />
            <div className="h-16 rounded-[1rem] bg-[#bcc7cd]" />
          </div>
        </div>
      </div>
    </div>
  );
}