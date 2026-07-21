import React from "react";
import PrismPages from "./pages";

export default function PrismPreview() {
  return (
    <div dir="rtl" data-template-id="prism-preview" className="min-h-screen w-full" style={{ background: "#fffef8", overflowX: "hidden" }}>
      <PrismPages initialPage="home" mode="preview" />
    </div>
  );
}
