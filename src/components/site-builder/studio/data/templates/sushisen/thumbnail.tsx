import React from "react";
export default function SushisenThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden" style={{ background: "#0b0b0b" }}>
        <div className="absolute inset-x-0 top-1/3 flex gap-2 overflow-hidden py-2" style={{ background: "#161616" }}>
          <div className="h-14 w-20 flex-shrink-0" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
          <div className="h-14 w-20 flex-shrink-0" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
          <div className="h-14 w-20 flex-shrink-0" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
        </div>
        <div className="absolute bottom-4 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#d4af37" }}>סושי · אומאקאסה</p>
          <h3 className="text-3xl font-bold" style={{ fontFamily: '"Cormorant Garamond", "Heebo"', color: "#f2f0ea" }}>Sushisen</h3>
        </div>
      </div>
    </div>
  );
}
