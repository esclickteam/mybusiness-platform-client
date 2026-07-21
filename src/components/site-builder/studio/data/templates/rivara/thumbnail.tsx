import React from "react";

export default function RivaraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="flex h-full min-h-[260px] flex-col" style={{ background: "#e8f3f2", color: "#12343a" }}>
        <div className="flex items-center justify-between border-b p-4" style={{ borderColor: "rgba(31,122,120,0.18)" }}>
          <div>
            <h3 className="text-3xl font-bold leading-none" style={{ fontFamily: '"Frank Ruhl Libre", serif' }}>Rivara</h3>
            <p className="mt-1 text-[10px] tracking-[0.24em]" style={{ color: "#1f7a78" }}>מים · אור · שקט</p>
          </div>
          <div className="h-7 w-11 border-y-2" style={{ borderColor: "#1f7a78" }} />
        </div>
        {[
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
          "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=900&q=80",
        ].map((image, index) => (
          <div key={image} className="relative flex-1 overflow-hidden border-b last:border-b-0" style={{ borderColor: "rgba(31,122,120,0.16)", backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="absolute inset-0" style={{ background: index === 1 ? "#e8f3f266" : "#1f7a7820" }} />
            <span className="absolute bottom-2 right-3 text-lg font-bold" style={{ fontFamily: '"Frank Ruhl Libre", serif' }}>{["מים", "אור", "שקט"][index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
