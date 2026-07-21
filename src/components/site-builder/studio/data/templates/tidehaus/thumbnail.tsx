import React from "react";
export default function TidehausThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] p-4" style={{ background: "#eef6fb", color: "#0c2a3a" }}>
        <div className="absolute inset-x-4 top-1/2 h-0.5 opacity-60" style={{ background: "repeating-linear-gradient(90deg, #0077b6, #0077b6 8px, transparent 8px, transparent 16px)" }} />
        <p className="text-[10px]" style={{ color: "#0077b6" }}>Surf · גלים</p>
        <h3 className="mt-2 text-4xl font-black" style={{ fontFamily: '"Archivo Black", "Heebo"' }}>Tidehaus</h3>
        <div className="absolute bottom-4 inset-x-4 flex gap-2">
          <div className="h-12 flex-1 rounded" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1531722561916-eece3f6e08b5?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
          <div className="h-12 flex-1 rounded" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
        </div>
      </div>
    </div>
  );
}
