import React from "react";
export default function MezzalineThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] p-3" style={{ background: "#f7f1e6" }}>
        <div className="grid h-[55%] grid-cols-2 gap-1">
          <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
          <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
          <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
          <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
        </div>
        <p className="mt-3 text-[10px]" style={{ color: "#5c7a4a" }}>מזטה · ים-תיכוני</p>
        <h3 className="text-2xl font-bold" style={{ fontFamily: '"Playfair Display", "Heebo"', color: "#2c2a22" }}>Mezzaline</h3>
      </div>
    </div>
  );
}
