import React from "react";
import CoralinePages from "./pages";
export default function CoralinePreview() {
  return (
    <div dir="rtl" data-template-id="coraline-preview" className="min-h-screen w-full" style={{ background: "#041824", color: "#e8f4ff" }}>
      <CoralinePages initialPage="home" mode="preview" />
    </div>
  );
}
