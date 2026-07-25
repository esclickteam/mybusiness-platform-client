import React from "react";

export default function FormaraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#1E1C1A", color: "#F3EEE7" }}>
      <img
        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: 0.58 }}
      />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #1E1C1A 5%, rgba(30,28,26,.42) 62%, rgba(30,28,26,.2))" }} />
      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between border-b border-white/15 pb-3">
          <span className="text-[10px] font-bold tracking-[0.22em]" style={{ color: "#C4A484" }}>עיצוב פנים</span>
          <div className="grid h-8 w-8 place-items-center border text-xs font-bold" style={{ borderColor: "#8B5E3C", color: "#8B5E3C" }}>F</div>
        </div>
        <div className="border-t-4 p-4" style={{ borderColor: "#8B5E3C", background: "rgba(30,28,26,.88)" }}>
          <h3 className="text-5xl leading-[0.82]" style={{ fontFamily: "\"Instrument Serif\", serif", letterSpacing: "-0.05em" }}>Formara</h3>
          <p className="mt-2 max-w-[210px] text-xs leading-5" style={{ color: "#B6AAA0" }}>חללים שקטים, חומרים עם עומק.</p>
          <div className="mt-4 grid grid-cols-6 gap-1">
            {["#8B5E3C", "#C3A07B", "#3B332C", "#E2D3C4", "#5B503F", "#F1E9DE"].map((color) => (
              <span key={color} className="aspect-square border border-white/10" style={{ background: color }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
