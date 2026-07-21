import React from "react";
export default function VillaireThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="flex h-full min-h-[260px] flex-col items-center justify-center p-5 text-center" style={{ background: "#0a0a0a", color: "#f4efe6" }}>
        <p className="text-[10px] tracking-[0.28em]" style={{ color: "#e2c7a0" }}>וילות פרטיות</p>
        <h3 className="mt-3 text-4xl font-bold" style={{ fontFamily: '"Cormorant Garamond"' }}>Villaire</h3>
        <div className="mt-3 h-px w-16" style={{ background: "#e2c7a0" }} />
        <div className="mt-5 h-20 w-full max-w-[220px]" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      </div>
    </div>
  );
}
