import React from "react";
import SkylaraPages from "./pages";
export default function SkylaraPreview() {
  return (
    <div dir="rtl" data-template-id="skylara-preview" className="min-h-screen w-full" style={{ background: "#071525", color: "#e8f1ff" }}>
      <SkylaraPages initialPage="home" mode="preview" />
    </div>
  );
}
