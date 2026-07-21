import React from "react";
export default function CoralineThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden" style={{ background: "linear-gradient(180deg, #020c14, #041824)" }}>
        <div className="absolute bottom-6 left-[20%] h-3 w-3 rounded-full border opacity-50" style={{ borderColor: "#3dffd4" }} />
        <div className="absolute bottom-10 left-[50%] h-4 w-4 rounded-full border opacity-50" style={{ borderColor: "#3dffd4" }} />
        <div className="absolute bottom-4 left-[75%] h-3 w-3 rounded-full border opacity-50" style={{ borderColor: "#3dffd4" }} />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px]" style={{ color: "#3dffd4" }}>צלילה · שונית</p>
          <h3 className="text-3xl font-bold" style={{ fontFamily: '"Sora"', color: "#e8f4ff" }}>Coraline</h3>
        </div>
      </div>
    </div>
  );
}
