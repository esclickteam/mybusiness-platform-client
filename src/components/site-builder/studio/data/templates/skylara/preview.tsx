import React from "react";
import SkylaraPages from "./pages";

export default function SkylaraPreview() {
  return (
    <div dir="rtl" data-template-id="skylara-preview" className="min-h-screen w-full overflow-hidden" style={{ background: "#06101c", color: "#e8f1ff" }}>
      <SkylaraPages initialPage="home" mode="preview" />
    </div>
  );
}
