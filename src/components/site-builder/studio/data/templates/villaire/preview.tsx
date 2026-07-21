import React from "react";
import VillairePages from "./pages";
export default function VillairePreview() {
  return (
    <div dir="rtl" data-template-id="villaire-preview" className="min-h-screen w-full" style={{ background: "#0b0b0b", color: "#f5f0e8" }}>
      <VillairePages initialPage="home" mode="preview" />
    </div>
  );
}
