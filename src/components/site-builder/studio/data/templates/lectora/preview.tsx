import React from "react";
import LectoraPages from "./pages";

export default function LectoraPreview() {
  return (
    <div dir="rtl" data-template-id="lectora" className="min-h-screen w-full" style={{ background: "#041F1E", overflowX: "hidden" }}>
      <LectoraPages initialPage="home" mode="preview" />
    </div>
  );
}
