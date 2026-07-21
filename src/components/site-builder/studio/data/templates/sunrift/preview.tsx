import React from "react";
import SunriftPages from "./pages";
export default function SunriftPreview() {
  return (
    <div dir="rtl" data-template-id="sunrift-preview" className="min-h-screen w-full" style={{ background: "#1a0f0a", color: "#fff4e8" }}>
      <SunriftPages initialPage="home" mode="preview" />
    </div>
  );
}
