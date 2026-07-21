import React from "react";
import FramehausPages from "./pages";

export default function FramehausPreview() {
  return (
    <div dir="rtl" data-template-id="framehaus-preview" className="min-h-screen w-full" style={{ background: "#fafafa", overflowX: "hidden" }}>
      <FramehausPages initialPage="home" mode="preview" />
    </div>
  );
}
