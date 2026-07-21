import React from "react";
import UrbanixPages from "./pages";
export default function UrbanixPreview() {
  return (
    <div dir="rtl" data-template-id="urbanix-preview" className="min-h-screen w-full" style={{ background: "#1a1c1e", color: "#f2f2f0" }}>
      <UrbanixPages initialPage="home" mode="preview" />
    </div>
  );
}
