import React from "react";
export default function MirageThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden" style={{ background: "#f7f0e4" }}>
        <div className="absolute inset-0 opacity-80" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1509316785579-021411973673?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "#f7f0e4aa" }} />
        <div className="relative p-4">
          <p className="text-[10px]" style={{ color: "#d4a574" }}>מדבר · ים</p>
          <h3 className="text-3xl font-bold" style={{ fontFamily: '"Cormorant Garamond"' }}>Mirage</h3>
          <div className="mt-4 flex gap-1"><span className="border px-2 py-1 text-[10px]" style={{ borderColor: "rgba(74,56,40,0.14)" }}>32°</span><span className="border px-2 py-1 text-[10px]" style={{ borderColor: "rgba(74,56,40,0.14)" }}>28°</span></div>
        </div>
      </div>
    </div>
  );
}
