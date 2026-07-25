import React from "react";

export default function TrailhausThumbnail() {
  return (
    <div className="relative flex h-full min-h-[260px] w-full flex-col justify-between overflow-hidden p-5 text-right" style={{ background: "#F4F7F0", color: "#14532D", fontFamily: "Heebo, sans-serif" }}>
      <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: `radial-gradient(circle at 80% 20%, #16653466, transparent 45%)` }} />
      <div className="relative">
        <div className="inline-flex px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em]" style={{ background: "#166534", color: "#F0FDF4" }}>טיולים וקמפינג</div>
        <h3 className="mt-4 text-3xl font-black leading-none" style={{ fontFamily: "Oswald, serif" }}>Trailhaus</h3>
        <p className="mt-2 text-xs font-semibold opacity-70">מהשביל עד הבסיס.</p>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        {["חנות", "גלריה", "אודות", "FAQ"].map((label) => (
          <div key={label} className="border px-2 py-3 text-center text-[10px] font-bold" style={{ borderColor: "#16653455", background: "#FFFFFF" }}>{label}</div>
        ))}
      </div>
    </div>
  );
}
