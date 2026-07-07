import React from "react";

export default function NovastraThumbnail() {
  return (
    <div className="relative h-full min-h-[260px] w-full overflow-hidden rounded-[1.75rem] bg-zinc-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.24),transparent_34%),linear-gradient(135deg,#09090b,#18181b_48%,#f5f0e8_49%,#ffffff)]" />

      <div className="absolute left-5 top-5 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-black text-zinc-950">
          N
        </div>
        <div className="text-2xl font-black uppercase tracking-[-0.08em]">NOVASTRA</div>
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <div className="mb-4 flex gap-2">
          <div className="h-24 flex-1 overflow-hidden rounded-2xl bg-white/15">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=70"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-24 flex-1 overflow-hidden rounded-2xl bg-white/15">
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=500&q=70"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="h-24 flex-1 overflow-hidden rounded-2xl bg-white/15">
            <img
              src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&q=70"
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        <p className="max-w-[300px] text-4xl font-black uppercase leading-[0.82] tracking-[-0.09em]">
          Fashion That Moves Like Midnight
        </p>
      </div>
    </div>
  );
}