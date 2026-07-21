import React from "react";
export default function DriftwoodThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] p-4" style={{ background: "#f0e8dc", color: "#3c2e22" }}>
        <div className="absolute right-4 top-4 h-16 w-16 rounded-[40%_60%_55%_45%]" style={{ background: "#8b5e3c33" }} />
        <p className="text-[10px]" style={{ color: "#8b5e3c" }}>מסעדת חוף</p>
        <h3 className="mt-2 text-3xl font-bold" style={{ fontFamily: '"Libre Baskerville"' }}>Driftwood</h3>
        <div className="absolute bottom-0 inset-x-0 flex gap-1 p-3">
          <div className="h-10 flex-1" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
          <div className="h-10 flex-1" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
        </div>
      </div>
    </div>
  );
}
