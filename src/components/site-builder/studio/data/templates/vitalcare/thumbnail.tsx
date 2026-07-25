import React from "react";

export default function VitalcareThumbnail() {
  return (
    <div
      dir="rtl"
      className="relative h-full min-h-[260px] w-full overflow-hidden rounded-3xl"
      style={{
        background: "linear-gradient(135deg, #F5F7F8 0%, #FFFFFF 48%, #DDEAE9 100%)",
        color: "#163033",
      }}
    >
      <div
        className="absolute left-0 top-0 h-full w-[42%]"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,31,34,0.08), rgba(10,31,34,0.22)), url('https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&w=700&q=80') center/cover",
        }}
      />
      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="grid h-9 w-9 place-items-center rounded-xl text-[10px] font-bold tracking-[0.18em] text-white"
              style={{ background: "#0D5C63" }}
            >
              VC
            </div>
            <span className="text-base font-semibold" style={{ fontFamily: "Georgia, serif", color: "#0A3D42" }}>
              Vitalcare
            </span>
          </div>
          <span className="h-px w-14" style={{ background: "#B8D8D4" }} />
        </div>
        <div className="mt-9 max-w-[190px]">
          <p
            className="mb-3 text-[9px] font-semibold uppercase tracking-[0.26em]"
            style={{ color: "#0D5C63" }}
          >
            מרפאה פרטית
          </p>
          <h3 className="text-2xl font-semibold leading-tight" style={{ fontFamily: "Georgia, serif", color: "#163033" }}>
            רפואה רגועה, מדויקת ואנושית.
          </h3>
          <div className="mt-5 grid max-w-[170px] grid-cols-3 gap-2">
            {["התמחויות", "רופאים", "ביטוחים"].map((label) => (
              <div key={label} className="rounded-lg bg-white/80 px-2 py-2 text-center text-[8px] font-semibold" style={{ color: "#5F6F72" }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-5 right-5 left-5 flex items-center justify-between">
        <span className="h-px flex-1" style={{ background: "rgba(13,92,99,0.16)" }} />
        <div className="flex items-center gap-2">
          <span className="mr-3 h-2 w-2 rounded-full" style={{ background: "#B8D8D4" }} />
          <span className="h-2 w-2 rounded-full" style={{ background: "#0D5C63" }} />
        </div>
      </div>
    </div>
  );
}
