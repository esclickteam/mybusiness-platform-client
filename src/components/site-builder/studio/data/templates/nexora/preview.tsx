import React from "react";
import NexoraPages from "./pages";

export default function NexoraPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="nexora-preview"
      className="min-h-screen w-full bg-[#0b1020] text-white"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <NexoraPages initialPage="home" mode="preview" />
    </div>
  );
}
