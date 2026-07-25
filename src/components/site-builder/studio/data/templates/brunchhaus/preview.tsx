import React from "react";
import BrunchhausPages from "./pages";
export default function BrunchhausPreview() {
  return (
    <div dir="rtl" data-template-id="brunchhaus-preview" className="min-h-screen w-full" style={{ background: "#fff8f0", color: "#3a2a1e" }}>
      <BrunchhausPages initialPage="home" mode="preview" />
    </div>
  );
}
