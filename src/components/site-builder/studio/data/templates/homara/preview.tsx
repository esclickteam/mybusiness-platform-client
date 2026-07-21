import React from "react";
import HomaraPages from "./pages";
export default function HomaraPreview() {
  return (
    <div dir="rtl" data-template-id="homara-preview" className="min-h-screen w-full" style={{ background: "#f7f2ea", color: "#2a241c" }}>
      <HomaraPages initialPage="home" mode="preview" />
    </div>
  );
}
