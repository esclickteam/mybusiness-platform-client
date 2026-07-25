import React from "react";
import DenimlabPages from "./pages";

export default function DenimlabPreview() {
  return (
    <div dir="rtl" data-template-id="denimlab-preview" className="min-h-screen w-full overflow-x-hidden">
      <DenimlabPages initialPage="home" mode="preview" />
    </div>
  );
}
