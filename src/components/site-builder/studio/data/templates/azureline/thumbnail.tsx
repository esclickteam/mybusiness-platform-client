import React from "react";
export default function AzurelineThumbnail() {
  return (
    <div dir="rtl" className="relative h-full min-h-[260px] w-full overflow-hidden">
      <div className="flex h-full min-h-[260px] flex-col items-center justify-center p-5 text-center" style={{ background: "#f8fcff", color: "#0a2540" }}>
        <p className="text-[10px] tracking-[0.28em]" style={{ color: "#0066cc" }}>יאcht · שייט</p>
        <h3 className="mt-2 text-3xl font-bold" style={{ fontFamily: '"Manrope"' }}>Azureline</h3>
        <div className="relative mt-4 h-px w-full max-w-[180px]" style={{ background: "#0066cc" }} />
        <div className="mt-3 h-14 w-full max-w-[200px]" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=85)", backgroundSize: "cover" }} />
      </div>
    </div>
  );
}
