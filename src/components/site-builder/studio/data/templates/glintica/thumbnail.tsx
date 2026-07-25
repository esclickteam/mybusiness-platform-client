import React from "react";

export default function GlinticaThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#1F1A1C", color: "#F8F1F2" }}>
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 52% 28%, #D4A0A733, transparent 36%), linear-gradient(180deg, transparent, #1F1A1C 78%)" }} />
      <div className="absolute left-5 top-16 h-28 w-20 border" style={{ borderColor: "#D4A0A755", background: "#D4A0A711", borderRadius: 0 }} />
      <div className="absolute bottom-12 right-7 h-24 w-24 border" style={{ borderColor: "#D4A0A744", borderRadius: 0 }} />
      <div className="relative z-10 flex items-center justify-between border-b pb-3" style={{ borderColor: "#ffffff18" }}>
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center text-xs font-bold" style={{ border: "1px solid #D4A0A7", color: "#D4A0A7", borderRadius: 0 }}>G</div>
          <span className="text-base font-semibold" style={{ fontFamily: "\"Cormorant Infant\", serif" }}>Glintica</span>
        </div>
        <span className="text-[9px] tracking-[0.26em]" style={{ color: "#D4A0A7" }}>איפור כלות</span>
      </div>
      <div className="relative z-10 mt-7 text-center">
        <h3 className="text-[44px] font-semibold leading-[0.75] tracking-[-0.06em]" style={{ fontFamily: "\"Cormorant Infant\", serif" }}>Glintica</h3>
        <div className="mx-auto mt-4 h-px w-28" style={{ background: "linear-gradient(90deg, transparent, #D4A0A7, transparent)" }} />
        <p className="mx-auto mt-4 max-w-[210px] text-xl font-semibold leading-none" style={{ fontFamily: "\"Cormorant Infant\", serif" }}>יופי נקי. נוכחות בלתי נשכחת.</p>
      </div>
      <div className="relative z-10 mt-7 grid grid-cols-[1fr_44px] gap-3">
        <div className="space-y-2">
          {["איפור כלה", "איפור ערב", "ליווי"].map((item, index) => (
            <div key={item} className="flex items-center gap-2 text-[10px]">
              <span style={{ color: "#D4A0A7" }}>0{index + 1}</span>
              <span>{item}</span>
              <span className="h-px flex-1" style={{ background: "repeating-linear-gradient(90deg,#D4A0A777 0 2px,transparent 2px 6px)" }} />
              <span style={{ color: "#D4A0A7" }}>₪</span>
            </div>
          ))}
        </div>
        <div className="grid grid-rows-2 gap-1">
          <div style={{ background: "#D4A0A722", border: "1px solid #D4A0A744", borderRadius: 0 }} />
          <div style={{ background: "#F8F1F222", border: "1px solid #D4A0A744", borderRadius: 0 }} />
        </div>
      </div>
    </div>
  );
}
