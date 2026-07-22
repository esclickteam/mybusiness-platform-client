import React from "react";
export default function LandmarkThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden"><div className="absolute inset-0" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=85)", backgroundSize:"cover" }} /><div className="absolute inset-0" style={{ background:"#0f172a88" }} /><div className="absolute bottom-4 right-4 left-4"><p className="text-[10px]" style={{ color:"#0ea5e9" }}>מדריך אזורים · נדל״ן</p><h3 className="text-3xl font-bold" style={{ fontFamily:'"Outfit"', color:"#1e293b" }}>Landmark</h3></div></div>
    </div>
  );
}
