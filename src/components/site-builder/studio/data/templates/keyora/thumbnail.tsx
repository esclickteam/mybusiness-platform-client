import React from "react";
export default function KeyoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#f4f7fb", color: "#122033" }}>
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #f4f7fb 18%, transparent 72%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: "#0b5fff" }}>סוכנות נדל״ן</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Rubik", serif' }}>Keyora</h3>
        <p className="mt-2 max-w-[230px] text-xs leading-5 opacity-85">קיורה מחברת בין קונים למוכרים עם תהליך ברור, נתונים …</p>
      </div>
    </div>
  );
}
