import React from "react";
import AdvisoraPages from "./pages";

export default function AdvisoraPreview() {
  return (
    <div dir="rtl" data-template-id="advisora-preview" className="min-h-screen w-full" style={{ background: "#0B1F3A", overflowX: "hidden" }}>
      <AdvisoraPages initialPage="home" mode="preview" />
    </div>
  );
}
