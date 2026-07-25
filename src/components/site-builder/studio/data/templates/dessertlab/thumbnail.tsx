import React from "react";
export default function DessertlabThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#1a1220" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #1a1220)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#e879f9" }}>קינוחים · פטיסרי</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Great Vibes", "Heebo"', color: "#f8eef8" }}>Dessertlab</h3>
        </div>
      </div>
    </div>
  );
}
