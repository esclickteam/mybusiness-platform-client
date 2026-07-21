import React from "react";
import KeyoraPages from "./pages";

export default function KeyoraPreview() {
  return (
    <div dir="rtl" data-template-id="keyora-preview" className="min-h-screen w-full" style={{ background: "#f5f8fc", color: "#0f1b2d" }}>
      <KeyoraPages initialPage="home" mode="preview" />
    </div>
  );
}
