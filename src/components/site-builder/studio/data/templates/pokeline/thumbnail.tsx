import React from "react";
export default function PokelineThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0" style={{ background: "#071a1f" }}>
        <div className="absolute inset-0 opacity-60" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent, #071a1f)" }} />
        <div className="absolute bottom-8 right-4 left-4">
          <p className="text-[10px] tracking-[0.2em]" style={{ color: "#2dd4bf" }}>פוקה · קערות</p>
          <h3 className="mt-1 text-3xl font-bold" style={{ fontFamily: '"Sora", "Heebo"', color: "#e8f7f6" }}>Pokeline</h3>
        </div>
      </div>
    </div>
  );
}
