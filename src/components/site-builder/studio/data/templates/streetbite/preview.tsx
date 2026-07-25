import React from "react";
import StreetbitePages from "./pages";
export default function StreetbitePreview() {
  return (
    <div dir="rtl" data-template-id="streetbite-preview" className="min-h-screen w-full" style={{ background: "#0d1117", color: "#e6edf3" }}>
      <StreetbitePages initialPage="home" mode="preview" />
    </div>
  );
}
