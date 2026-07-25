import React from "react";
export default function ArchoraThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden p-5"
      style={{
        background: "#111111",
        color: "#F5F5F0",
        fontFamily: "Syne, Space Grotesk, sans-serif",
      }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(17,17,17,.18), #111111 86%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10 flex h-full min-h-[220px] flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="border px-2 py-1 text-[10px] font-black" style={{ borderColor: "#D4FF00", color: "#D4FF00" }}>
            AR
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: "#D4FF00" }}>
            אדריכלות
          </span>
        </div>
        <div>
          <div className="mb-3 h-16 w-3 rotate-12" style={{ background: "#D4FF00" }} />
          <h3 className="text-5xl font-black leading-[0.8] tracking-[-0.12em]">ARCHORA</h3>
          <div className="mt-5 grid grid-cols-[1.35fr_.65fr] gap-2">
            <span className="h-16 border" style={{ borderColor: "rgba(212,255,0,.7)", background: "rgba(212,255,0,.12)" }} />
            <span className="h-16" style={{ background: "#D4FF00" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
