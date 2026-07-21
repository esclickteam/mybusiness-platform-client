import React from "react";

export default function VesperaThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#1a0f14", color: "#f4ebe4" }}>
      <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #1a0f14 15%, transparent 70%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.22em]" style={{ color: "#d4a0a8" }}>אולם תרבות · ירושלים</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Playfair Display", serif' }}>Vespera</h3>
        <p className="mt-2 max-w-[220px] text-xs leading-5 opacity-80">במה למוזיקה חיה, שיחות ואמנות. ערבים שנבחרים בקפ…</p>
      </div>
    </div>
  );
}
