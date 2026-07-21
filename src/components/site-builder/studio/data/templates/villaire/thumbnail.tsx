import React from "react";
export default function VillaireThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#0b0b0b", color: "#f5f0e8" }}>
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0b0b0b 18%, transparent 72%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: "#e2c7a0" }}>וילות פרטיות</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Villaire</h3>
        <p className="mt-2 max-w-[230px] text-xs leading-5 opacity-85">וילר מתמחה בוילות אדריכליות, מגרשים נדירים ונכסים עם…</p>
      </div>
    </div>
  );
}
