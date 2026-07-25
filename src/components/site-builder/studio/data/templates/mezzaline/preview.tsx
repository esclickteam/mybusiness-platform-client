import React from "react";
import MezzalinePages from "./pages";
export default function MezzalinePreview() {
  return (
    <div dir="rtl" data-template-id="mezzaline-preview" className="min-h-screen w-full" style={{ background: "#f7f1e6", color: "#2c2a22" }}>
      <MezzalinePages initialPage="home" mode="preview" />
    </div>
  );
}
