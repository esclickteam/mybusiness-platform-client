import React from "react";
import VineriaPages from "./pages";
export default function VineriaPreview() {
  return (
    <div dir="rtl" data-template-id="vineria" className="min-h-screen w-full" style={{ background: "#1a1218", color: "#f5ebe0" }}>
      <VineriaPages initialPage="home" mode="preview" />
    </div>
  );
}
