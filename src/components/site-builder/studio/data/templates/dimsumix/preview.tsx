import React from "react";
import DimsumixPages from "./pages";
export default function DimsumixPreview() {
  return (
    <div dir="rtl" data-template-id="dimsumix-preview" className="min-h-screen w-full" style={{ background: "#0f1412", color: "#f0f5f2" }}>
      <DimsumixPages initialPage="home" mode="preview" />
    </div>
  );
}
