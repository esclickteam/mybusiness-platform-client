import React from "react";
import VitalcarePages from "./pages";

export default function VitalcarePreview() {
  return (
    <div
      dir="rtl"
      data-template-id="vitalcare"
      className="min-h-screen w-full"
      style={{ background: "#F0F9FF", overflowX: "hidden" }}
    >
      <VitalcarePages initialPage="home" mode="preview" />
    </div>
  );
}
