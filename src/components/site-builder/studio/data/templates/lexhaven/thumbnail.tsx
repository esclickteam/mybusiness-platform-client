import React from "react";

export default function LexhavenThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#F7F3EE", color: "#211615" }}>
      <div className="relative z-10 flex items-center justify-between border-b pb-3" style={{ borderColor: "#7A1F2B33", color: "#7A1F2B" }}>
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center border text-[10px] font-bold" style={{ borderColor: "#7A1F2B" }}>LH</div>
          <span className="text-sm font-bold" style={{ fontFamily: "\"Libre Baskerville\", serif" }}>Lexhaven</span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-[0.18em]">ייעוץ</span>
      </div>
      <div className="relative z-10 mt-6 grid grid-cols-[1fr_92px] gap-4">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: "#7A1F2B" }}>משרד מסחרי</p>
          <h3 className="mt-2 text-2xl font-bold leading-tight" style={{ fontFamily: "\"Libre Baskerville\", serif" }}>
            אסטרטגיה משפטית
            <br />
            לפני כל צעד.
          </h3>
          <div className="mt-4 h-1 w-14" style={{ background: "#7A1F2B" }} />
        </div>
        <div className="border-l-[7px] p-1" style={{ borderColor: "#7A1F2B", background: "#7A1F2B14" }}>
          <div className="h-[105px] w-full bg-[#3A2A28]" />
        </div>
      </div>
      <div className="relative z-10 mt-6 divide-y border-y text-xs" style={{ borderColor: "#7A1F2B40" }}>
        {["חברות והשקעות", "נדל״ן מסחרי", "ליטיגציה"].map((item, index) => (
          <div key={item} className="flex items-center gap-3 py-2" style={{ borderColor: "#7A1F2B26" }}>
            <span className="font-bold" style={{ color: "#7A1F2B", fontFamily: "\"Libre Baskerville\", serif" }}>0{index + 1}</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 h-14 w-28" style={{ background: "#7A1F2B" }} />
    </div>
  );
}
