import React from "react";
export default function NestoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#f3f5f8", color: "#1e2836" }}>
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #f3f5f8 18%, transparent 72%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: "#3d5a80" }}>סוכנות בוטיק</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Nestora</h3>
        <p className="mt-2 max-w-[230px] text-xs leading-5 opacity-85">נסטורה היא סוכנות קטנה עם ליווי צמוד — פחות נכסים על…</p>
      </div>
    </div>
  );
}
