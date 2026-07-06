import React from "react";

export default function AdionThumbnail() {
  return (
    <div className="relative h-full min-h-[280px] w-full overflow-hidden rounded-[1.6rem] bg-[#fff8f0] p-4 text-[#301b12]">
      <style>
        {`
          @keyframes adionThumbFloatA {
            0%, 100% { transform: translateY(0) rotate(-10deg); }
            50% { transform: translateY(-8px) rotate(-7deg); }
          }

          @keyframes adionThumbFloatB {
            0%, 100% { transform: translateY(0) rotate(8deg); }
            50% { transform: translateY(7px) rotate(11deg); }
          }

          @keyframes adionThumbFloatC {
            0%, 100% { transform: translateX(0) rotate(-4deg); }
            50% { transform: translateX(7px) rotate(-1deg); }
          }

          @keyframes adionThumbMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          @keyframes adionThumbSpin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>

      <div className="pointer-events-none absolute left-[-35px] top-[-20px] h-32 w-32 rounded-full bg-[#ffc6d8] blur-2xl" />
      <div className="pointer-events-none absolute bottom-[-28px] right-[-30px] h-36 w-36 rounded-full bg-[#c9b5ff] blur-2xl" />
      <div className="pointer-events-none absolute bottom-16 left-[42%] h-24 w-24 rounded-full bg-[#ffe3a8] blur-2xl" />

      <div
        className="pointer-events-none absolute right-5 top-16 h-20 w-20 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(48,27,18,.65) 1.3px, transparent 1.3px)",
          backgroundSize: "13px 13px",
        }}
      />

      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#301b12] text-lg font-black text-white shadow-[0_10px_25px_rgba(48,27,18,0.28)]">
            <span className="absolute inset-1 animate-[adionThumbSpin_10s_linear_infinite] rounded-full border border-dashed border-white/35" />
            <span className="relative z-10">v</span>
          </span>

          <span className="text-xl font-black tracking-[-0.08em]">
            virello
          </span>
        </div>

        <div className="hidden gap-1 text-[10px] font-black opacity-60 sm:flex">
          <span>(01)</span>
          <span>(02)</span>
          <span>(03)</span>
        </div>
      </div>

      <div className="relative z-10 mt-6">
        <div className="mb-2 flex flex-wrap gap-1.5">
          <p className="inline-flex rounded-full bg-[#ffe3a8] px-3 py-1 text-[10px] font-black">
            Branding
          </p>

          <p className="inline-flex rounded-full bg-[#eadcff] px-3 py-1 text-[10px] font-black">
            Motion
          </p>
        </div>

        <h3 className="text-[56px] font-black leading-[0.68] tracking-[-0.14em] sm:text-[64px]">
          virello
        </h3>

        <p className="mt-3 max-w-[210px] text-xs font-black leading-5 text-[#301b12]/60">
          Bold creative studio with floating cards, motion strips and premium
          layout.
        </p>
      </div>

      <div className="absolute bottom-5 left-4 z-10 flex items-end gap-2">
        <div className="h-24 w-16 animate-[adionThumbFloatA_5.5s_ease-in-out_infinite] overflow-hidden rounded-2xl border-4 border-[#fff8f0] bg-[#f7b6ca] shadow-[0_16px_36px_rgba(48,27,18,0.18)]">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="h-28 w-20 animate-[adionThumbFloatB_6s_ease-in-out_infinite] overflow-hidden rounded-2xl border-4 border-[#fff8f0] bg-[#c9b5ff] shadow-[0_16px_36px_rgba(48,27,18,0.18)]">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="h-[72px] w-24 animate-[adionThumbFloatC_6.5s_ease-in-out_infinite] overflow-hidden rounded-2xl border-4 border-[#fff8f0] bg-[#ffe3a8] shadow-[0_16px_36px_rgba(48,27,18,0.18)]">
          <img
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=300&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="absolute bottom-7 right-5 z-20 grid h-16 w-16 place-items-center rounded-full bg-[#301b12] text-center text-[10px] font-black leading-tight text-white shadow-[0_16px_40px_rgba(48,27,18,0.28)]">
        1.2k+
        <br />
        works
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-0 overflow-hidden border-t border-[#301b12]/10 bg-white/45 py-2">
        <div className="flex w-max animate-[adionThumbMarquee_16s_linear_infinite] gap-5 text-[11px] font-black uppercase tracking-[-0.02em] text-[#301b12]/35">
          {[
            "UI/UX",
            "Web Design",
            "Branding",
            "Motion",
            "Development",
            "Marketing",
            "Virello",
            "UI/UX",
            "Web Design",
            "Branding",
            "Motion",
            "Development",
            "Marketing",
            "Virello",
          ].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}