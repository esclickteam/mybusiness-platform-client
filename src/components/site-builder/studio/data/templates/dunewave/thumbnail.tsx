import React from "react";
export default function DunewaveThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: "linear-gradient(180deg, transparent, #f4ead8)" }} />
        <svg className="absolute bottom-0 w-full" viewBox="0 0 400 30" preserveAspectRatio="none"><path fill="#f4ead8" d="M0,15 Q100,30 200,15 T400,15 L400,30 L0,30 Z"/></svg>
        <div className="absolute bottom-4 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#c9956a" }}>Resort · דיונות</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Playfair Display"', color: "#3d2f1f" }}>Dunewave</h3>
        </div>
      </div>
    </div>
  );
}
