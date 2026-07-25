import React from "react";

export default function TalentixThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-5 text-right" style={{ background: "#ECFEFF", color: "#164E63", fontFamily: "Heebo, sans-serif" }}>
      <div>
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ background: "#0E7490" }}>סוכנות גיוס</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Talentix</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">האנשים הנכונים לעסק</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["אודות", "שירותים", "צוות"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "#0E749055", background: "#FFFFFF" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
