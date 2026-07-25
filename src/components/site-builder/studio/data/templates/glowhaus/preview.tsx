import React from "react";
import GlowhausPages from "./pages";

export default function GlowhausPreview() {
  return (
    <div dir="rtl" data-template-id="glowhaus-preview" className="min-h-screen w-full" style={{ background: "#061018", overflowX: "hidden" }}>
      <GlowhausPages initialPage="home" mode="preview" />
    </div>
  );
}
