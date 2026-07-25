import React from "react";
import LashoraPages from "./pages";

export default function LashoraPreview() {
  return (
    <div dir="rtl" data-template-id="lashora-preview" className="min-h-screen w-full" style={{ background: "#0B0A12", overflowX: "hidden" }}>
      <LashoraPages initialPage="home" mode="preview" />
    </div>
  );
}
