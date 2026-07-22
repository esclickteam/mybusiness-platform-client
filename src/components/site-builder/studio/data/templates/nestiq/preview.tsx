import React from "react";
import NestiqPages from "./pages";
export default function NestiqPreview() {
  return (
    <div dir="rtl" data-template-id="nestiq-preview" className="min-h-screen w-full" style={{ background: "#faf5ff", color: "#1e1b4b" }}>
      <NestiqPages initialPage="home" mode="preview" />
    </div>
  );
}
