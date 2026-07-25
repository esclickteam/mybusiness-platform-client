import React from "react";

export default function AdspireThumbnail() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-5 text-right" style={{ background: "#0B0614", color: "#F5F3FF", fontFamily: "Heebo, sans-serif" }}>
      <div>
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white" style={{ background: "#7C3AED" }}>סוכנות פרסום</div>
        <h3 className="mt-4 text-3xl font-black leading-none">Adspire</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">פרסום שאי אפשר לפספס</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["אודות", "שירותים", "צוות"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "#7C3AED55", background: "#160B24" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
