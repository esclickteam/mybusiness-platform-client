import React from "react";
import GroomoraPages from "./pages";

export default function GroomoraPreview() {
  return (
    <div dir="rtl" data-template-id="groomora-preview" className="min-h-screen w-full" style={{ background: "#0C1208", overflowX: "hidden" }}>
      <GroomoraPages initialPage="home" mode="preview" />
    </div>
  );
}
