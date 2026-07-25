import React from "react";
import PetoraPages from "./pages";

export default function PetoraPreview() {
  return (
    <div dir="rtl" data-template-id="petora-preview" className="min-h-screen w-full overflow-x-hidden">
      <PetoraPages initialPage="home" mode="preview" />
    </div>
  );
}
