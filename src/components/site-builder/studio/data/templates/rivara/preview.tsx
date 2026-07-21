import React from "react";
import RivaraPages from "./pages";
export default function RivaraPreview() {
  return (
    <div dir="rtl" data-template-id="rivara-preview" className="min-h-screen w-full" style={{ background: "#eef6f5", color: "#16323a" }}>
      <RivaraPages initialPage="home" mode="preview" />
    </div>
  );
}
