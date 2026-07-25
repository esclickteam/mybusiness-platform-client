import React from "react";
import GlowlabPages from "./pages";

export default function GlowlabPreview() {
  return (
    <div dir="rtl" data-template-id="glowlab-preview" className="min-h-screen w-full overflow-x-hidden">
      <GlowlabPages initialPage="home" mode="preview" />
    </div>
  );
}
