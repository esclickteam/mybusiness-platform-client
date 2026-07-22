import React from "react";
export default function BlockwiseThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden"><div className="absolute inset-0" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85)", backgroundSize:"cover" }} /><div className="absolute inset-0" style={{ background:"#0d0d0d88" }} /><div className="absolute bottom-4 right-4 left-4"><p className="text-[10px]" style={{ color:"#e63946" }}>נדל״ן בrutalist · עיר</p><h3 className="text-3xl font-bold" style={{ fontFamily:'"Archivo Black", "IBM Plex Sans Hebrew"', color:"#1a1a1a" }}>Blockwise</h3></div></div>
    </div>
  );
}
