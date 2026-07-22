import React from "react";
import AxispointPages from "./pages";
export default function AxispointPreview() {
  return (
    <div dir="rtl" data-template-id="axispoint-preview" className="min-h-screen w-full" style={{ background: "#0c1222", color: "#e2e8f0" }}>
      <AxispointPages initialPage="home" mode="preview" />
    </div>
  );
}
