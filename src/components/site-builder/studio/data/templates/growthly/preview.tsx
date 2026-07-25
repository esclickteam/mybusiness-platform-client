import React from "react";
import GrowthlyPages from "./pages";

export default function GrowthlyPreview() {
  return (
    <div dir="rtl" data-template-id="growthly-preview" className="min-h-screen w-full overflow-x-hidden">
      <GrowthlyPages initialPage="home" mode="preview" />
    </div>
  );
}
