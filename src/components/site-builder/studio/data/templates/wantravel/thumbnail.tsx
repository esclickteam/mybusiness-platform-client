import React from "react";

export default function WantravelThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[240px] w-full overflow-hidden rounded-[24px] bg-[#18392f] text-white"
      style={{ fontFamily: "Assistant, Heebo, system-ui, sans-serif" }}
    >
      <img
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        alt="Wantravel"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/20 to-[#18392f]" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-black tracking-[0.2em] backdrop-blur">
            TRAVEL
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f7d99b] font-black text-[#18392f]">
            W
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-black leading-tight">Wantravel</h3>
          <p className="mt-2 max-w-[220px] text-xs font-semibold leading-5 text-white/85">
            תבנית יוקרתית לסוכנות נסיעות עם הירו גדול, יעדים, חבילות וטופס
            לידים.
          </p>
        </div>
      </div>
    </div>
  );
}