import React from "react";
import AureliaPages from "./pages";

export default function AureliaPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="aurelia-preview"
      className="min-h-screen w-full bg-[#14100d] text-[#f5eee1]"
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        position: "relative",
      }}
    >
      <AureliaPages initialPage="home" mode="preview" />
    </div>
  );
}
