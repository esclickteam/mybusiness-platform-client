import React from "react";
import PlantoraPages from "./pages";
export default function PlantoraPreview() {
  return (
    <div dir="rtl" data-template-id="plantora-preview" className="min-h-screen w-full" style={{ background: "#f4f7f0", color: "#1a2e1a" }}>
      <PlantoraPages initialPage="home" mode="preview" />
    </div>
  );
}
