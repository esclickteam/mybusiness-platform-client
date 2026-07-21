import React from "react";
export default function RivaraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#eef6f5", color: "#16323a" }}>
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #eef6f5 18%, transparent 72%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: "#1f7a78" }}>בתים ליד המים</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Frank Ruhl Libre", serif' }}>Rivara</h3>
        <p className="mt-2 max-w-[230px] text-xs leading-5 opacity-85">ריברה מחברת לקוחות לבתים ליד נחלים, אגמים ופארקים — …</p>
      </div>
    </div>
  );
}
