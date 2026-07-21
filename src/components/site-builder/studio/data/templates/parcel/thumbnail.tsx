import React from "react";
export default function ParcelThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#f3efe6", color: "#243018" }}>
      <div className="absolute inset-0 opacity-45" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #f3efe6 18%, transparent 72%)" }} />
      <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-5">
        <p className="text-[10px] font-semibold tracking-[0.2em]" style={{ color: "#6b5a2e" }}>קרקעות ומגרשים</p>
        <h3 className="mt-2 text-3xl font-bold leading-none" style={{ fontFamily: '"Assistant", serif' }}>Parcel</h3>
        <p className="mt-2 max-w-[230px] text-xs leading-5 opacity-85">פארסל מתמחה בקרקעות לבנייה, מגרשים פרטיים ועסקאות קו…</p>
      </div>
    </div>
  );
}
