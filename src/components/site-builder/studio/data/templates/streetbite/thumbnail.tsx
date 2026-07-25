import React from "react";
export default function StreetbiteThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden p-4" style={{ background: "#0d1117" }}>
        <div className="absolute top-8 -right-4 rotate-[-8deg] border-2 px-3 py-1 text-xs font-black" style={{ borderColor: "#39d353", background: "#161b22", color: "#e6edf3" }}>TRUCK</div>
        <p className="mt-16 text-[10px]" style={{ color: "#8b949e" }}>אוכל רחוב · פודטראק</p>
        <h3 className="text-3xl font-black" style={{ fontFamily: '"Rubik", "Heebo"', color: "#39d353", textShadow: "0 0 10px #39d353" }}>Streetbite</h3>
        <div className="mt-4 h-10 w-full" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
      </div>
    </div>
  );
}
