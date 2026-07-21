import React from "react";
import FluxoraPages from "./pages";

export default function FluxoraPreview() {
  return (
    <div
      dir="rtl"
      data-template-id="fluxora-preview"
      className="min-h-screen w-full bg-[#070b10] text-[#e8eef5]"
    >
      <FluxoraPages initialPage="home" mode="preview" />
    </div>
  );
}
