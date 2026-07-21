import React from "react";
import SeabloomPages from "./pages";
export default function SeabloomPreview() {
  return (
    <div dir="rtl" data-template-id="seabloom-preview" className="min-h-screen w-full" style={{ background: "#f5faf5", color: "#1a3d2e" }}>
      <SeabloomPages initialPage="home" mode="preview" />
    </div>
  );
}
