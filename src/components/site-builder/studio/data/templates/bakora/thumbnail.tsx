import React from "react";
export default function BakoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#faf6f0" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #faf6f0)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#c4784a" }}>מאפייה · מאפים</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Libre Baskerville", "Heebo"', color: "#2a1f18" }}>Bakora</h3>
        </div>
      </div>
    </div>
  );
}
