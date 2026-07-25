import React from "react";
import BridaluxePages from "./pages";

export default function BridaluxePreview() {
  return (
    <div dir="rtl" data-template-id="bridaluxe-preview" className="min-h-screen w-full" style={{ background: "#FFF7F8", overflowX: "hidden" }}>
      <BridaluxePages initialPage="home" mode="preview" />
    </div>
  );
}
