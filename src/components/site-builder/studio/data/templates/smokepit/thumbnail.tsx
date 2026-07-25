import React from "react";
export default function SmokepitThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#120c08" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #120c08)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#ea580c" }}>ברביקיו · מעשנה</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Bebas Neue", "Heebo"', color: "#f3e8d8" }}>Smokepit</h3>
        </div>
      </div>
    </div>
  );
}
