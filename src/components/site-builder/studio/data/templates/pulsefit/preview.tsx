import React from "react";
import PulsefitPages from "./pages";

export default function PulsefitPreview() {
  return (
    <div dir="rtl" data-template-id="pulsefit-preview" className="min-h-screen w-full" style={{ background: "#121212", overflowX: "hidden" }}>
      <PulsefitPages initialPage="home" mode="preview" />
    </div>
  );
}
