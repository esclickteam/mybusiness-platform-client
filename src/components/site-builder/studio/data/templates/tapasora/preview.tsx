import React from "react";
import TapasoraPages from "./pages";
export default function TapasoraPreview() {
  return (
    <div dir="rtl" data-template-id="tapasora-preview" className="min-h-screen w-full" style={{ background: "#12081a", color: "#f8eef8" }}>
      <TapasoraPages initialPage="home" mode="preview" />
    </div>
  );
}
