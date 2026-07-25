import React from "react";
export default function SeafoodixThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#04151c" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #04151c)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#38bdf8" }}>פירות ים · דגים</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Fraunces", "Heebo"', color: "#e6f4f8" }}>Seafoodix</h3>
        </div>
      </div>
    </div>
  );
}
