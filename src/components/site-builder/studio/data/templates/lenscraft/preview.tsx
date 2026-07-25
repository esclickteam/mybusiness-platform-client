import React from "react";
import LenscraftPages from "./pages";

export default function LenscraftPreview() {
  return (
    <div dir="rtl" data-template-id="lenscraft-preview" className="min-h-screen w-full" style={{ background: "#0F0F10", overflowX: "hidden" }}>
      <LenscraftPages initialPage="home" mode="preview" />
    </div>
  );
}
