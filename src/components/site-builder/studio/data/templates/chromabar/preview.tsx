import React from "react";
import ChromabarPages from "./pages";

export default function ChromabarPreview() {
  return (
    <div dir="rtl" data-template-id="chromabar-preview" className="min-h-screen w-full" style={{ background: "#0B1220", overflowX: "hidden" }}>
      <ChromabarPages initialPage="home" mode="preview" />
    </div>
  );
}
