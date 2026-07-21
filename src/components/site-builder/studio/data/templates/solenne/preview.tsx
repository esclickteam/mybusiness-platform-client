import React from "react";
import SolennePages from "./pages";

export default function SolennePreview() {
  return (
    <div dir="rtl" data-template-id="solenne-preview" className="min-h-screen w-full" style={{ background: "#f7f3ee", color: "#1d1a17" }}>
      <SolennePages initialPage="home" mode="preview" />
    </div>
  );
}
