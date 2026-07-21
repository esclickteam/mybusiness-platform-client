import React from "react";
import LoteraPages from "./pages";

export default function LoteraPreview() {
  return (
    <div dir="rtl" data-template-id="lotera-preview" className="min-h-screen w-full" style={{ background: "#07131f", color: "#eef5fb" }}>
      <LoteraPages initialPage="home" mode="preview" />
    </div>
  );
}
