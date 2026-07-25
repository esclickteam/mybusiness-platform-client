import React from "react";
import HandcraftPages from "./pages";

export default function HandcraftPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="handcraft-preview"
      className="min-h-screen w-full"
      style={{ background: "#FAFAF9", overflowX: "hidden" }}
    >
      <HandcraftPages initialPage="home" mode="preview" />
    </div>
  );
}
