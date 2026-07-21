import React from "react";
export default function HomaraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#f7f2ea", color: "#2a241c" }}>
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #f7f2ea 18%, transparent 72%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: "#3f6f5a" }}>בתים למשפחה</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Assistant", serif' }}>Homara</h3>
        <p className="mt-2 max-w-[230px] text-xs leading-5 opacity-85">הומרה מחפשת בתים עם חצר, בתי ספר קרובים, ושכונה שאפש…</p>
      </div>
    </div>
  );
}
