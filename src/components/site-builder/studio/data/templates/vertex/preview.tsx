import React from "react";
import VertexPages from "./pages";

export default function VertexPreview() {
  return (
    <div dir="rtl" data-template-id="vertex-preview" className="min-h-screen w-full" style={{ background: "#050505", overflowX: "hidden" }}>
      <VertexPages initialPage="home" mode="preview" />
    </div>
  );
}
