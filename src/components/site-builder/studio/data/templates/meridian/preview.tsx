import React from "react";
import MeridianPages from "./pages";

export default function MeridianPreview() {
  return (
    <div dir="rtl" data-template-id="meridian-preview" className="min-h-screen w-full" style={{ background: "#12100e", color: "#f3ebe1" }}>
      <MeridianPages initialPage="home" mode="preview" />
    </div>
  );
}
