import React from "react";
export default function CrustoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="grid h-full min-h-[260px] grid-cols-2">
        <div className="flex flex-col justify-center p-4" style={{ background: "#faf4eb", color: "#2a1810" }}>
          <p className="text-[10px]" style={{ color: "#c1121f" }}>פיצה · תנור עצים</p>
          <h3 className="text-3xl font-black leading-none" style={{ fontFamily: '"Archivo Black", "Heebo"' }}>Crustora</h3>
          <div className="mt-2 h-1 w-16" style={{ background: "#c1121f" }} />
        </div>
        <div className="flex items-center justify-center" style={{ background: "#ffffff" }}>
          <div className="h-24 w-24 rounded-full border-4" style={{ borderColor: "#c1121f", backgroundImage: "url(https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        </div>
      </div>
    </div>
  );
}
