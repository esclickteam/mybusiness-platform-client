import React from "react";
import VelvetinePages from "./pages";

export default function VelvetinePreview() {
  return (
    <div dir="rtl" data-template-id="velvetine-preview" className="min-h-screen w-full" style={{ background: "#120E0C", overflowX: "hidden" }}>
      <VelvetinePages initialPage="home" mode="preview" />
    </div>
  );
}
