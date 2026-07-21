import React from "react";
import SaltforgePages from "./pages";
export default function SaltforgePreview() {
  return (
    <div dir="rtl" data-template-id="saltforge-preview" className="min-h-screen w-full" style={{ background: "#e8e4df", color: "#2a2826" }}>
      <SaltforgePages initialPage="home" mode="preview" />
    </div>
  );
}
