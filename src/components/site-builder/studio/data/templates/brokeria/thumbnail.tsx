import React from "react";
export default function BrokeriaThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="absolute inset-0"><div className="absolute inset-0" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=85)", backgroundSize:"cover" }} /><div className="absolute inset-x-0 bottom-0 h-8 overflow-hidden border-t" style={{ borderColor:"#c9a962" }} /><div className="absolute bottom-10 right-4"><p className="text-[10px]" style={{ color:"#c9a962" }}>נדל״ן פרימיום · תל אביב</p><h3 className="text-3xl font-bold" style={{ fontFamily:'"Playfair Display"', color:"#f0f4fa" }}>Brokeria</h3></div></div>
    </div>
  );
}
