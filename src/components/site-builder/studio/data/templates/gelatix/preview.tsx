import React from "react";
import GelatixPages from "./pages";
export default function GelatixPreview() {
  return (
    <div dir="rtl" data-template-id="gelatix-preview" className="min-h-screen w-full" style={{ background: "#fff5f8", color: "#2b1822" }}>
      <GelatixPages initialPage="home" mode="preview" />
    </div>
  );
}
