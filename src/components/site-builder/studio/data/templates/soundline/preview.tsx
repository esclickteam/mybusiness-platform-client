import React from "react";
import SoundlinePages from "./pages";
export default function SoundlinePreview() {
  return (
    <div dir="rtl" data-template-id="soundline-preview" className="min-h-screen w-full" style={{ background: "#0B0B12", overflowX: "hidden" }}>
      <SoundlinePages initialPage="home" mode="preview" />
    </div>
  );
}
