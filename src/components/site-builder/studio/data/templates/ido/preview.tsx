import React from "react";
import IdoPages from "./pages";

export default function IdoPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="ido-preview"
      className="min-h-screen w-full bg-[#07100e] text-white"
      style={{
        position: "relative",
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      <IdoPages initialPage="home" mode="preview" />
    </div>
  );
}