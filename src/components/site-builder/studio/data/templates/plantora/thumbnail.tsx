import React from "react";
export default function PlantoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#f4f7f0" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #f4f7f0)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#65a30d" }}>טבעוני · צמחי</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"DM Serif Display", "Heebo"', color: "#1a2e1a" }}>Plantora</h3>
        </div>
      </div>
    </div>
  );
}
