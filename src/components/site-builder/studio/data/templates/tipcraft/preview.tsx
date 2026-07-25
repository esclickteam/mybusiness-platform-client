import React from "react";
import TipcraftPages from "./pages";

export default function TipcraftPreview() {
  return (
    <div dir="rtl" data-template-id="tipcraft-preview" className="min-h-screen w-full" style={{ background: "#FAF8FF", overflowX: "hidden" }}>
      <TipcraftPages initialPage="home" mode="preview" />
    </div>
  );
}
