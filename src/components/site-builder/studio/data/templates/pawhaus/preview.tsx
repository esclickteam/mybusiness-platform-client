import React from "react";
import PawhausPages from "./pages";
export default function PawhausPreview() {
  return (
    <div dir="rtl" data-template-id="pawhaus-preview" className="min-h-screen w-full" style={{ background: "#FAF7F2", overflowX: "hidden" }}>
      <PawhausPages initialPage="home" mode="preview" />
    </div>
  );
}
