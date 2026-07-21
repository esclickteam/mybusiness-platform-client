import React from "react";
import DunewavePages from "./pages";
export default function DunewavePreview() {
  return (
    <div dir="rtl" data-template-id="dunewave-preview" className="min-h-screen w-full" style={{ background: "#f4ead8", color: "#3d2f1f" }}>
      <DunewavePages initialPage="home" mode="preview" />
    </div>
  );
}
