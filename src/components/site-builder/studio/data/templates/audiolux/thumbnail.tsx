import React from "react";

export default function AudioluxThumbnail() {
  return (
    <div className="relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#050915", color: "#E0F2FE", fontFamily: "Heebo, sans-serif" }}>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 80% 20%, #06B6D466, transparent 45%)` }} />
      <div className="relative">
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: "#06B6D4", color: "#041016" }}>אודיו וסאונד</div>
        <h3 className="mt-4 text-3xl font-black leading-none" style={{ fontFamily: "Space Grotesk, serif" }}>Audiolux</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">במה פרטית בבית.</p>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        {["חנות", "גלריה", "אודות", "FAQ"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "#06B6D455", background: "#111827" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
