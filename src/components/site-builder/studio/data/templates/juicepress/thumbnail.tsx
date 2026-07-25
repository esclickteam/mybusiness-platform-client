import React from "react";
export default function JuicepressThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#fffbeb" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #fffbeb)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#f59e0b" }}>מיצים · בר בריאות</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Space Grotesk", "Heebo"', color: "#1c1917" }}>Juicepress</h3>
        </div>
      </div>
    </div>
  );
}
