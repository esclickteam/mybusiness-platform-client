import React from "react";
export default function NoodlixThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="relative flex h-full min-h-[260px] flex-col items-center justify-center" style={{ background: "radial-gradient(circle at 50% 60%, #18201c, #0f1412)" }}>
        <div className="h-16 w-16 rounded-full border-2" style={{ borderColor: "#3dd6c6", backgroundImage: "url(https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
        <p className="mt-4 text-[10px]" style={{ color: "#3dd6c6" }}>ראמן · אסיה</p>
        <h3 className="text-3xl font-bold" style={{ fontFamily: '"Sora", "Heebo"', color: "#eef6f1" }}>Noodlix</h3>
      </div>
    </div>
  );
}
