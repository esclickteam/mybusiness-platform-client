import React from "react";
export default function SkylaraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#071525", color: "#e8f1ff" }}>
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #071525 18%, transparent 72%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: "#39d0ff" }}>מגדלים ודירות גבוהות</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Rubik", serif' }}>Skylara</h3>
        <p className="mt-2 max-w-[230px] text-xs leading-5 opacity-85">סקיילרה מתמחה בדירות במגדלים, קומות גבוהות ונופים פת…</p>
      </div>
    </div>
  );
}
