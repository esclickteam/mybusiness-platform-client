import React from "react";
import SteelworksPages from "./pages";

export default function SteelworksPreview() {
  return (
    <div dir="rtl" data-template-id="steelworks-preview" className="min-h-screen w-full" style={{ background: "#1a1a1a", overflowX: "hidden" }}>
      <SteelworksPages initialPage="home" mode="preview" />
    </div>
  );
}
