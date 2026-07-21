import React from "react";
import NestoraPages from "./pages";
export default function NestoraPreview() {
  return (
    <div dir="rtl" data-template-id="nestora-preview" className="min-h-screen w-full" style={{ background: "#f3f5f8", color: "#1e2836" }}>
      <NestoraPages initialPage="home" mode="preview" />
    </div>
  );
}
