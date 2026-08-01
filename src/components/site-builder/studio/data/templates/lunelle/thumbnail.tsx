import React from "react";

export default function LunelleThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden p-5"
      style={{ background: "#FFF7F1", color: "#2A171C" }}
    >
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(circle at 18% 12%, #E8B8C188, transparent 40%), radial-gradient(circle at 88% 78%, #D6A24A33, transparent 36%), linear-gradient(160deg, #FFFFFF, transparent 62%)",
        }}
      />
      <div className="relative z-10">
        <p
          className="text-[10px] font-bold uppercase tracking-[0.22em]"
          style={{ color: "#8A4F5F" }}
        >
          סטודיו בוטיק לציפורניים
        </p>
        <h3
          className="mt-3 text-3xl font-bold leading-none"
          style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
        >
          Lunelle
        </h3>
        <p className="mt-3 max-w-[230px] text-xs leading-5 opacity-80">
          מניקור, לק ג׳ל ויומן תורים — עיצוב רך עם חנות, גלריה וטופס לידים ל־CRM.
        </p>
        <div className="mt-8 h-1.5 w-24" style={{ background: "#8A4F5F" }} />
      </div>
    </div>
  );
}
