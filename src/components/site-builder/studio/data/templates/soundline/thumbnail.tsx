import React from "react";
export default function SoundlineThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#060609", color: "#F7F7FB" }}>
      <div className="absolute inset-0 opacity-70" style={{ background: "linear-gradient(90deg, rgba(255,77,109,.18) 1px, transparent 1px), radial-gradient(circle at 72% 20%, #FF4D6D66, transparent 28%)", backgroundSize: "34px 34px, auto" }} />
      <div className="absolute bottom-5 left-5 h-24 w-24 rounded-full border-[14px] border-black bg-[#FF4D6D]" />
      <div className="absolute left-8 top-12 h-36 w-12 border border-white/25 bg-white/10" />
      <div className="absolute left-24 top-8 h-40 w-12 border border-[#FF4D6D] bg-black" />
      <div className="relative">
        <div className="text-xs font-black uppercase tracking-[0.28em]" style={{ color: "#FF4D6D" }}>בית ספר למוזיקה</div>
        <h3 className="mt-8 text-6xl font-black uppercase leading-[0.82]" style={{ fontFamily: "Impact, sans-serif", textShadow: "4px 4px 0 #FF4D6D" }}>Soundline</h3>
        <p className="mt-5 max-w-[170px] text-sm font-bold leading-5 text-white/70">ניאון, במה, מורים וגלריית סטריפים</p>
      </div>
    </div>
  );
}
