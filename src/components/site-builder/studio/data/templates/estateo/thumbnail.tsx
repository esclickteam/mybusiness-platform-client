import React from "react";
export default function EstateoThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="grid h-full min-h-[260px] grid-cols-2">
        <div className="flex flex-col justify-between p-4" style={{ background: "#100e0c", color: "#f4ecdf" }}>
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#d4af6a" }}>PRIVATE</p>
          <h3 className="text-3xl font-bold leading-none" style={{ fontFamily: '"Playfair Display"' }}>Estateo</h3>
        </div>
        <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      </div>
    </div>
  );
}
