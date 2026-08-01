import React from "react";
import LunellePages from "./pages";

export default function LunellePreview() {
  return (
    <div
      dir="rtl"
      data-template-id="lunelle-preview"
      className="min-h-screen w-full"
      style={{ background: "#FFF7F1", overflowX: "hidden" }}
    >
      <LunellePages initialPage="home" mode="preview" />
    </div>
  );
}
