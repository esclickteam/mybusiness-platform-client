import React from "react";
import HorizonixPages from "./pages";
export default function HorizonixPreview() {
  return (
    <div dir="rtl" data-template-id="horizonix-preview" className="min-h-screen w-full" style={{ background: "#0d1117", color: "#f0f6fc" }}>
      <HorizonixPages initialPage="home" mode="preview" />
    </div>
  );
}
