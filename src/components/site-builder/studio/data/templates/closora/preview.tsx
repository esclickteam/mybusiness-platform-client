import React from "react";
import ClosoraPages from "./pages";

export default function ClosoraPreview() {
  return (
    <div dir="rtl" data-template-id="closora-preview" className="min-h-screen w-full overflow-x-hidden">
      <ClosoraPages initialPage="home" mode="preview" />
    </div>
  );
}
