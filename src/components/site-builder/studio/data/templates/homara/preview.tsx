import React from "react";
import HomaraPages from "./pages";

export default function HomaraPreview() {
  return (
    <div dir="rtl" data-template-id="homara-preview" className="min-h-screen w-full" style={{ background: "#f3f0e8", color: "#243028" }}>
      <HomaraPages initialPage="home" mode="preview" />
    </div>
  );
}
