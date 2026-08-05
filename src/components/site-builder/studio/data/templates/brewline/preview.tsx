import React from "react";
import BrewlinePages from "./pages";
export default function BrewlinePreview() {
  return (
    <div dir="rtl" data-template-id="brewline" className="min-h-screen w-full" style={{ background: "#1A1410", overflowX: "hidden" }}>
      <BrewlinePages initialPage="home" mode="preview" />
    </div>
  );
}
