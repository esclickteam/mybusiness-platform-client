import React from "react";
import KineticPages from "./pages";

export default function KineticPreview() {
  return (
    <div dir="rtl" data-template-id="kinetic-preview" className="min-h-screen w-full" style={{ background: "#0b0b0b", overflowX: "hidden" }}>
      <KineticPages initialPage="home" mode="preview" />
    </div>
  );
}
