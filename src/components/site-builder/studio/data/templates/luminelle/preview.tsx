import React from "react";
import LuminellePages from "./pages";

export default function LuminellePreview() {
  return (
    <div
      dir="rtl"
      data-template-id="luminelle"
      className="min-h-screen w-full"
      style={{ background: "#E8E4DF", overflowX: "hidden" }}
    >
      <LuminellePages initialPage="home" mode="preview" />
    </div>
  );
}
