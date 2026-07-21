import React from "react";
import { homaraDefaultData } from "./defaultData";

export default function HomaraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#f3f0e8", color: "#243028" }}>
      <div className="flex h-full min-h-[260px] flex-col items-center justify-between p-5 text-center">
        <div className="flex w-full items-center justify-between border-b pb-3 text-xs" style={{ borderColor: "rgba(36,48,40,0.14)" }}>
          <b style={{ fontFamily: '"Assistant"' }}>Homara</b>
          <span style={{ color: "#3f6f5a" }}>בתים</span>
        </div>
        <div>
          <div className="mx-auto h-28 w-28 overflow-hidden border-4" style={{ borderRadius: "9999px", borderColor: "#3f6f5a", backgroundImage: `url(${homaraDefaultData.heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <h3 className="mt-4 text-3xl font-bold leading-none" style={{ fontFamily: '"Assistant"' }}>בית שהילדים רצים בו החוצה.</h3>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 text-[10px]">
          <div className="border p-2" style={{ borderColor: "rgba(36,48,40,0.14)", background: "#ebe6da" }}>רמת השרון</div>
          <div className="border p-2" style={{ borderColor: "rgba(36,48,40,0.14)", background: "#ebe6da" }}>הוד השרון</div>
        </div>
      </div>
    </div>
  );
}
