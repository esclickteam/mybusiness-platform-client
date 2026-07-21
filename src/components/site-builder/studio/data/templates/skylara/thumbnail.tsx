import React from "react";

export default function SkylaraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="grid h-full min-h-[260px] grid-cols-[0.38fr_0.62fr]" style={{ background: "#06101c", color: "#e8f1ff" }}>
        <div className="relative overflow-hidden border-l" style={{ borderColor: "rgba(57,208,255,0.24)" }}>
          <div className="absolute inset-0" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=700&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #06101ce8)" }} />
          <div className="absolute inset-x-3 bottom-4 space-y-1 text-[9px] font-bold tracking-[0.18em]" style={{ color: "#39d0ff" }}>
            {["46", "31", "18"].map((floor) => <div key={floor} className="flex justify-between border-t pt-1" style={{ borderColor: "#39d0ff" }}><span>FLOOR</span><span>{floor}</span></div>)}
          </div>
        </div>
        <div className="p-4">
          <p className="text-[9px] font-bold tracking-[0.28em]" style={{ color: "#39d0ff" }}>HIGH-RISE</p>
          <h3 className="mt-4 text-4xl font-bold leading-[0.9]" style={{ fontFamily: '"Space Grotesk", sans-serif' }}>לחיות מעל העיר.</h3>
          <div className="mt-5 h-px w-20" style={{ background: "#39d0ff" }} />
          <div className="absolute bottom-4 left-4 right-[44%] border-t pt-2 text-[10px] font-bold" style={{ borderColor: "rgba(57,208,255,0.26)", color: "#7f97b0" }}>42 · 31 · 18</div>
        </div>
      </div>
    </div>
  );
}
