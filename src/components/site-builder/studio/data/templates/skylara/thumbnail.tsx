import React from "react";
export default function SkylaraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="grid h-full min-h-[260px] grid-cols-[0.4fr_0.6fr]" style={{ background: "#06101c", color: "#e8f1ff" }}>
        <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="flex flex-col justify-center p-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#39d0ff" }}>FLOOR 42</p>
          <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Space Grotesk"' }}>Skylara</h3>
        </div>
      </div>
    </div>
  );
}
