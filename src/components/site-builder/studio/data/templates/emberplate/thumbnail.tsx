import React from "react";
export default function EmberplateThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#140c08" }}>
        <div className="absolute inset-0 opacity-70" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #140c08)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <div className="mb-2 flex gap-1">{[1,2,3,4].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: "#e85d04" }} />)}</div>
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#e85d04" }}>גריל · סטייקים</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Bebas Neue", "Heebo"', color: "#f6ebe0" }}>Emberplate</h3>
        </div>
      </div>
    </div>
  );
}
