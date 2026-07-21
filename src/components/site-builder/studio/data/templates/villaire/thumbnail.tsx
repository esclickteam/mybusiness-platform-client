import React from "react";

export default function VillaireThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden px-5 py-4 text-center" style={{ background: "#0a0a0a", color: "#f4efe6" }}>
        <div className="flex items-center justify-between text-[10px] tracking-[0.24em]" style={{ color: "#e2c7a0" }}>
          <span>Villaire</span>
          <span className="border px-2 py-1" style={{ borderColor: "#e2c7a0" }}>סיור</span>
        </div>
        <p className="mt-7 text-[9px] tracking-[0.34em]" style={{ color: "#e2c7a0" }}>PRIVATE VILLA</p>
        <h3 className="mx-auto mt-2 max-w-[210px] text-5xl font-bold leading-[0.86]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>וילה אחת.</h3>
        <div className="mx-auto mt-4 h-px w-20" style={{ background: "#e2c7a0" }} />
        <div className="absolute inset-x-5 bottom-5 overflow-hidden border" style={{ borderColor: "rgba(226,199,160,0.2)" }}>
          <div className="aspect-[21/9]" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
        </div>
      </div>
    </div>
  );
}
