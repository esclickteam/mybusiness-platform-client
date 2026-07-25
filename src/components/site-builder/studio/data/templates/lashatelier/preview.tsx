import React from "react";
import LashatelierPages from "./pages";

export default function LashatelierPreview() {
  return (
    <div dir="rtl" data-template-id="lashatelier-preview" className="min-h-screen w-full" style={{ background: "#120A1F", overflowX: "hidden" }}>
      <LashatelierPages initialPage="home" mode="preview" />
    </div>
  );
}
