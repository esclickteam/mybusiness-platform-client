import React from "react";
export default function SeabloomThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }}>
        <div className="absolute inset-0" style={{ background: "#f5faf599" }} />
        <div className="absolute top-2 left-[15%] h-2 w-2 rounded-full" style={{ background: "#2d8a6e" }} />
        <div className="absolute top-4 left-[40%] h-2 w-2 rounded-full" style={{ background: "#2d8a6e" }} />
        <div className="absolute top-3 left-[70%] h-2 w-2 rounded-full" style={{ background: "#2d8a6e" }} />
        <div className="absolute bottom-4 right-4 left-4">
          <p className="text-[10px]" style={{ color: "#2d8a6e" }}>Spa · טרופי</p>
          <h3 className="text-3xl font-bold" style={{ fontFamily: '"DM Serif Display", "Heebo"', color: "#1a3d2e" }}>Seabloom</h3>
        </div>
      </div>
    </div>
  );
}
