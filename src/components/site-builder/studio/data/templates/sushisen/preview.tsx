import React from "react";
import SushisenPages from "./pages";
export default function SushisenPreview() {
  return (
    <div dir="rtl" data-template-id="sushisen-preview" className="min-h-screen w-full" style={{ background: "#0b0b0b", color: "#f2f0ea" }}>
      <SushisenPages initialPage="home" mode="preview" />
    </div>
  );
}
