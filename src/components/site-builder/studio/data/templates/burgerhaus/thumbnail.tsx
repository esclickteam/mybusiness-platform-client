import React from "react";
export default function BurgerhausThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#111111" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #111111)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#f59e0b" }}>המבורגר · סמאש</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Archivo Black", "Heebo"', color: "#f5f5f5" }}>Burgerhaus</h3>
        </div>
      </div>
    </div>
  );
}
