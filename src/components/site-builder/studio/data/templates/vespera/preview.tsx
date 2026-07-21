import React from "react";
import VesperaPages from "./pages";

export default function VesperaPreview() {
  return (
    <div dir="rtl" data-template-id="vespera-preview" className="min-h-screen w-full" style={{ background: "#1a0f14", color: "#f4ebe4" }}>
      <VesperaPages initialPage="home" mode="preview" />
    </div>
  );
}
