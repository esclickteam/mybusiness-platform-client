import React from "react";
import OpenhausPages from "./pages";
export default function OpenhausPreview() {
  return (
    <div dir="rtl" data-template-id="openhaus-preview" className="min-h-screen w-full" style={{ background: "#fffbf7", color: "#292524" }}>
      <OpenhausPages initialPage="home" mode="preview" />
    </div>
  );
}
