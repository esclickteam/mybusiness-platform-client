import React from "react";
export default function HomaraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="flex h-full min-h-[260px] flex-col items-center justify-center p-5 text-center" style={{ background: "#f3f0e8", color: "#243028" }}>
        <div className="h-28 w-28 overflow-hidden rounded-full border-4" style={{ borderColor: "#3f6f5a", backgroundImage: "url(https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
        <h3 className="mt-4 text-3xl font-bold" style={{ fontFamily: '"Assistant"' }}>Homara</h3>
        <p className="mt-1 text-[10px] tracking-[0.2em]" style={{ color: "#3f6f5a" }}>בתים למשפחה</p>
      </div>
    </div>
  );
}
