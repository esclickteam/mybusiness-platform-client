import React from "react";
import RivaraPages from "./pages";

export default function RivaraPreview() {
  return (
    <div dir="rtl" data-template-id="rivara-preview" className="min-h-screen w-full overflow-hidden" style={{ background: "#e8f3f2", color: "#12343a" }}>
      <RivaraPages initialPage="home" mode="preview" />
    </div>
  );
}
