import React from "react";
export default function TacoflareThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#1a0e0a" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #1a0e0a)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#e85d04" }}>מקסיקני · טאקו</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Oswald", "Heebo"', color: "#fff3e8" }}>Tacoflare</h3>
        </div>
      </div>
    </div>
  );
}
