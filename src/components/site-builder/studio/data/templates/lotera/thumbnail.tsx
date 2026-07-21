import React from "react";
export default function LoteraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, #07131f 90%)" }} />
        <div className="absolute inset-x-8 top-[45%] h-px" style={{ background: "#5eb4ff" }} />
        <div className="absolute bottom-5 right-5 left-5">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#5eb4ff" }}>נדל״ן יוקרה · חוף</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Frank Ruhl Libre"', color: "#eef5fb" }}>Lotera</h3>
        </div>
      </div>
    </div>
  );
}
