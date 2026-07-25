import React from "react";
import ScentoraPages from "./pages";

export default function ScentoraPreview() {
  return (
    <div dir="rtl" data-template-id="scentora-preview" className="min-h-screen w-full overflow-x-hidden">
      <ScentoraPages initialPage="home" mode="preview" />
    </div>
  );
}
