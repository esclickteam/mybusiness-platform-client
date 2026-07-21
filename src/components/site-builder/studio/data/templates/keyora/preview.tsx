import React from "react";
import KeyoraPages from "./pages";
export default function KeyoraPreview() {
  return (
    <div dir="rtl" data-template-id="keyora-preview" className="min-h-screen w-full" style={{ background: "#f4f7fb", color: "#122033" }}>
      <KeyoraPages initialPage="home" mode="preview" />
    </div>
  );
}
