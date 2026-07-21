import React from "react";
export default function UrbanixThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#1a1c1e", color: "#f2f2f0" }}>
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #1a1c1e 18%, transparent 72%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: "#c8f542" }}>דירות בעיר</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Rubik", serif' }}>Urbanix</h3>
        <p className="mt-2 max-w-[230px] text-xs leading-5 opacity-85">אורבניקס מתמחה בדירות במגדלים, פנטהאוזים עירוניים וה…</p>
      </div>
    </div>
  );
}
