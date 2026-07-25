import React from "react";
export default function SpiceforgeThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative flex h-full min-h-[260px] flex-col justify-between p-4" style={{ background: "#1a0f0a" }}>
        <div>
          <p className="text-[10px]" style={{ color: "#e76f51" }}>הודו · תבלינים</p>
          <h3 className="text-3xl font-bold" style={{ fontFamily: '"Libre Baskerville", "Heebo"', color: "#fff1e0" }}>Spiceforge</h3>
        </div>
        <div className="ml-auto h-20 w-20 rounded-full border-4" style={{ borderColor: "#1a0f0a", background: "conic-gradient(#e76f51, #e9c46a, #f4a261, #e76f51)" }} />
      </div>
    </div>
  );
}
