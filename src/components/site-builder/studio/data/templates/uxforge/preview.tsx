import React from "react";
import UxforgePages from "./pages";

export default function UxforgePreview() {
  return (
    <div dir="rtl" data-template-id="uxforge-preview" className="min-h-screen w-full overflow-x-hidden">
      <UxforgePages initialPage="home" mode="preview" />
    </div>
  );
}
