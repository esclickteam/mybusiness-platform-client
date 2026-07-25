import React from "react";
import DessertlabPages from "./pages";
export default function DessertlabPreview() {
  return (
    <div dir="rtl" data-template-id="dessertlab-preview" className="min-h-screen w-full" style={{ background: "#1a1220", color: "#f8eef8" }}>
      <DessertlabPages initialPage="home" mode="preview" />
    </div>
  );
}
