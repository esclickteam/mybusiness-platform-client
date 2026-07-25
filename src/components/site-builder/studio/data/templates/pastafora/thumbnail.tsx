import React from "react";
export default function PastaforaThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#faf7f2" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #faf7f2)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#b91c1c" }}>פסטה · איטלקי</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Playfair Display", "Heebo"', color: "#2c1810" }}>Pastafora</h3>
        </div>
      </div>
    </div>
  );
}
