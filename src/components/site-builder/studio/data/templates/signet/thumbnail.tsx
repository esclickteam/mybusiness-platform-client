import React from "react";
export default function SignetThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden"><div className="absolute inset-0" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85)", backgroundSize:"cover" }} /><div className="absolute inset-0" style={{ background:"#0d0c0a88" }} /><div className="absolute bottom-4 right-4 left-4"><p className="text-[10px]" style={{ color:"#b8860b" }}>תהליך עסקה · חותמת</p><h3 className="text-3xl font-bold" style={{ fontFamily:'"Cinzel"', color:"#f5f0e6" }}>Signet</h3></div></div>
    </div>
  );
}
