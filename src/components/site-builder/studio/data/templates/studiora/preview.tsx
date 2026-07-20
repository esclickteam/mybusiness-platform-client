import React from "react";
import StudioraPages from "./pages";

export default function StudioraPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="studiora-preview"
      className="min-h-screen w-full bg-[#0a0a0a] text-white"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <StudioraPages initialPage="home" mode="preview" />
    </div>
  );
}
