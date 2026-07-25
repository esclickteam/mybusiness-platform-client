import React from "react";
export default function DimsumixThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#0f1412" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1496116218417-ba7f5b9971f5?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #0f1412)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#86efac" }}>דימ סאם · כיסונים</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Noto Serif SC", "Heebo"', color: "#f0f5f2" }}>Dimsumix</h3>
        </div>
      </div>
    </div>
  );
}
