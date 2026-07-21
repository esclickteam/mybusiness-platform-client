import React from "react";
import { loteraDefaultData } from "./defaultData";

export default function LoteraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#07131f", color: "#eef5fb" }}>
      <div className="absolute inset-0" style={{ backgroundImage: `url(${loteraDefaultData.heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(7,19,31,0.15), #07131f 88%)" }} />
      <div className="absolute inset-x-6 top-[46%] h-px" style={{ background: "linear-gradient(90deg, transparent, #5eb4ff, transparent)" }} />
      <div className="absolute right-5 top-4 flex items-center gap-2">
        <span className="h-7 w-px" style={{ background: "#5eb4ff" }} />
        <span className="text-sm font-bold" style={{ fontFamily: '"Frank Ruhl Libre"' }}>Lotera</span>
      </div>
      <div className="absolute bottom-20 right-5 left-5">
        <p className="text-[9px] font-bold tracking-[0.24em]" style={{ color: "#5eb4ff" }}>נדל״ן יוקרה · חוף</p>
        <h3 className="mt-2 text-4xl font-bold leading-none" style={{ fontFamily: '"Frank Ruhl Libre"' }}>הבית נפתח אל הים.</h3>
      </div>
      <div className="absolute bottom-4 right-4 left-4 grid grid-cols-3 border text-[9px]" style={{ borderColor: "rgba(238,245,251,0.24)", background: "rgba(7,19,31,0.72)" }}>
        {["מרינה", "מצוק", "טיילת"].map((item) => (
          <div key={item} className="border-l p-2 last:border-l-0" style={{ borderColor: "rgba(238,245,251,0.16)" }}>
            <b style={{ color: "#5eb4ff" }}>{item}</b>
            <div className="mt-1 opacity-70">קו ראשון</div>
          </div>
        ))}
      </div>
    </div>
  );
}
