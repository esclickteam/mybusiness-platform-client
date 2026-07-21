import React from "react";
import CitadelPages from "./pages";

export default function CitadelPreview() {
  return (
    <div dir="rtl" data-template-id="citadel-preview" className="min-h-screen w-full" style={{ background: "#030a06", overflowX: "hidden" }}>
      <CitadelPages initialPage="home" mode="preview" />
    </div>
  );
}
