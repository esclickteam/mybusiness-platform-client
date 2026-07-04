import React from "react";

export default function ChanelThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-[420px] w-full overflow-hidden rounded-[28px] border border-[#241711]/10 bg-[#fff8f3] shadow-[0_20px_60px_rgba(36,23,17,.12)]"
    >
      <img
        src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=90"
        alt="Chanel spa template"
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(65,17,24,.72),rgba(189,78,90,.34),rgba(255,220,215,.10))]" />

      <div className="absolute left-7 top-7 rounded-full bg-[#241711] px-5 py-3 text-xs font-black text-white">
        קביעת תור
      </div>

      <div className="absolute right-7 top-7 font-serif text-4xl tracking-[-0.09em] text-white">
        Chanel
      </div>

      <div className="absolute bottom-9 right-8 max-w-[74%] text-white">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/80">
          SPA • BEAUTY • WELLNESS
        </p>
        <h3 className="mt-3 font-serif text-5xl leading-[.84] tracking-[-0.08em]">
          חוויית ספא יוקרתית.
        </h3>
        <p className="mt-4 text-sm font-bold leading-6 text-white/82">
          תבנית ספא עם תנועה בגלילה, שירותים, צוות, מחירון וטופס.
        </p>
      </div>
    </div>
  );
}
