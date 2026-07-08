import React from "react";
import JustoraPages from "./pages";

export default function JustoraPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="justora-preview"
      className="min-h-screen w-full bg-[#f6efe3] text-[#172433]"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <JustoraPages initialPage="home" mode="preview" />
    </div>
  );
}