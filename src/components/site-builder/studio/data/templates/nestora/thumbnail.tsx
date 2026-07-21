import React from "react";
export default function NestoraThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="flex h-full min-h-[260px] flex-col justify-between p-5" style={{ background: "#eef1f5", color: "#1e2836" }}>
        <div>
          <p className="text-4xl font-bold leading-none" style={{ fontFamily: '"Cormorant Garamond"', color: "#3d5a80" }}>“</p>
          <h3 className="mt-1 text-2xl font-bold leading-snug" style={{ fontFamily: '"Cormorant Garamond"' }}>פחות נכסים. יותר התאמה.</h3>
        </div>
        <div className="h-16 w-full" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover", backgroundPosition: "center" }} />
      </div>
    </div>
  );
}
