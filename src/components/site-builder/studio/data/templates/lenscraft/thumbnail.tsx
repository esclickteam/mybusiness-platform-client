import React from "react";

export default function LenscraftThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-4" style={{ background: "#0F0F10", color: "#FAFAFA", fontFamily: "\"Space Grotesk\", sans-serif" }}>
      <div className="absolute inset-y-0 left-0 w-2" style={{ background: "#E11D48" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(225,29,72,.24), transparent 48%)" }} />
      <div className="relative z-10 flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(255,255,255,.14)" }}>
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center border text-[10px] font-bold" style={{ borderColor: "#E11D48", color: "#E11D48", borderRadius: 0 }}>LC</div>
          <span className="text-sm font-bold tracking-[-0.04em]">Lenscraft</span>
        </div>
        <span className="text-[9px] uppercase tracking-[0.22em]" style={{ color: "#E11D48" }}>film studio</span>
      </div>
      <div className="relative z-10 mt-7 grid grid-cols-[1.1fr_.9fr] gap-3">
        <div>
          <h3 className="text-2xl font-bold leading-[.95] tracking-[-0.08em]">פריימים חדים<br />למותגים חיים.</h3>
          <div className="mt-5 space-y-2">
            {["Frame", "Sequence", "Campaign"].map((item) => (
              <div key={item} className="border px-3 py-2 text-[10px] font-bold" style={{ borderColor: "rgba(225,29,72,.45)", borderRadius: 0 }}>{item}</div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="col-span-2 h-20" style={{ background: "linear-gradient(135deg, #3F3F46, #E11D48)" }} />
          <div className="h-16" style={{ background: "#27272A" }} />
          <div className="h-16" style={{ background: "#E11D48" }} />
        </div>
      </div>
    </div>
  );
}
