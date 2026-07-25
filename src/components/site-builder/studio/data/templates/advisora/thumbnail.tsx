import React from "react";

export default function AdvisoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#0B1F3A", color: "#F4F1E8" }}>
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80" alt="" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(7,20,40,.96), rgba(11,31,58,.78), rgba(11,31,58,.2))" }} />
      </div>
      <div className="absolute left-5 top-5 bottom-12 w-[52%] border p-4" style={{ borderColor: "#C9A22766", background: "rgba(7,20,40,.72)" }}>
        <div className="h-1 w-12" style={{ background: "#C9A227" }} />
        <p className="mt-5 text-[34px] font-bold leading-none" style={{ color: "#C9A227", fontFamily: "\"Fraunces\", serif" }}>Advisora</p>
        <h3 className="mt-3 whitespace-pre-line text-xl font-bold leading-tight" style={{ fontFamily: "\"Fraunces\", serif" }}>החלטות חדות.{"\n"}צמיחה יציבה.</h3>
      </div>
      <div className="absolute inset-x-0 bottom-0 grid grid-cols-3 text-center text-[11px] font-bold" style={{ background: "#C9A227", color: "#071428" }}>
        {["87%", "40+", "12"].map((item) => (
          <div key={item} className="border-l py-3 last:border-l-0" style={{ borderColor: "rgba(7,20,40,.25)" }}>{item}</div>
        ))}
      </div>
    </div>
  );
}
