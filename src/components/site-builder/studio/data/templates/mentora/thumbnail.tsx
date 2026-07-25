import React from "react";

export default function MentoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#0F172A", color: "#F8FAFC" }}>
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(circle at 18% 20%, #F59E0B66, transparent 45%)" }} />
      <div className="relative z-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "#F59E0B" }}>מנטורשיפ אישי</p>
        <h3 className="mt-3 text-3xl font-bold leading-none" style={{ fontFamily: "\"Fraunces\"" }}>Mentora</h3>
        <p className="mt-3 max-w-[220px] text-xs leading-5 opacity-80">מנטורשיפ אחד־על־אחד לקריירה, עסק וצמיחה אישית — עם מפת דרכים ברורה.…</p>
        <div className="mt-8 flex gap-2">
          {["2.4k", "4.9", "120"].map((n) => (
            <div key={n} className="border px-3 py-2 text-xs font-bold" style={{ borderColor: "#F59E0B55", color: "#F59E0B" }}>{n}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
