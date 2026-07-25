import React from "react";
export default function BrunchhausThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative flex h-full min-h-[260px] flex-col justify-end p-4" style={{ background: "#fff8f0" }}>
        <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full opacity-50" style={{ background: `conic-gradient(from 0deg, transparent, #f4a26155, transparent)` }} />
        <p className="relative text-[10px]" style={{ color: "#f4a261" }}>בראנץ׳ · קפה</p>
        <h3 className="relative text-3xl font-bold" style={{ fontFamily: '"Fraunces", "Heebo"', color: "#3a2a1e" }}>Brunchhaus</h3>
        <div className="relative mt-3 flex gap-2">
          <div className="h-12 w-10 -rotate-6 bg-white p-0.5 shadow"><div className="h-full w-full" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} /></div>
          <div className="h-12 w-10 rotate-3 bg-white p-0.5 shadow"><div className="h-full w-full" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=1400&q=85)", backgroundSize: "cover" }} /></div>
        </div>
      </div>
    </div>
  );
}
