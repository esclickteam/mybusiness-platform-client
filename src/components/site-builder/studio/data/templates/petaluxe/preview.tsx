import React from "react";
import PetaluxePages from "./pages";

export default function PetaluxePreview() {
  return (
    <div dir="rtl" data-template-id="petaluxe-preview" className="min-h-screen w-full" style={{ background: "#FFF5F9", overflowX: "hidden" }}>
      <PetaluxePages initialPage="home" mode="preview" />
    </div>
  );
}
