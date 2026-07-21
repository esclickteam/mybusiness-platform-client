import React from "react";
import CinderPages from "./pages";

export default function CinderPreview() {
  return (
    <div dir="rtl" data-template-id="cinder-preview" className="min-h-screen w-full" style={{ background: "#1a120e", color: "#f6efe6" }}>
      <CinderPages initialPage="home" mode="preview" />
    </div>
  );
}
