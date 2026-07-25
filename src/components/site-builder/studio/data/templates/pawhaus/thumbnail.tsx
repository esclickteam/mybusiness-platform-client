import React from "react";

export default function PawhausThumbnail() {
  const images = [
    "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=500&q=75",
    "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=500&q=75",
  ];

  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#FAF7F2", color: "#1C1917" }}>
      <div className="flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center text-sm font-black text-white" style={{ background: "#F59E0B" }}>P</div>
        <span className="text-[10px] font-black tracking-[0.28em]" style={{ color: "#F59E0B" }}>טיפול בחיות</span>
      </div>
      <h3 className="mt-5 text-4xl font-black leading-none tracking-[-0.06em]" style={{ fontFamily: "\"Fraunces\", serif" }}>Pawhaus</h3>
      <div className="mt-5 grid h-28 grid-cols-5 gap-2">
        <img src={images[0]} alt="" className="col-span-3 h-full w-full object-cover" />
        <div className="col-span-2 grid gap-2">
          <img src={images[1]} alt="" className="h-full w-full object-cover" />
          <img src={images[2]} alt="" className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {["מעון", "פנסיון", "טיפוח"].map((label) => (
          <div key={label} className="px-2 py-2 text-center text-[10px] font-black text-white" style={{ background: "#F59E0B" }}>{label}</div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-5 py-3 text-center text-xs font-black text-white" style={{ background: "#1C1917" }}>
        שריינו יום ניסיון
      </div>
    </div>
  );
}
