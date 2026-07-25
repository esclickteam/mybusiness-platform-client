import React from "react";

export default function FloriqueThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#FFF7FB", color: "#3B1028" }}>
      <div className="absolute -left-14 -top-8 h-36 w-36 rounded-full blur-3xl" style={{ background: "rgba(225,29,140,0.18)" }} />
      <div className="flex items-center justify-between">
        <span className="text-5xl leading-none" style={{ fontFamily: "\"Great Vibes\", cursive", color: "#E11D8C" }}>Florique</span>
        <span className="grid h-8 w-8 place-items-center border text-xs font-black" style={{ borderColor: "#E11D8C", color: "#E11D8C" }}>F</span>
      </div>
      <div className="mt-6 grid h-32 grid-cols-5 gap-2">
        <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=500&q=75" alt="" className="col-span-3 h-full w-full object-cover" />
        <div className="col-span-2 grid gap-2">
          <img src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=500&q=75" alt="" className="h-full w-full object-cover" />
          <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=500&q=75" alt="" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="mt-5 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.28em]" style={{ color: "#E11D8C" }}>סטודיו פרחים</p>
        <h3 className="mx-auto mt-2 max-w-[230px] text-xl font-semibold leading-tight">זרים שנראים כאילו נקטפו מתוך מכתב אהבה.</h3>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-5 py-3 text-center text-xs font-black uppercase tracking-[0.2em] text-white" style={{ background: "#E11D8C" }}>
        הזמינו זר
      </div>
    </div>
  );
}
