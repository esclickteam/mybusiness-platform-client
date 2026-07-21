import React from "react";
export default function RivaraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="flex h-full min-h-[260px] flex-col" style={{ background: "#e8f3f2", color: "#12343a" }}>
        <div className="p-4"><h3 className="text-3xl font-bold" style={{ fontFamily: '"Frank Ruhl Libre"' }}>Rivara</h3><p className="text-[10px]" style={{ color: "#1f7a78" }}>בתים ליד המים</p></div>
        <div className="flex-1" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <div className="h-10" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover", opacity: .85 }} />
        <div className="h-8" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover", opacity: .7 }} />
      </div>
    </div>
  );
}
