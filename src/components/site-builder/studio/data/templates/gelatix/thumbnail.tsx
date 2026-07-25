import React from "react";
export default function GelatixThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#fff5f8" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #fff5f8)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#e85a8c" }}>גלידה · ג׳לאטו</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Cormorant Garamond", "Heebo"', color: "#2b1822" }}>Gelatix</h3>
        </div>
      </div>
    </div>
  );
}
