import React from "react";
import IdoPages from "./pages";

export default function IdoPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="ido-preview"
      className="h-screen min-h-screen w-full bg-[#07100e] text-white"
      style={{
        overflow: "hidden",
        position: "relative",
      }}
    >
      <IdoPages initialPage="home" mode="preview" />
    </div>
  );
}