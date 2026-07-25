import React from "react";
import WaxellePages from "./pages";

export default function WaxellePreview() {
  return (
    <div dir="rtl" data-template-id="waxelle-preview" className="min-h-screen w-full" style={{ background: "#FFFBF5", overflowX: "hidden" }}>
      <WaxellePages initialPage="home" mode="preview" />
    </div>
  );
}
