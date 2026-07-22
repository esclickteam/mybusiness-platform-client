import React from "react";
export default function HorizonixThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden" style={{ background: "#0d1117" }}>
        <div className="flex h-full">
          <div className="w-1/3" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
          <div className="w-1/3" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
          <div className="w-1/3" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3" style={{ background: "linear-gradient(transparent, #010409cc)" }}>
          <p className="text-[10px]" style={{ color: "#58a6ff" }}>צילום · חוף</p>
          <h3 className="text-2xl font-bold" style={{ fontFamily: '"Space Grotesk"', color: "#f0f6fc" }}>Horizonix</h3>
        </div>
      </div>
    </div>
  );
}
