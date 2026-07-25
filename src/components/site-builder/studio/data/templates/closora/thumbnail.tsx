import React from "react";

export default function ClosoraThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-5 text-right" style={{ background: "#FFF7ED", color: "#431407", fontFamily: "Heebo, sans-serif" }}>
      <div>
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ background: "#C2410C" }}>סוכנות מכירות</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Closora</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">מכירות שסוגרות</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["אודות", "שירותים", "צוות"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "#C2410C55", background: "#FFFFFF" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
