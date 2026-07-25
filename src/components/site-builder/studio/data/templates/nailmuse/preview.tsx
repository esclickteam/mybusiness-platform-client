import React from "react";
import NailmusePages from "./pages";

export default function NailmusePreview() {
  return (
    <div dir="rtl" data-template-id="nailmuse-preview" className="min-h-screen w-full" style={{ background: "#FFF9F0", overflowX: "hidden" }}>
      <NailmusePages initialPage="home" mode="preview" />
    </div>
  );
}
