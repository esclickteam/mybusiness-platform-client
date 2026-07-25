import React from "react";
export default function DentelleThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden p-5"
      style={{
        background: "#F8FAFC",
        color: "#0F172A",
        fontFamily: "Fraunces, Manrope, serif",
      }}
    >
      <div className="absolute left-4 top-4 h-28 w-28" style={{ background: "rgba(45,212,191,.16)" }} />
      <div className="relative z-10 grid h-full min-h-[220px] grid-cols-[.88fr_1.12fr] gap-4">
        <div className="flex flex-col justify-between">
          <div>
            <span className="inline-grid h-9 w-9 place-items-center text-sm font-black text-white" style={{ background: "#2DD4BF" }}>
              D
            </span>
            <p className="mt-4 text-[10px] font-black uppercase tracking-[0.24em]" style={{ color: "#2DD4BF" }}>
              רפואת שיניים
            </p>
          </div>
          <div>
            <h3 className="text-5xl font-semibold leading-[0.82] tracking-[-0.1em]">Dentelle</h3>
            <span className="mt-4 block h-2 w-24" style={{ background: "#2DD4BF" }} />
          </div>
        </div>
        <div className="overflow-hidden border bg-white p-2" style={{ borderColor: "rgba(45,212,191,.35)" }}>
          <div
            className="h-full min-h-[204px] w-full"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(248,250,252,.08), rgba(248,250,252,.42)), url('https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=900&q=80')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
}
