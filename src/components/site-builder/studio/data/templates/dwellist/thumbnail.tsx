import React from "react";
export default function DwellistThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden"><div className="absolute inset-0" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85)", backgroundSize:"cover" }} /><div className="absolute inset-0" style={{ background:"#1a151088" }} /><div className="absolute bottom-4 right-4 left-4"><p className="text-[10px]" style={{ color:"#5c7c6a" }}>תכנון מגורים · נדל״ן</p><h3 className="text-3xl font-bold" style={{ fontFamily:'"DM Serif Display", "DM Sans"', color:"#2c2419" }}>Dwellist</h3></div></div>
    </div>
  );
}
