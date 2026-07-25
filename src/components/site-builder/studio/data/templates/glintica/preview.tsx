import React from "react";
import GlinticaPages from "./pages";

export default function GlinticaPreview() {
  return (
    <div dir="rtl" data-template-id="glintica-preview" className="min-h-screen w-full" style={{ background: "#1F1A1C", overflowX: "hidden" }}>
      <GlinticaPages initialPage="home" mode="preview" />
    </div>
  );
}
