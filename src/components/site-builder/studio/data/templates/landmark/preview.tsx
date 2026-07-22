import React from "react";
import LandmarkPages from "./pages";
export default function LandmarkPreview() {
  return (
    <div dir="rtl" data-template-id="landmark-preview" className="min-h-screen w-full" style={{ background: "#f0f4f8", color: "#1e293b" }}>
      <LandmarkPages initialPage="home" mode="preview" />
    </div>
  );
}
