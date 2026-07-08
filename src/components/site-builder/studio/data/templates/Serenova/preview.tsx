import React from "react";
import SerenovaPages from "./pages";

export default function SerenovaPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="serenova-preview"
      className="min-h-screen w-full bg-[#f8f2e8] text-[#20342a]"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <SerenovaPages initialPage="home" mode="preview" />
    </div>
  );
}