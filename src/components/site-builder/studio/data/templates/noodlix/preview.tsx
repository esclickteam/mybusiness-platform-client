import React from "react";
import NoodlixPages from "./pages";
export default function NoodlixPreview() {
  return (
    <div dir="rtl" data-template-id="noodlix-preview" className="min-h-screen w-full" style={{ background: "#0f1412", color: "#eef6f1" }}>
      <NoodlixPages initialPage="home" mode="preview" />
    </div>
  );
}
