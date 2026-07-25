import React from "react";
import BladehausPages from "./pages";

export default function BladehausPreview() {
  return (
    <div dir="rtl" data-template-id="bladehaus-preview" className="min-h-screen w-full" style={{ background: "#111111", overflowX: "hidden" }}>
      <BladehausPages initialPage="home" mode="preview" />
    </div>
  );
}
