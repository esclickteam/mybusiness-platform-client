import React from "react";
export default function EstateoThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#14110f", color: "#f5efe6" }}>
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #14110f 18%, transparent 72%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: "#d4af6a" }}>נדל״ן פרטי · יוקרה</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Playfair Display", serif' }}>Estateo</h3>
        <p className="mt-2 max-w-[230px] text-xs leading-5 opacity-85">בתים פרטיים, אחוזות ונכסי אספנות — עם דיסקרטיות מלאה…</p>
      </div>
    </div>
  );
}
