import React from "react";

export default function UrbanixThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#141516", color: "#f2f2f0" }}>
      <div className="absolute inset-y-0 left-0 w-2" style={{ background: "#c8f542" }} />
      <div className="flex h-full min-h-[260px] flex-col justify-between p-5">
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(242,242,240,0.12)" }}>
          <b className="text-xl font-black" style={{ fontFamily: '"Rubik"' }}>Urbanix</b>
          <span className="px-2 py-1 text-[9px] font-black" style={{ background: "#c8f542", color: "#101210" }}>LIVE</span>
        </div>
        <div>
          <p className="text-[9px] font-black tracking-[0.24em]" style={{ color: "#c8f542" }}>CITY / APARTMENTS</p>
          <h3 className="mt-2 text-5xl font-black leading-[0.85]" style={{ fontFamily: '"Rubik"', color: "#f2f2f0" }}>העיר. הדירה. הקצב.</h3>
        </div>
        <div className="border-y py-2 text-[10px] font-black tracking-[0.18em]" style={{ borderColor: "rgba(242,242,240,0.12)", color: "#c8f542" }}>פלורנטין / רוטשילד / הצפון הישן</div>
        <div className="grid grid-cols-[1fr_auto] border text-[10px]" style={{ borderColor: "rgba(242,242,240,0.12)" }}>
          <span className="p-2">דירת 3 רוטשילד</span>
          <b className="p-2" style={{ color: "#c8f542" }}>₪2.9M</b>
        </div>
      </div>
    </div>
  );
}
