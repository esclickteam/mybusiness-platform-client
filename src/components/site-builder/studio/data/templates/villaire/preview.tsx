import React from "react";
import VillairePages from "./pages";
export default function VillairePreview() {
  return (
    <div dir="rtl" data-template-id="villaire-preview" className="min-h-screen w-full" style={{ background: "#0a0a0a", color: "#f4efe6" }}>
      <VillairePages initialPage="home" mode="preview" />
    </div>
  );
}
