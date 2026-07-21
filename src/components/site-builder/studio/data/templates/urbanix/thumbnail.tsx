import React from "react";
export default function UrbanixThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden p-5" style={{ background: "#141516", color: "#f2f2f0" }}>
        <div className="absolute inset-y-0 left-0 w-1.5" style={{ background: "#c8f542" }} />
        <p className="text-[10px] tracking-[0.2em]" style={{ color: "#c8f542" }}>CITY</p>
        <h3 className="mt-2 text-5xl font-black leading-none" style={{ fontFamily: '"Rubik"', color: "#c8f542" }}>Urbanix</h3>
        <div className="absolute bottom-0 inset-x-0 border-t px-3 py-2 text-[10px] font-bold tracking-[0.18em]" style={{ borderColor: "rgba(242,242,240,0.12)", background: "#1e2022", color: "#c8f542" }}>פלורנטין · רוטשילד · סיטי · יפו</div>
      </div>
    </div>
  );
}
