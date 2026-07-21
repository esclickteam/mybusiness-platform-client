import React from "react";
import TidehausPages from "./pages";
export default function TidehausPreview() {
  return (
    <div dir="rtl" data-template-id="tidehaus-preview" className="min-h-screen w-full" style={{ background: "#eef6fb", color: "#0c2a3a" }}>
      <TidehausPages initialPage="home" mode="preview" />
    </div>
  );
}
