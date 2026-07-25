import React from "react";
import ArchoraPages from "./pages";
export default function ArchoraPreview() {
  return (
    <div dir="rtl" data-template-id="archora-preview" className="min-h-screen w-full" style={{ background: "#111111", overflowX: "hidden" }}>
      <ArchoraPages initialPage="home" mode="preview" />
    </div>
  );
}
