import React from "react";
export default function SaltforgeThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "url(https://images.unsplash.com/photo-156916313939-606684352ba8?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover", filter: "grayscale(30%)" }} />
        <div className="absolute inset-0 opacity-30" style={{ background: "#1a1816" }} />
        <div className="relative grid h-full grid-cols-2 gap-1 p-3">
          <div className="col-span-2"><p className="text-[10px]" style={{ color: "#c45c26" }}>Artisan · חוף</p><h3 className="text-2xl font-bold" style={{ fontFamily: '"Oswald"', color: "#fff" }}>Saltforge</h3></div>
          <div className="h-16" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
          <div className="h-20" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
        </div>
      </div>
    </div>
  );
}
