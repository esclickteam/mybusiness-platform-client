import React from "react";
export default function VineriaThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative flex h-full min-h-[260px] flex-col items-center justify-center p-5 text-center" style={{ background: "#1a1218" }}>
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "#1a1218cc" }} />
        <p className="relative text-[10px] tracking-[0.3em]" style={{ color: "#9b2335" }}>יין · טעימות</p>
        <h3 className="relative mt-2 text-3xl font-semibold" style={{ fontFamily: '"Cormorant Garamond", "Heebo"', color: "#f5ebe0" }}>Vineria</h3>
        <div className="relative mt-3 border px-2 py-1 text-[9px] tracking-widest" style={{ borderColor: "#9b2335", color: "#9b2335" }}>CELLAR</div>
      </div>
    </div>
  );
}
