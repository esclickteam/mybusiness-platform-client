import React from "react";

export default function KeyoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden" style={{ background: "#f5f8fc", color: "#0f1b2d" }}>
      <div className="absolute -left-6 top-0 text-[11rem] font-black leading-none opacity-[0.06]" style={{ color: "#0b5fff", fontFamily: '"Rubik"' }}>K</div>
      <div className="relative flex h-full min-h-[260px] flex-col justify-between p-5">
        <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: "rgba(15,27,45,0.12)" }}>
          <b style={{ color: "#0b5fff", fontFamily: '"Rubik"' }}>Keyora</b>
          <span className="h-0.5 w-12" style={{ background: "#0b5fff" }} />
        </div>
        <div>
          <p className="text-[9px] font-bold tracking-[0.24em]" style={{ color: "#0b5fff" }}>חיפוש · תקציב · חדרים</p>
          <h3 className="mt-2 text-4xl font-black leading-none" style={{ fontFamily: '"Rubik"' }}>מצאו נכס. בלי רעש.</h3>
          <div className="mt-4 grid grid-cols-[1fr_1fr_1fr_auto] border bg-white text-[9px]" style={{ borderColor: "rgba(15,27,45,0.14)" }}>
            <span className="border-l p-2" style={{ borderColor: "rgba(15,27,45,0.12)" }}>עיר</span>
            <span className="border-l p-2" style={{ borderColor: "rgba(15,27,45,0.12)" }}>תקציב</span>
            <span className="border-l p-2" style={{ borderColor: "rgba(15,27,45,0.12)" }}>חדרים</span>
            <span className="p-2 text-white" style={{ background: "#0b5fff" }}>חפש</span>
          </div>
        </div>
        <div className="grid grid-cols-3 border-y text-center text-[10px]" style={{ borderColor: "rgba(15,27,45,0.12)" }}>
          {["240+", "48ש׳", "96%"].map((x) => <b key={x} className="py-2" style={{ color: "#0b5fff" }}>{x}</b>)}
        </div>
      </div>
    </div>
  );
}
