import React from "react";
import LoteraPages from "./pages";
export default function LoteraPreview() {
  return (
    <div dir="rtl" data-template-id="lotera-preview" className="min-h-screen w-full" style={{ background: "#0c1520", color: "#eef4f8" }}>
      <LoteraPages initialPage="home" mode="preview" />
    </div>
  );
}
