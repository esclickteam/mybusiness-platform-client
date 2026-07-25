import React from "react";
import VitaraPages from "./pages";

export default function VitaraPreview() {
  return (
    <div dir="rtl" data-template-id="vitara-preview" className="min-h-screen w-full overflow-x-hidden">
      <VitaraPages initialPage="home" mode="preview" />
    </div>
  );
}
