import React from "react";

export default function NestoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px] overflow-hidden p-4" style={{ background: "#eef1f5", color: "#1e2836" }}>
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(61,90,128,0.16)" }}>
          <h3 className="text-3xl font-bold leading-none" style={{ fontFamily: '"Cormorant Garamond", serif' }}>Nestora</h3>
          <span className="text-[10px]" style={{ color: "#3d5a80" }}>בוטיק</span>
        </div>
        <blockquote className="mt-5 text-3xl font-bold leading-[1.02]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          “הבית שלא צריך לשכנע.”
        </blockquote>
        <div className="absolute inset-x-4 bottom-4 overflow-hidden border" style={{ borderColor: "rgba(61,90,128,0.16)" }}>
          <div className="aspect-[16/8]" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80)", backgroundSize: "cover", backgroundPosition: "center" }} />
          <div className="border-t px-3 py-2 text-[10px] font-bold tracking-[0.24em]" style={{ borderColor: "rgba(238,241,245,0.35)", background: "#121820dd", color: "#eef1f5" }}>FEATURED</div>
        </div>
      </div>
    </div>
  );
}
