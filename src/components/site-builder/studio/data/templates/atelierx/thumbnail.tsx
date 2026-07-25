import React from "react";

export default function AtelierxThumbnail() {
  const images = [
    "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=75",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=75",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=75",
  ];

  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#FAFAFA", color: "#111111" }}>
      <img src={images[0]} alt="" className="absolute inset-0 h-full w-full object-cover grayscale" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-white/10" />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-between p-5 text-white">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-[0.28em]">בוטיק אופנה</span>
          <span className="h-px w-12" style={{ background: "#E11D48" }} />
        </div>
        <div>
          <h3 className="text-5xl font-black leading-[0.82] tracking-[-0.08em]" style={{ fontFamily: "\"Playfair Display\", serif" }}>Atelier X</h3>
          <div className="mt-4 h-1 w-28" style={{ background: "#E11D48" }} />
          <div className="mt-5 flex gap-2">
            {images.slice(1).map((image) => (
              <img key={image} src={image} alt="" className="h-16 w-16 object-cover grayscale" />
            ))}
          </div>
        </div>
        <div className="text-[10px] font-black uppercase tracking-[0.24em]" style={{ color: "#E11D48" }}>new arrivals</div>
      </div>
    </div>
  );
}
