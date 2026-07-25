import React from "react";
export default function TapasoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] p-4" style={{ background: "#12081a" }}>
        <p className="text-[10px]" style={{ color: "#b89bc4" }}>טאפס · בר לילה</p>
        <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Oswald", "Heebo"', color: "#ff2d95", textShadow: `0 0 12px #ff2d95` }}>Tapasora</h3>
        <div className="mt-6 flex gap-2">
          <div className="h-14 w-14 rounded-full border-2" style={{ borderColor: "#ff2d95", backgroundImage: "url(https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
          <div className="h-14 w-14 rounded-full border-2" style={{ borderColor: "#ff2d95", backgroundImage: "url(https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
          <div className="h-14 w-14 rounded-full border-2" style={{ borderColor: "#ff2d95", backgroundImage: "url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} />
        </div>
      </div>
    </div>
  );
}
