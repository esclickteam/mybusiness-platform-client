import React from "react";

export default function SavoryThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-[28px]"
      style={{
        background: "#12100E",
        color: "#F5F0E8",
        fontFamily: "Manrope, system-ui, sans-serif",
      }}
    >
      <img
        src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80"
        alt=""
        className="absolute bottom-0 left-0 h-[72%] w-[58%] object-cover"
      />
      <div className="absolute inset-y-0 right-0 w-[52%] border-l border-white/10 bg-[#12100E] p-5">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center border text-[11px] font-extrabold tracking-[0.18em]" style={{ borderColor: "#E8A317", color: "#E8A317" }}>
            S
          </div>
          <span
            className="text-base font-bold leading-none"
            style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#F5F0E8" }}
          >
            Savory
          </span>
        </div>
        <div className="mt-8">
          <p className="text-[9px] font-extrabold tracking-[0.2em]" style={{ color: "#E8A317" }}>
            מסעדת שף
          </p>
          <h3
            className="mt-3 text-[25px] font-bold leading-[0.95]"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            מטבח עונתי וטעם שנשאר
          </h3>
          <div className="mt-5 h-px w-16" style={{ background: "#E8A317" }} />
          <div className="mt-5 space-y-2">
            {["טרטר דג ים", "ניוקי מרווה", "בר ים על גחלים"].map((item, index) => (
              <div key={item} className="flex items-center justify-between gap-3 border-b border-white/10 pb-2">
                <span className="truncate text-[10px]" style={{ color: "#A39E94" }}>
                  {item}
                </span>
                <span className="text-[12px] font-bold" style={{ color: "#F0C75E" }}>
                  ₪{[68, 82, 126][index]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 border border-[#E8A317]/70 bg-[#0A0908] px-4 py-3">
        <p className="text-[10px] font-bold" style={{ color: "#E8A317" }}>
          הזמנת שולחן
        </p>
      </div>
    </div>
  );
}
