import React from "react";
import VaulturePages from "./pages";
export default function VaulturePreview() {
  return (
    <div dir="rtl" data-template-id="vaulture-preview" className="min-h-screen w-full" style={{ background: "#0c0a08", color: "#f5f0e8" }}>
      <VaulturePages initialPage="home" mode="preview" />
    </div>
  );
}
