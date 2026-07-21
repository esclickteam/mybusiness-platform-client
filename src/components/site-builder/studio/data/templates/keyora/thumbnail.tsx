import React from "react";
export default function KeyoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="flex h-full min-h-[260px] flex-col justify-between p-5" style={{ background: "#f5f8fc", color: "#0f1b2d" }}>
        <div>
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#0b5fff" }}>סוכנות נדל״ן מודרנית</p>
          <h3 className="mt-3 text-4xl font-black leading-none" style={{ fontFamily: '"Rubik"', color: "#0b5fff" }}>Keyora</h3>
          <p className="mt-3 text-xs opacity-70">חיפוש · תקציב · חדרים</p>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t pt-3 text-center" style={{ borderColor: "rgba(15,27,45,0.12)" }}>
          <div><div className="text-lg font-bold" style={{ color: "#0b5fff" }}>240+</div><div className="text-[10px] opacity-60">נכסים</div></div>
          <div><div className="text-lg font-bold" style={{ color: "#0b5fff" }}>48ש׳</div><div className="text-[10px] opacity-60">מענה</div></div>
          <div><div className="text-lg font-bold" style={{ color: "#0b5fff" }}>96%</div><div className="text-[10px] opacity-60">שביעות</div></div>
        </div>
      </div>
    </div>
  );
}
