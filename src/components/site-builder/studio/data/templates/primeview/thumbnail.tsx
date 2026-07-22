import React from "react";
export default function PrimeviewThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative h-full min-h-[260px]"><div className="absolute inset-0 grid grid-cols-2"><div style={{ backgroundImage:"url(https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1400&q=85)", backgroundSize:"cover" }} /><div style={{ backgroundImage:"url(https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=2000&q=85)", backgroundSize:"cover" }} /></div><div className="absolute inset-y-0 left-1/2 w-0.5" style={{ background:"#059669" }} /><div className="absolute bottom-4 right-4"><h3 className="text-2xl font-bold" style={{ fontFamily:'"Libre Baskerville"', color:"#fff" }}>Primeview</h3></div></div>
    </div>
  );
}
