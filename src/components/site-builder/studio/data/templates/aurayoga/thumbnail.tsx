import React from "react";
export default function AurayogaThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden p-5" style={{ background: "#1C1526", color: "#F5F0FF" }}>
      <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at 20% 20%, #A78BFA55, transparent 34%), linear-gradient(145deg, #1C1526, #120E18)" }} />
      <div className="absolute left-4 top-7 h-28 w-16 border border-[#A78BFA88]" />
      <div className="absolute bottom-5 right-5 h-24 w-24 border border-white/20 bg-white/5" />
      <div className="absolute bottom-10 left-8 h-20 w-20 bg-[#A78BFA] opacity-80" />
      <div className="relative">
        <div className="text-xs uppercase tracking-[0.28em]" style={{ color: "#A78BFA" }}>סטודיו יוגה</div>
        <h3 className="mt-10 text-5xl font-semibold leading-none" style={{ fontFamily: "serif", letterSpacing: "-0.06em" }}>AuraYoga</h3>
        <p className="mt-4 max-w-[170px] text-sm leading-5 text-white/70">תבנית רגועה עם קלפים מרובעים ותנועה רכה</p>
      </div>
    </div>
  );
}
