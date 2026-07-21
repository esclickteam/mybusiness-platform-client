import React from "react";
export default function LoteraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#0c1520", color: "#eef4f8" }}>
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0c1520 18%, transparent 72%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: "#6eb6ff" }}>נדל״ן יוקרה · חוף</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Frank Ruhl Libre", serif' }}>Lotera</h3>
        <p className="mt-2 max-w-[230px] text-xs leading-5 opacity-85">לוטרה מתמחה בדירות ובתים עם נוף לים. ליווי אישי, בחי…</p>
      </div>
    </div>
  );
}
