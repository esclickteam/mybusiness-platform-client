import React from "react";

export default function SkillforgeThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#18181B", color: "#FAFAFA" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 18% 20%, #A3E63566, transparent 45%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#A3E635" }}>כישורי קריירה</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Oswald\"" }}>Skillforge</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">הכשרות קריירה פרקטיות — מכירות, ניהול, דאטה ותקשורת — בלי מילים ריקות.…</p>
        <div className="mt-8 flex gap-2">
          {["2.4k", "4.9", "120"].map((n) => (
            <div key={n} className="border px-3 py-2 text-xs font-bold" style={{ borderColor: "#A3E63555", color: "#A3E635" }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
