import React from "react";
import JuicepressPages from "./pages";
export default function JuicepressPreview() {
  return (
    <div dir="rtl" data-template-id="juicepress" className="min-h-screen w-full" style={{ background: "#fffbeb", color: "#1c1917" }}>
      <JuicepressPages initialPage="home" mode="preview" />
    </div>
  );
}
