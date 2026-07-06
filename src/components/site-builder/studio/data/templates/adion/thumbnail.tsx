import React from "react";

export default function AdionThumbnail() {
  const images = [
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=700&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
  ];

  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-[1.4rem] bg-[#10100e] text-[#f6efe3]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(247,200,115,.14),transparent_34%),radial-gradient(circle_at_85%_80%,rgba(255,255,255,.12),transparent_36%)]" />

      <div className="absolute left-1/2 top-[-8%] -translate-x-1/2 select-none bg-gradient-to-b from-white via-white/55 to-white/0 bg-clip-text text-[7rem] font-black uppercase leading-none tracking-[-.16em] text-transparent opacity-90">
        ADION
      </div>

      <div className="absolute left-0 right-0 top-[34%] z-10 text-center">
        <p className="text-[11px] font-medium text-white/60">
          הפקת וידאו וצילום למותגים מודרניים
        </p>
      </div>

      <div className="absolute inset-x-[-12%] bottom-[-6%] top-[42%]">
        {images.map((src, index) => {
          const positions = [
            "right-[2%] top-[0%] h-[44%] w-[33%] rotate-[5deg]",
            "right-[34%] top-[-2%] h-[44%] w-[33%] rotate-[-1deg]",
            "right-[66%] top-[1%] h-[44%] w-[33%] rotate-[-5deg]",
            "right-[8%] top-[48%] h-[42%] w-[34%] rotate-[-4deg]",
            "right-[41%] top-[46%] h-[42%] w-[34%] rotate-[2deg]",
            "right-[73%] top-[48%] h-[42%] w-[34%] rotate-[5deg]",
          ];

          return (
            <div
              key={src}
              className={`absolute overflow-hidden rounded-xl border-[2px] border-[#252520] bg-[#151512] shadow-2xl shadow-black/50 ${positions[index]}`}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover grayscale"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10" />
            </div>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#10100e] via-[#10100e]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#10100e] via-[#10100e]/60 to-transparent" />

      <div className="absolute bottom-5 right-5 z-20">
        <div className="rounded-full bg-[#f6efe3] px-4 py-2 text-[10px] font-black tracking-[.18em] text-[#10100e]">
          תיק עבודות
        </div>
      </div>

      <div className="absolute bottom-5 left-5 z-20 flex gap-2">
        <span className="h-8 w-8 rounded-full border border-white/15 bg-white/10" />
        <span className="h-8 w-8 rounded-full border border-white/15 bg-white/10" />
      </div>
    </div>
  );
}